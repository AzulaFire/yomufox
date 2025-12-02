'use client';

import { useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/context/LanguageContext';

export default function TranslatePage() {
  const { t } = useLanguage();
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!text) return;
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setError('Please login to generate study sets.');
        setLoading(false);
        return;
      }

      // FIX: URL is now a correct string
      const response = await axios.post(
        '[http://127.0.0.1:8000/generate_study_set](http://127.0.0.1:8000/generate_study_set)',
        {
          sentence: text,
          user_id: user.id,
        }
      );

      if (response.data.success) {
        setResult(response.data.data);
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.detail ||
          err.message ||
          'An unexpected error occurred.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='w-full py-12 max-w-4xl mx-auto'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className='text-center mb-10'
      >
        <h2 className='text-4xl font-bold bg-linear-to-r from-white to-neutral-400 bg-clip-text text-transparent mb-4 pb-2 leading-tight'>
          {t.translatePage?.title || 'AI Language Studio'}
        </h2>
        <p className='text-neutral-400'>
          {t.translatePage?.desc ||
            'Enter a sentence to generate a full study set: Translation, Grammar, and Flashcards.'}
        </p>
      </motion.div>

      <div className='relative bg-neutral-800/50 rounded-2xl p-2 ring-1 ring-white/10 focus-within:ring-orange-500/50 transition-all'>
        <textarea
          className='w-full bg-transparent p-6 text-lg text-white placeholder-neutral-500 resize-none outline-none min-h-[150px]'
          placeholder={
            t.translatePage?.placeholder ||
            'E.g. I want to buy a train ticket to Kyoto.'
          }
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className='flex justify-between items-center px-4 pb-4'>
          <span className='text-xs text-neutral-500'>{text.length} chars</span>
          <Button
            onClick={handleGenerate}
            disabled={loading || !text}
            className='bg-orange-600 hover:bg-orange-700 text-white rounded-full px-6'
          >
            {loading ? (
              <Loader2 className='animate-spin w-4 h-4 mr-2' />
            ) : (
              <Sparkles className='w-4 h-4 mr-2' />
            )}
            {loading
              ? t.translatePage?.loading || 'Creating Lesson...'
              : t.translatePage?.button || 'Generate'}
          </Button>
        </div>
      </div>

      {error && (
        <div className='mt-4 p-4 bg-red-900/20 border border-red-500/30 text-red-400 rounded-lg text-sm'>
          {error}
        </div>
      )}

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className='mt-12 grid gap-6'
          >
            <div className='bg-neutral-900 border border-white/10 rounded-xl p-6'>
              <h3 className='text-sm font-medium text-orange-500 uppercase tracking-wider mb-2'>
                Translation
              </h3>
              <p className='text-2xl font-medium text-white'>
                {result.translation}
              </p>
            </div>

            <div className='bg-neutral-900 border border-white/10 rounded-xl p-6'>
              <h3 className='text-sm font-medium text-blue-500 uppercase tracking-wider mb-2'>
                Grammar Breakdown
              </h3>
              <p className='text-neutral-300 leading-relaxed'>
                {result.grammar_explanation}
              </p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {result.flashcards.map((card, i) => (
                <div
                  key={i}
                  className='bg-neutral-800/50 p-4 rounded-lg border border-white/5 flex flex-col justify-between'
                >
                  <div>
                    <p className='text-lg font-bold text-white mb-1'>
                      {card.front}
                    </p>
                    <p className='text-xs text-neutral-500 mb-2'>
                      {card.reading}
                    </p>
                  </div>
                  <p className='text-sm text-neutral-300 border-t border-white/5 pt-2 mt-2'>
                    {card.back}
                  </p>
                </div>
              ))}
            </div>

            <div className='flex justify-center mt-8'>
              <Button
                variant='outline'
                className='gap-2'
                onClick={() => (window.location.href = '/flashcards')}
              >
                Go to Flashcards <ArrowRight className='w-4 h-4' />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
