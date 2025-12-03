'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

function FlashcardsContent() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const deckId = searchParams.get('deckId');

  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deckTitle, setDeckTitle] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      let query = supabase.from('cards').select('*');

      if (deckId) {
        // 1. Specific Deck Mode (Public or Private specific deck)
        query = query.eq('deck_id', deckId);

        // Fetch deck title for display
        const { data: deckData } = await supabase
          .from('decks')
          .select('title')
          .eq('id', deckId)
          .single();

        if (deckData) {
          setDeckTitle(deckData.title);
        }
      } else {
        // 2. User's All Cards Mode (Default behavior)
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          query = query.eq('user_id', user.id);
          setDeckTitle(t.flashcardsPage?.title || 'Your Flashcards');
        } else {
          // No user and no specific deckId -> Empty state or guest view
          setLoading(false);
          return;
        }
      }

      const { data } = await query.order('created_at', { ascending: false });

      if (data) {
        setCards(data);
      }
      setLoading(false);
    };

    fetchData();
  }, [deckId, t.flashcardsPage?.title]);

  if (loading)
    return (
      <div className='flex h-[50vh] justify-center items-center'>
        <Loader2 className='animate-spin text-orange-500 w-8 h-8' />
      </div>
    );

  return (
    <div className='w-full py-12 flex flex-col items-center max-w-4xl mx-auto'>
      {/* Animated Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className='text-center mb-10'
      >
        <h2 className='text-4xl font-bold bg-linear-to-r from-white to-neutral-400 bg-clip-text text-transparent mb-4 pb-2 leading-tight'>
          {deckTitle || t.flashcardsPage?.title || 'Your Flashcards'}
        </h2>
        <p className='text-neutral-400'>
          {deckId
            ? 'Reviewing this specific deck.'
            : "Review the vocabulary you've collected from your translations."}
        </p>
      </motion.div>

      {cards.length === 0 ? (
        <div className='text-center py-20 text-neutral-400'>
          <p>
            {t.flashcardsPage?.empty ||
              'No flashcards found. Go to Translate to generate some!'}
          </p>
          {!deckId && (
            <Button
              className='mt-4 bg-orange-600 hover:bg-orange-700 text-white'
              onClick={() => (window.location.href = '/translate')}
            >
              {t.flashcardsPage?.createBtn || 'Create First Set'}
            </Button>
          )}
        </div>
      ) : (
        <div className='w-full max-w-2xl'>
          <div className='w-full flex justify-between items-center mb-6 px-4'>
            <span className='text-sm font-medium text-orange-500'>
              Studying
            </span>
            <span className='text-sm text-neutral-500'>
              {currentIndex + 1} / {cards.length}
            </span>
          </div>

          <div
            className='relative w-full h-[400px] perspective-1000'
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <motion.div
              className='w-full h-full relative preserve-3d cursor-pointer'
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{
                duration: 0.6,
                type: 'spring',
                stiffness: 260,
                damping: 20,
              }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Front */}
              <div className='absolute w-full h-full backface-hidden bg-neutral-800 border-2 border-neutral-700 rounded-3xl flex flex-col items-center justify-center p-8 shadow-2xl'>
                <span className='absolute top-6 left-6 text-xs font-bold text-orange-500 tracking-widest uppercase'>
                  {t.flashcardsPage?.frontLabel || 'Japanese'}
                </span>
                <h3 className='text-5xl font-bold mb-4 text-white text-center'>
                  {cards[currentIndex].front}
                </h3>
                <p className='text-neutral-400 text-lg'>
                  {cards[currentIndex].reading}
                </p>
              </div>

              {/* Back */}
              <div
                className='absolute w-full h-full backface-hidden bg-neutral-900 border-2 border-orange-500/30 rounded-3xl flex flex-col items-center justify-center p-8 shadow-2xl'
                style={{ transform: 'rotateY(180deg)' }}
              >
                <span className='absolute top-6 left-6 text-xs font-bold text-blue-500 tracking-widest uppercase'>
                  {t.flashcardsPage?.backLabel || 'Meaning'}
                </span>
                <h3 className='text-3xl font-bold mb-6 text-center text-white'>
                  {cards[currentIndex].back}
                </h3>
                <div className='w-full h-px bg-white/10 mb-6' />
                <p className='text-neutral-400 text-center italic'>
                  &quot;{cards[currentIndex].example_sentence}&quot;
                </p>
              </div>
            </motion.div>
          </div>

          <div className='flex gap-4 mt-10 justify-center'>
            <Button
              className='w-32 bg-white/5 hover:bg-white/10 text-white'
              onClick={() => {
                setIsFlipped(false);
                setTimeout(
                  () =>
                    setCurrentIndex((i) =>
                      i === 0 ? cards.length - 1 : i - 1
                    ),
                  200
                );
              }}
            >
              Previous
            </Button>
            <Button
              className='w-32 bg-orange-600 hover:bg-orange-700 text-white'
              onClick={() => {
                setIsFlipped(false);
                setTimeout(
                  () => setCurrentIndex((i) => (i + 1) % cards.length),
                  200
                );
              }}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function FlashcardsPage() {
  return (
    <Suspense
      fallback={
        <div className='flex h-[50vh] justify-center items-center'>
          <Loader2 className='animate-spin text-orange-500 w-8 h-8' />
        </div>
      }
    >
      <FlashcardsContent />
    </Suspense>
  );
}
