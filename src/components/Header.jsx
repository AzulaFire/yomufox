'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Button } from './ui/button';
import {
  BookOpen,
  Pencil,
  ClipboardList,
  Book,
  Menu,
  X,
  LogIn,
  LogOut,
  User,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/lib/supabase';

export default function Header() {
  const { lang, toggleLang, t } = useLanguage();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check active session
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };
    checkUser();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // const handleLogin = async () => {
  //   await supabase.auth.signInWithOAuth({ provider: 'google' });
  // };

  // For simple email testing without setting up Google Cloud Console
  const handleLogin = async () => {
    // This will send a magic link to your email
    await supabase.auth.signInWithOtp({ email: 'your-email@example.com' });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const modules = [
    {
      name: t.modules.translate,
      icon: <Pencil className='w-5 h-5' />,
      href: '/translate',
    },
    {
      name: t.modules.flashcards,
      icon: <ClipboardList className='w-5 h-5' />,
      href: '/flashcards',
    },
    {
      name: t.modules.quizzes,
      icon: <Book className='w-5 h-5' />,
      href: '/quizzes',
    },
    {
      name: t.modules.grammar,
      icon: <BookOpen className='w-5 h-5' />,
      href: '/grammar',
    },
  ];

  return (
    <header className='sticky top-0 z-50 w-full border-b border-white/10 bg-neutral-900/80 backdrop-blur-md'>
      <div className='max-w-7xl mx-auto flex justify-between items-center px-6 py-4'>
        {/* Logo */}
        <Link href='/' passHref className='flex items-center gap-3 group'>
          <div className='relative w-10 h-10 transition-transform group-hover:scale-110'>
            <Image
              src='/logo.png'
              alt='YomuFox Logo'
              fill
              className='object-contain'
            />
          </div>
          <span className='text-2xl font-bold tracking-tight text-white'>
            Yomu<span className='text-orange-500'>Fox</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className='hidden md:flex items-center gap-2'>
          {modules.map((mod) => (
            <Link key={mod.href} href={mod.href}>
              <Button
                variant='ghost'
                className={`text-sm font-medium transition-all ${
                  pathname === mod.href
                    ? 'bg-orange-500/10 text-orange-500'
                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {mod.icon}
                <span className='ml-2'>{mod.name}</span>
              </Button>
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className='hidden md:flex items-center gap-3'>
          <Button
            onClick={toggleLang}
            variant='outline'
            className='border-neutral-700 bg-transparent text-neutral-300 hover:bg-neutral-800 hover:text-white'
          >
            {lang === 'en' ? '🇺🇸 EN' : '🇯🇵 JP'}
          </Button>

          {user ? (
            <div className='flex items-center gap-3 pl-3 border-l border-neutral-700'>
              {/* FIX: Removed 'flex' from base classes to avoid conflict with 'hidden' */}
              <div className='hidden lg:flex flex-col text-right'>
                <span className='text-xs text-neutral-400'>Pro Plan</span>
                <span className='text-sm font-medium text-white truncate max-w-[100px]'>
                  {user.email.split('@')[0]}
                </span>
              </div>
              <Button
                onClick={handleLogout}
                size='icon'
                variant='ghost'
                className='text-neutral-400 hover:text-red-400'
              >
                <LogOut className='w-5 h-5' />
              </Button>
            </div>
          ) : (
            <Button
              onClick={handleLogin}
              className='bg-orange-600 hover:bg-orange-700 text-white shadow-lg shadow-orange-900/20'
            >
              <LogIn className='w-4 h-4 mr-2' /> Login
            </Button>
          )}
        </div>

        {/* Mobile Toggle */}
        <div className='md:hidden'>
          <Button variant='ghost' onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className='md:hidden absolute top-full left-0 w-full bg-neutral-900 border-b border-neutral-800 p-4 flex flex-col gap-2 shadow-2xl'>
          {modules.map((mod) => (
            <Link
              key={mod.href}
              href={mod.href}
              onClick={() => setMobileOpen(false)}
            >
              <div className='flex items-center gap-3 p-3 rounded-lg text-neutral-300 hover:bg-neutral-800 hover:text-white'>
                {mod.icon} {mod.name}
              </div>
            </Link>
          ))}
          <div className='h-px bg-neutral-800 my-2' />
          <Button
            onClick={toggleLang}
            variant='ghost'
            className='justify-start w-full'
          >
            {lang === 'en' ? 'Switch to Japanese' : '英語に切り替え'}
          </Button>
          {user ? (
            <Button
              onClick={handleLogout}
              variant='ghost'
              className='justify-start w-full text-red-400'
            >
              Logout
            </Button>
          ) : (
            <Button onClick={handleLogin} className='w-full bg-orange-600'>
              Login
            </Button>
          )}
        </div>
      )}
    </header>
  );
}
