import Link from 'next/link';
import { Twitter, Github, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className='w-full border-t border-white/10 bg-neutral-900/50 mt-20'>
      <div className='max-w-7xl mx-auto px-6 py-12'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8 mb-8'>
          {/* Brand Column */}
          <div className='md:col-span-2'>
            <Link
              href='/'
              className='text-2xl font-bold tracking-tight text-white mb-4 block'
            >
              Yomu<span className='text-orange-500'>Fox</span>
            </Link>
            <p className='text-neutral-400 text-sm max-w-sm leading-relaxed'>
              Your AI-powered companion for mastering Japanese. Translate
              contextually, create flashcards instantly, and learn grammar
              naturally.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h4 className='font-semibold text-white mb-4'>Product</h4>
            <ul className='space-y-2 text-sm text-neutral-400'>
              <li>
                <Link
                  href='/translate'
                  className='hover:text-orange-500 transition-colors'
                >
                  Translate
                </Link>
              </li>
              <li>
                <Link
                  href='/flashcards'
                  className='hover:text-orange-500 transition-colors'
                >
                  Flashcards
                </Link>
              </li>
              <li>
                <Link
                  href='/quizzes'
                  className='hover:text-orange-500 transition-colors'
                >
                  Quizzes
                </Link>
              </li>
              <li>
                <Link
                  href='/grammar'
                  className='hover:text-orange-500 transition-colors'
                >
                  Grammar
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal / Socials */}
          <div>
            <h4 className='font-semibold text-white mb-4'>Connect</h4>
            <div className='flex gap-4 mb-4'>
              <a
                href='#'
                className='text-neutral-400 hover:text-white transition-colors'
              >
                <Twitter className='w-5 h-5' />
              </a>
              <a
                href='#'
                className='text-neutral-400 hover:text-white transition-colors'
              >
                <Github className='w-5 h-5' />
              </a>
              <a
                href='#'
                className='text-neutral-400 hover:text-white transition-colors'
              >
                <Linkedin className='w-5 h-5' />
              </a>
            </div>
            <ul className='space-y-2 text-sm text-neutral-400'>
              <li>
                <Link href='#' className='hover:text-white transition-colors'>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href='#' className='hover:text-white transition-colors'>
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className='border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4'>
          <p className='text-neutral-500 text-sm'>
            © {new Date().getFullYear()} YomuFox. All rights reserved.
          </p>
          <div className='flex items-center gap-2'>
            <span className='w-2 h-2 rounded-full bg-green-500 animate-pulse'></span>
            <span className='text-neutral-500 text-xs font-mono'>
              SYSTEM OPERATIONAL
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
