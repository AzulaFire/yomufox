'use client';

import { motion } from 'framer-motion';
import { Check, X, Zap, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';

export default function PricingPage() {
  const { t } = useLanguage();

  const features = [
    { key: 'generations', free: '5 / day', pro: 'Unlimited' },
    { key: 'flashcards', free: true, pro: true },
    { key: 'grammar', free: true, pro: true },
    { key: 'quizzes', free: false, pro: true },
    { key: 'srs', free: false, pro: true }, // Spaced Repetition
    { key: 'audio', free: false, pro: 'Coming Soon' }, // TTS
    { key: 'context', free: false, pro: 'Coming Soon' }, // Roleplay
  ];

  return (
    <div className='w-full py-20 px-4 max-w-6xl mx-auto'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className='text-center mb-16'
      >
        <h1 className='text-5xl font-bold bg-linear-to-r from-white to-neutral-400 bg-clip-text text-transparent mb-6 pb-2 leading-tight'>
          {t.pricingPage?.title || 'Simple, Transparent Pricing'}
        </h1>
        <p className='text-xl text-neutral-400 max-w-2xl mx-auto'>
          {t.pricingPage?.desc ||
            'Start for free, upgrade to master Japanese faster with AI-powered tools.'}
        </p>
      </motion.div>

      <div className='grid md:grid-cols-2 gap-8 max-w-4xl mx-auto'>
        {/* Free Plan */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className='bg-neutral-900 border border-white/10 rounded-3xl p-8 flex flex-col relative overflow-hidden'
        >
          <div className='mb-8'>
            <h3 className='text-xl font-semibold text-neutral-300 mb-2'>
              {t.pricingPage?.freeTitle || 'Free'}
            </h3>
            <div className='flex items-baseline gap-1'>
              <span className='text-4xl font-bold text-white'>$0</span>
              <span className='text-neutral-500'>/mo</span>
            </div>
            <p className='text-neutral-400 mt-4 text-sm'>
              {t.pricingPage?.freeDesc ||
                'Perfect for casual learners exploring the language.'}
            </p>
          </div>

          <ul className='space-y-4 mb-8 flex-1'>
            {features.map((feat, i) => (
              <li
                key={i}
                className='flex items-center gap-3 text-sm text-neutral-300'
              >
                {feat.free ? (
                  <Check className='w-5 h-5 text-green-500 shrink-0' />
                ) : (
                  <X className='w-5 h-5 text-neutral-700 shrink-0' />
                )}
                <span className={!feat.free ? 'text-neutral-600' : ''}>
                  {t.pricingPage?.features?.[feat.key] || feat.key}
                  {typeof feat.free === 'string' && (
                    <span className='text-neutral-500 ml-1'>({feat.free})</span>
                  )}
                </span>
              </li>
            ))}
          </ul>

          <Button
            variant='outline'
            className='w-full py-6 border-neutral-700 bg-transparent text-neutral-300 hover:bg-neutral-800 hover:text-white'
          >
            {t.pricingPage?.currentPlan || 'Current Plan'}
          </Button>
        </motion.div>

        {/* Pro Plan */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className='bg-neutral-900 border-2 border-orange-500/50 rounded-3xl p-8 flex flex-col relative overflow-hidden shadow-2xl shadow-orange-900/20'
        >
          <div className='absolute top-0 right-0 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl'>
            POPULAR
          </div>

          <div className='mb-8'>
            <h3 className='text-xl font-semibold text-orange-500 mb-2 flex items-center gap-2'>
              {t.pricingPage?.proTitle || 'Pro'}{' '}
              <Zap className='w-4 h-4 fill-current' />
            </h3>
            <div className='flex items-baseline gap-1'>
              <span className='text-4xl font-bold text-white'>$9</span>
              <span className='text-neutral-500'>/mo</span>
            </div>
            <p className='text-neutral-400 mt-4 text-sm'>
              {t.pricingPage?.proDesc ||
                'Serious tools for serious learners. Unlimited access.'}
            </p>
          </div>

          <ul className='space-y-4 mb-8 flex-1'>
            {features.map((feat, i) => (
              <li
                key={i}
                className='flex items-center gap-3 text-sm text-white'
              >
                <Check className='w-5 h-5 text-orange-500 shrink-0' />
                <span>
                  {t.pricingPage?.features?.[feat.key] || feat.key}
                  {typeof feat.pro === 'string' && (
                    <span className='text-orange-400/80 ml-2 text-xs border border-orange-500/30 px-1.5 py-0.5 rounded-full'>
                      {feat.pro}
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ul>

          <Button className='w-full py-6 bg-orange-600 hover:bg-orange-700 text-white shadow-lg shadow-orange-500/20'>
            {t.pricingPage?.upgradeBtn || 'Upgrade to Pro'}
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
