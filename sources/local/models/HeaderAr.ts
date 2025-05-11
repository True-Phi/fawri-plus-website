import { Model } from '@stackbit/types';
import { Header } from './Header';  // ← your existing English Header model

export const HeaderAr: Model = {
  ...Header,
  name: 'HeaderAr',
  label: 'Header (Arabic)',
};
