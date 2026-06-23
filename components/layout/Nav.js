export default function Nav() {
  return (
    <header className="nav">
      <div className="nav__inner">
        <a href="#top" className="nav__brand">FireSafe<span>X</span></a>
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
