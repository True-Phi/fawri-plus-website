import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <NextScript />
        {/* Respond.io Chat Widget */}
        <script
          id="respondio__widget"
          src="https://cdn.respond.io/webchat/widget/widget.js?cld=3b9e6b2b2872360cb02656a30b84da7"
        ></script>
      </body>
    </Html>
  );
}
