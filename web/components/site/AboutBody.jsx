'use client';

import { useEffect, useState } from 'react';
import { apiGet } from '@/lib/api';

const DEFAULT_ABOUT =
  'ओंकार नाथ अग्रवाल सर्राफ is a trusted gold and silver sarraf based at Naraini Road, Atarra, District Banda, Uttar Pradesh. With years of honest dealing in pure gold and silver jewellery, we serve families across Atarra, Banda and nearby towns.';

export default function AboutBody() {
  const [about, setAbout] = useState(DEFAULT_ABOUT);
  const [name, setName] = useState('ओंकार नाथ अग्रवाल सर्राफ');

  useEffect(() => {
    apiGet('/api/settings')
      .then((res) => {
        const s = res.settings || {};
        if (s.about) setAbout(s.about);
        if (s.businessName) setName(s.businessName);
      })
      .catch(() => {});
  }, []);

  return (
    <article className="max-w-3xl space-y-5">
      <p className="font-hindi text-lg leading-relaxed text-charcoal-700 sm:text-xl">
        {name}
      </p>
      <p className="text-[15px] leading-relaxed text-charcoal-600 sm:text-base">{about}</p>
    </article>
  );
}