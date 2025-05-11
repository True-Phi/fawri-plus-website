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
import { isArabicPath } from './locale';

/* ------------------------------------------------------------------ */
/*  helpers                                                           */
/* ------------------------------------------------------------------ */
const pickObject = (objects, model) =>
    objects.find((obj) => obj?.__metadata?.modelName === model) ?? null;

/* ------------------------------------------------------------------ */
/*  main resolver                                                     */
/* ------------------------------------------------------------------ */
export function resolveStaticProps(urlPath, data) {
    /* 1. identify the correct page (root of a paged path) */
    const rootUrlPath = getRootPagePath(urlPath);
    const { __metadata, ...rest } = data.pages.find(
        (p) => p.__metadata.urlPath === rootUrlPath
    );

    /* 2. decide which header/footer to use               */
    const arabic    = isArabicPath(urlPath);

    const headerEn  = data.props.header   ?? pickObject(data.objects, 'Header');
    const headerAr  = data.props.headerAr ?? pickObject(data.objects, 'HeaderAr');

    const footerEn  = data.props.footer   ?? pickObject(data.objects, 'Footer');
    const footerAr  = data.props.footerAr ?? pickObject(data.objects, 'FooterAr');

    const header    = arabic ? headerAr || headerEn : headerEn;
    const footer    = arabic ? footerAr || footerEn : footerEn;

    /* 3. compose props */
    const props = {
        page: {
            __metadata: { ...__metadata, urlPath }, // keep paged url
            ...rest
        },
        ...data.props,          // keep any other globals
        ...(header && { header }),
        ...(footer && { footer })
    };

    /* 4. run the existing deep-reference resolving logic */
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

/* ------------------------------------------------------------------ */
/*  per-model resolvers (unchanged)                                   */
/* ------------------------------------------------------------------ */
const StaticPropsResolvers = {
    PostLayout: (props, data, dbg) =>
        resolveReferences(props, ['author', 'category'], data.objects, dbg),

    PostFeedLayout: (props, data) => {
        const perPage = props.numOfPostsPerPage ?? 10;
        let items = getAllNonFeaturedPostsSorted(data.objects);
        if (!process.env.stackbitPreview) items = items.filter(isPublished);
        const pagination = getPagedItemsForPage(props, items, perPage);
        return {
            ...props,
            ...pagination,
            items: resolveReferences(pagination.items, ['author', 'category'], data.objects)
        };
    },

    PostFeedCategoryLayout: (props, data) => {
        const id      = props.__metadata?.id;
        const perPage = props.numOfPostsPerPage ?? 10;
        let items     = getAllCategoryPostsSorted(data.objects, id);
        if (!process.env.stackbitPreview) items = items.filter(isPublished);
        const pagination = getPagedItemsForPage(props, items, perPage);
        return {
            ...props,
            ...pagination,
            items: resolveReferences(pagination.items, ['author', 'category'], data.objects)
        };
    },

    RecentPostsSection: (props, data) => {
        let posts = getAllPostsSorted(data.objects);
        if (!process.env.stackbitPreview) posts = posts.filter(isPublished);
        posts = posts.slice(0, props.recentCount || 6);
        return { ...props, posts: resolveReferences(posts, ['author', 'category'], data.objects) };
    },

    FeaturedPostsSection: (p, d, dbg) =>
        resolveReferences(p, ['posts.author', 'posts.category'], d.objects, dbg),

    FeaturedPeopleSection: (p, d, dbg) =>
        resolveReferences(p, ['people'], d.objects, dbg)
};
