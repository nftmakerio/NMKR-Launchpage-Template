// DOM Elements
let themeToggleInput;
const mintQuantitySlider = document.getElementById('mint-quantity-slider'); 
const mintQuantityValueDisplay = document.getElementById('mint-quantity-value');
const projectsGrid = document.querySelector('.projects-grid'); 
const mintModal = document.getElementById('mint-modal');
const closeModal = document.querySelector('.close-modal');
const modalProjectTitle = document.getElementById('modal-project-title');
const modalMintPrice = mintModal.querySelector('.mint-price'); 
const modalActualMintButton = mintModal.querySelector('.mint-button'); 
const hamburgerButton = document.getElementById('hamburger-menu');
const navLinksMenu = document.getElementById('nav-links-menu');
const themeSwitchContainer = document.getElementById('theme-switch-container');
const navRightGroupDesktop = document.getElementById('nav-right-group-desktop');

let activeProjectIndex = null; 
let projectPricelists = {}; 

// Initialize theme
function initTheme() {
    const configuredDefaultTheme = (config && config.site && config.site.defaultTheme) ? config.site.defaultTheme : 'light';
    const savedTheme = localStorage.getItem('theme') || configuredDefaultTheme;
    document.documentElement.setAttribute('data-theme', savedTheme);
    if (themeToggleInput) {
        themeToggleInput.checked = savedTheme === 'dark';
    }
}

// Toggle theme
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

// Set site configuration
function setSiteConfiguration() {
    // Set page title
    document.title = config.site.title;
    const pageTitle = document.getElementById('page-title');
    if (pageTitle) pageTitle.textContent = config.site.title;
    
    // Set site logo
    const siteLogo = document.getElementById('site-logo');
    if (siteLogo) {
        siteLogo.src = config.site.logo;
        siteLogo.alt = config.site.title;
    }

    // Set favicon
    const favicon = document.getElementById('site-favicon');
    if (favicon && config.site.favicon) {
        favicon.href = config.site.favicon;
    }

    // Set hero section
    const siteTitle = document.getElementById('site-title');
    const siteSubtitle = document.getElementById('site-subtitle');
    if (siteTitle) siteTitle.textContent = config.site.title;
    if (siteSubtitle) siteSubtitle.textContent = config.site.subtitle;
    
    // Set banner section
    const bannerImage = document.getElementById('banner-image');
    if (bannerImage) bannerImage.src = config.site.banner.image;
    
    if (config.site.banner.overlay.enabled) {
        const bannerTitle = document.getElementById('banner-title');
        const bannerDescription = document.getElementById('banner-description');
        const bannerCta = document.getElementById('banner-cta');
        
        if (bannerTitle) bannerTitle.textContent = config.site.banner.overlay.title;
        if (bannerDescription) bannerDescription.textContent = config.site.banner.overlay.description;
        
        if (bannerCta) {
            if (config.site.banner.overlay.cta.enabled) {
                bannerCta.style.display = 'inline-block';
                bannerCta.textContent = config.site.banner.overlay.cta.text;
                bannerCta.href = config.site.banner.overlay.cta.link;
            } else {
                bannerCta.style.display = 'none';
            }
        }
    }
    
    // Set about section
    const aboutTitle = document.getElementById('about-title');
    const aboutContent = document.getElementById('aboutContent');
    if (aboutTitle) aboutTitle.textContent = config.site.about.title;
    if (aboutContent) aboutContent.innerHTML = config.site.about.content;
    
    // Set social links
    const twitterLink = document.getElementById('twitter-link');
    const discordLink = document.getElementById('discord-link');
    const telegramLink = document.getElementById('telegram-link');
    
    if (twitterLink) twitterLink.href = config.social.twitter;
    if (discordLink) discordLink.href = config.social.discord;
    if (telegramLink) telegramLink.href = config.social.telegram;
    
    // Set copyright
    const copyright = document.getElementById('copyright');
    if (copyright) copyright.textContent = `© 2024 ${config.site.title}. All rights reserved.`;
    
    // Apply accent colors
    const root = document.documentElement;
    root.style.setProperty('--primary-color', config.site.colors.accent);
    root.style.setProperty('--hover-color', config.site.colors.accentHover);
    root.style.setProperty('--accent-text-color', config.site.colors.accentText);
}

