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
        logo: 'https://placehold.co/200x80/1E1E1E/11f250?text=Your_logo',
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
            image: 'https://placehold.co/1200x400/1E1E1E/11f250?text=1200x400', // Change the banner image here, recommended size: 1200x400
            mobileImage: 'https://placehold.co/800x600/1E1E1E/11f250?text=800x600', // Matching mobile version, recommended size: 800x600
            overlay: {
                enabled: true, //change to false to remove the banner overlay
                title: 'Your Featured Collection', //change the title here
                description: 'Discover our latest and most exclusive NFT collection', //change the description here
                cta: {
                    enabled: true, //change to false to remove the button
                    text: 'CTA button', //change the button text here
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
        }
    },

    // Project Information
    // Configure your NFT projects here
    // Add more projects as needed, make sure to also add the project UID to the env file
    projects: [
        {
            name: 'Project 1', //change the project name here
            description: 'A unique collection of digital art pieces', //change the description here
            image: 'https://placehold.co/400x400/1E1E1E/11f250', //change the image here, recommended size: 400x400
            projectName: 'project1' //change the project name here, must match in the env file (For projectName: 'project1' the env must contain: NMKR_PROJECT_UID_PROJECT1=your_project_UID )
        },
        {
            name: 'Project 2',
            description: 'Exclusive NFT collection with special utilities',
            image: 'https://placehold.co/400x400/1E1E1E/11f250',
            projectName: 'project2'
        },
        {
            name: 'Project 3',
            description: 'Limited edition collectibles with rare attributes',
            image: 'https://placehold.co/400x400/1E1E1E/11f250',
            projectName: 'project3'
        }
    ],

    // Social Links
    // Add your project's social media links
    social: {
        twitter: 'https://twitter.com/nmkr_io',
        discord: 'https://discord.gg/G3aBKSFnb6',
        telegram: 'https://t.me/nmkrtoken'
    }
};

