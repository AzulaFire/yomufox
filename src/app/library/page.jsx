'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Book, Globe, Loader2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function LibraryPage() {
  const [publicDecks, setPublicDecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { lang, t } = useLanguage();

  useEffect(() => {
    const fetchPublicDecks = async () => {
      setLoading(true);

      // LOGIC:
      // If the site is in English, the user wants to learn Japanese ('ja').
      // If the site is in Japanese, the user wants to learn English ('en').
      const targetLang = lang === 'en' ? 'ja' : 'en';

      const { data, error } = await supabase
        .from('decks')
        .select('*, cards(count)') // Get deck info + card count
        .eq('is_public', true)
        .eq('target_language', targetLang) // Filter by target language
        .order('created_at', { ascending: false });

      if (data) setPublicDecks(data);
      setLoading(false);
    };

    fetchPublicDecks();
  }, [lang]); // Re-run this effect if the language changes

  return (
    <div className='w-full max-w-6xl py-12'>
      <div className='mb-10 text-center'>
        <h1 className='text-4xl font-bold text-white mb-4'>
          {lang === 'en' ? 'Public Library' : '公開ライブラリ'}
        </h1>
        <p className='text-neutral-400'>
          {lang === 'en'
            ? 'Free study sets created for everyone.'
            : '誰でも利用できる無料の学習セット。'}
        </p>
      </div>

      {loading ? (
        <div className='flex justify-center h-40 items-center'>
          <Loader2 className='animate-spin text-orange-500 w-8 h-8' />
        </div>
      ) : publicDecks.length === 0 ? (
        <div className='text-center py-20 border border-dashed border-neutral-800 rounded-xl'>
          <p className='text-neutral-500'>
            {lang === 'en'
              ? 'No public decks found for this language yet.'
              : 'この言語の公開デッキはまだありません。'}
          </p>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {publicDecks.map((deck) => (
            <div
              key={deck.id}
              className='bg-neutral-800 border border-white/10 p-6 rounded-xl hover:border-orange-500/50 transition-all group flex flex-col h-full'
            >
              <div className='flex items-start justify-between mb-4'>
                <div className='p-3 bg-neutral-900 rounded-lg'>
                  <Globe className='w-6 h-6 text-orange-500' />
                </div>
                <span className='text-xs font-mono bg-neutral-900 border border-white/5 px-2 py-1 rounded text-neutral-400'>
                  {deck.cards?.[0]?.count || 0} cards
                </span>
              </div>

              <h3 className='text-xl font-bold text-white mb-2 group-hover:text-orange-400 transition-colors'>
                {deck.title}
              </h3>

              <p className='text-neutral-400 text-sm mb-6 line-clamp-3 grow'>
                {deck.description || 'No description provided.'}
              </p>

              {/* Category Tag */}
              {deck.category && (
                <div className='mb-4'>
                  <span className='text-xs text-orange-400/80 bg-orange-900/20 px-2 py-1 rounded-full border border-orange-500/20'>
                    {deck.category}
                  </span>
                </div>
              )}

              <div className='grid grid-cols-2 gap-3 mt-auto'>
                <Link href={`/flashcards?deckId=${deck.id}`} className='w-full'>
                  <button className='w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg text-sm font-medium text-white transition-colors'>
                    {lang === 'en' ? 'Cards' : 'カード'}
                  </button>
                </Link>
                <Link href={`/quizzes?deckId=${deck.id}`} className='w-full'>
                  <button className='w-full py-2.5 bg-orange-600 hover:bg-orange-700 rounded-lg text-sm font-medium text-white transition-colors shadow-lg shadow-orange-900/20'>
                    {lang === 'en' ? 'Quiz' : 'クイズ'}
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
