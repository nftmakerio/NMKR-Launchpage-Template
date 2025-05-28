require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
const path = require('path');
const NodeCache = require('node-cache');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname));

// NMKR API Configuration
const NMKR_API_KEY = process.env.NMKR_API_KEY;
const NMKR_API_BASE_URL = 'https://studio-api.nmkr.io';

// Initialize cache with a 5-minute TTL
const appCache = new NodeCache({ stdTTL: 300 });

// Get all project UIDs from environment variables
const projectUids = Object.keys(process.env)
    .filter(key => key.startsWith('NMKR_PROJECT_UID_'))
    .reduce((acc, key) => {
        const projectNameKey = key.replace('NMKR_PROJECT_UID_', '').toLowerCase();
        acc[projectNameKey] = process.env[key];
        return acc;
    }, {});

console.log('[DEBUG] Loaded projectUids:', projectUids);

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'healthy' });
});

// Get available projects
app.get('/api/projects', (req, res) => {
    res.json(Object.keys(projectUids));
});

// Minting endpoint
app.post('/api/mint/:projectName', async (req, res) => {
    const { projectName: projectNameFromParams } = req.params;
    try {
        const { quantity } = req.body; // Only quantity is needed from frontend for this call
        
        console.log(`[INFO] GetNmkrPayLink request for project: ${projectNameFromParams}`, {
            quantity,
            body: req.body
        });

        if (typeof quantity !== 'number' || quantity <= 0) {
            return res.status(400).json({ error: 'Invalid quantity provided' });
        }

        const projectUid = projectUids[projectNameFromParams.toLowerCase()];
        if (!projectUid) {
            console.log(`[ERROR] Project not found: ${projectNameFromParams}`);
            return res.status(404).json({ error: 'Project not found' });
        }

        // Construct payload for /v2/GetNmkrPayLink
        const nmkrPayPayload = {
            projectUid: projectUid,
            paymentTransactionType: "nmkr_pay_random",
            paymentgatewayParameters: {
                mintNfts: {
                    countNfts: quantity
                    // No reserveNfts or lovelace needed for THIS specific GetNmkrPayLink call payload
                }
            }
        };

        const getNmkrPayLinkUrl = `${NMKR_API_BASE_URL}/v2/GetNmkrPayLink`; // Updated to v2

        console.log(`[INFO] Calling NMKR API for GetNmkrPayLink (v2):`, {
            projectUid,
            quantity,
            url: getNmkrPayLinkUrl,
            payload: nmkrPayPayload
        });

        const response = await axios.post(getNmkrPayLinkUrl, nmkrPayPayload, {
            headers: {
                'Authorization': `Bearer ${NMKR_API_KEY}`,
                'Content-Type': 'application/json',
                'accept': 'text/plain' // Added accept header
            }
        });

        console.log(`[INFO] NMKR API GetNmkrPayLink Response (v2):`, {
            status: response.status,
            data: response.data,
            headers: response.headers
        });

        res.json(response.data); // Forward NMKR's response to the frontend
    } catch (error) {
        console.error('[ERROR] GetNmkrPayLink process error:', {
            project: projectNameFromParams,
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
            headers: error.response?.headers
        });
        res.status(500).json({ 
            error: 'Failed to process minting request',
            details: error.response?.data || error.message
        });
    }
});

// Stats endpoint
app.get('/api/stats/:projectName', async (req, res) => {
    try {
        const { projectName } = req.params;
        const projectUid = projectUids[projectName.toLowerCase()];
        
        console.log(`[INFO] Fetching stats for project: ${projectName} (UID: ${projectUid})`);
        
        if (!projectUid) {
            console.log(`[ERROR] Project not found: ${projectName}`);
            return res.status(404).json({ error: 'Project not found' });
        }

        const response = await axios.get(`${NMKR_API_BASE_URL}/v1/projects/${projectUid}/stats`, {
            headers: {
                'Authorization': `Bearer ${NMKR_API_KEY}`
            }
        });

        console.log(`[INFO] NMKR API Stats Response:`, {
            status: response.status,
            data: response.data,
            headers: response.headers
        });

        res.json(response.data);
    } catch (error) {
        console.error('[ERROR] Stats error:', {
            project: projectName,
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
            headers: error.response?.headers
        });
        res.status(500).json({ 
            error: 'Failed to fetch stats',
            details: error.response?.data || error.message
        });
    }
});

