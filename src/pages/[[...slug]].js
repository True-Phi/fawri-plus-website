// src/pages/[[...slug]].js
import React from 'react'
import Head from 'next/head'
import { allContent } from '../utils/local-content'
import { getComponent } from '../components/components-registry'
import { resolveStaticProps } from '../utils/static-props-resolvers'
import { resolveStaticPaths } from '../utils/static-paths-resolvers'
import {
  seoGenerateTitle,
  seoGenerateMetaTags,
  seoGenerateMetaDescription
} from '../utils/seo-utils'

function Page(props) {
  const { page, site } = props
  const { modelName } = page.__metadata || {}
  if (!modelName) {
    throw new Error(`page has no type, page '${props.path}'`)
  }
  const PageLayout = getComponent(modelName)
  if (!PageLayout) {
    throw new Error(`no page layout matching the page model: ${modelName}`)
  }
  const title = seoGenerateTitle(page, site)
  const metaTags = seoGenerateMetaTags(page, site)
  const metaDescription = seoGenerateMetaDescription(page, site)

  return (
    <>
      <Head>
        <title>{title}</title>
        {metaDescription && <meta name="description" content={metaDescription} />}
        {metaTags.map((tag) =>
          tag.format === 'property' ? (
            <meta
              key={tag.property}
              property={tag.property}
              content={tag.content}
            />
          ) : (
            <meta
              key={tag.property}
              name={tag.property}
              content={tag.content}
            />
          )
        )}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {site.favicon && <link rel="icon" href={site.favicon} />}
      </Head>
      <PageLayout page={page} site={site} />
    </>
  )
}

export function getStaticPaths() {
  const data = allContent()
  const basePaths = resolveStaticPaths(data)
  const locales = ['en', 'ar']

  const paths = basePaths.flatMap((entry) => {
    // ensure slug is always an array
    const slugArray = Array.isArray(entry.params?.slug
