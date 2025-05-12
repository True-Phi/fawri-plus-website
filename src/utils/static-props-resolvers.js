// src/utils/static-props-resolvers.js

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

import { isArabicPath } from './locale';

export function resolveStaticProps(urlPath, data) {
  // 1. Find the matching page by its “root” URL (handles /page/2 etc)
  const rootUrlPath = getRootPagePath(urlPath);
  const { __metadata, ...rest } = data.pages.find(
    (p) => p.__metadata.urlPath === rootUrlPath
  );

  // 2. Pick English vs Arabic singletons
  const pickFromObjects = (model) =>
    data.objects.find((o) => o.__metadata?.modelName === model) ?? null;

  const headerEn = data.props.header   ?? pickFromObjects('Header');
  const headerAr = data.props.headerAr ?? pickFromObjects('HeaderAr');
  const footerEn = data.props.footer   ?? pickFromObjects('Footer');
  const footerAr = data.props.footerAr ?? pickFromObjects('FooterAr');

  const useArabic = isArabicPath(urlPath);

  const header = useArabic ? (headerAr ?? headerEn) : headerEn;
  const footer = useArabic ? (footerAr ?? footerEn) : footerEn;

  // 3. Build `page` and `site` and then wrap them for mapping
  const page = {
    __metadata: {
      ...__metadata,
      urlPath // preserve the full paginated path
    },
    ...rest
  };

  const site = {
    ...data.props,       // all your global singletons from content/data/site.json
    ...(header && { header }),
    ...(footer && { footer })
  };

  const props = { page, site };

  // 4. Finally resolve any __metadata references throughout page & site
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

/* --------------------------------------------------------------------
   Per-model resolvers (unchanged)
-------------------------------------------------------------------- */
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
    const recent = resolveReferences(
      posts,
      ['author', 'category'],
      data.objects
    );
    return { ...props, posts: recent };
  },

  FeaturedPostsSection: (props, data, dbg) =>
    resolveReferences(props, ['posts.author', 'posts.category'], data.objects, dbg),

  FeaturedPeopleSection: (props, data, dbg) =>
    resolveReferences(props, ['people'], data.objects, dbg)
};
