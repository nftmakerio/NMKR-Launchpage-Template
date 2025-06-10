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
        const { quantity, customPrice, isCustomPricing } = req.body;

        console.log(`[INFO] Mint request for project: ${projectNameFromParams}`, {
            quantity,
            customPrice,
            isCustomPricing,
            body: req.body
        });

        const projectUid = projectUids[projectNameFromParams.toLowerCase()];
        if (!projectUid) {
            console.log(`[ERROR] Project not found: ${projectNameFromParams}`);
            return res.status(404).json({ error: 'Project not found' });
        }

        if (isCustomPricing) {
            if (typeof customPrice !== 'number' || customPrice <= 0) {
                return res.status(400).json({ error: 'Invalid custom price provided' });
            }
            const countNfts = 1; 
            const priceInLovelace = Math.round(customPrice * 1000000);

            const getPaymentAddressUrl = `${NMKR_API_BASE_URL}/v2/GetPaymentAddressForRandomNftSale/${projectUid}/${countNfts}/${priceInLovelace}?addresstype=Enterprise&blockchain=Cardano`;

            console.log(`[INFO] Calling NMKR API for GetPaymentAddressForRandomNftSale (v2):`, {
                projectUid,
                countNfts,
                priceInLovelace,
                url: getPaymentAddressUrl
            });

            const response = await axios.get(getPaymentAddressUrl, {
                headers: {
                    'Authorization': `Bearer ${NMKR_API_KEY}`,
                    'accept': 'text/plain'
                }
            });

            console.log(`[INFO] NMKR API GetPaymentAddressForRandomNftSale Response (v2):`, {
                status: response.status,
                data: response.data,
            });

            const paymentAddress = response.data.paymentAddress;
            const lovelaceAmount = response.data.priceInLovelace;
            const expires = response.data.expires;
            
            if (typeof lovelaceAmount !== 'number') {
                console.error('[ERROR] priceInLovelace is not a number:', lovelaceAmount);
                return res.status(500).json({ error: 'Invalid price data from NMKR API' });
            }
            const adaForDisplay = lovelaceAmount / 1000000;

            res.json({
                paymentAddress,
                adaForDisplay: adaForDisplay.toFixed(2),
                expires
            });

        } else {
            // Existing logic for non-custom priced projects (GetNmkrPayLink)
            if (typeof quantity !== 'number' || quantity <= 0) {
                return res.status(400).json({ error: 'Invalid quantity provided' });
            }

            const nmkrPayPayload = {
                projectUid: projectUid,
                paymentTransactionType: "nmkr_pay_random",
                paymentgatewayParameters: {
                    mintNfts: {
                        countNfts: quantity
                    }
                }
            };

            const getNmkrPayLinkUrl = `${NMKR_API_BASE_URL}/v2/GetNmkrPayLink`;

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
                    'accept': 'text/plain'
                }
            });

            console.log(`[INFO] NMKR API GetNmkrPayLink Response (v2):`, {
                status: response.status,
                data: response.data,
                headers: response.headers
            });

            res.json(response.data);
        }
    } catch (error) {
        console.error('[ERROR] Minting process error:', {
            project: projectNameFromParams,
            isCustomPricing,
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

// Catch-all route for client-side routing (subpages)
app.get('*', (req, res) => {
    if (req.path.startsWith('/api/')) {
        return res.status(404).json({ error: 'API endpoint not found' });
    }
    
    console.log(`[INFO] Serving index.html for client-side route: ${req.path}`);
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log('Available projects:', Object.keys(projectUids));
}); 