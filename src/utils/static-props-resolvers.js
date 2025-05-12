/**
 * Stackbit → Next static-props resolver
 *
 * Adds paging, reference-resolution **and** language-aware header + footer
 * and bundles everything else under `site`.
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

export async function resolveStaticProps(urlPath, data) {
  // 1. find the matching page
  const rootUrlPath = getRootPagePath(urlPath);
  const { __metadata, ...rest } =
    data.pages.find((p) => p.__metadata.urlPath === rootUrlPath);

  // 2. pick English/Arabic header + footer singletons
  const pick = (modelName) =>
    data.objects.find((o) => o.__metadata.modelName === modelName) || null;

  const headerEn = data.props.header   ?? pick('Header');
  const headerAr = data.props.headerAr ?? pick('HeaderAr');
  const footerEn = data.props.footer   ?? pick('Footer');
  const footerAr = data.props.footerAr ?? pick('FooterAr');

  const useAr = isArabicPath(urlPath);
  const header = useAr ? (headerAr ?? headerEn) : headerEn;
  const footer = useAr ? (footerAr ?? footerEn) : footerEn;

  // 3. assemble the `site` object
  const site = {
    ...data.props,   // favicon, titleSuffix, etc
    header,
    footer
  };

  // 4. assemble `page`
  const page = {
    __metadata: { ...__metadata, urlPath },
    ...rest
  };

  // 5. resolve any references in the tree
  const result = await mapDeepAsync(
    { site, page },
    async (value, keyPath, stack) => {
      const model = value?.__metadata?.modelName;
      if (model && StaticResolvers[model]) {
        return StaticResolvers[model](value, data, { keyPath, stack });
      }
      return value;
    },
    { postOrder: true }
  );

  return result;
}

/** per‐model reference resolvers (unchanged) **/
const StaticResolvers = {
  PostLayout: (props, data, dbg) =>
    resolveReferences(props, ['author', 'category'], data.objects, dbg),

  PostFeedLayout: (props, data) => {
    const perPage = props.numOfPostsPerPage || 10;
    let posts = getAllNonFeaturedPostsSorted(data.objects);
    if (!process.env.stackbitPreview) posts = posts.filter(isPublished);
    const pagination = getPagedItemsForPage(props, posts, perPage);
    const items = resolveReferences(pagination.items, ['author','category'], data.objects);
    return { ...props, ...pagination, items };
  },

  PostFeedCategoryLayout: (props, data) => {
    const perPage = props.numOfPostsPerPage || 10;
    const posts = getAllCategoryPostsSorted(data.objects, props.__metadata.id)
      .filter((p) => process.env.stackbitPreview || isPublished(p));
    const pagination = getPagedItemsForPage(props, posts, perPage);
    const items = resolveReferences(pagination.items, ['author','category'], data.objects);
    return { ...props, ...pagination, items };
  },

  RecentPostsSection: (props, data) => {
    let posts = getAllPostsSorted(data.objects);
    if (!process.env.stackbitPreview) posts = posts.filter(isPublished);
    posts = posts.slice(0, props.recentCount || 6);
    return { ...props, posts: resolveReferences(posts, ['author','category'], data.objects) };
  },

  FeaturedPostsSection: (props, data, dbg) =>
    resolveReferences(props, ['posts.author','posts.category'], data.objects, dbg),

  FeaturedPeopleSection: (props, data, dbg) =>
    resolveReferences(props, ['people'], data.objects, dbg)
};
