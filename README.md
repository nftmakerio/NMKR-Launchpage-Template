# NMKR Launch Page Template

A customizable NFT launch page template that integrates with NMKR Studio. This template allows NFT project creators to set up a professional launch page where their customers can mint NFTs.

Preview Video https://c-ipfs-gw.nmkr.io/ipfs/QmNb3wo7dTihCkydSYY7GJYqYkTbQk8GeWyNyJrEky8jG5

## For Project Creators

This template is designed for NFT project creators who want to:
- Create a professional launch page for their NFT project(s)
- Allow customers to mint NFTs directly from the page
- Enable custom pricing for donations / pay-what-you-want pricing models
- Display project information, roadmap, team, and FAQs
- Support multiple NFT projects on a single page

## Features

- 🎨 Clean, modern design
- 🌓 Light/Dark theme support
- 📱 Fully responsive
- 🎯 Integrated server for NMKR Studio API calls
- 🔄 Real-time minting statistics
- 📊 Multiple minting options
- 💰 Custom pricing support(pay-what-you-want)
- 🎭 Customizable content sections
- 🔗 Social media integration
- 📦 Support for multiple NFT projects

## Quick Start for Project Creators

1. Fork this repository
2. Clone your fork:
```bash
git clone https://github.com/your-username/NMKR-Launchpage-Template.git
```

3. Install dependencies:
```bash
npm install
```

4. Create a `.env` file in the root directory:
```env
PORT=3000
NMKR_API_KEY=your_api_key_here

# Add your project UIDs (you can add as many as you need)
# The projectname must match the projectName in the config.js file 
# ( For projectName: 'project1' in the config.js , 
# the env must contain: NMKR_PROJECT_UID_PROJECT1=your_project_UID )

NMKR_PROJECT_UID_PROJECT1=your_project1_uid_here
NMKR_PROJECT_UID_PROJECT2=your_project2_uid_here
```

5. Customize the configuration in `js/config.js`:
```javascript
const config = {
    // Site and Style Configuration
    site: {
        title: 'Brand Title',
        subtitle: 'This is your subtitle',
        logo: 'path/to/your/logo.png', // Example: 'https://placehold.co/200x80/11f250/000000?text=Your_logo'
        favicon: 'path/to/your/favicon.ico', // Example: 'https://placehold.co/32x32/11f250/000000?text=NMKR'
        defaultTheme: 'dark', // 'light' or 'dark'
        colors: {
            accent: '#11f250',      // Main accent color
            accentHover: '#0edf45', // Accent color on hover
            accentText: '#000000'   // Text color on accent backgrounds
        },
        banner: {
            enabled: true,                // Set to false to hide the main page banner entirely
            image: 'path/to/your/banner.jpg', // Example: 'https://placehold.co/1200x400/11f250/000000?text=Banner'
            overlay: {
                enabled: true,
                title: 'Your Featured Collection',
                description: 'Discover our latest and most exclusive NFT collection',
                cta: {
                    enabled: true, // Set to false to remove the button
                    text: 'Call to Action',
                    link: 'https://your-link.com'
                }
            }
        },
        about: {
            title: 'About Section Title',
            content: 'Your about section content in HTML format'
        }
    },

    // Project Information
    projects: [
        {
            name: 'Your Project Name',
            description: 'Your project description',
            image: 'your-project-image-url', 
            projectName: 'project1', // Corresponds to NMKR_PROJECT_UID_PROJECT1 in .env
            custom_pricing: false // Set to true to enable custom pricing mode
        },
        {
            name: 'Donation Project',
            description: 'Support our cause with a custom donation amount',
            image: 'your-donation-project-image-url',
            projectName: 'project2',
            custom_pricing: true, // Enable custom pricing for donations
            minimumCustomPrice: 5.0 // Minimum donation amount in ADA
        }
        // Add more projects as needed
    ],

    // Social Links
    social: {
        twitter: 'https://twitter.com/yourproject',
        discord: 'https://discord.gg/yourproject',
        telegram: 'https://t.me/yourproject'
    }
};
```

