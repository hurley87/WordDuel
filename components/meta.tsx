import Head from 'next/head';

const Meta = () => (
  <Head>
    <title>WordDuel</title>
    <meta charSet="utf-8" />
    <meta name="mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta
      name="apple-mobile-web-app-status-bar-style"
      content="black-translucent"
    />
    <meta name="apple-mobile-web-app-title" content="WordDuel" />
    <meta name="application-name" content="WordDuel" />
    <meta name="theme-color" content="#f4f4f5" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, user-scalable=0, viewport-fit=cover"
    />
    <link rel="icon" type="image/png" href="/images/favicon.png" />
    <link rel="manifest" href="/manifest.json" />
  </Head>
);

export default Meta;
