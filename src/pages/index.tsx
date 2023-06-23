import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { useState, useEffect } from 'react'
import styles from './index.module.css'
import AddFlashcard from "./components/AddFlashcard"
import FlashcardList from './components/FlashcardList'

import { api } from "~/utils/api";
import FlashcardSet from "./components/FlashcardSet";

interface Card {
  question: string
  answer: string
}

const Home: NextPage = () => {
    const cards = api.test.list.useQuery().data
    const [flashcards, setFlashcards] = useState<Card[]>(cards ? cards : []);

    useEffect(() => {
      if (cards) {
        setFlashcards(cards);
      }
    }, [cards]);

    function addFlashcard(newFlashcard: Card) {
        setFlashcards([...flashcards, newFlashcard]);
    }

    return (
        <>
            <Head>
                <title>MemoMind</title>
                <meta name='description' content='Generated by create-t3-app' />
                <link rel='icon' href='/favicon.ico' />
            </Head>
            <main className={styles.main}>
                <div className={styles.container}>
                    <h1 className={styles.title}>
                        <span className={styles.pinkSpan}>Memo</span>Mind
                    </h1>

                    <AddFlashcard addFlashcard={addFlashcard}/>
                    <FlashcardSet />
                    <FlashcardList cards={flashcards} />
                </div>
            </main>
            </>
    )
}

export default Home

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();

  const { data: secretMessage } = api.example.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined },
  );

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
        {secretMessage && <span> - {secretMessage}</span>}
      </p>
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};
