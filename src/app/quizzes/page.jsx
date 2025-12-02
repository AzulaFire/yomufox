'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function QuizzesPage() {
  const { t } = useLanguage();
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    // FIX: Function defined INSIDE useEffect to prevent reference errors
    const generateQuiz = async () => {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        // Fetch user's cards
        const { data: cards } = await supabase
          .from('cards')
          .select('*')
          .limit(20);

        if (cards && cards.length >= 4) {
          // Create 5 random questions
          const newQuiz = Array.from({ length: 5 }).map(() => {
            const correctCard = cards[Math.floor(Math.random() * cards.length)];
            const others = cards.filter((c) => c.id !== correctCard.id);

            // Shuffle others and take 3 wrong answers
            const wrong = others.sort(() => 0.5 - Math.random()).slice(0, 3);

            // Combine correct + wrong and shuffle options
            const options = [...wrong, correctCard].sort(
              () => 0.5 - Math.random()
            );

            return {
              question: `What is the meaning of "${correctCard.front}"?`,
              correct: correctCard.back,
              options: options.map((o) => o.back),
            };
          });
          setQuestions(newQuiz);
        }
      }
      setLoading(false);
    };

    generateQuiz();
  }, []);

  const handleAnswer = (answer) => {
    if (answer === questions[currentQ].correct) setScore(score + 1);

    if (currentQ + 1 < questions.length) {
      setCurrentQ(currentQ + 1);
    } else {
      setFinished(true);
    }
  };

  if (loading)
    return (
      <div className='flex justify-center h-[50vh] items-center'>
        <Loader2 className='animate-spin text-orange-500 w-8 h-8' />
      </div>
    );

  return (
    <div className='w-full py-12 max-w-2xl mx-auto'>
      {/* Animated Title Section */}
      {!finished && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='text-center mb-10'
        >
          <h2 className='text-4xl font-bold bg-linear-to-r from-white to-neutral-400 bg-clip-text text-transparent mb-4 pb-2 leading-tight'>
            {t.quizzesPage?.title || 'Daily Quiz'}
          </h2>
          <p className='text-neutral-400'>
            {t.quizzesPage?.desc ||
              'Test your knowledge against your personal deck.'}
          </p>
        </motion.div>
      )}

      {questions.length === 0 ? (
        <div className='text-center py-20 text-neutral-400 border border-dashed border-neutral-700 rounded-xl'>
          <p>Not enough cards to build a quiz yet.</p>
          <Button
            className='mt-6 bg-orange-600 hover:bg-orange-700 text-white'
            onClick={() => (window.location.href = '/translate')}
          >
            Create Study Set
          </Button>
        </div>
      ) : finished ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className='text-center py-20 bg-neutral-800 rounded-2xl border border-white/5'
        >
          <h2 className='text-4xl font-bold mb-4 text-white'>Quiz Complete!</h2>
          <p className='text-xl text-neutral-400 mb-8'>You scored</p>
          <div className='text-6xl font-bold text-orange-500 mb-8'>
            {score} / {questions.length}
          </div>
          <Button
            onClick={() => window.location.reload()}
            className='bg-white text-black hover:bg-neutral-200'
          >
            Try Again
          </Button>
        </motion.div>
      ) : (
        <>
          <div className='flex justify-between mb-8 text-neutral-400 text-sm font-medium'>
            <span>
              Question {currentQ + 1} of {questions.length}
            </span>
            <span>Score: {score}</span>
          </div>

          <motion.div
            key={currentQ}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className='bg-neutral-800 p-8 rounded-2xl border border-white/5 text-center shadow-lg'
          >
            <h3 className='text-3xl font-bold mb-10 text-white'>
              {questions[currentQ].question}
            </h3>
            <div className='grid gap-4'>
              {questions[currentQ].options.map((opt, i) => (
                <Button
                  key={i}
                  variant='outline'
                  className='w-full py-6 text-lg bg-transparent border-neutral-600 text-neutral-200 hover:bg-orange-600 hover:text-white hover:border-orange-600 transition-all whitespace-normal h-auto'
                  onClick={() => handleAnswer(opt)}
                >
                  {opt}
                </Button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
}
