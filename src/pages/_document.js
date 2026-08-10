import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="bn">
      <Head>
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#0B0E14" />
        <meta name="description" content="BDT Mining — Next Generation Mobile Mining Platform" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body className="bg-darkBg text-white antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}