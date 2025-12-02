'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export default function GrammarPage() {
  const mockGrammar = [
    {
      sentence: '私は日本語を勉強しています。',
      reading: 'Watashi wa nihongo o benkyou shiteimasu.',
      english: 'I am learning Japanese.',
      explanation:
        'Subject + は + Object + を + Verb. "勉強しています" is the progressive form of "勉強する" (to study).',
    },
    {
      sentence: '昨日、友達と映画を見ました。',
      reading: 'Kinou, tomodachi to eiga o mimashita.',
      english: 'Yesterday, I watched a movie with my friend.',
      explanation:
        'The sentence starts with a time expression "昨日". "友達と" means "with a friend". "映画を見ました" is past tense.',
    },
    {
      sentence: '猫が庭で遊んでいます。',
      reading: 'Neko ga niwa de asondeimasu.',
      english: 'The cat is playing in the garden.',
      explanation:
        '"猫が" marks the subject, "庭で" indicates location, "遊んでいます" shows ongoing action.',
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showJapanese, setShowJapanese] = useState(true);

  const grammar = mockGrammar[currentIndex];

  return (
    <div className='w-full py-10'>
      <motion.h2
        key='grammar-title'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className='text-4xl font-semibold mb-8 text-center'
      >
        Grammar Helper
      </motion.h2>

      <div className='w-full max-w-3xl mx-auto flex flex-col gap-6'>
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className='w-full bg-neutral-700 p-6 rounded-xl text-center hover:bg-neutral-600 transition-colors'
        >
          <p className='text-xl font-semibold mb-2'>
            {showJapanese ? grammar.sentence : grammar.english}
          </p>

          {showJapanese && (
            <p className='text-neutral-400 mb-2'>{grammar.reading}</p>
          )}

          <p className='text-neutral-300 text-sm'>{grammar.explanation}</p>
        </motion.div>

        <div className='flex gap-4 justify-center'>
          <Button
            className='border border-neutral-900 w-48 bg-orange-600 text-neutral-50 hover:bg-neutral-600 hover:text-neutral-50'
            onClick={() =>
              setCurrentIndex((i) => (i === 0 ? mockGrammar.length - 1 : i - 1))
            }
          >
            Previous
          </Button>
          <Button
            className='border border-neutral-900 w-48 bg-orange-600 text-neutral-50 hover:bg-neutral-600 hover:text-neutral-50'
            onClick={() => setCurrentIndex((i) => (i + 1) % mockGrammar.length)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
