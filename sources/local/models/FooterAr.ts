import { Model } from '@stackbit/types';
import { Footer } from './Footer';  // ← your existing English Footer model

export const FooterAr: Model = {
  ...Footer,
  name: 'FooterAr',
  label: 'Footer (Arabic)',
};
