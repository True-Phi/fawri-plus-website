// pages/index.js
import { FormattedMessage } from 'react-intl';
import LanguageSwitcher from '../components/LanguageSwitcher';

export default function Home() {
  return (
    <main>
      <LanguageSwitcher />

      <h1>
        <FormattedMessage id="welcome" defaultMessage="Welcome!" />
      </h1>

      <p>
        <FormattedMessage
          id="order_now"
          defaultMessage="Order now and get it delivered fast!"
        />
      </p>

      <button>
        <FormattedMessage id="order_now" defaultMessage="Order Now" />
      </button>
    </main>
  );
}
