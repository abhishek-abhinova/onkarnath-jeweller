'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Logo from './Logo';
import { NAV, callLink, waLink } from '@/lib/constants';
import { PhoneIcon, WhatsAppIcon, MenuIcon, CloseIcon } from './icons';

const TopBar = () => (
  <div className="hidden border-b border-gold-500/10 bg-maroon-950 sm:block">
    <div className="container-x flex h-9 items-center justify-between text-[11px] text-gold-300/80">
      <p className="flex items-center gap-2">
        <span className="text-gold-400">✦</span> नरैनी रोड, अटारा जनपद बांदा — शुद्ध स्वर्ण एवं रजत
      </p>
      <p className="flex items-center gap-4">
        <a href={callLink()} className="transition hover:text-gold-200">सोम–शनि: सुबह 10 से रात 8 बजे तक</a>
      </p>
    </div>
  </div>
);

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50">
      <TopBar />
      <div
        className={`border-b transition-all duration-300 ${
          scrolled
            ? 'border-gold-500/15 bg-maroon-900/95 shadow-soft backdrop-blur'
            : 'border-gold-500/10 bg-maroon-900/85 backdrop-blur'
        }`}
      >
        <div className="container-x flex h-16 items-center justify-between gap-3 sm:h-18">
          <Logo light />

          <nav className="hidden items-center gap-1 lg:flex">
            {NAV.map((item) => {
              const active = pathname === item.href;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={`relative rounded-full px-4 py-2 text-[13px] font-medium transition ${
                    active
                      ? 'bg-white/10 text-gold-200'
                      : 'text-ivory-100/90 hover:bg-white/5 hover:text-gold-200'
                  }`}
                >
                  {item.label}
                  {active && <span className="absolute inset-x-4 -bottom-[9px] h-[2px] rounded bg-gold-400" />}
                </a>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={callLink()}
              className="hidden h-10 items-center gap-2 rounded-full border border-gold-500/40 px-4 text-[13px] font-semibold text-gold-100 transition hover:border-gold-400 hover:bg-gold-500/10 md:inline-flex"
              aria-label="Call now"
            >
              <PhoneIcon className="h-4 w-4" />
              <span className="hidden xl:inline">Call Now</span>
            </a>
            <a
              href={waLink('नमस्ते, मुझे आपके आभूषणों की जानकारी चाहिए।')}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-gold hidden h-10 px-4 md:inline-flex"
            >
              <WhatsAppIcon className="h-4 w-4" />
              WhatsApp
            </a>
            <a
              href={callLink()}
              className="grid h-10 w-10 place-items-center rounded-full border border-gold-500/40 text-gold-200 md:hidden"
              aria-label="Call"
            >
              <PhoneIcon className="h-4 w-4" />
            </a>
            <a
              href={waLink('नमस्ते, मुझे आपके आभूषणों की जानकारी चाहिए।')}
              target="_blank"
              rel="noopener noreferrer"
              className="grid h-10 w-10 place-items-center rounded-full bg-[#1fa855] text-white md:hidden"
              aria-label="WhatsApp"
            >
              <WhatsAppIcon className="h-4 w-4" />
            </a>
            <button
              onClick={() => setOpen(!open)}
              className="grid h-10 w-10 place-items-center rounded-full border border-gold-500/40 text-gold-200 lg:hidden"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
            >
              {open ? <CloseIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-40 transition lg:hidden ${open ? 'visible' : 'invisible'}`}
        aria-hidden={!open}
      >
        <div
          className={`absolute inset-0 bg-maroon-950/60 backdrop-blur-sm transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setOpen(false)}
        />
        <div
          className={`absolute right-0 top-0 h-full w-[82%] max-w-sm bg-maroon-950 shadow-2xl transition-transform duration-300 ${
            open ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b border-gold-500/15 px-5 py-4">
              <Logo light compact />
              <button
                onClick={() => setOpen(false)}
                className="grid h-9 w-9 place-items-center rounded-full text-gold-300 hover:bg-white/5"
                aria-label="Close"
              >
                <CloseIcon />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto px-3 py-4">
              {NAV.map((item, i) => {
                const active = pathname === item.href;
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    className={`flex items-center justify-between rounded-xl px-4 py-3.5 text-[15px] font-medium transition ${
                      active ? 'bg-gold-500/15 text-gold-200' : 'text-ivory-100 hover:bg-white/5'
                    }`}
                    style={{ animationDelay: `${i * 40}ms` }}
                  >
                    {item.label}
                    <span className={`h-1.5 w-1.5 rounded-full ${active ? 'bg-gold-400' : 'bg-gold-500/30'}`} />
                  </a>
                );
              })}
            </nav>
            <div className="grid grid-cols-2 gap-3 border-t border-gold-500/15 p-5">
              <a href={callLink()} className="btn btn-outline-dark !px-3">
                <PhoneIcon className="h-4 w-4" /> Call
              </a>
              <a
                href={waLink('नमस्ते, मुझे आपके आभूषणों की जानकारी चाहिए।')}
                target="_blank"
                rel="noopener noreferrer"
                className="btn !px-3 bg-[#1fa855] text-white hover:bg-[#189349]"
              >
                <WhatsAppIcon className="h-4 w-4" /> WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}