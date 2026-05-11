import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({
  title = "Metal Web | Premium Web Development & Digital Design Agency Mumbai",
  description = "Metal Web is a premium digital agency in Mumbai specializing in high-performance web development, custom software solutions, and elite UI/UX design.",
  keywords = "web development agency Mumbai, premium web design, custom software development, digital agency India, high-end UI/UX, React developers Mumbai, Vite development, Metal Web agency",
  author = "Metal Web",
  ogImage = "/og-image.png",
  url = "https://metalweb.site"
}) => {

  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "Metal Web",
    "image": "https://metalweb.site/logo.png",
    "@id": "https://metalweb.site",
    "url": "https://metalweb.site",
    "telephone": "+91 8169574956",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "",
      "addressLocality": "Mumbai",
      "addressRegion": "MH",
      "postalCode": "401107",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 19.2828,
      "longitude": 72.8872

    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"
      ],
      "opens": "09:00",
      "closes": "18:00"
    },
    "sameAs": [
      "https://www.linkedin.com/company/metalweb",
      "https://twitter.com/metalweb"
    ],
    "description": "Metal Web is a boutique digital agency specializing in premium web development and strategic design for growth-focused brands."
  };

  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <link rel="canonical" href={url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* JSON-LD Schema Markup */}
      <script type="application/ld+json">
        {JSON.stringify(schemaMarkup)}
      </script>
    </Helmet>
  );
};

export default SEO;
