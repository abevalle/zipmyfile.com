// src/pages/_app.js
import '../styles/globals.css';
import Head from 'next/head';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>ZipMyFile - Efficient File Compression</title>
        <meta name="title" content="ZipMyFile - Efficient File Compression" />
        <meta name="description" content="Compress your files quickly and efficiently with ZipMyFile. Save space and reduce file size effortlessly." />
        <meta name="keywords" content="file compression, zip files, online file compression, reduce file size, ZipMyFile" />
        <meta name="author" content="ZipMyFile" />
        <meta property="og:title" content="ZipMyFile - Efficient File Compression" />
        <meta property="og:description" content="Compress your files quickly and efficiently with ZipMyFile. Save space and reduce file size effortlessly." />
        <meta property="og:image" content="/meta-image.png" />
        <meta property="og:url" content="https://www.zipmyfile.com" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="ZipMyFile - Efficient File Compression" />
        <meta name="twitter:description" content="Compress your files quickly and efficiently with ZipMyFile. Save space and reduce file size effortlessly." />
        <meta name="twitter:image" content="meta-image.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
