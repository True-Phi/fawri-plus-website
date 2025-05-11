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
        {metaDescription && (
          <meta name="description" content={metaDescription} />
        )}
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
          return (
            <meta
              key={metaTag.property}
              name={metaTag.property}
              content={metaTag.content}
            />
          );
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
  // annotate each path for both locales
  const localized = paths.flatMap((p) =>
    ['en', 'ar'].map((loc) => ({
      ...p,
      locale: loc
    }))
  );
  return { paths: localized, fallback: false };
}

export async function getStaticProps({ params, locale }) {
  const data = allContent();
  const urlPath = '/' + (params.slug || []).join('/');
  // original props (page + site)
  const props = await resolveStaticProps(urlPath, data);

  // load header/footer JSON based on locale
  const header = await import(
    `../content/data/header${locale === 'ar' ? 'Ar' : ''}.json`
  );
  const footer = await import(
    `../content/data/footer${locale === 'ar' ? 'Ar' : ''}.json`
  );

  return {
    props: {
      ...props,
      header: header.default,
      footer: footer.default,
      locale
    }
  };
}

export default Page;
