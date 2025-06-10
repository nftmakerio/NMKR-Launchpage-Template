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

// Custom pricing elements
const quantitySliderContainer = document.getElementById('quantity-slider-container');
const customPriceContainer = document.getElementById('custom-price-container');
const customPriceInput = document.getElementById('custom-price-input');
const customPriceHelp = document.getElementById('custom-price-help');

let activeProjectIndex = null; 
let projectPricelists = {}; 
let expiryCountdownInterval = null;

// Subpage routing variables
let currentPage = 'main'; 
let currentProjects = []; 
let currentDescription = null;
let currentBanner = null; 

// URL Routing Functions
function getCurrentPageFromURL() {
    const path = window.location.pathname;
    if (path === '/' || path === '/index.html') {
        return 'main';
    }
    return path.substring(1);
}

function getSubpageConfig(pageUrl) {
    if (!config.subpages || !config.subpages.enabled) {
        return null;
    }
    return config.subpages.pages.find(page => page.url === pageUrl && page.enabled);
}

function navigateToPage(pageUrl) {
    if (pageUrl === 'main') {
        history.pushState(null, '', '/');
    } else {
        history.pushState(null, '', `/${pageUrl}`);
    }
    loadCurrentPage();
}

function loadCurrentPage() {
    const pageUrl = getCurrentPageFromURL();
    currentPage = pageUrl;
    
    if (pageUrl === 'main') {
        currentProjects = config.projects;
        currentDescription = {
            title: config.site.about.title,
            content: config.site.about.content
        };
        currentBanner = null; 
    } else {
        const subpageConfig = getSubpageConfig(pageUrl);
        if (subpageConfig) {
            currentProjects = subpageConfig.projects;
            currentDescription = subpageConfig.description;
            currentBanner = subpageConfig.banner || null; 
        } else {
            navigateToPage('main');
            return;
        }
    }
    
    updatePageContent();
    updateNavbar();
    loadProjects();
}

function updatePageContent() {
    const aboutTitle = document.getElementById('about-title');
    const aboutContent = document.getElementById('aboutContent');
    
    if (aboutTitle && currentDescription) {
        aboutTitle.textContent = currentDescription.title;
    }
    if (aboutContent && currentDescription) {
        aboutContent.innerHTML = currentDescription.content;
    }
    
    updateBannerContent();
}

function updateBannerContent() {
    const bannerConfig = currentBanner || config.site.banner;
    
    const bannerImage = document.getElementById('banner-image');
    if (bannerImage && bannerConfig) {
        bannerImage.src = bannerConfig.image;
        if (bannerConfig.mobileImage) {
            document.documentElement.style.setProperty('--mobile-banner-image', `url(${bannerConfig.mobileImage})`);
        }
    }
    
    if (bannerConfig && bannerConfig.overlay) {
        const bannerTitle = document.getElementById('banner-title');
        const bannerDescription = document.getElementById('banner-description');
        const bannerCta = document.getElementById('banner-cta');
        
        if (bannerConfig.overlay.enabled) {
            if (bannerTitle) bannerTitle.textContent = bannerConfig.overlay.title;
            if (bannerDescription) bannerDescription.textContent = bannerConfig.overlay.description;
            
            if (bannerCta && bannerConfig.overlay.cta) {
                if (bannerConfig.overlay.cta.enabled) {
                    bannerCta.style.display = 'inline-block';
                    bannerCta.textContent = bannerConfig.overlay.cta.text;
                    bannerCta.href = bannerConfig.overlay.cta.link;
                } else {
                    bannerCta.style.display = 'none';
                }
            }
        }
    }
}

