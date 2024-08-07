// pages/index.js
import Head from 'next/head';
import Chat from '../components/Chat';
export default function Home() {
  return (
    <>
      <Head>
        <title>ChatGPT Clone</title>
        <meta name="description" content="ChatGPT clone built with Next.js" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>ChatGPT Clone</h1>
        <Chat />
      </main>

      <style jsx>{`
        main {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          padding: 0 2rem;
        }

        h1 {
          font-size: 2rem;
          margin-bottom: 1rem;
        }
      `}</style>
    </>
  );
}
