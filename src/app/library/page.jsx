'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Book, ArrowRight } from 'lucide-react';

export default function LibraryPage() {
  const [publicDecks, setPublicDecks] = useState([]);

  useEffect(() => {
    const fetchPublicDecks = async () => {
      const { data, error } = await supabase
        .from('decks')
        .select('*, cards(count)') // Get deck info + card count
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (data) setPublicDecks(data);
    };
    fetchPublicDecks();
  }, []);

  return (
    <div className='w-full max-w-6xl py-12'>
      <h1 className='text-4xl font-bold text-white mb-8'>Public Library</h1>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {publicDecks.map((deck) => (
          <div
            key={deck.id}
            className='bg-neutral-800 border border-white/10 p-6 rounded-xl hover:border-orange-500/50 transition-all group'
          >
            <div className='flex items-start justify-between mb-4'>
              <Book className='w-8 h-8 text-orange-500' />
              <span className='text-xs font-mono bg-neutral-900 px-2 py-1 rounded text-neutral-400'>
                {deck.cards?.[0]?.count || 0} cards
              </span>
            </div>
            <h3 className='text-xl font-bold text-white mb-2 group-hover:text-orange-400'>
              {deck.title}
            </h3>
            <p className='text-neutral-400 text-sm mb-6 line-clamp-2'>
              {deck.description ||
                'Learn Japanese vocabulary and grammar with this study set.'}
            </p>
            <div className='flex gap-2'>
              <Link href={`/flashcards?deckId=${deck.id}`} className='flex-1'>
                <button className='w-full py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm font-medium text-white transition-colors'>
                  Study Cards
                </button>
              </Link>
              <Link href={`/quizzes?deckId=${deck.id}`} className='flex-1'>
                <button className='w-full py-2 bg-orange-600 hover:bg-orange-700 rounded-lg text-sm font-medium text-white transition-colors'>
                  Take Quiz
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
