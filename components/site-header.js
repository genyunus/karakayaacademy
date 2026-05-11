"use client";

import { useState } from "react";

export default function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavigate = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="site-header">
      <a className="brand-mark" href="/" aria-label="Karakaya home">
        <span className="brand-mark__name">Karakaya</span>
        <span className="brand-mark__tag">Boxing + Functional Hybrid Training</span>
      </a>
      <button
        className="menu-toggle"
        type="button"
        aria-expanded={mobileMenuOpen}
        aria-controls="site-nav"
        onClick={() => setMobileMenuOpen((value) => !value)}
      >
        Menu
      </button>
      <nav
        className={`site-nav${mobileMenuOpen ? " is-open" : ""}`}
        id="site-nav"
        aria-label="Primary"
      >
        <a href="/about" onClick={handleNavigate}>
          About Us
        </a>
        <a href="/#booking" onClick={handleNavigate}>
          Book a Class
        </a>
        <a href="/#pricing" onClick={handleNavigate}>
          Pricing
        </a>
        <a href="/#faq" onClick={handleNavigate}>
          FAQ
        </a>
        <a href="/#contact" onClick={handleNavigate}>
          Contact
        </a>
      </nav>
    </header>
  );
}