// Create project cards
function createProjectCards() {
    projectsGrid.innerHTML = ''; // This function is superseded by loadProjects and createProjectCard
}

// Helper function to update the price display in the modal
function updateModalPriceDisplay() {
    if (activeProjectIndex === null || activeProjectIndex === undefined || !config.projects[activeProjectIndex] || !modalMintPrice) {
        if (modalMintPrice) modalMintPrice.textContent = 'N/A';
        if (modalActualMintButton) modalActualMintButton.disabled = true;
        return;
    }
    const project = config.projects[activeProjectIndex];
    const pricelist = projectPricelists[project.projectName];
    const quantity = parseInt(mintQuantitySlider.value);

    if (!pricelist || pricelist.length === 0) {
        modalMintPrice.textContent = 'Price N/A';
        if (modalActualMintButton) modalActualMintButton.disabled = true;
        return;
    }

    let effectivePriceEntry = null;
    const sortedPricelist = [...pricelist].sort((a, b) => a.countNft - b.countNft);
    for (const entry of sortedPricelist) {
        if (entry.countNft >= quantity) {
            effectivePriceEntry = entry;
            break;
        }
    }
    
    if (!effectivePriceEntry && sortedPricelist.length > 0 && quantity > sortedPricelist[sortedPricelist.length -1].countNft) {
         effectivePriceEntry = sortedPricelist[sortedPricelist.length -1];
    }


    if (effectivePriceEntry) {
        const directPriceEntry = sortedPricelist.find(p => p.countNft === quantity);
        if (directPriceEntry) {
            modalMintPrice.textContent = `${directPriceEntry.adaToSend} ADA`;
            if (modalActualMintButton) modalActualMintButton.disabled = false;
        } else {
            modalMintPrice.textContent = 'Amount not available'; 
            if (modalActualMintButton) modalActualMintButton.disabled = true;
        }
    } else {
        modalMintPrice.textContent = 'Price N/A for selected quantity';
        if (modalActualMintButton) modalActualMintButton.disabled = true;
    }
}

// Show mint modal
function showMintModal(projectIndex) { 
    activeProjectIndex = projectIndex;
    const project = config.projects[projectIndex];

    if (!project) {
        console.error("Project not found for showMintModal, Index:", projectIndex);
        alert("Sorry, there was an error loading project details.");
        return;
    }

    modalProjectTitle.textContent = project.name;
    const pricelist = projectPricelists[project.projectName];

    if (!pricelist || pricelist.length === 0) {
        console.warn(`Pricelist not available for project ${project.name}. Disabling mint controls.`);
        mintQuantitySlider.min = 1;
        mintQuantitySlider.max = 1;
        mintQuantitySlider.value = 1;
        if (mintQuantityValueDisplay) mintQuantityValueDisplay.textContent = '1';
        if (modalActualMintButton) modalActualMintButton.disabled = true;
        updateModalPriceDisplay(); 
        mintModal.style.display = 'block';
        return;
    }
    
    const quantities = pricelist.map(p => p.countNft).sort((a, b) => a - b);
    mintQuantitySlider.min = quantities[0] || 1;
    mintQuantitySlider.max = quantities[quantities.length - 1] || 1;
    mintQuantitySlider.step = 1; 
    mintQuantitySlider.value = quantities[0] || 1; 
    if(mintQuantityValueDisplay) mintQuantityValueDisplay.textContent = mintQuantitySlider.value;
    
    if (modalActualMintButton) modalActualMintButton.disabled = false;
    updateModalPriceDisplay();
    mintModal.style.display = 'block';
}

// Close mint modal
function closeMintModal() {
    mintModal.style.display = 'none';
    mintQuantitySlider.value = 1;
}

