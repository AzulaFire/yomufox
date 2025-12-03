'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Loader2, BookOpen, ArrowLeft } from 'lucide-react';
// プレビュー環境での解決のために相対パスに変更
import { supabase } from '../../lib/supabase';
import { useLanguage } from '../../context/LanguageContext';
import { Button } from '../../components/ui/button';

function GrammarContent() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const deckId = searchParams.get('deckId');

  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewTitle, setViewTitle] = useState('Grammar Library');

  useEffect(() => {
    const fetchGrammar = async () => {
      setLoading(true);
      let query = supabase
        .from('decks')
        .select('*')
        .not('grammar_text', 'is', null);

      if (deckId) {
        // 1. Specific Deck Mode (Public or Private)
        query = query.eq('id', deckId);
        // We'll update the title after we get the data
      } else {
        // 2. User History Mode (Logged in only)
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          query = query.eq('user_id', user.id);
        } else {
          // No user, no deckId -> nothing to show
          setLoading(false);
          return;
        }
      }

      const { data } = await query.order('created_at', { ascending: false });

      if (data) {
        setLessons(data);
        if (deckId && data.length > 0) {
          setViewTitle(data[0].title || 'Grammar Lesson');
        }
      }
      setLoading(false);
    };

    fetchGrammar();
  }, [deckId]);

  if (loading)
    return (
      <div className='flex justify-center h-[50vh] items-center'>
        <Loader2 className='animate-spin text-orange-500 w-8 h-8' />
      </div>
    );

  return (
    <div className='w-full py-12 max-w-4xl mx-auto'>
      {/* Navigation Back Button (only if viewing specific deck) */}
      {deckId && (
        <div className='mb-6'>
          <Button
            variant='ghost'
            className='text-neutral-400 hover:text-white pl-0'
            onClick={() => window.history.back()}
          >
            <ArrowLeft className='w-4 h-4 mr-2' /> Back
          </Button>
        </div>
      )}

      {/* Animated Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className='text-center mb-12'
      >
        <h2 className='text-4xl font-bold bg-linear-to-r from-white to-neutral-400 bg-clip-text text-transparent mb-4 pb-2 leading-tight'>
          {viewTitle}
        </h2>
        <p className='text-neutral-400'>
          {deckId
            ? 'Grammar explanation for this specific lesson.'
            : 'AI-generated explanations from your previous study sessions.'}
        </p>
      </motion.div>

      <div className='grid gap-6'>
        {lessons.length === 0 ? (
          <div className='text-center text-neutral-400 py-10 border border-dashed border-neutral-700 rounded-xl'>
            <p>No grammar lessons found.</p>
            {!deckId && (
              <p className='text-sm mt-2'>
                Translate a sentence to automatically generate one!
              </p>
            )}
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
              <div className='bg-neutral-900/50 p-5 rounded-lg text-neutral-300 leading-relaxed text-lg whitespace-pre-wrap'>
                {item.grammar_text}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

export default function GrammarPage() {
  return (
    <Suspense
      fallback={
        <div className='flex justify-center h-[50vh] items-center'>
          <Loader2 className='animate-spin text-orange-500 w-8 h-8' />
        </div>
      }
    >
      <GrammarContent />
    </Suspense>
  );
}
