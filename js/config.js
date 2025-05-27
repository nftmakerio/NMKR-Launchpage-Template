// NMKR Launchpage Configuration
// This file is where you configure your launch page

const config = {
    // NMKR API Configuration
    nmkr: {
        apiKey: 'YOUR_NMKR_API_KEY',
        projectUid: 'YOUR_PROJECT_UID',
        baseUrl: 'https://studio-api.nmkr.io'
    },

    // Site and Style Configuration
    site: {
        title: 'Brand Title', // Change the title of your brand
        subtitle: 'This is your subtitle', // Change the subtitle of your brand
        logo: 'https://placehold.co/200x80/11f250/000000?text=Your_logo',
        favicon: 'https://placehold.co/32x32/11f250/000000?text=NMKR', // Add your favicon URL here
        defaultTheme: 'dark', // Change default theme setting: 'light' or 'dark'
        colors: {
            accent: '#11f250',  // Main accent color
            accentHover: '#0edf45',  // Accent color on hover
            accentText: '#000000'  // Text color on accent backgrounds
        },
        banner: {
            image: 'https://placehold.co/1200x400/11f250/000000?text=Banner', //change the banner image here
            overlay: {
                enabled: true, //change to false to remove the banner overlay
                title: 'Your Featured Collection', //change the title here
                description: 'Discover our latest and most exclusive NFT collection', //change the description here
                cta: {
                    enabled: true, //change to false to remove the button
                    text: 'Change button text here',
                    link: 'https://nmkr.io' // change the link here or remove the button
                }
            }
        },
        about: {
            title: 'About Our Projects',
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
            image: 'https://placehold.co/400x400/11f250/000000?text=Project+1', //change the image here
            projectName: 'project1' //change the project name here, must match in the env file (For projectName: 'project1' the env must contain: NMKR_PROJECT_UID_PROJECT1=your_project_UID )
        },
        {
            name: 'Project 2',
            description: 'Exclusive NFT collection with special utilities',
            image: 'https://placehold.co/400x400/11f250/000000?text=Project+2',
            projectName: 'project2'
        },
        {
            name: 'Project 3',
            description: 'Limited edition collectibles with rare attributes',
            image: 'https://placehold.co/400x400/11f250/000000?text=Project+3',
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

