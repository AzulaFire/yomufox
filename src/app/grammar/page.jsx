'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { Loader2, BookOpen } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function GrammarPage() {
  const { t } = useLanguage();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGrammar = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('decks')
          .select('*')
          .not('grammar_text', 'is', null)
          .order('created_at', { ascending: false });
        setLessons(data || []);
      }
      setLoading(false);
    };
    fetchGrammar();
  }, []);

  if (loading)
    return (
      <div className='flex justify-center py-20'>
        <Loader2 className='animate-spin text-orange-500 w-8 h-8' />
      </div>
    );

  return (
    <div className='w-full py-12 max-w-4xl mx-auto'>
      {/* Animated Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className='text-center mb-12'
      >
        <h2 className='text-4xl font-bold bg-linear-to-r from-white to-neutral-400 bg-clip-text text-transparent mb-4 pb-2 leading-tight'>
          Grammar Library
        </h2>
        <p className='text-neutral-400'>
          AI-generated explanations from your previous study sessions.
        </p>
      </motion.div>

      <div className='grid gap-6'>
        {lessons.length === 0 ? (
          <div className='text-center text-neutral-400 py-10 border border-dashed border-neutral-700 rounded-xl'>
            <p>No grammar lessons yet.</p>
            <p className='text-sm mt-2'>
              Translate a sentence to automatically generate one!
            </p>
          </div>
        ) : (
          lessons.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className='bg-neutral-800 border border-white/10 p-6 rounded-xl hover:border-orange-500/30 transition-colors'
            >
              <div className='flex items-center gap-2 mb-4 text-orange-500'>
                <BookOpen className='w-5 h-5' />
                <h3 className='font-semibold text-lg'>
                  &quot;{item.source_text}&quot;
                </h3>
              </div>
              <div className='bg-neutral-900/50 p-5 rounded-lg text-neutral-300 leading-relaxed text-lg'>
                {item.grammar_text}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