// Get NFT counts endpoint
app.get('/api/counts/:projectName', async (req, res) => {
    const { projectName: projectNameFromParams } = req.params;
    const cacheKey = `counts_${projectNameFromParams.toLowerCase()}`;

    if (appCache.has(cacheKey)) {
        console.log(`[CACHE] Serving counts for ${projectNameFromParams} from cache.`);
        return res.json(appCache.get(cacheKey));
    }

    try {
        const projectUid = projectUids[projectNameFromParams.toLowerCase()];
        
        if (!projectUid) {
            console.log(`[ERROR] Project not found for counts: ${projectNameFromParams}`);
            return res.status(404).json({ error: 'Project not found' });
        }

        const getCountsUrl = `${NMKR_API_BASE_URL}/v2/GetCounts/${projectUid}`; 

        console.log(`[INFO] Fetching counts for project: ${projectNameFromParams} (UID: ${projectUid}) from ${getCountsUrl}`);
        
        const response = await axios.get(getCountsUrl, {
            headers: {
                'Authorization': `Bearer ${NMKR_API_KEY}`,
                'accept': 'text/plain' 
            }
        });

        console.log(`[INFO] NMKR API GetCounts Response for ${projectNameFromParams}:`, {
            status: response.status,
            data: response.data,
            headers: response.headers
        });

        appCache.set(cacheKey, response.data); // Cache the response
        res.json(response.data); // Forward NMKR's response
    } catch (error) {
        console.error(`[ERROR] Counts error for project: ${projectNameFromParams}`, {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
            headers: error.response?.headers
        });
        res.status(500).json({ 
            error: 'Failed to fetch NFT counts',
            details: error.response?.data || error.message
        });
    }
});

// Get NFT pricelist endpoint
app.get('/api/pricelist/:projectName', async (req, res) => {
    const { projectName: projectNameFromParams } = req.params;
    const cacheKey = `pricelist_${projectNameFromParams.toLowerCase()}`;

    if (appCache.has(cacheKey)) {
        console.log(`[CACHE] Serving pricelist for ${projectNameFromParams} from cache.`);
        return res.json(appCache.get(cacheKey));
    }

    try {
        const projectUid = projectUids[projectNameFromParams.toLowerCase()];

        if (!projectUid) {
            console.log(`[ERROR] Project not found for pricelist: ${projectNameFromParams}`);
            return res.status(404).json({ error: 'Project not found' });
        }

        const getPricelistUrl = `${NMKR_API_BASE_URL}/v2/GetPricelist/${projectUid}?returnAllPrices=false`;

        console.log(`[INFO] Fetching pricelist for project: ${projectNameFromParams} (UID: ${projectUid}) from ${getPricelistUrl}`);

        const response = await axios.get(getPricelistUrl, {
            headers: {
                'Authorization': `Bearer ${NMKR_API_KEY}`,
                'accept': 'text/plain'
            }
        });

        console.log(`[INFO] NMKR API GetPricelist Response for ${projectNameFromParams}:`, {
            status: response.status,
            data: response.data
        });

        if (Array.isArray(response.data)) {
            appCache.set(cacheKey, response.data); // Cache the response
            res.json(response.data);
        } else {
            console.error(`[ERROR] Unexpected pricelist data format for ${projectNameFromParams}:`, response.data);
            res.status(500).json({ error: 'Unexpected pricelist data format from NMKR API' });
        }

    } catch (error) {
        console.error(`[ERROR] Pricelist error for project: ${projectNameFromParams}`, {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status
        });
        res.status(500).json({
            error: 'Failed to fetch NFT pricelist',
            details: error.response?.data || error.message
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log('Available projects:', Object.keys(projectUids));
}); 