function updateNavbar() {
    const navLinksMenu = document.getElementById('nav-links-menu');
    if (!navLinksMenu) return;
    
    const existingLinks = navLinksMenu.querySelectorAll('a:not([data-subpage]):not([data-main])');
    
    navLinksMenu.querySelectorAll('a[data-subpage], a[data-main]').forEach(link => link.remove());
    
    const mainLink = document.createElement('a');
    mainLink.href = '#';
    mainLink.textContent = 'Main';
    mainLink.setAttribute('data-main', 'true');
    if (currentPage === 'main') {
        mainLink.classList.add('active');
    }
    mainLink.addEventListener('click', (e) => {
        e.preventDefault();
        navigateToPage('main');
    });
    navLinksMenu.insertBefore(mainLink, existingLinks[0]);
    
    if (config.subpages && config.subpages.enabled && config.subpages.showInNavbar) {
        config.subpages.pages.forEach(page => {
            if (page.enabled) {
                const link = document.createElement('a');
                link.href = '#';
                link.textContent = page.name;
                link.setAttribute('data-subpage', page.url);
                if (currentPage === page.url) {
                    link.classList.add('active');
                }
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    navigateToPage(page.url);
                });
                navLinksMenu.appendChild(link);
            }
        });
    }
}

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
    if (bannerImage) {
        bannerImage.src = config.site.banner.image;
        if (config.site.banner.mobileImage) {
            document.documentElement.style.setProperty('--mobile-banner-image', `url(${config.site.banner.mobileImage})`);
        }
    }
    
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
    
    // Apply font configuration
    if (config.site.fonts) {
        root.style.setProperty('--primary-font', config.site.fonts.primary);
    }
    
    // Handle navigation link visibility
    if (config.site.navigation) {
        const aboutLink = document.querySelector('a[href="#about"]');
        const exploreLink = document.querySelector('a[href="#explore"]');
        
        if (aboutLink) {
            aboutLink.style.display = config.site.navigation.showAboutLink ? '' : 'none';
        }
        if (exploreLink) {
            exploreLink.style.display = config.site.navigation.showExploreLink ? '' : 'none';
        }
    }
}

// Create project cards
function createProjectCards() {
    projectsGrid.innerHTML = ''; // This function is superseded by loadProjects and createProjectCard
}

// Helper function to update the price display in the modal
function updateModalPriceDisplay() {
    if (activeProjectIndex === null || activeProjectIndex === undefined || !currentProjects[activeProjectIndex] || !modalMintPrice) {
        if (modalMintPrice) modalMintPrice.textContent = 'N/A';
        if (modalActualMintButton) modalActualMintButton.disabled = true;
        return;
    }
    
    const project = currentProjects[activeProjectIndex];
    
    // Handle custom pricing mode
    if (project.custom_pricing) {
        const customPrice = parseFloat(customPriceInput.value);
        const minimumPrice = project.minimumCustomPrice || 0;
        
        if (customPrice && customPrice > 0) {
            if (customPrice >= minimumPrice) {
                modalMintPrice.textContent = `${customPrice.toFixed(2)} ADA (Custom Price)`;
                if (modalActualMintButton) modalActualMintButton.disabled = false;
            } else {
                modalMintPrice.textContent = `Minimum price: ${minimumPrice} ADA`;
                if (modalActualMintButton) modalActualMintButton.disabled = true;
            }
        } else {
            modalMintPrice.textContent = 'Enter a valid price';
            if (modalActualMintButton) modalActualMintButton.disabled = true;
        }
        return;
    }
    
    // Handle normal pricing mode
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
    const project = currentProjects[projectIndex];

    if (!project) {
        console.error("Project not found for showMintModal, Index:", projectIndex);
        alert("Sorry, there was an error loading project details.");
        return;
    }

    modalProjectTitle.textContent = project.name;
    
    if (expiryCountdownInterval) {
        clearInterval(expiryCountdownInterval);
        expiryCountdownInterval = null;
    }

    const paymentInfoEl = document.getElementById('modal-payment-info');
    if (paymentInfoEl) {
        paymentInfoEl.innerHTML = '';
        paymentInfoEl.style.display = 'none';
    }
    
    // Handle custom pricing mode
    if (project.custom_pricing) {
        quantitySliderContainer.style.display = 'none';
        customPriceContainer.style.display = 'flex';
        
        const minimumPrice = project.minimumCustomPrice || 0;
        customPriceInput.min = minimumPrice;
        customPriceInput.placeholder = minimumPrice > 0 ? `Min: ${minimumPrice}` : '0.00';
        
        if (customPriceHelp) {
            if (minimumPrice > 0) {
                customPriceHelp.textContent = `Minimum price: ${minimumPrice} ADA`;
                customPriceHelp.style.display = 'block';
            } else {
                customPriceHelp.style.display = 'none';
            }
        }
        
        customPriceInput.value = '';
        
        mintQuantitySlider.value = 1;
        if (mintQuantityValueDisplay) mintQuantityValueDisplay.textContent = '1';
        
        if (modalActualMintButton) modalActualMintButton.disabled = true;
        updateModalPriceDisplay();
        mintModal.style.display = 'block';
        
        setTimeout(() => customPriceInput.focus(), 100);
        return;
    }
    
    // Handle normal pricing mode
    quantitySliderContainer.style.display = 'flex';
    customPriceContainer.style.display = 'none';
    
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
    if (customPriceInput) customPriceInput.value = '';
    if (customPriceHelp) customPriceHelp.style.display = 'none';
    
    if (expiryCountdownInterval) {
        clearInterval(expiryCountdownInterval);
        expiryCountdownInterval = null;
    }

    const paymentInfoEl = document.getElementById('modal-payment-info');
    if (paymentInfoEl) {
        paymentInfoEl.innerHTML = ''; 
        paymentInfoEl.style.display = 'none'; 
    }
    
    if (modalActualMintButton && modalActualMintButton.textContent === 'Awaiting Payment') {
        modalActualMintButton.textContent = 'Mint Now';
        modalActualMintButton.disabled = false;
    }
}

