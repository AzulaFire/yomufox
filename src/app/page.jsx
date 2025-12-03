'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { BookOpen, Pencil, ClipboardList, Book } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

const translations = {
  en: {
    learnTitle: 'Learn Japanese with AI-Powered Tools',
    learnDesc: 'Translate, study, and quiz yourself — all in one dashboard.',
    startLearning: 'Start Learning',
    modules: {
      translate: 'Translate',
      translateDesc: 'English ↔ Japanese with AI rewriting.',
      flashcards: 'Flashcards',
      flashcardsDesc:
        'Study vocabulary, Kanji, and example sentences efficiently.',
      quizzes: 'Quizzes',
      quizzesDesc: 'Test your Kanji recognition, grammar, and vocabulary.',
      grammar: 'Grammar Helper',
      grammarDesc: 'Sentence structure, particles, and verb forms easily.',
    },
  },
  ja: {
    learnTitle: 'AIで英語を学ぼう',
    learnDesc: '翻訳、学習、クイズを一つのダッシュボードで。',
    startLearning: '学習を始める',
    modules: {
      translate: '翻訳',
      translateDesc: '日本語 ↔ 英語（AIによる文章改善付き）',
      flashcards: '単語カード',
      flashcardsDesc: '単語、漢字、例文を効率的に学習できます。',
      quizzes: 'クイズ',
      quizzesDesc: '漢字認識、文法、語彙をテストできます。',
      grammar: '文法ヘルパー',
      grammarDesc: '文の構造、助詞、動詞の形を簡単に理解できます。',
    },
  },
};

export default function Home() {
  const { lang } = useLanguage();
  const t = translations[lang];

  return (
    <main className='min-h-screen flex flex-col items-center'>
      {/* Hero */}
      <section className='text-center mb-20 max-w-4xl'>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className='text-5xl font-semibold my-4'
        >
          {t.learnTitle}
        </motion.h2>
        <p className='text-lg text-neutral-300 mb-8'>{t.learnDesc}</p>
        <Link href='/library'>
          <Button
            size='lg'
            className='text-lg px-8 py-4 flex items-center gap-2 hover:bg-orange-500 cursor-pointer'
          >
            <BookOpen className='w-5 h-5' /> {t.startLearning}
          </Button>
        </Link>
      </section>

      {/* Modules */}
      <section className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl w-full mb-24'>
        {Object.entries(t.modules).map(([key, value]) => {
          const icons = {
            translate: Pencil,
            flashcards: ClipboardList,
            quizzes: Book,
            grammar: BookOpen,
          };
          const Icon = icons[key];
          if (!Icon) return null;
          return (
            <Link key={key} href={`/${key}`}>
              <motion.div className='bg-neutral-700 rounded-xl p-6 flex flex-col items-center hover:bg-orange-500 transition-colors cursor-pointer'>
                <Icon className='w-8 h-8 mb-4' />
                <h3 className='text-xl font-semibold mb-2'>{value}</h3>
              </motion.div>
            </Link>
          );
        })}
      </section>
    </main>
  );
}
