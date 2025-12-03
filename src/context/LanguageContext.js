'use client';
import { createContext, useContext, useState } from 'react';
import en from '@/locales/en.json'; // Make sure these exist!
import ja from '@/locales/ja.json';

// Simple dictionary extension for the menu items since they might not be in the JSON files yet
const translations = {
  en: {
    ...en,
    modules: {
      translate: 'Translate',
      flashcards: 'Flashcards',
      quizzes: 'Quizzes',
      grammar: 'Grammar',
      library: 'Library',
    },
  },
  ja: {
    ...ja,
    modules: {
      translate: '翻訳',
      flashcards: '単語カード',
      quizzes: 'クイズ',
      grammar: '文法',
      library: '図書館',
    },
  },
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState('en');

  const toggleLang = () => setLang((prev) => (prev === 'en' ? 'ja' : 'en'));

  return (
    <LanguageContext.Provider
      value={{ lang, toggleLang, t: translations[lang] }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
