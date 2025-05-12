/**
 * Stackbit → Next static-props resolver
 *
 * Adds paging, reference-resolution **and** language-aware header / footer.
 */

import {
    getRootPagePath,
    resolveReferences,
    getAllPostsSorted,
    getAllNonFeaturedPostsSorted,
    getAllCategoryPostsSorted,
    getPagedItemsForPage,
    isPublished,
    mapDeepAsync
} from './data-utils';

import { isArabicPath } from './locale';   // helper we added earlier

// Utility to sanitize objects by replacing `undefined` with `null`
function sanitizeObject(obj) {
    if (obj === undefined) return null;
    if (obj === null || typeof obj !== 'object') return obj;

    const sanitized = Array.isArray(obj) ? [] : {};
    for (const key in obj) {
        sanitized[key] = sanitizeObject(obj[key]);
    }
    return sanitized;
}

export function resolveStaticProps(urlPath, data) {
    /* ──────────────────────────────
       Locate the page that matches the (possibly paged) URL
    ────────────────────────────── */
    const rootUrlPath = getRootPagePath(urlPath);
    const { __metadata, ...rest } =
        data.pages.find((p) => p.__metadata.urlPath === rootUrlPath) || {};

    /* ──────────────────────────────
       Pick English + Arabic singletons
       – take from data.site (resolved from site.json) if available;
         otherwise fall back to first matching object in data.objects
    ────────────────────────────── */
    const pickFromObjects = (model) =>
        data.objects.find((o) => o.__metadata?.modelName === model) ?? null;

    // Use data.site to access the resolved header/footer from site.json
    const headerEn = data.site?.header || pickFromObjects('Header');
    const headerAr = data.site?.headerAr || pickFromObjects('HeaderAr');
    const footerEn = data.site?.footer || pickFromObjects('Footer');
    const footerAr = data.site?.footerAr || pickFromObjects('FooterAr');

    // Determine if the current page is Arabic based on the URL path
    const useArabic = isArabicPath(urlPath);

    // Select the appropriate header and footer based on the language
    const header = useArabic ? (headerAr || headerEn) : headerEn;
    const footer = useArabic ? (footerAr || footerEn) : footerEn;

    /* ──────────────────────────────
       Build the props that go to the page
    ────────────────────────────── */
    const props = {
        page: {
            __metadata: {
                ...__metadata,
                // keep the REAL urlPath for paginated pages
                urlPath
            },
            ...rest
        },
        site: sanitizeObject({
            ...data.site,
            header: headerEn,
            headerAr: headerAr,
            footer: footerEn,
            footerAr: footerAr
        }), // Ensure all variants are included in site
        ...(header && { header }),
        ...(footer && { footer })
    };

    /* ──────────────────────────────
       Walk the tree & resolve references
    ────────────────────────────── */
    return mapDeepAsync(
        props,
        async (value, keyPath, stack) => {
            const model = value?.__metadata?.modelName;
            if (model && StaticPropsResolvers[model]) {
                return StaticPropsResolvers[model](value, data, { keyPath, stack });
            }
            return value;
        },
        { postOrder: true }
    );
}

/* ----------------------------------------------------------------------
   Per-model resolvers (unchanged)
------------------------------------------------------------------------ */
const StaticPropsResolvers = {
    PostLayout: (props, data, dbg) =>
        resolveReferences(props, ['author', 'category'], data.objects, dbg),

    PostFeedLayout: (props, data) => {
        const perPage = props.numOfPostsPerPage ?? 10;
        let posts = getAllNonFeaturedPostsSorted(data.objects);
        if (!process.env.stackbitPreview) posts = posts.filter(isPublished);

        const pagination = getPagedItemsForPage(props, posts, perPage);
        const items = resolveReferences(
            pagination.items,
            ['author', 'category'],
            data.objects
        );
        return { ...props, ...pagination, items };
    },

    PostFeedCategoryLayout: (props, data) => {
        const perPage = props.numOfPostsPerPage ?? 10;
        const catId = props.__metadata?.id;
        let posts = getAllCategoryPostsSorted(data.objects, catId);
        if (!process.env.stackbitPreview) posts = posts.filter(isPublished);

        const pagination = getPagedItemsForPage(props, posts, perPage);
        const items = resolveReferences(
            pagination.items,
            ['author', 'category'],
            data.objects
        );
        return { ...props, ...pagination, items };
    },

    RecentPostsSection: (props, data) => {
        let posts = getAllPostsSorted(data.objects);
        if (!process.env.stackbitPreview) posts = posts.filter(isPublished);
        posts = posts.slice(0, props.recentCount || 6);

        const recent = resolveReferences(posts, ['author', 'category'], data.objects);
        return { ...props, posts: recent };
    },

    FeaturedPostsSection: (props, data, dbg) =>
        resolveReferences(props, ['posts.author', 'posts.category'], data.objects, dbg),

    FeaturedPeopleSection: (props, data, dbg) =>
        resolveReferences(props, ['people'], data.objects, dbg)
};
