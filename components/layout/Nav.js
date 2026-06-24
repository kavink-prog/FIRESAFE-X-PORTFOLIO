import Image from "next/image";


import appleTouchIcon from "../../public/icons/apple-touch-icon.png";

export default function Nav() {
  return (
    <header className="nav">
      <div className="nav__inner">
        <a href="#top" className="nav__brand">
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
        <nav className="nav__links">
          <a href="#overview">Overview</a>
          <a href="#problem">Problem</a>
          <a href="#hardware">Hardware</a>
          <a href="#ai">AI</a>
          <a href="#workflow">How it works</a>
          <a href="#analytics">Global</a>
          <a href="#industries">Industries</a>
          <a href="#specs">Specs</a>
        </nav>
        <a href="#cta" className="nav__buy" data-book-demo>Book demo <span aria-hidden="true">›</span></a>
      </div>
    </header>
  );
}
