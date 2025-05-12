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
  // props now contains: page, header, footer, favicon, titleSuffix, etc.
  const { page, header, footer, ...site } = props;
  const { modelName } = page.__metadata;
  if (!modelName) {
    throw new Error(`page has no type, page '${page.__metadata.urlPath}'`);
  }
  const PageLayout = getComponent(modelName);
  if (!PageLayout) {
    throw new Error(`no page layout matching the page model: ${modelName}`);
  }

  // SEO
  const title = seoGenerateTitle(page, site);
  const metaTags = seoGenerateMetaTags(page, site);
  const metaDescription = seoGenerateMetaDescription(page, site);

  return (
    <>
      <Head>
        <title>{title}</title>
        {metaDescription && (
          <meta name="description" content={metaDescription} />
        )}
        {metaTags.map((mt) =>
          mt.format === 'property' ? (
            <meta
              key={mt.property}
              property={mt.property}
              content={mt.content}
            />
          ) : (
            <meta
              key={mt.property}
              name={mt.property}
              content={mt.content}
            />
          )
        )}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {site.favicon && <link rel="icon" href={site.favicon} />}
      </Head>
      {/* pass header/footer (and any other globals) as part of site */}
      <PageLayout page={page} header={header} footer={footer} site={site} />
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
  const parts = params.slug || [];
  const slug = parts.join('/');

  let urlPath;
  if (!slug) {
    // home page
    urlPath = locale === defaultLocale ? '/' : `/${locale}`;
  } else {
    urlPath =
      locale === defaultLocale ? `/${slug}` : `/${locale}/${slug}`;
  }

  const props = await resolveStaticProps(urlPath, data);
  return { props };
}

export default Page;