6. Start the server:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

7. Deploy to your preferred hosting service (Heroku, DigitalOcean, etc.)

## Configuration Guide

### NMKR API Configuration
The `nmkr` object in `js/config.js` is used for configuring aspects of the NMKR API integration that might be relevant on the client side.

```javascript
// Example from js/config.js
nmkr: {
    apiKey: 'YOUR_NMKR_API_KEY',    // This is primarily for client-side reference if needed for specific UI features.
                                    // The actual API key for server-side calls MUST be set in your .env file (NMKR_API_KEY).
    projectUid: 'YOUR_PROJECT_UID', // This is a general placeholder. Specific project UIDs for server-side
                                    // operations are fetched from .env (e.g., NMKR_PROJECT_UID_PROJECT1).
    baseUrl: 'https://studio-api.nmkr.io' // Base URL for NMKR Studio API
}
```
**Important:** For security and proper functionality, your `NMKR_API_KEY` (used by the server to communicate with NMKR services) and the specific `NMKR_PROJECT_UID_<projectName>` values (which link your frontend project entries to specific NMKR Studio projects) **must** be stored in your `.env` file. The server uses these environment variables for all sensitive operations and API calls. The `js/config.js` file can hold placeholders or configurations for client-side display logic if needed, but should not be the source of truth for sensitive credentials used by the backend.

### Site Configuration
The `site` object in `config.js` controls the main visual elements of your launch page:

```javascript
site: {
    title: 'Brand Title',                // Main page title
    subtitle: 'This is your subtitle',   // Page subtitle
    logo: 'path/to/your/logo.png',       // URL or path to your logo. Example: 'https://placehold.co/200x80/11f250/000000?text=Your_logo'
    favicon: 'path/to/your/favicon.ico', // URL or path to your favicon. Example: 'https://placehold.co/32x32/11f250/000000?text=NMKR'
    defaultTheme: 'dark',                // Default theme: 'light' or 'dark'
    colors: {
        accent: '#11f250',               // Main accent color
        accentHover: '#0edf45',          // Accent color on hover
        accentText: '#000000'            // Text color on accent backgrounds
    },
    banner: {
        enabled: true,                // Set to false to hide the main page banner entirely
        image: 'path/to/your/banner.jpg', // URL or path to your banner image. Example: 'https://placehold.co/1200x400/11f250/000000?text=Banner'
        overlay: {
            enabled: true,                // Set to false to hide the overlay text and button
            title: 'Your Banner Title',
            description: 'Your banner description text',
            cta: {
                enabled: true,            // Set to false to remove the Call to Action button
                text: 'Call to Action',
                link: 'https://your-link.com'
            }
        }
    },
    about: {
        title: 'About Section Title',
        content: 'Your about section content in HTML format. You can use <p> tags for paragraphs.' // Example: '<p>Welcome to our project!</p><p>Learn more about us.</p>'
    }
}
```

### Project Configuration
Each project in the `projects` array in `js/config.js` configures how a specific NFT project is displayed on your launch page.

```javascript
// js/config.js
{
    name: 'Project Name',          // Display name of your project
    description: 'Description',    // Project description
    image: 'image-url',           // Project image URL (e.g., a preview or representative image for the collection)
                                  // Example: 'https://placehold.co/400x400/11f250/000000?text=Project+1'
    projectName: 'project1'       // Unique identifier for the project. This is crucial as it links this
                                  // frontend configuration to a specific project UID defined in your .env file.
                                  // For example, if projectName is 'project1', the server will look for
                                  // an environment variable named NMKR_PROJECT_UID_PROJECT1 to get the actual NMKR Studio Project UID.
}
```
Details such as price per NFT, minting limits, and remaining supply are typically managed within your NMKR Studio project settings. The backend server fetches this information dynamically using the project UID (derived from `projectName` and your `.env` file) and makes it available to the frontend. The `js/config.js` entries primarily handle the static display information like name, description, and a representative image for the project on the launch page. Ensure the `projectName` here matches the suffix of the corresponding `NMKR_PROJECT_UID_` variable in your `.env` file.

