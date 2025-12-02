'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export default function FlashcardsPage() {
  const mockFlashcards = [
    {
      english: 'Good morning',
      japanese: 'おはようございます',
      reading: 'Ohayou gozaimasu',
      example:
        'Good morning! How are you today? / おはようございます！今日はいかがですか？',
    },
    {
      english: 'Thank you',
      japanese: 'ありがとう',
      reading: 'Arigatou',
      example: 'Thank you for your help. / 助けてくれてありがとう。',
    },
    {
      english: 'I am learning Japanese',
      japanese: '私は日本語を勉強しています',
      reading: 'Watashi wa nihongo o benkyou shiteimasu',
      example:
        'I am learning Japanese every day. / 毎日日本語を勉強しています。',
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showJapanese, setShowJapanese] = useState(true);

  const card = mockFlashcards[currentIndex];

  return (
    <div className='w-full py-10'>
      <motion.h2
        key='flashcards-title'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className='text-4xl font-semibold mb-8 text-center'
      >
        Flashcards
      </motion.h2>

      <div className='w-full max-w-3xl mx-auto flex flex-col gap-6'>
        {/* ONLY animate when index changes, not on page load */}
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className='w-full bg-neutral-700 p-6 rounded-xl text-center cursor-pointer hover:bg-neutral-600 transition-colors'
        >
          <p className='text-xl font-semibold mb-2'>
            {showJapanese ? card.japanese : card.english}
          </p>
          {showJapanese && (
            <p className='text-neutral-400 mb-2'>{card.reading}</p>
          )}
          <p className='text-neutral-300 text-sm'>{card.example}</p>
        </motion.div>

        <div className='flex gap-4 justify-center'>
          <Button
            className='border border-neutral-900 w-48 bg-orange-600 text-neutral-50 hover:bg-neutral-600 hover:text-neutral-50'
            onClick={() =>
              setCurrentIndex((i) =>
                i === 0 ? mockFlashcards.length - 1 : i - 1
              )
            }
          >
            Previous
          </Button>
          <Button
            className='border border-neutral-900 w-48 bg-orange-600 text-neutral-50 hover:bg-neutral-600 hover:text-neutral-50'
            onClick={() =>
              setCurrentIndex((i) => (i + 1) % mockFlashcards.length)
            }
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
