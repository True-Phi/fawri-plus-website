import * as React from 'react';
import classNames from 'classnames';

import { mapStylesToClassNames as mapStyles } from '../../../utils/map-styles-to-class-names';

export default function TitleBlock(props) {
    const { className, text = [], color = 'text-dark', styles = {}, lang } = props;
    const fieldPath = props['data-sb-field-path'];
    if (!text) {
        return null;
    }

    // Determine if the content is Arabic based on lang prop
    const isArabic = lang === 'ar';

    return (
        <h2
            className={classNames(
                'sb-component',
                'sb-component-block',
                'sb-component-title',
                color,
                className,
                styles?.self ? mapStyles(styles?.self) : undefined
            )}
            lang={isArabic ? 'ar' : 'en'} // Set lang attribute dynamically
            data-sb-field-path={fieldPath}
        >
            <span {...(fieldPath && { 'data-sb-field-path': '.text' })}>{text}</span>
        </h2>
    );
}