// Handle minting
async function handleMint() {
    if (activeProjectIndex === null || activeProjectIndex === undefined) {
        console.error("No active project selected for minting.");
        alert("Error: No project selected. Please close the modal and try again.");
        return;
    }
    
    const quantity = parseInt(mintQuantitySlider.value);
    const project = config.projects[activeProjectIndex]; 
    
    if (!project) {
        console.error(`Project not found for activeProject index: ${activeProjectIndex}`);
        alert("Error: Project details not found. Please try again.");
        return;
    }

    const pricelist = projectPricelists[project.projectName];
    const isValidQuantity = pricelist && pricelist.some(p => p.countNft === quantity);

    if (!isValidQuantity) {
        alert(`The selected quantity (${quantity}) is not a valid minting tier for this project. Please adjust the slider.`);
        return;
    }
    
    if (!modalActualMintButton) {
        console.error("Mint button in modal not found.");
        return;
    }
    const originalButtonText = modalActualMintButton.textContent;

    try {
        modalActualMintButton.disabled = true;
        modalActualMintButton.textContent = 'Processing...';

        // Fetch /v2/GetNmkrPayLink from backend
        const apiResponse = await fetch(`/api/mint/${project.projectName}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ quantity: quantity })
        });

        let responseData;
        try {
            responseData = await apiResponse.json();
        } catch (jsonError) {
            console.error('Failed to parse JSON from API response:', jsonError);
            const errorText = await apiResponse.text();
            console.error('API response text:', errorText);
            if (!apiResponse.ok) {
                 throw new Error(apiResponse.statusText || `Request failed with status: ${apiResponse.status}. Response: ${errorText}`);
            }
            throw new Error(`Received an invalid JSON response from the server. Response: ${errorText}`);
        }

        if (!apiResponse.ok) {
            throw new Error(responseData.details || responseData.error || `Minting request failed (status: ${apiResponse.status})`);
        }

        if (responseData.nmkrPayUrl) {
            window.open(responseData.nmkrPayUrl, '_blank');
            setTimeout(() => {
                if (mintModal.style.display === 'block' && modalActualMintButton) {
                    modalActualMintButton.disabled = false;
                    modalActualMintButton.textContent = originalButtonText;
                }
            }, 3000);
        } else {
            console.error('NMKR Pay URL not found in response:', responseData);
            alert('Could not retrieve the payment URL. Please try again.');
            modalActualMintButton.disabled = false; 
            modalActualMintButton.textContent = originalButtonText;
        }
        
    } catch (error) {
        console.error('Minting error:', error);
        alert('Failed to mint: ' + error.message);
        if (modalActualMintButton) { 
            modalActualMintButton.disabled = false; 
            modalActualMintButton.textContent = originalButtonText;
        }
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    themeToggleInput = document.getElementById('theme-toggle');
    if (themeToggleInput) {
        themeToggleInput.addEventListener('change', toggleTheme);
    }
    
    initTheme();
    setSiteConfiguration();
    loadProjects(); 
    updateThemeToggleLocation();
    window.addEventListener('resize', updateThemeToggleLocation);

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Project card mint buttons
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('mint-button') && e.target.dataset.projectIndex !== undefined) {
            const projectIdx = parseInt(e.target.dataset.projectIndex, 10);
            showMintModal(projectIdx);
        }
    });

    // Close modal
    closeModal.addEventListener('click', closeMintModal);
    window.addEventListener('click', (e) => {
        if (e.target === mintModal) {
            closeMintModal();
        }
    });

    // Mint button in modal
    // const modalActualMintButton = mintModal.querySelector('.mint-button'); // Defined globally
    if (modalActualMintButton) {
        modalActualMintButton.addEventListener('click', handleMint);
    } else {
        console.error('Could not find mint button in modal to attach event listener.');
    }

    // Event Listeners for slider
    if (mintQuantitySlider && mintQuantityValueDisplay) {
        mintQuantitySlider.addEventListener('input', () => { 
            mintQuantityValueDisplay.textContent = mintQuantitySlider.value;
            updateModalPriceDisplay(); 
        });

        mintQuantitySlider.addEventListener('change', () => { 
            const project = config.projects[activeProjectIndex];
            if (!project) return;
            const pricelist = projectPricelists[project.projectName];
            if (!pricelist || pricelist.length === 0) return;

            const currentValue = parseInt(mintQuantitySlider.value);
            const sortedPricelist = [...pricelist].sort((a, b) => a.countNft - b.countNft);
            
            let snappedValue = currentValue;
            let foundExactOrGreater = false;

            for (const entry of sortedPricelist) {
                if (entry.countNft >= currentValue) {
                    snappedValue = entry.countNft;
                    foundExactOrGreater = true;
                    break;
                }
            }

            // If current value is greater than all available counts, snap to the largest
            if (!foundExactOrGreater && sortedPricelist.length > 0) {
                snappedValue = sortedPricelist[sortedPricelist.length - 1].countNft;
            }
            else if (currentValue < sortedPricelist[0].countNft) {
                 snappedValue = sortedPricelist[0].countNft;
            }


            mintQuantitySlider.value = snappedValue;
            mintQuantityValueDisplay.textContent = snappedValue;
            updateModalPriceDisplay(); 
        });
    } else {
        console.error("Mint quantity slider or value display element not found.");
    }

    // Hamburger Menu Toggle
    if (hamburgerButton && navLinksMenu) {
        hamburgerButton.addEventListener('click', () => {
            navLinksMenu.classList.toggle('active');
            const isExpanded = navLinksMenu.classList.contains('active');
            hamburgerButton.setAttribute('aria-expanded', isExpanded);
            hamburgerButton.innerHTML = isExpanded ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>'; 
        });

        navLinksMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (navLinksMenu.classList.contains('active')) {
                    navLinksMenu.classList.remove('active');
                    hamburgerButton.setAttribute('aria-expanded', 'false');
                    hamburgerButton.innerHTML = '<i class="fas fa-bars"></i>';
                }
            });
        });
    }
});

async function updateProjectCounts(projectName) {
    try {
        const response = await fetch(`/api/counts/${projectName}`);
        if (!response.ok) {
            console.error(`Error fetching counts for ${projectName}: ${response.status} ${response.statusText}`);
            const projectCard = document.querySelector(`[data-project-name="${projectName}"]`);
            if (projectCard) {
                const statsElement = projectCard.querySelector('.project-stats-supply');
                if (statsElement) {
                    statsElement.innerHTML = `
                        <div class="project-stat">
                            <span>Total Supply:</span> Error
                        </div>
                        <div class="project-stat">
                            <span>Available:</span> Error
                        </div>
                    `;
                }
            }
            return;
        }
        const data = await response.json();
        
        const projectCard = document.querySelector(`[data-project-name="${projectName}"]`);
        if (projectCard) {
            const statsElement = projectCard.querySelector('.project-stats-supply');
            if (statsElement) {
                statsElement.innerHTML = `
                    <div class="project-stat">
                        <span>Total Supply:</span> ${data.nftTotal !== undefined ? data.nftTotal : 'N/A'}
                    </div>
                    <div class="project-stat">
                        <span>Available:</span> ${data.free !== undefined ? data.free : 'N/A'}
                    </div>
                `;
            }
        }
    } catch (error) {
        console.error(`Error fetching project counts for ${projectName}:`, error);
        const projectCard = document.querySelector(`[data-project-name="${projectName}"]`);
        if (projectCard) {
            const statsElement = projectCard.querySelector('.project-stats-supply');
            if (statsElement) {
                statsElement.innerHTML = `
                    <div class="project-stat">
                        <span>Total Supply:</span> Error
                    </div>
                    <div class="project-stat">
                        <span>Available:</span> Error
                    </div>
                `;
            }
        }
    }
}

async function fetchAndDisplayProjectPricelist(project, cardElement, projectIndex) {
    const projectName = project.projectName;
    const priceElement = cardElement.querySelector('.project-price');
    const mintButtonOnCard = cardElement.querySelector('.mint-button');

    try {
        const response = await fetch(`/api/pricelist/${projectName}`);
        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(`Failed to fetch pricelist for ${projectName}: ${response.status}. Details: ${errorData}`);
        }
        const pricelist = await response.json();
        
        if (!Array.isArray(pricelist)) {
             console.error(`Pricelist for ${projectName} is not an array:`, pricelist);
             projectPricelists[projectName] = [];
             throw new Error(`Pricelist data for ${projectName} is not in expected format.`);
        }
        projectPricelists[projectName] = pricelist;

        if (pricelist && pricelist.length > 0) {
            const sortedPricelist = [...pricelist].sort((a,b) => a.countNft - b.countNft);
            const smallestTierEntry = sortedPricelist[0];

            if (priceElement) {
                if (smallestTierEntry) {
                    const formattedPrice = parseFloat(smallestTierEntry.adaToSend).toFixed(2);
                    priceElement.innerHTML = `<span class="price-label">starting from:</span><span class="price-value-container"><span class="price-amount">${formattedPrice}</span><span class="price-currency">₳</span></span>`;
                } else {
                    priceElement.textContent = 'N/A';
                }
            }

            const maxMint = sortedPricelist.reduce((max, p) => p.countNft > max ? p.countNft : max, 0);
             if (mintButtonOnCard) mintButtonOnCard.disabled = !(maxMint > 0) ;

        } else {
            if (priceElement) priceElement.textContent = 'N/A';
            if (mintButtonOnCard) mintButtonOnCard.disabled = true; 
            console.warn(`No pricelist data or empty pricelist for ${projectName}`);
        }
    } catch (error) {
        console.error(`Error fetching or processing pricelist for ${projectName}:`, error);
        if (priceElement) priceElement.textContent = 'Error';
        if (mintButtonOnCard) mintButtonOnCard.disabled = true;
    }
}

function createProjectCard(project, index) {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.setAttribute('data-project-name', project.projectName); 
    
    card.innerHTML = `
        <img src="${project.image}" alt="${project.name}" class="project-image">
        <div class="project-info">
            <h3 class="project-title">${project.name}</h3>
            <p class="project-description">${project.description}</p>
            <div class="project-stats project-stats-pricing"> 
                 <div class="project-stat">
                    <span class="project-price">Loading...</span>
                </div>
            </div>
            <div class="project-stats project-stats-supply"> 
                <div class="project-stat">
                    <span>Total Supply:</span> Loading...
                </div>
                <div class="project-stat">
                    <span>Available:</span> Loading...
                </div>
            </div>
            <button class="mint-button" data-project-index="${index}" disabled>Mint Now</button> 
        </div>
    `;
    fetchAndDisplayProjectPricelist(project, card, index); 
    return card;
}

// Update the loadProjects function to refresh counts periodically
function loadProjects() {
    if (!projectsGrid) {
        console.error("Projects grid not found for loadProjects.");
        return;
    }
    projectsGrid.innerHTML = '';
    projectPricelists = {}; 
    
    config.projects.forEach((project, index) => {
        const card = createProjectCard(project, index);
        projectsGrid.appendChild(card);
        updateProjectCounts(project.projectName); 
    });
}

// Function to move theme toggle based on screen size
function updateThemeToggleLocation() {
    if (!themeSwitchContainer || !navLinksMenu || !navRightGroupDesktop) {
        console.error('Required elements for theme toggle relocation not found.');
        return;
    }

    if (window.innerWidth <= 768) {
        if (themeSwitchContainer.parentNode !== navLinksMenu) {
            navLinksMenu.appendChild(themeSwitchContainer);
        }
    } else {
        if (themeSwitchContainer.parentNode !== navRightGroupDesktop) {
            navRightGroupDesktop.appendChild(themeSwitchContainer); 
        } else {
            navRightGroupDesktop.appendChild(themeSwitchContainer); 
        }
    }
} 