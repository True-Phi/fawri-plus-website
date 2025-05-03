import * as React from 'react';
import classNames from 'classnames';

import { getComponent } from '../../components-registry';
import { mapStylesToClassNames as mapStyles } from '../../../utils/map-styles-to-class-names';
import SubmitButtonFormControl from './SubmitButtonFormControl';

export default function FormBlock(props) {
  const formRef = React.useRef<HTMLFormElement>(null);
  const [status, setStatus] = React.useState<'idle'|'success'|'error'>('idle');
  const {
    fields = [],
    elementId,
    submitButton,
    className,
    styles = {},
    'data-sb-field-path': fieldPath
  } = props;

  // After successful submit, just show a thank-you message:
  if (status === 'success') {
    return (
      <div
        className={classNames(
          'sb-component sb-component-block sb-component-form-block',
          className,
          styles.self?.padding ? mapStyles({ padding: styles.self.padding }) : undefined
        )}
      >
        <p>Thank you! Your message was sent successfully.</p>
      </div>
    );
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = formRef.current;
    if (!form) return;

    const body = new URLSearchParams(new FormData(form) as any).toString();
    try {
      const res = await fetch('/__forms.html', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body
      });
      if (res.ok) {
        setStatus('success');
      } else {
        console.error('Form submission failed:', res.status, res.statusText);
        setStatus('error');
      }
    } catch (err) {
      console.error('Network error:', err);
      setStatus('error');
    }
  }

  return (
    <form
      ref={formRef}
      name={elementId}
      id={elementId}
      method="POST"
      data-netlify="true"
      onSubmit={handleSubmit}
      className={classNames(
        'sb-component sb-component-block sb-component-form-block',
        className,
        styles.self?.margin   ? mapStyles({ margin: styles.self.margin   }) : undefined,
        styles.self?.padding  ? mapStyles({ padding: styles.self.padding  }) : undefined,
        styles.self?.borderWidth && styles.self.borderWidth !== 0 && styles.self.borderStyle !== 'none'
          ? mapStyles({
              borderWidth: styles.self.borderWidth,
              borderStyle: styles.self.borderStyle,
              borderColor: styles.self.borderColor ?? 'border-primary'
            })
          : undefined,
        styles.self?.borderRadius ? mapStyles({ borderRadius: styles.self.borderRadius }) : undefined
      )}
      data-sb-field-path={fieldPath}
    >
      {/* Hidden input so Netlify knows this form’s name */}
      <input type="hidden" name="form-name" value={elementId} />

      <div
        className={classNames(
          'w-full flex flex-wrap gap-8',
          mapStyles({ justifyContent: styles.self?.justifyContent ?? 'flex-start' })
        )}
        {...(fieldPath && { 'data-sb-field-path': '.fields' })}
      >
        {fields.map((field, i) => {
          const modelName = field.__metadata.modelName;
          if (!modelName) throw new Error(`Form field missing modelName`);
          const FormControl = getComponent(modelName);
          if (!FormControl) throw new Error(`No component for model ${modelName}`);
          return (
            <FormControl
              key={i}
              {...field}
              {...(fieldPath && { 'data-sb-field-path': `.${i}` })}
            />
          );
        })}
      </div>

      {status === 'error' && (
        <p className="mt-4 text-red-600">
          Oops! Something went wrong. Please try again.
        </p>
      )}

      {submitButton && (
        <div className={classNames('mt-8 flex', mapStyles({ justifyContent: styles.self?.justifyContent ?? 'flex-start' }))}>
          <SubmitButtonFormControl
            {...submitButton}
            {...(fieldPath && { 'data-sb-field-path': '.submitButton' })}
          />
        </div>
      )}
    </form>
  );
}
