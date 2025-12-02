'use client';

import { useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function TranslatePage() {
  const [text, setText] = useState('');
  const [translation, setTranslation] = useState('');
  const [targetLang, setTargetLang] = useState('ja');
  const [politeness, setPoliteness] = useState('casual');
  const [loading, setLoading] = useState(false);

  const handleTranslate = async () => {
    if (!text) return;
    setLoading(true);
    setTranslation('');

    try {
      const response = await axios.post('http://127.0.0.1:8000/translate', {
        text,
        target_language: targetLang,
        politeness,
      });

      if (response.data.translation) {
        setTranslation(response.data.translation);
      } else if (response.data.error) {
        setTranslation(`Error: ${response.data.error}`);
      }
    } catch (err) {
      setTranslation(`Request failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='w-full py-10'>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className='text-4xl font-semibold mb-8 text-center'
      >
        Translate
      </motion.h2>

      <div className='w-full max-w-3xl mx-auto'>
        <textarea
          className='w-full p-4 rounded-lg bg-neutral-700 text-neutral-50 mb-4'
          rows={5}
          placeholder='Enter text to translate'
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <div className='flex gap-4 mb-4 w-full'>
          <select
            className='flex-1 p-2 rounded-lg bg-neutral-700 text-neutral-50'
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
          >
            <option value='ja'>Japanese</option>
            <option value='en'>English</option>
          </select>

          <select
            className='flex-1 p-2 rounded-lg bg-neutral-700 text-neutral-50'
            value={politeness}
            onChange={(e) => setPoliteness(e.target.value)}
          >
            <option value='casual'>Casual</option>
            <option value='polite'>Polite</option>
            <option value='business'>Business</option>
          </select>
        </div>

        <Button
          onClick={handleTranslate}
          disabled={loading}
          className='bg-orange-600 text-neutral-900 hover:bg-orange-600 mb-6 w-full'
        >
          {loading ? 'Translating...' : 'Translate'}
        </Button>

        {translation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className='w-full bg-neutral-700 p-4 rounded-lg'
          >
            <h2 className='font-semibold mb-2'>Translation:</h2>
            <p>{translation}</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
