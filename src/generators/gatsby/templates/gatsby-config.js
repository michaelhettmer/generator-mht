/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-var-requires */
module.exports = {
    siteMetadata: {
        author: `<%= authorName %>`,
        defaultTitle: `<%= moduleName %>`
    },
    plugins: [
        'gatsby-plugin-remove-console',
        {
            resolve: `gatsby-plugin-typescript`,
            options: {
                isTSX: true,
                jsxPragma: `React`,
                allExtensions: true,
            },
        },
        {
            resolve: 'gatsby-plugin-svgr',
            options: {
                prettier: true,
                svgo: true,
                dimensions: false,
                svgoConfig: {
                    plugins: {
                        removeViewBox: false,
                        cleanupIDs: true,
                    },
                },
            },
        },
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                path: `${__dirname}/src/images`,
                name: 'images',
            },
        },
        `gatsby-transformer-json`,
        `gatsby-plugin-react-helmet-async`,
        {
            resolve: `gatsby-plugin-root-import`,
            options: {
                '~': `${__dirname}/src`,
            },
        },
        'gatsby-transformer-sharp',
        'gatsby-plugin-sharp',
        {
            resolve: `gatsby-plugin-manifest`,
            options: {
                name: '<%= moduleName %>',
                short_name: '<%= moduleName %>',
                start_url: '/',
                background_color: '#026666',
                theme_color: '#026666',
                display: 'standalone',
                icon: 'src/images/icon.jpg',
                crossOrigin: `use-credentials`,
            },
        },
        `gatsby-plugin-offline`,
        {
            resolve: 'gatsby-plugin-postcss',
            options: {
                postCssPlugins: [require(`postcss-preset-env`)({ stage: 0 })],
            },
        },
        {
            resolve: `gatsby-plugin-minify-classnames`,
            options: {
                develop: false,
            },
        },
    ],
};
