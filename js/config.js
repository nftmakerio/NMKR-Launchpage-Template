// NMKR Launchpage Configuration
// This file is where you configure your launch page

const config = {
    // NMKR API Configuration
    nmkr: {
        apiKey: 'YOUR_NMKR_API_KEY', // Do not touch this! Provide your API Key in the env file
        projectUid: 'YOUR_PROJECT_UID', // Do not touch this! Provide your Project UID in the env file
        baseUrl: 'https://studio-api.nmkr.io' // Do not touch this!
    },

    // Site and Style Configuration
    site: {
        title: 'Brand Title', // Change the title of your brand
        subtitle: 'This is your subtitle', // Change the subtitle of your brand
        logo: {
            url: 'https://placehold.co/140x70/1E1E1E/11f250?text=Your_logo',
            height: '40px' // Change logo height here (max. '60px' for larger logos)
        },
        favicon: 'https://placehold.co/32x32/1E1E1E/11f250?text=NMKR', // Add your favicon URL here, recommended size: 32x32
        defaultTheme: 'dark', // Change default theme setting: 'light' or 'dark'
        fonts: {
            primary: 'Inter', // Default font 'Inter', change to your preferred font
            alternatives: [
                'Plus Jakarta Sans',
                'Space Grotesk',
                'Outfit',
                'Sora',
                'VT323' // Matrix-style typewriter font
            ]
        },
        typography: {
            // Font sizes in rem units (1rem = 16px by default)
            sizes: {
                h1: '4rem',      // Change the title size here
                h2: '3rem',      // Change the subtitle size here
                h3: '2.25rem',   // Change the project name size here
                h4: '1.75rem',   // Change the project description size here
                h5: '1.25rem',   
                h6: '1rem',      
                body: '1.125rem', //
                small: '0.875rem', 
                tiny: '0.75rem'   
            },
            // Font weights (400 = normal, 500 = medium, 600 = semibold, 700 = bold)
            weights: {
                normal: 400,
                medium: 500,
                semibold: 600,
                bold: 700
            },
            // Line heights
            lineHeights: {
                tight: 1.1,      
                normal: 1.6,     
                relaxed: 1.8     
            },
            // Letter spacing
            letterSpacing: {
                tight: '-0.02em',  
                normal: '0',
                wide: '0.02em',    
                wider: '0.04em'    
            }
        },
        colors: {
            accent: '#11f250',  // Main accent color
            accentHover: '#0edf45',  // Accent color on hover
            accentText: '#000000',  // Text color on accent backgrounds 
            background: {
                light: '#ffffff',
                dark: '#1E1E1E'
            },
            text: {
                light: '#333333',
                dark: '#ffffff'
            },
            card: {
                light: '#f8f8f8',
                dark: '#2A2A2A'
            },
            border: {
                light: '#e0e0e0',
                dark: '#404040'
            }
        },
        banner: {
            enabled: true, // Set to false to hide the main page banner
            image: 'https://placehold.co/1200x400/1E1E1E/11f250?text=1200x400', // Change the banner image here, recommended size: 1200x400
            mobileImage: 'https://placehold.co/800x600/1E1E1E/11f250?text=800x600', // Matching mobile version, recommended size: 800x600
            overlay: {
                enabled: true, //change to false to remove the banner overlay
                title: 'Your Featured Collection', //change the title here
                description: 'Discover our latest and most exclusive NFT collection', //change the description here
                cta: {
                    enabled: true, //change to false to remove the explore button
                    text: 'CTA button', //change the button text here (default links to #explore section)
                    link: '#explore' // change the link here or remove the button
                }
            }
        },
        about: {
            title: 'About Section Title',
            content: `
                <p>Welcome to our NFT projects! Here's where you can tell your story and explain what makes your projects unique.</p>
                <p>Add multiple paragraphs to describe your projects' vision, goals, and unique features.</p>
            `
        },
        navigation: {
            showAboutLink: true, // Set to false to hide "About" link in navbar
            showExploreLink: true // Set to false to hide "Explore" link in navbar
        }
    },

    // Project Information
    // Configure your NFT projects here
    // Add more projects as needed, make sure to also add the project UID to the env file
    projects: [
        {
            name: 'Project 1', //change the project name here
            description: 'A unique collection of digital art pieces', //change the description here
            image: 'https://placehold.co/400x200/1E1E1E/11f250',
            projectName: 'project1', //change the project name here, must match in the env file (For projectName: 'project1' the env must contain: NMKR_PROJECT_UID_PROJECT1=your_project_UID )
            custom_pricing: false // Set to true to enable custom pricing mode (hides price display on card, allows custom price input in mint modal)
        },
        {
            name: 'Project 2',
            description: 'Exclusive NFT collection with special utilities',
            image: 'https://placehold.co/400x200/1E1E1E/11f250',
            projectName: 'project2',
            custom_pricing: true, // Example: This project uses custom pricing
            minimumCustomPrice: 6.5 // Minimum price for custom pricing (in ADA). Only applies when custom_pricing is true
                                    // For Multisig transactions 4.0 ADA, for regular transactions 6.5 ADA - set up in pricelist settings of NMKR Studio
        },
        {
            name: 'Project 3',
            description: 'Limited edition collectibles with rare attributes',
            image: 'https://placehold.co/400x200/1E1E1E/11f250',
            projectName: 'project3',
            custom_pricing: false
        }
    ],

    // Subpages Configuration
    subpages: {
        enabled: true, // Master switch for subpages feature
        showInNavbar: true, // Show subpage links in navbar
        
        // Content-based subpages with one or more project cards
        contentPages: [
            {
                name: 'Subpage 1', // Display name in navbar
                url: 'subpage1', // Creates /subpage1 URL
                enabled: true,
                banner: {
                    enabled: true, // Set to false to hide this subpage's banner
                    image: 'https://placehold.co/1200x400/000000/11f250?text=Subpage+1+Banner', // Custom banner for this subpage
                    mobileImage: 'https://placehold.co/800x600/000000/11f250?text=Subpage+1+Mobile', // Mobile version
                    overlay: {
                        enabled: true,
                        title: 'Subpage 1 Featured Content',
                        description: 'Discover exclusive content available only on subpage 1',
                        cta: {
                            enabled: true,
                            text: 'View Projects',
                            link: '#explore'
                        }
                    }
                },
                description: {
                    title: 'Subpage 1 Title',
                    content: `
                        <p>This is the description content for subpage 1.</p>
                        <p>Add your own content here to describe this section of your project.</p>
                        <p>You can use HTML formatting in this content area.</p>
                    `
                },
                projects: [
                    {
                        name: 'Project A',
                        description: 'Description for project A',
                        image: 'https://placehold.co/400x200/1E1E1E/11f250',
                        projectName: 'project_a', // Needs NMKR_PROJECT_UID_PROJECT_A in .env
                        custom_pricing: false
                    },
                    {
                        name: 'Project B',
                        description: 'Description for project B',
                        image: 'https://placehold.co/400x200/1E1E1E/11f250',
                        projectName: 'project_b', // Needs NMKR_PROJECT_UID_PROJECT_B in .env
                        custom_pricing: false
                    }
                ]
            },
            {
                name: 'Subpage 2',
                url: 'subpage2',
                enabled: true,
                banner: {
                    enabled: true, // Set to false to hide this subpage's banner
                    image: 'https://placehold.co/1200x400/1E1E1E/11f250?text=Subpage+2+Banner',
                    mobileImage: 'https://placehold.co/800x600/1E1E1E/11f250?text=Subpage+2+Mobile',
                    overlay: {
                        enabled: true,
                        title: 'Subpage 2 Custom Pricing',
                        description: 'Projects with flexible pricing - pay what you think is fair',
                        cta: {
                            enabled: true,
                            text: 'Explore Custom Pricing',
                            link: '#explore'
                        }
                    }
                },
                description: {
                    title: 'Subpage 2 Title',
                    content: `
                        <p>This is the description content for subpage 2.</p>
                        <p>This subpage demonstrates custom pricing functionality.</p>
                        <p>Users can enter their own ADA amount for these projects.</p>
                    `
                },
                projects: [
                    {
                        name: 'Project C',
                        description: 'Description for project C with custom pricing',
                        image: 'https://placehold.co/400x200/1E1E1E/11f250',
                        projectName: 'project_c', // Needs NMKR_PROJECT_UID_PROJECT_C in .env
                        custom_pricing: true,
                        minimumCustomPrice: 10.0
                    }
                ]
            },
            {
                name: 'Subpage 3',
                url: 'subpage3',
                enabled: false, // Disabled - won't show in navbar
                banner: {
                    enabled: false, // Set to false to hide this subpage's banner
                    image: 'https://placehold.co/1200x400/11f250/000000?text=Subpage+3+Banner',
                    mobileImage: 'https://placehold.co/800x600/11f250/000000?text=Subpage+3+Mobile',
                    overlay: {
                        enabled: true,
                        title: 'Subpage 3 Coming Soon',
                        description: 'Exciting new projects will be available here soon',
                        cta: {
                            enabled: false, // Disabled for this example
                            text: 'Coming Soon',
                            link: '#'
                        }
                    }
                },
                description: {
                    title: 'Subpage 3 Title',
                    content: `
                        <p>This is the description content for subpage 3.</p>
                        <p>This subpage is currently disabled and won't appear in the navigation.</p>
                    `
                },
                projects: [
                    {
                        name: 'Project D',
                        description: 'Description for project D',
                        image: 'https://placehold.co/400x200/1E1E1E/11f250',
                        projectName: 'project_d', // Needs NMKR_PROJECT_UID_PROJECT_D in .env
                        custom_pricing: true,
                        minimumCustomPrice: 5.0
                    }
                ]
            }
        ],

        // Gallery subpages for displaying all NFTs from a single project for specific sales.
        galleryPages: [
            {
                name: 'Gallery 1',
                url: 'gallery1',
                enabled: true,
                projectName: 'gallery_1', // Connects to NMKR_PROJECT_UID_GALLERY_1 in .env
                banner: {
                    enabled: true, // Set to false to hide this gallery's banner
                    image: 'https://placehold.co/1200x400/1E1E1E/11f250?text=Gallery+1+Banner',
                    mobileImage: 'https://placehold.co/800x600/1E1E1E/11f250?text=Gallery+1+Mobile',
                    overlay: {
                        enabled: true,
                        title: 'Awesome NFT Collection',
                        description: 'Browse all the unique NFTs from our first collection.',
                        cta: {
                            enabled: false
                        }
                    }
                },
                description: {
                    title: 'About Our Collection',
                    content: `
                        <p>This gallery showcases every NFT from the "Awesome" collection.</p>
                        <p>Each piece is unique. Find your favorite and grab it before it's gone!</p>
                    `
                }
            },
            {
                name: 'Gallery 2 (Disabled)',
                url: 'gallery2',
                enabled: true,
                projectName: 'gallery_2', // Connects to NMKR_PROJECT_UID_GALLERY_2 in .env
                banner: {
                    enabled: false, // Set to false to hide this gallery's banner
                    image: 'https://placehold.co/1200x400/1E1E1E/11f250?text=Gallery+2+Banner',
                    mobileImage: 'https://placehold.co/800x600/1E1E1E/11f250?text=Gallery+2+Mobile',
                    overlay: {
                        enabled: true,
                        title: 'Second Collection (Coming Soon)',
                        description: 'Our second collection will be available here soon.',
                        cta: {
                            enabled: false
                        }
                    }
                },
                description: {
                    title: 'Our Second Collection',
                    content: `
                        <p>This gallery is not yet active. Check back soon for our next drop!</p>
                    `
                }
            }
        ]
    },

    // Social Links
    // Add your project's social media links
    social: {
        twitter: 'https://twitter.com/nmkr_io',
        discord: 'https://discord.gg/G3aBKSFnb6',
        telegram: 'https://t.me/nmkrtoken'
    }
};

