import {
  defineStackbitConfig,
  DocumentStringLikeFieldNonLocalized,
  SiteMapEntry,
  Model
} from '@stackbit/types';
import { GitContentSource } from '@stackbit/cms-git';
import { allModels } from 'sources/local/models';

/* ─── 1. Clone Header/Footer models for Arabic ────────────────────────── */
const HeaderArModel: Model = {
  ...allModels.Header,
  name: 'HeaderAr',
  label: 'Header (Arabic)'
};

const FooterArModel: Model = {
  ...allModels.Footer,
  name: 'FooterAr',
  label: 'Footer (Arabic)'
};
/* ─────────────────────────────────────────────────────────────────────── */

const gitContentSource = new GitContentSource({
  rootPath: __dirname,
  contentDirs: ['content'],
  /* ── 2. Register the cloned models ── */
  models: [
    ...Object.values(allModels),
    HeaderArModel,       // NEW
    FooterArModel        // NEW
  ],
  assetsConfig: {
    referenceType: 'static',
    staticDir: 'public',
    uploadDir: 'images',
    publicPath: '/'
  }
});

export const config = defineStackbitConfig({
  stackbitVersion: '~0.7.0',
  ssgName: 'nextjs',
  nodeVersion: '18',
  styleObjectModelName: 'ThemeStyle',
  contentSources: [gitContentSource],
  presetSource: {
    type: 'files',
    presetDirs: ['sources/local/presets']
  },
  siteMap: ({ documents, models }): SiteMapEntry[] => {
    const pageModels = models
      .filter((m) => m.type === 'page')
      .map((m) => m.name);

    return documents
      .filter((doc) => pageModels.includes(doc.modelName))
      .map((doc) => {
        let slug = (doc.fields.slug as DocumentStringLikeFieldNonLocalized)
          ?.value;
        if (!slug) return null;

        slug = slug.replace(/^\\/+/, ''); // strip leading /

        switch (doc.modelName) {
          case 'PostFeedLayout':
            return { urlPath: '/blog', document: doc };
          case 'PostLayout':
            return { urlPath: `/blog/${slug}`, document: doc };
          default:
            return { urlPath: `/${slug}`, document: doc };
        }
      });
  }
});

export default config;
