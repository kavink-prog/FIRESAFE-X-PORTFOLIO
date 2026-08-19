'use client';

import Image from "next/image";
import { useEffect, useState } from "react";

import appleTouchIcon from "../../public/icons/apple-touch-icon.png";

const NAV_LINKS = [
  { href: '#product', label: 'Product' },
  { href: '#workflow', label: 'How it works' },
  { href: '#platform', label: 'Platform' },
  { href: '#industries', label: 'Industries' },
  { href: '#about', label: 'About' },
];

export default function Nav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setIsMenuOpen(false);
    };
    const closeOnDesktop = () => {
      if (window.innerWidth > 768) setIsMenuOpen(false);
    };

    window.addEventListener('keydown', closeOnEscape);
    window.addEventListener('resize', closeOnDesktop);

    return () => {
      window.removeEventListener('keydown', closeOnEscape);
      window.removeEventListener('resize', closeOnDesktop);
    };
  }, []);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className={`nav ${isMenuOpen ? 'nav--menu-open' : ''}`}>
      <div className="nav__inner">
        <a href="#top" className="nav__brand" onClick={closeMenu}>
          {/* Plain img tag — next/image is incompatible with output:'export'
              for small local icons. The file is served directly from /icons/. */}
          <Image
            src={appleTouchIcon}
            alt="FireSafeX"
            width={36}
            height={36}
            className="nav__logo"
            loading="eager"
          />
          <span className="nav__brand-text">FireSafe<span className="nav__brand-x">X</span></span>
        </a>
        <nav id="primary-navigation" className="nav__links" aria-label="Primary navigation">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} onClick={closeMenu}>{link.label}</a>
          ))}
        </nav>
        <button
          type="button"
          className="nav__menu-toggle"
          aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-controls="primary-navigation"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          <span></span>
          <span></span>
        </button>
        <a href="#cta" className="nav__buy" data-book-demo>Book demo <span aria-hidden="true">›</span></a>
      </div>
      <button
        type="button"
        className="nav__scrim"
        aria-label="Close navigation menu"
        tabIndex={isMenuOpen ? 0 : -1}
        onClick={closeMenu}
      />
    </header>
  );
}