### Custom Pricing Configuration
Enable custom pricing for projects where users can specify their own ADA amount - perfect for donations, pay-what-you-want models, or flexible minting scenarios.

```javascript
// js/config.js
{
    name: 'Donation Project',
    description: 'Support our cause with your preferred amount',
    image: 'image-url',
    projectName: 'donation1',
    custom_pricing: true,                    // Enable custom pricing mode
    minimumCustomPrice: 5.0                  // Minimum price in ADA (optional)
    // For Multisig transactions 4.0 ADA, for regular transactions 6.5 ADA - set up in pricelist settings of NMKR Studio
}
```

#### Custom Pricing Features:
- **Flexible Amount Entry**: Users can enter any ADA amount they wish to pay
- **Minimum Price Validation**: Set a minimum amount to ensure transaction viability
- **Fixed Quantity**: Custom pricing projects mint exactly 1 NFT per transaction
- **Smart UI**: Price display is hidden on project cards, replaced with an informative disclaimer
- **Real-time Validation**: Immediate feedback on price requirements during entry

#### Use Cases:
- **Donation Campaigns**: Allow supporters to contribute any amount they choose
- **Pay-What-You-Want**: Let customers decide the value of your NFT
- **Flexible Fundraising**: Perfect for charity projects or community funding

#### Configuration Notes:
- Set `custom_pricing: true` to enable the feature
- Use `minimumCustomPrice` to enforce minimum viable transaction amounts
- Consider NMKR Studio transaction fees when setting minimums (Multisig: 4.0 ADA, Regular: 6.5 ADA)
- The project card will show a disclaimer instead of fixed pricing information

### Social Links
Configure your social media presence:

```javascript
social: {
    twitter: 'https://twitter.com/yourproject',
    discord: 'https://discord.gg/yourproject',
    telegram: 'https://t.me/yourproject'
}
```

### Subpages Configuration
This template supports two types of subpages, which can be configured in the `subpages` object in `js/config.js`.

#### Content Pages
Content pages are flexible subpages where you can display a collection of different project cards. This is useful for showcasing multiple minting projects, different collections, or featured items.

**Configuration:**
- Add a page object to the `subpages.contentPages` array.
- Each page can have its own banner, description, and an array of `projects`.

```javascript
// js/config.js
subpages: {
    enabled: true,
    showInNavbar: true,
    contentPages: [
        {
            name: 'Featured Drops',
            url: 'featured',
            enabled: true,
            banner: {
                enabled: true, // Set to false to hide this subpage's banner
                // ...
            },
            description: { /* ... */ },
            projects: [
                {
                    name: 'Project A',
                    projectName: 'project_a',
                    // ...
                },
                {
                    name: 'Project B',
                    projectName: 'project_b',
                    // ...
                }
            ]
        }
    ]
}
```

#### Gallery Pages
Gallery pages are designed to showcase every NFT from a single project in a grid view. This is perfect for secondary sales or allowing users to browse an entire collection.

**Configuration:**
- Add a page object to the `subpages.galleryPages` array.
- Each gallery page is linked to a **single** `projectName`. This `projectName` must have a corresponding `NMKR_PROJECT_UID_` entry in your `.env` file.

```javascript
// js/config.js
subpages: {
    // ...
    galleryPages: [
        {
            name: 'Main Collection',
            url: 'collection',
            enabled: true,
            projectName: 'main_collection', // Corresponds to NMKR_PROJECT_UID_MAIN_COLLECTION in .env
            banner: {
                enabled: true, // Set to false to hide this gallery's banner
                // ...
            },
            description: { /* ... */ }
        }
    ]
}
```

## Development

To modify the template:

1. Make your changes to the HTML, CSS, or JavaScript files
2. Start the development server: `npm run dev` / for production deployment `npm start`
3. Test your changes at `http://localhost:3000`
4. Commit and push your changes
5. Deploy to your hosting service

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support with NMKR Studio integration, please contact our support via https://nmkr.io/support.