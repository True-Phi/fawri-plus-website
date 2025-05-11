/* ------------------------------------------------------------------ */
/*  src/components/sections/Footer/index.tsx                          */
/* ------------------------------------------------------------------ */

import * as React from 'react';
import Markdown                 from 'markdown-to-jsx';
import classNames               from 'classnames';
import { useRouter }            from 'next/router';

import { mapStylesToClassNames as mapStyles } from '../../../utils/map-styles-to-class-names';
import { Social, Action, Link }               from '../../atoms';
import ImageBlock                              from '../../blocks/ImageBlock';
import LanguageSwitcher                        from '../../atoms/LanguageSwitcher';

import { t } from '../../../utils/locale';   // tiny helper we created

/* ------------------------------------------------------------------ */
/*  Footer component                                                  */
/* ------------------------------------------------------------------ */

export default function Footer(props: any) {
  const {
    colors = 'bg-light-fg-dark',
    logo,
    title,
    text,
    primaryLinks,
    secondaryLinks,
    socialLinks = [],
    legalLinks  = [],
    copyrightText,
    styles      = {},
    enableAnnotations
  } = props;

  /* current locale comes from Next.js router  */
  const { locale } = useRouter();

  return (
    <footer
      className={classNames(
        'sb-component',
        'sb-component-footer',
        colors,
        styles?.self?.margin
          ? mapStyles({ padding: styles?.self?.margin })
          : undefined,
        styles?.self?.padding
          ? mapStyles({ padding: styles?.self?.padding })
          : 'px-4 py-28'
      )}
      {...(enableAnnotations && { 'data-sb-object-id': props?.__metadata?.id })}
    >
      <div className="mx-auto max-w-7xl">

        {/* -------------------------------------------------------------- */}
        {/* top grid                                                      */}
        {/* -------------------------------------------------------------- */}
        <div className="grid sm:grid-cols-3 lg:grid-cols-4 gap-8">
          {/* brand column ------------------------------------------------ */}
          {(logo?.url || title || text) && (
            <div className="pb-8 sm:col-span-3 lg:col-auto">
              {(logo?.url || title) && (
                <Link href="/" className="flex flex-col items-start">
                  {logo && (
                    <ImageBlock
                      {...logo}
                      /* when logo is stored in dictionary, override url   */
                      url={t(locale as string, 'logo') as string}
                      className="inline-block w-auto"
                      {...(enableAnnotations && {
                        'data-sb-field-path': 'logo'
                      })}
                    />
                  )}
                  {title && (
                    <div
                      className="h4"
                      {...(enableAnnotations && {
                        'data-sb-field-path': 'title'
                      })}
                    >
                      {title}
                    </div>
                  )}
                </Link>
              )}

              {text && (
                <Markdown
                  options={{ forceBlock: true, forceWrapper: true }}
                  className={classNames(
                    'sb-markdown',
                    'text-sm',
                    { 'mt-4': title || logo?.url }
                  )}
                  {...(enableAnnotations && {
                    'data-sb-field-path': 'text'
                  })}
                >
                  {text}
                </Markdown>
              )}
            </div>
          )}

          {/* link columns ---------------------------------------------- */}
          {primaryLinks   && <FooterLinksGroup {...primaryLinks}
                                {...(enableAnnotations && {
                                  'data-sb-field-path': 'primaryLinks'
                                })}
                              />}
          {secondaryLinks && <FooterLinksGroup {...secondaryLinks}
                                {...(enableAnnotations && {
                                  'data-sb-field-path': 'secondaryLinks'
                                })}
                              />}

          {/* social icons --------------------------------------------- */}
          {socialLinks.length > 0 && (
            <div className="pb-6">
              <ul
                className="flex flex-wrap items-center"
                {...(enableAnnotations && {
                  'data-sb-field-path': 'socialLinks'
                })}
              >
                {socialLinks.map((link: any, index: number) => (
                  <li
                    key={index}
                    className="text-2xl mb-2 mr-8 lg:mr-12 last:mr-0"
                  >
                    <Social
                      {...link}
                      {...(enableAnnotations && {
                        'data-sb-field-path': `.${index}`
                      })}
                    />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* -------------------------------------------------------------- */}
        {/* bottom bar: legal | switcher | copyright                      */}
        {/* -------------------------------------------------------------- */}
        {(copyrightText || legalLinks.length > 0) && (
          <div
            className="sb-footer-bottom border-t pt-8 mt-16
                       flex flex-col sm:flex-row sm:flex-wrap
                       sm:items-center sm:justify-between">

            {/* legal links ----------- */}
            {legalLinks.length > 0 && (
              <ul
                className="flex flex-wrap mb-3"
                {...(enableAnnotations && {
                  'data-sb-field-path': 'legalLinks'
                })}
              >
                {legalLinks.map((link: any, index: number) => (
                  <li key={index} className="mb-1 mr-6 last:mr-0">
                    <Action
                      {...link}
                      className="text-sm"
                      {...(enableAnnotations && {
                        'data-sb-field-path': `.${index}`
                      })}
                    />
                  </li>
                ))}
              </ul>
            )}

            {/* desktop language switch */}
            <div className="hidden sm:block sm:ml-auto mb-3 sm:mb-0">
              <LanguageSwitcher />
            </div>

            {/* copyright ------------ */}
            {copyrightText && (
              <Markdown
                options={{ forceInline: true, forceWrapper: true, wrapper: 'p' }}
                className={classNames(
                  'sb-markdown',
                  'text-sm',
                  'mb-4',
                  { 'sm:order-first sm:mr-12': legalLinks.length > 0 }
                )}
                {...(enableAnnotations && {
                  'data-sb-field-path': 'copyrightText'
                })}
              >
                {copyrightText}
              </Markdown>
            )}
          </div>
        )}

        {/* mobile language switch */}
        <div className="block sm:hidden mt-8">
          <LanguageSwitcher />
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/*  FooterLinksGroup helper                                           */
/* ------------------------------------------------------------------ */

function FooterLinksGroup(props: any) {
  const { title, links = [] } = props;
  const fieldPath = props['data-sb-field-path'];

  if (links.length === 0) return null;

  return (
    <div className="pb-8" data-sb-field-path={fieldPath}>
      {title && (
        <h2
          className="uppercase text-base tracking-wide"
          {...(fieldPath && { 'data-sb-field-path': '.title' })}
        >
          {title}
        </h2>
      )}

      {links.length > 0 && (
        <ul
          className={classNames('space-y-3', { 'mt-7': title })}
          {...(fieldPath && { 'data-sb-field-path': '.links' })}
        >
          {links.map((link: any, index: number) => (
            <li key={index}>
              <Action
                {...link}
                className="text-sm"
                {...(fieldPath && { 'data-sb-field-path': `.${index}` })}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
