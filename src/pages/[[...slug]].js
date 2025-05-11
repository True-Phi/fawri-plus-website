// src/pages/[[...slug]].js
import React from 'react';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';
import { allContent } from '../utils/local-content';
import { getComponent } from '../components/components-registry';
import { resolveStaticProps } from '../utils/static-props-resolvers';
import { resolveStaticPaths } from '../utils/static-paths-resolvers';
import { seoGenerateTitle, seoGenerateMetaTags, seoGenerateMetaDescription } from '../utils/seo-utils';
import LanguageSwitcher from '../components/LanguageSwitcher';

function Header() {
  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div>Logo</div>
        <LanguageSwitcher />
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="bg-gray-800 text-white p-4 mt-8">
      <div className="container mx-auto flex justify-between items-center">
        <div>&copy; 2025 Your Company</div>
        <LanguageSwitcher />
      </div>
    </footer>
  );
}

function Page(props) {
    const { page, site } = props;
    const { t } = useTranslation();
    const router = useRouter(); // Add useRouter for dynamic path handling

    // Determine language from URL and adjust content path
    const isArabic = router.pathname.startsWith('/ar');
    const contentPath = isArabic ? '/ar' + (router.pathname.replace('/ar', '') || '/index') : '/' + (router.pathname || '/index');
    const translatedPage = {
        ...page,
        title: page.title ? t(page.title) : page.title,
        sections: page.sections
            ? page.sections.map((section) => ({
                ...section,
                title: section.title && section.title.text ? { ...section.title, text: t(section.title.text) } : section.title,
                subtitle: section.subtitle ? t(section.subtitle) : section.subtitle,
                text: section.text ? t(section.text) : section.text,
                items: section.items
                    ? section.items.map((item) => ({
                        ...item,
                        title: item.title ? t(item.title) : item.title,
                        subtitle: item.subtitle ? t(item.subtitle) : item.subtitle,
                        text: item.text ? t(item.text) : item.text,
                    }))
                    : section.items,
                actions: section.actions
                    ? section.actions.map((action) => ({
                        ...action,
                        label: action.label ? t(action.label) : action.label,
                    }))
                    : section.actions,
            }))
            : page.sections,
    };

    const { modelName } = translatedPage.__metadata;
    if (!modelName) {
        throw new Error(`page has no type, page '${props.path}'`);
    }

    const PageLayout = getComponent(modelName);
    if (!PageLayout) {
        throw new Error(`no page layout matching the page model: ${modelName}`);
    }

    const title = seoGenerateTitle(translatedPage, site);
    const metaTags = seoGenerateMetaTags(translatedPage, site);
    const metaDescription = seoGenerateMetaDescription(translatedPage, site);

    return (
        <>
            <Head>
                <title>{title}</title>
                {metaDescription && <meta name="description" content={metaDescription} />}
                {metaTags.map((metaTag) => {
                    if (metaTag.format === 'property') {
                        return <meta key={metaTag.property} property={metaTag.property} content={metaTag.content} />;
                    }
                    return <meta key={metaTag.property} name={metaTag.property} content={metaTag.content} />;
                })}
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                {site.favicon && <link rel="icon" href={site.favicon} />}
            </Head>
            <Header />
            <PageLayout page={translatedPage} site={site} />
            <Footer />
        </>
    );
}

export function getStaticPaths() {
    const data = allContent();
    const paths = resolveStaticPaths(data);
    // Add Arabic paths
    const arabicPaths = paths.map((path) => ({
        ...path,
        params: { slug: ['ar', ...path.params.slug] },
    }));
    return { paths: [...paths, ...arabicPaths], fallback: false };
}

export async function getStaticProps({ params }) {
    const data = allContent();
    const slug = params.slug || [];
    const isArabic = slug[0] === 'ar';
    const urlPath = '/' + (isArabic ? slug.slice(1).join('/') : slug.join('/'));
    const props = await resolveStaticProps(urlPath, data);
    return { props };
}

export default Page;
