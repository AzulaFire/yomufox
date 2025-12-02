'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export default function QuizzesPage() {
  const mockQuizzes = [
    {
      questionJP: '次の漢字の読み方はどれですか？: 水',
      questionEN: 'What is the reading of the following kanji: 水?',
      options: ['みず', 'ひ', 'き', 'そら'],
      answer: 'みず',
    },
    {
      questionJP: '「勉強する」の意味は何ですか？',
      questionEN: 'What does "勉強する" mean?',
      options: ['To play', 'To study', 'To eat', 'To sleep'],
      answer: 'To study',
    },
    {
      questionJP: '「昨日、私は映画を見ました。」の正しい英訳は？',
      questionEN:
        'Which is the correct English translation for "昨日、私は映画を見ました。"?',
      options: [
        'I watch a movie yesterday.',
        'Yesterday, I watched a movie.',
        'I am watching a movie yesterday.',
        'Yesterday, I am watching a movie.',
      ],
      answer: 'Yesterday, I watched a movie.',
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showJapanese, setShowJapanese] = useState(true);

  const quiz = mockQuizzes[currentIndex];

  return (
    <div className='w-full py-10'>
      <motion.h2
        key='quizzes-title'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className='text-4xl font-semibold mb-8 text-center'
      >
        Quizzes
      </motion.h2>

      <div className='w-full max-w-3xl mx-auto flex flex-col gap-6'>
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className='w-full bg-neutral-700 p-6 rounded-xl text-center hover:bg-neutral-600 transition-colors'
        >
          <p className='text-xl font-semibold mb-4'>
            {showJapanese ? quiz.questionJP : quiz.questionEN}
          </p>

          <div className='flex flex-col gap-2'>
            {quiz.options.map((opt, i) => (
              <button
                key={i}
                className='bg-neutral-800 hover:bg-neutral-600 transition-colors rounded-md py-2 text-neutral-50 cursor-pointer'
              >
                {opt}
              </button>
            ))}
          </div>
        </motion.div>

        <div className='flex gap-4 justify-center'>
          <Button
            className='border border-neutral-900 w-48 bg-orange-600 text-neutral-50 hover:bg-neutral-600 hover:text-neutral-50'
            onClick={() =>
              setCurrentIndex((i) => (i === 0 ? mockQuizzes.length - 1 : i - 1))
            }
          >
            Previous
          </Button>
          <Button
            className='border border-neutral-900 w-48 bg-orange-600 text-neutral-50 hover:bg-neutral-600 hover:text-neutral-50'
            onClick={() => setCurrentIndex((i) => (i + 1) % mockQuizzes.length)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