// Handle minting
async function handleMint() {
    if (activeProjectIndex === null || activeProjectIndex === undefined) {
        console.error("No active project selected for minting.");
        alert("Error: No project selected. Please close the modal and try again.");
        return;
    }
    
    const project = currentProjects[activeProjectIndex]; 
    
    if (!project) {
        console.error(`Project not found for activeProject index: ${activeProjectIndex}`);
        alert("Error: Project details not found. Please try again.");
        return;
    }

    let quantity, customPriceValue;
    const isCustomPricingProject = project.custom_pricing;
    
    if (isCustomPricingProject) {
        quantity = 1; 
        customPriceValue = parseFloat(customPriceInput.value);
        const minimumPrice = project.minimumCustomPrice || 0;
        
        if (customPriceInput.value.trim() === '' || isNaN(customPriceValue) || customPriceValue <= 0) {
            alert("Please enter a valid price greater than 0.");
            customPriceInput.focus();
            return;
        }
        
        if (customPriceValue < minimumPrice) {
            alert(`Price must be at least ${minimumPrice} ADA.`);
            customPriceInput.focus();
            return;
        }
    } else {
        // Handle normal pricing validation
        quantity = parseInt(mintQuantitySlider.value);
        const pricelist = projectPricelists[project.projectName];
        const isValidQuantity = pricelist && pricelist.some(p => p.countNft === quantity);

        if (!isValidQuantity) {
            alert(`The selected quantity (${quantity}) is not a valid minting tier for this project. Please adjust the slider.`);
            return;
        }
    }
    
    if (!modalActualMintButton) {
        console.error("Mint button in modal not found.");
        return;
    }
    const originalButtonText = modalActualMintButton.dataset.originalText || 'Mint Now'; 
    modalActualMintButton.dataset.originalText = originalButtonText; 
    
    const paymentInfoEl = document.getElementById('modal-payment-info');
    if (paymentInfoEl) paymentInfoEl.innerHTML = '';

    try {
        modalActualMintButton.disabled = true;
        modalActualMintButton.textContent = 'Processing...';

        const requestBody = { quantity };
        if (isCustomPricingProject) {
            requestBody.customPrice = customPriceValue;
            requestBody.isCustomPricing = true;
        }

        const apiResponse = await fetch(`/api/mint/${project.projectName}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        });

        let responseData;
        try {
            responseData = await apiResponse.json();
        } catch (jsonError) {
            console.error('Failed to parse JSON from API response:', jsonError);
            const errorText = await apiResponse.text();
            console.error('API response text:', errorText);
            throw new Error(`Received an invalid JSON response. Server said: ${errorText || apiResponse.statusText}`);
        }

        if (!apiResponse.ok) {
            throw new Error(responseData.details || responseData.error || `Minting request failed (status: ${apiResponse.status})`);
        }

        if (isCustomPricingProject && responseData.paymentAddress && responseData.adaForDisplay) {
            if (paymentInfoEl) {
                const iconOnlyDefault = `
                    <svg class="custom-copy-icon" viewBox="0 0 24 24" aria-hidden="true" role="img" width="20" height="20">
                        <path d="M0 0h24v24H0z" fill="none"></path>
                        <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" fill="currentColor"></path>
                    </svg>
                `;
                const iconOnlyCopied = `
                    <svg class="custom-copy-icon" viewBox="0 0 24 24" aria-hidden="true" role="img" width="20" height="20">
                        <path d="M0 0h24v24H0z" fill="none"></path>
                        <path d="M9 16.2l-3.5-3.5 1.41-1.41L9 13.38l7.09-7.09 1.41 1.41z" fill="currentColor"></path>
                    </svg>
                `;
                paymentInfoEl.innerHTML = `
                    <p>Please send exactly <strong>${responseData.adaForDisplay} ADA</strong> to the following address:</p>
                    <div class="payment-address-container">
                        <span class="payment-address-display" id="payment-address-value">${responseData.paymentAddress}</span>
                        <button id="copy-address-button" class="copy-button" aria-label="Copy address" type="button">${iconOnlyDefault}</button>
                    </div>
                    <p class="payment-expiry-display" id="modal-expiry-countdown">Expires: Calculating...</p> 
                `;
                paymentInfoEl.style.display = 'block'; 

                const copyButton = document.getElementById('copy-address-button');
                if (copyButton) {
                    copyButton.innerHTML = iconOnlyDefault;
                    copyButton.addEventListener('click', () => {
                        const addressToCopy = document.getElementById('payment-address-value')?.textContent;
                        if (addressToCopy) {
                            navigator.clipboard.writeText(addressToCopy).then(() => {
                                copyButton.innerHTML = iconOnlyCopied;
                                copyButton.disabled = true;
                                setTimeout(() => {
                                    copyButton.innerHTML = iconOnlyDefault;
                                    copyButton.disabled = false;
                                }, 2000);
                            }).catch(err => {
                                console.error('Failed to copy address: ', err);
                                alert('Failed to copy address. Please try selecting it manually.');
                            });
                        }
                    });
                }

                const expiryDisplayElement = document.getElementById('modal-expiry-countdown');
                if (expiryDisplayElement && responseData.expires) {
                    startExpiryCountdown(new Date(responseData.expires).getTime(), expiryDisplayElement);
                }
            }
            modalActualMintButton.textContent = 'Awaiting Payment';
        } else if (!isCustomPricingProject && responseData.nmkrPayUrl) {
            window.open(responseData.nmkrPayUrl, '_blank');
            setTimeout(() => {
                if (mintModal.style.display === 'block' && modalActualMintButton) {
                    modalActualMintButton.disabled = false;
                    modalActualMintButton.textContent = originalButtonText; 
                }
            }, 3000); 
        } else {
            console.error('Unexpected response structure for minting:', responseData);
            throw new Error('Could not process the minting request due to an unexpected server response.');
        }
        
    } catch (error) {
        console.error('Minting error:', error);
        if (paymentInfoEl) {
            paymentInfoEl.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
            paymentInfoEl.style.display = 'block';
        }
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
    // Initialize routing and load current page
    loadCurrentPage();
    updateThemeToggleLocation();
    window.addEventListener('resize', updateThemeToggleLocation);
    
    // Handle browser back/forward buttons
    window.addEventListener('popstate', () => {
        loadCurrentPage();
    });

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

    if (modalActualMintButton) {
        modalActualMintButton.addEventListener('click', handleMint);
         // Store original text on load if not already set by a previous mint attempt
        if (!modalActualMintButton.dataset.originalText) {
            modalActualMintButton.dataset.originalText = modalActualMintButton.textContent;
        }
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
            const project = currentProjects[activeProjectIndex];
            if (!project || project.custom_pricing) return; // Slider not used for custom pricing adjustments here
            const pricelist = projectPricelists[project.projectName];
            if (!pricelist || pricelist.length === 0) return;

            const currentValue = parseInt(mintQuantitySlider.value);
            const sortedPricelist = [...pricelist].sort((a, b) => a.countNft - b.countNft);
            
            let snappedValue = currentValue;
            let foundExactOrGreater = false;

            // Snap to available pricelist quantities
            for (const entry of sortedPricelist) {
                if (entry.countNft >= currentValue) {
                    snappedValue = entry.countNft;
                    foundExactOrGreater = true;
                    break;
                }
            }

            if (!foundExactOrGreater && sortedPricelist.length > 0) {
                snappedValue = sortedPricelist[sortedPricelist.length - 1].countNft; // Snap to largest if above all
            } else if (sortedPricelist.length > 0 && currentValue < sortedPricelist[0].countNft) {
                 snappedValue = sortedPricelist[0].countNft; // Snap to smallest if below all
            }

            mintQuantitySlider.value = snappedValue;
            mintQuantityValueDisplay.textContent = snappedValue;
            updateModalPriceDisplay(); 
        });
    } else {
        console.error("Mint quantity slider or value display element not found.");
    }

    if (customPriceInput) {
        customPriceInput.addEventListener('input', () => {
            updateModalPriceDisplay();
        });

        customPriceInput.addEventListener('blur', () => {
            const trimmedValue = customPriceInput.value.trim();
            if (trimmedValue === '') {
                customPriceInput.value = '';
            } else {
                const value = parseFloat(trimmedValue);
                if (!isNaN(value)) {
                    customPriceInput.value = value.toFixed(2);
                } else {
                    customPriceInput.value = '';
                }
            }
            updateModalPriceDisplay();
        });
    } else {
        console.error("Custom price input element not found.");
    }

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

    applyTypographySettings();
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
    
    const pricingSection = project.custom_pricing ? 
        '' : 
        `<div class="project-stats project-stats-pricing"> 
             <div class="project-stat">
                <span class="project-price">Loading...</span>
            </div>
        </div>`;
    
    const customPricingDisclaimer = project.custom_pricing ?
        `<div class="custom-pricing-disclaimer">
            <i class="fas fa-info-circle"></i>
            <span>This project allows you to specify a custom ADA amount when minting</span>
        </div>` :
        '';
    
    card.innerHTML = `
        <img src="${project.image}" alt="${project.name}" class="project-image">
        <div class="project-info">
            <h3 class="project-title">${project.name}</h3>
            <p class="project-description">${project.description}</p>
            ${pricingSection}
            <div class="project-stats project-stats-supply"> 
                <div class="project-stat">
                    <span>Total Supply:</span> Loading...
                </div>
                <div class="project-stat">
                    <span>Available:</span> Loading...
                </div>
            </div>
            <button class="mint-button" data-project-index="${index}" disabled>Mint Now</button>
            ${customPricingDisclaimer}
        </div>
    `;
    
    if (!project.custom_pricing) {
        fetchAndDisplayProjectPricelist(project, card, index);
    } else {
        const mintButtonOnCard = card.querySelector('.mint-button');
        if (mintButtonOnCard) mintButtonOnCard.disabled = false;
    }
    
    return card;
}

function loadProjects() {
    if (!projectsGrid) {
        console.error("Projects grid not found for loadProjects.");
        return;
    }
    projectsGrid.innerHTML = '';
    projectPricelists = {}; 
    
    currentProjects.forEach((project, index) => {
        const card = createProjectCard(project, index);
        projectsGrid.appendChild(card);
        updateProjectCounts(project.projectName); 
    });
}

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
        } 
    }
}

function applyTypographySettings() {
    const root = document.documentElement;
    const typography = config.site.typography;

    if (typography && typography.sizes) {
        Object.entries(typography.sizes).forEach(([key, value]) => {
            root.style.setProperty(`--font-size-${key}`, value);
        });
    }

    if (typography && typography.weights) {
        Object.entries(typography.weights).forEach(([key, value]) => {
            root.style.setProperty(`--font-weight-${key}`, value);
        });
    }

    if (typography && typography.lineHeights) {
        Object.entries(typography.lineHeights).forEach(([key, value]) => {
            root.style.setProperty(`--line-height-${key}`, value);
        });
    }

    if (typography && typography.letterSpacing) {
        Object.entries(typography.letterSpacing).forEach(([key, value]) => {
            root.style.setProperty(`--letter-spacing-${key}`, value);
        });
    }
}

function startExpiryCountdown(expiryTime, displayElement) {
    if (expiryCountdownInterval) {
        clearInterval(expiryCountdownInterval);
    }

    function updateCountdown() {
        const now = new Date().getTime();
        const timeLeft = expiryTime - now;

        if (timeLeft <= 0) {
            clearInterval(expiryCountdownInterval);
            expiryCountdownInterval = null;
            displayElement.textContent = "Expired";
            if(modalActualMintButton && modalActualMintButton.textContent === 'Awaiting Payment'){
            }
            return;
        }

        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

        let countdownString = "Expires in: ";
        if (days > 0) countdownString += `${days}d `;
        if (hours > 0 || days > 0) countdownString += `${hours}h `;
        if (minutes > 0 || hours > 0 || days > 0) countdownString += `${minutes}m `;
        countdownString += `${seconds}s`;

        displayElement.textContent = countdownString;
    }

    updateCountdown(); 
    expiryCountdownInterval = setInterval(updateCountdown, 1000); 
}