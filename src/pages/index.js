import { FormattedMessage } from 'react-intl';
import LanguageSwitcher from '../src/components/LanguageSwitcher';

export default function Home() {
  return (
    <>
      <LanguageSwitcher />
      <h1><FormattedMessage id="welcome" /></h1>
      <button><FormattedMessage id="order_now" /></button>
    </>
  );
}
