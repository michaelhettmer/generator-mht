import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useStaticQuery, graphql } from 'gatsby';

interface Props {
    description?: string;
    lang?: string;
    title?: string;
}

export default ({ description = ``, title }: Props) => {
    const query = useStaticQuery(
        graphql`
            query {
                site {
                    siteMetadata {
                        author
                        defaultTitle
                    }
                }
            }
        `,
    );

    const site = query ? query.site : {};

    const metaDescription = description;

    return (
        <Helmet
            htmlAttributes={{
                lang: 'de',
            }}
            defaultTitle={site && site.siteMetadata ? site.siteMetadata.defaultTitle : ''}
            title={title}
            titleTemplate={`%s | ${site && site.siteMetadata ? site.siteMetadata.defaultTitle : ''}`}
            meta={[
                {
                    name: `description`,
                    content: metaDescription,
                },
                {
                    property: `og:title`,
                    content: title,
                },
                {
                    property: `og:description`,
                    content: metaDescription,
                },
                {
                    property: `og:type`,
                    content: `website`,
                },
                {
                    name: `twitter:card`,
                    content: `summary`,
                },
                {
                    name: `twitter:creator`,
                    content: site && site.siteMetadata ? site.siteMetadata.author : '',
                },
                {
                    name: `twitter:title`,
                    content: title,
                },
                {
                    name: `twitter:description`,
                    content: metaDescription,
                },
            ]}
        />
    );
};
