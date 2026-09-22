'use client';

import { useState } from 'react';
import { BUSINESS, callLink, waLink } from '@/lib/constants';
import { apiPost } from '@/lib/api';
import { PhoneIcon, WhatsAppIcon, MapPinIcon, CheckIcon } from './icons';

const STATUS = {
  idle: '',
  sending: 'Sending...',
  ok: 'Thank you! We will get back to you shortly.',
  error: 'Could not send. Please call or WhatsApp us instead.',
};

export default function ContactSection({ compact = false }) {
  const [form, setForm] = useState({ name: '', phone: '', message: '' });
  const [status, setStatus] = useState('idle');

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() && !form.phone.trim()) return;
    setStatus('sending');
    try {
      await apiPost('/api/contact', form);
      setForm({ name: '', phone: '', message: '' });
      setStatus('ok');
    } catch {
      setStatus('error');
    }
  };

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <section className="section-pad bg-ivory-100">
      <div className="container-x grid gap-10 lg:grid-cols-2 lg:items-start">
        {/* info */}
        <div>
          <span className="eyebrow"><span className="h-px w-6 bg-gold-500/60" />Contact</span>
          <h2 className="heading-hindi mt-3 text-3xl font-bold text-charcoal-900 sm:text-4xl">
            आइए, मिलकर करें शुरुआत
          </h2>
          <p className="mt-3 max-w-md text-[15px] leading-relaxed text-charcoal-500">
            आभूषण चयन के लिए दुकान पर पधारें, या फ़ोन / व्हाट्सऐप पर संपर्क करें — हम पूरी मदद करेंगे।
          </p>

          <div className="mt-7 space-y-4">
            <a
              href={BUSINESS.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="card group flex items-start gap-4 p-5 transition hover:shadow-soft"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gold-100 text-gold-700 transition group-hover:bg-gold-200">
                <MapPinIcon className="h-5 w-5" />
              </span>
              <div>
                <p className="font-hindi text-[15px] font-bold text-charcoal-900">{BUSINESS.name}</p>
                <p className="mt-1 text-sm leading-relaxed text-charcoal-500">
                  {BUSINESS.addressLines.map((l) => ` ${l}`).join('')}
                </p>
              </div>
            </a>
            <a href={callLink()} className="card group flex items-center gap-4 p-5 transition hover:shadow-soft">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gold-100 text-gold-700 transition group-hover:bg-gold-200">
                <PhoneIcon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-bold text-charcoal-900">{BUSINESS.phoneDisplay}</p>
                <p className="text-xs text-charcoal-500">सोम–शनि · सुबह 10 – रात 8 बजे</p>
              </div>
            </a>
          </div>

          <div className="mt-7 flex flex-wrap gap-3">
            <a href={callLink()} className="btn btn-dark">
              <PhoneIcon className="h-4 w-4" /> Call Now
            </a>
            <a href={waLink('नमस्ते, मुझे जानकारी चाहिए।')} target="_blank" rel="noopener noreferrer" className="btn bg-[#1fa855] text-white hover:bg-[#189349]">
              <WhatsAppIcon className="h-4 w-4" /> WhatsApp
            </a>
            <a href={BUSINESS.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
              <MapPinIcon className="h-4 w-4" /> Get Directions
            </a>
          </div>
        </div>

        {/* form */}
        {!compact && (
          <form onSubmit={submit} className="card p-6 sm:p-8">
            <h3 className="font-display text-2xl font-semibold text-charcoal-900">Quick Enquiry</h3>
            <p className="mt-1 text-sm text-charcoal-500">हम जल्द से जल्द संपर्क करेंगे।</p>
            <div className="mt-5 space-y-4">
              <div>
                <label className="label" htmlFor="c-name">Name</label>
                <input id="c-name" className="input" placeholder="Your name" value={form.name} onChange={set('name')} />
              </div>
              <div>
                <label className="label" htmlFor="c-phone">Phone</label>
                <input id="c-phone" className="input" inputMode="tel" placeholder="10-digit mobile number" value={form.phone} onChange={set('phone')} />
              </div>
              <div>
                <label className="label" htmlFor="c-msg">Message</label>
                <textarea id="c-msg" rows={3} className="input resize-none" placeholder="e.g. I want gold bangles for ~10g..." value={form.message} onChange={set('message')} />
              </div>
              <button type="submit" disabled={status === 'sending'} className="btn btn-gold w-full !py-3">
                Send Enquiry <CheckIcon className="h-4 w-4" />
              </button>
              {status === 'ok' && (
                <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">{STATUS.ok}</p>
              )}
              {status === 'error' && (
                <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">{STATUS.error}</p>
              )}
            </div>
          </form>
        )}
      </div>
    </section>
  );
}