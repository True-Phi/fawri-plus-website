import React from 'react';
import Head from 'next/head';
import { allContent } from '../utils/local-content';
import { getComponent } from '../components/components-registry';
import { resolveStaticProps } from '../utils/static-props-resolvers';
import { resolveStaticPaths } from '../utils/static-paths-resolvers';
import {
  seoGenerateTitle,
  seoGenerateMetaTags,
  seoGenerateMetaDescription
} from '../utils/seo-utils';

function Page(props) {
  const { page, site } = props;
  const { modelName } = page.__metadata;
  if (!modelName) {
    throw new Error(`page has no type, page '${props.path}'`);
  }
  const PageLayout = getComponent(modelName);
  if (!PageLayout) {
    throw new Error(`no page layout matching the page model: ${modelName}`);
  }
  const title = seoGenerateTitle(page, site);
  const metaTags = seoGenerateMetaTags(page, site);
  const metaDescription = seoGenerateMetaDescription(page, site);
  return (
    <>
      <Head>
        <title>{title}</title>
        {metaDescription && <meta name="description" content={metaDescription} />}
        {metaTags.map((metaTag) => {
          if (metaTag.format === 'property') {
            return (
              <meta
                key={metaTag.property}
                property={metaTag.property}
                content={metaTag.content}
              />
            );
          }
          return <meta key={metaTag.property} name={metaTag.property} content={metaTag.content} />;
        })}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {site.favicon && <link rel="icon" href={site.favicon} />}
      </Head>
      <PageLayout page={page} site={site} />
    </>
  );
}

export function getStaticPaths() {
  const data = allContent();
  const paths = resolveStaticPaths(data);
  return { paths, fallback: false };
}

export async function getStaticProps({ params, locale, defaultLocale }) {
  const data = allContent();

  // reconstruct the slug ('' for the root, or 'pricing', etc.)
  const parts = params.slug || [];
  const slug = parts.join('/');

  // if default locale, leave off the prefix; otherwise prefix with "/ar"
  let urlPath;
  if (!slug) {
    // the home page: "/" or "/ar"
    urlPath = locale === defaultLocale ? '/' : `/${locale}`;
  } else {
    // any other page: "/pricing" or "/ar/pricing"
    urlPath =
      locale === defaultLocale ? `/${slug}` : `/${locale}/${slug}`;
  }

  const props = await resolveStaticProps(urlPath, data);
  return { props };
}

export default Page;
