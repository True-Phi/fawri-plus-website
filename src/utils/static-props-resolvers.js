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

// NEW – helper to detect /ar/…
import { isArabicPath } from './locale';

export function resolveStaticProps(urlPath, data) {
    // root of a paged path: /blog/page/2  →  /blog
    const rootUrlPath = getRootPagePath(urlPath);
    const { __metadata, ...rest } = data.pages.find(
        (page) => page.__metadata.urlPath === rootUrlPath
    );

// ── pick the correct header & footer (only if they exist) ─────────────
const arabic = isArabicPath(urlPath);

const headerEn   = data.props.header   ?? null;
const headerAr   = data.props.headerAr ?? null;
const footerEn   = data.props.footer   ?? null;
const footerAr   = data.props.footerAr ?? null;

const header = arabic ? headerAr ?? headerEn : headerEn;
const footer = arabic ? footerAr ?? footerEn : footerEn;


const props = {
  page: {
    __metadata: {
      ...__metadata,
      // override urlPath in metadata with paged path: /blog → /blog/page/2
      urlPath
    },
    ...rest
  },

  // keep every existing global prop first
  ...data.props,

  // add header/footer only if they exist (avoid undefined)
  ...(header && { header }),
  ...(footer && { footer })
};


    return mapDeepAsync(
        props,
        async (value, keyPath, stack) => {
            const objectType = value?.__metadata?.modelName;
            if (objectType && StaticPropsResolvers[objectType]) {
                const resolver = StaticPropsResolvers[objectType];
                return resolver(value, data, { keyPath, stack });
            }
            return value;
        },
        { postOrder: true }
    );
}

/* -------------------------------------------------------------------- */
/*  Per-model resolvers (unchanged below)                               */
/* -------------------------------------------------------------------- */

const StaticPropsResolvers = {
    PostLayout: (props, data, debugContext) => {
        return resolveReferences(props, ['author', 'category'], data.objects, debugContext);
    },
    PostFeedLayout: (props, data) => {
        const numOfPostsPerPage = props.numOfPostsPerPage ?? 10;
        let allPosts = getAllNonFeaturedPostsSorted(data.objects);
        if (!process.env.stackbitPreview) {
            allPosts = allPosts.filter(isPublished);
        }
        const paginationData = getPagedItemsForPage(props, allPosts, numOfPostsPerPage);
        const items = resolveReferences(paginationData.items, ['author', 'category'], data.objects);
        return {
            ...props,
            ...paginationData,
            items
        };
    },
    PostFeedCategoryLayout: (props, data) => {
        const categoryId = props.__metadata?.id;
        const numOfPostsPerPage = props.numOfPostsPerPage ?? 10;
        let allCategoryPosts = getAllCategoryPostsSorted(data.objects, categoryId);
        if (!process.env.stackbitPreview) {
            allCategoryPosts = allCategoryPosts.filter(isPublished);
        }
        const paginationData = getPagedItemsForPage(props, allCategoryPosts, numOfPostsPerPage);
        const items = resolveReferences(paginationData.items, ['author', 'category'], data.objects);
        return {
            ...props,
            ...paginationData,
            items
        };
    },
    RecentPostsSection: (props, data) => {
        let allPosts = getAllPostsSorted(data.objects);
        if (!process.env.stackbitPreview) {
            allPosts = allPosts.filter(isPublished);
        }
        allPosts = allPosts.slice(0, props.recentCount || 6);
        const recentPosts = resolveReferences(allPosts, ['author', 'category'], data.objects);
        return {
            ...props,
            posts: recentPosts
        };
    },
    FeaturedPostsSection: (props, data, debugContext) => {
        return resolveReferences(props, ['posts.author', 'posts.category'], data.objects, debugContext);
    },
    FeaturedPeopleSection: (props, data, debugContext) => {
        return resolveReferences(props, ['people'], data.objects, debugContext);
    }
};
