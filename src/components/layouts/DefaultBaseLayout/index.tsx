import * as React from 'react';
import classNames from 'classnames';
import Header from '../../sections/Header';
import Footer from '../../sections/Footer';

export default function DefaultBaseLayout(props) {
    const { page, site, lang } = props; // Add lang to destructured props
    const { enableAnnotations = true } = site;
    const pageMeta = page?.__metadata || {};
    
    console.log('🛠️  site.header modelName:', site.header?.__metadata?.modelName);
    console.log('🛠️  site.footer modelName:', site.footer?.__metadata?.modelName);
    
    return (
        <div className={classNames('sb-page', pageMeta.pageCssClasses)} {...(enableAnnotations && { 'data-sb-object-id': pageMeta.id })}>
            <div className="sb-base sb-default-base-layout">
                {site.header && <Header {...site.header} enableAnnotations={enableAnnotations} lang={lang} />} {/* Pass lang to Header */}
                {props.children}
                {site.footer && <Footer {...site.footer} enableAnnotations={enableAnnotations} lang={lang} />} {/* Pass lang to Footer */}
            </div>
        </div>
    );
}
