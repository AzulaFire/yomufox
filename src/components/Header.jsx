'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Button } from './ui/button';
import { BookOpen, Pencil, ClipboardList, Book, Menu, X } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function Header() {
  const { lang, toggleLang } = useLanguage();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const modules = [
    {
      name: { en: 'Translate', ja: '翻訳' },
      icon: <Pencil className='w-6 h-6' />,
      href: '/translate',
    },
    {
      name: { en: 'Flashcards', ja: '単語カード' },
      icon: <ClipboardList className='w-6 h-6' />,
      href: '/flashcards',
    },
    {
      name: { en: 'Quizzes', ja: 'クイズ' },
      icon: <Book className='w-6 h-6' />,
      href: '/quizzes',
    },
    {
      name: { en: 'Grammar', ja: '文法ヘルパー' },
      icon: <BookOpen className='w-6 h-6' />,
      href: '/grammar',
    },
  ];

  return (
    <header className='w-full max-w-6xl flex justify-between items-center py-6 mb-12'>
      <Link href='/' passHref>
        <div className='flex items-center cursor-pointer pl-5'>
          <div>
            <Image src='/logo.png' alt='YomuFox Logo' width={68} height={68} />
          </div>
          <div className='text-3xl font-bold tracking-tight'>
            Yomu<span className='text-orange-600'>Fox</span>
          </div>
        </div>
      </Link>

      {/* Desktop Menu */}
      <div className='hidden md:flex items-center gap-4'>
        {modules.map((mod) => (
          <Link key={mod.href} href={mod.href}>
            <Button
              className={`border border-neutral-900 cursor-pointer ${
                pathname === mod.href
                  ? 'bg-orange-600 text-neutral-50'
                  : 'bg-neutral-700 text-neutral-50 hover:bg-neutral-600'
              }`}
            >
              <div className='flex items-center gap-2'>
                {mod.icon} {mod.name[lang]}
              </div>
            </Button>
          </Link>
        ))}

        <Button
          onClick={toggleLang}
          className='border border-neutral-900 bg-orange-600 text-neutral-50 hover:bg-neutral-600 hover:text-white cursor-pointer'
        >
          {lang === 'en' ? 'EN / JP' : '英語 / 日本語'}
        </Button>
      </div>

      {/* Mobile Menu Toggle */}
      <div className='md:hidden'>
        <Button onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? (
            <X className='w-6 h-6' />
          ) : (
            <Menu className='w-6 h-6' />
          )}
        </Button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className='absolute top-24 left-0 w-full bg-neutral-800 flex flex-col items-center py-4 gap-4 md:hidden'>
          {modules.map((mod) => (
            <Link key={mod.href} href={mod.href}>
              <Button
                className={`border border-neutral-900 w-48 ${
                  pathname === mod.href
                    ? 'bg-orange-600 text-neutral-50'
                    : 'bg-neutral-700 text-neutral-50 hover:bg-neutral-600'
                }`}
                onClick={() => setMobileOpen(false)}
              >
                <div className='flex items-center gap-2 justify-center'>
                  {mod.icon} {mod.name[lang]}
                </div>
              </Button>
            </Link>
          ))}
          <Button
            onClick={toggleLang}
            className='border border-neutral-900 w-48 bg-orange-600 text-neutral-50 hover:bg-neutral-600 hover:text-neutral-50'
          >
            {lang === 'en' ? 'EN / JP' : '英語 / 日本語'}
          </Button>
        </div>
      )}
    </header>
  );
}
