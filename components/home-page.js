"use client";

import { useEffect, useState } from "react";

import { classes, faqs, packages } from "../lib/site-data";

const initialInquiry = {
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  interest: "",
  messageBody: "",
};

const initialBooking = {
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  interest: "",
  messageBody: "",
  classSlug: classes[0]?.slug ?? "",
};

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(0);
  const [inquiryForm, setInquiryForm] = useState(initialInquiry);
  const [bookingForm, setBookingForm] = useState(initialBooking);
  const [inquiryState, setInquiryState] = useState({ type: "", message: "" });
  const [bookingState, setBookingState] = useState({ type: "", message: "" });
  const [checkoutState, setCheckoutState] = useState({ type: "", message: "" });
  const [submittingInquiry, setSubmittingInquiry] = useState(false);
  const [submittingBooking, setSubmittingBooking] = useState(false);
  const [startingCheckout, setStartingCheckout] = useState("");

  useEffect(() => {
    const targets = Array.from(document.querySelectorAll(".reveal"));

    if (!targets.length) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.14 }
    );

    targets.forEach((target) => observer.observe(target));

    return () => observer.disconnect();
  }, []);

  async function handleInquirySubmit(event) {
    event.preventDefault();
    setSubmittingInquiry(true);
    setInquiryState({ type: "", message: "" });

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inquiryForm),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Could not send inquiry.");
      }

      setInquiryState({
        type: result.mode === "demo" ? "info" : "success",
        message: result.message,
      });
      setInquiryForm(initialInquiry);
    } catch (error) {
      setInquiryState({ type: "error", message: error.message });
    } finally {
      setSubmittingInquiry(false);
    }
  }

  async function handleBookingSubmit(event) {
    event.preventDefault();
    setSubmittingBooking(true);
    setBookingState({ type: "", message: "" });

    try {
      const response = await fetch("/api/class-bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingForm),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Could not book class.");
      }

      setBookingState({
        type: result.mode === "demo" ? "info" : "success",
        message: result.message,
      });
      setBookingForm(initialBooking);
    } catch (error) {
      setBookingState({ type: "error", message: error.message });
    } finally {
      setSubmittingBooking(false);
    }
  }

  async function startCheckout(packageSlug) {
    setStartingCheckout(packageSlug);
    setCheckoutState({ type: "", message: "" });

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packageSlug }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Could not start checkout.");
      }

      if (result.checkoutUrl) {
        window.location.href = result.checkoutUrl;
        return;
      }
    } catch (error) {
      setCheckoutState({ type: "info", message: error.message });
    } finally {
      setStartingCheckout("");
    }
  }

  return (
    <div className="page-shell">
      <header className="site-header">
        <a className="brand-mark" href="#top" aria-label="Karakayaacademy home">
          <span className="brand-mark__name">Karakayaacademy</span>
          <span className="brand-mark__tag">Boxing x Functional Training</span>
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
          <a href="#info" onClick={() => setMobileMenuOpen(false)}>
            Info
          </a>
          <a href="#about" onClick={() => setMobileMenuOpen(false)}>
            About Us
          </a>
          <a href="#booking" onClick={() => setMobileMenuOpen(false)}>
            Book a Class
          </a>
          <a href="#membership" onClick={() => setMobileMenuOpen(false)}>
            Membership
          </a>
          <a href="#faq" onClick={() => setMobileMenuOpen(false)}>
            FAQ
          </a>
          <a href="#contact" onClick={() => setMobileMenuOpen(false)}>
            Contact
          </a>
        </nav>
      </header>

      <main id="top">
        <section className="intro-video" aria-label="Academy introduction">
          <video
            className="intro-video__media"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          >
            <source src="/assets/video/intro.MP4" type="video/mp4" />
          </video>
        </section>

        <section className="hero" aria-label="Hero">
          <div className="hero__backdrop"></div>
          <div className="hero__inner reveal is-visible">
            <div className="hero__copy">
              <p className="eyebrow">Precision. Presence. Performance.</p>
              <h1>Where elite boxing meets functional conditioning.</h1>
              <p className="hero__summary">
                Karakayaacademy is a disciplined training environment built for
                people who want more than a workout. We fuse technical boxing,
                athletic movement, and premium coaching into one purposeful
                system.
              </p>
              <div className="hero__actions">
                <a className="button button--solid" href="#booking">
                  Book a Class
                </a>
                <a className="button button--ghost" href="#contact">
                  Send Inquiry
                </a>
                <a className="button button--ghost" href="#membership">
                  View Packages
                </a>
              </div>
            </div>

            <div className="hero__rail">
              <article className="hero-note">
                <span>Boxing</span>
                <p>
                  Sharp technical rounds that teach timing, defense, rhythm, and
                  control.
                </p>
              </article>
              <article className="hero-note">
                <span>Functional Training</span>
                <p>
                  Strength, mobility, balance, and engine work designed to
                  improve how you move.
                </p>
              </article>
              <article className="hero-note">
                <span>Coaching</span>
                <p>
                  High-touch instruction with a luxury atmosphere and real
                  progression.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className="info-strip reveal" id="info">
          <article>
            <span>Format</span>
            <p>Private coaching, selective small groups, and academy-style progression.</p>
          </article>
          <article>
            <span>Training Lens</span>
            <p>Technique-first boxing blended with strength, movement, and recovery.</p>
          </article>
          <article>
            <span>Experience</span>
            <p>A clean, elevated environment built for focus, confidence, and consistency.</p>
          </article>
        </section>

        <section className="section section--split section--about reveal" id="about">
          <div className="section-heading">
            <p className="eyebrow">About Us</p>
            <h2>Built around the full spectrum of performance.</h2>
          </div>
          <div className="section-copy">
            <p>
              Karakayaacademy was designed for people who want structure,
              elegance, and results in the same room. The boxing side develops
              timing, confidence, and sharp mechanics. The functional side
              develops durability, control, and movement that carries into daily
              life.
            </p>
            <p>
              That balance is the product. We are not selling random intensity.
              We are building capable bodies and composed athletes through
              thoughtful coaching, premium standards, and a training rhythm that
              respects both performance and longevity.
            </p>
          </div>
          <figure className="photo-panel photo-panel--tall">
            <img
              src="/assets/images/IMG_6611.jpg"
              alt="Coach leading a functional mobility session overlooking the ocean."
            />
          </figure>
        </section>

        <section className="section section--editorial reveal" id="why">
          <div className="section-heading section-heading--wide">
            <p className="eyebrow">Why Karakayaacademy</p>
            <h2>Because serious training should feel intentional at every level.</h2>
          </div>
          <div className="editorial-grid">
            <article className="editorial-card">
              <h3>Technical before theatrical</h3>
              <p>
                Every session starts with sound mechanics so speed, power, and
                conditioning grow from quality instead of chaos.
              </p>
            </article>
            <article className="editorial-card">
              <h3>Athleticism with carryover</h3>
              <p>
                Functional blocks train rotation, posture, deceleration, core
                control, and resilience that support both boxing and real life.
              </p>
            </article>
            <article className="editorial-card">
              <h3>Premium environment, clear standards</h3>
              <p>
                The experience is calm, focused, and refined, which changes how
                people show up, train, and stay committed.
              </p>
            </article>
          </div>
        </section>

        <section className="manifesto reveal">
          <figure className="photo-banner">
            <img
              src="/assets/images/IMG_9395.JPG"
              alt="Close-up training moment during a boxing session."
            />
            <figcaption>
              <p className="eyebrow">Atmosphere</p>
              <h2>Training that feels cinematic because the work is real.</h2>
              <p>
                The close-up tension, the controlled pace, the attention to
                detail. This is the energy we want the academy to project.
              </p>
            </figcaption>
          </figure>
        </section>

        <section className="section section--difference reveal" id="difference">
          <div className="difference-copy">
            <div className="section-heading">
              <p className="eyebrow">What Differentiates Us</p>
              <h2>Coaching detail, not just class volume.</h2>
            </div>
            <div className="difference-points">
              <article>
                <span>01</span>
                <h3>Hands-on coaching</h3>
                <p>
                  You are seen, corrected, and progressed instead of being left
                  to survive a circuit.
                </p>
              </article>
              <article>
                <span>02</span>
                <h3>Boxing integrated with preparation</h3>
                <p>
                  Pad work, mobility, strength, and recovery are programmed to
                  support one another as a complete system.
                </p>
              </article>
              <article>
                <span>03</span>
                <h3>Identity beyond the gym floor</h3>
                <p>
                  The brand can expand into lifestyle, retreats, private
                  coaching, and elevated member experiences without changing its
                  core.
                </p>
              </article>
            </div>
          </div>
          <figure className="photo-panel photo-panel--wide">
            <img
              src="/assets/images/IMG_8816.JPG"
              alt="Coach observing an athlete while gloves are adjusted before training."
            />
          </figure>
        </section>

        <section className="section section--capabilities reveal" id="booking">
          <div className="section-heading section-heading--wide">
            <p className="eyebrow">Book a Class</p>
            <h2>Launch with simple booking now, then automate confirmations next.</h2>
          </div>
          <div className="capability-layout">
            <div className="capability-cards">
              {classes.map((classItem) => (
                <article className="capability-card" key={classItem.slug}>
                  <div>
                    <p className="eyebrow">{classItem.type}</p>
                    <h3>{classItem.name}</h3>
                  </div>
                  <p>{classItem.description}</p>
                  <ul className="meta-list">
                    <li>{classItem.duration}</li>
                    <li>{classItem.capacity}</li>
                    <li>{classItem.priceLabel}</li>
                  </ul>
                </article>
              ))}
            </div>
            <form className="contact-form capability-form" onSubmit={handleBookingSubmit}>
              <label>
                First name
                <input
                  type="text"
                  name="firstName"
                  value={bookingForm.firstName}
                  onChange={(event) =>
                    setBookingForm((current) => ({
                      ...current,
                      firstName: event.target.value,
                    }))
                  }
                  placeholder="First name"
                  autoComplete="given-name"
                  required
                />
              </label>
              <label>
                Last name
                <input
                  type="text"
                  name="lastName"
                  value={bookingForm.lastName}
                  onChange={(event) =>
                    setBookingForm((current) => ({
                      ...current,
                      lastName: event.target.value,
                    }))
                  }
                  placeholder="Last name"
                  autoComplete="family-name"
                  required
                />
              </label>
              <label>
                Email address
                <input
                  type="email"
                  name="email"
                  value={bookingForm.email}
                  onChange={(event) =>
                    setBookingForm((current) => ({ ...current, email: event.target.value }))
                  }
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />
              </label>
              <label>
                Phone number
                <input
                  type="tel"
                  name="phoneNumber"
                  value={bookingForm.phoneNumber}
                  onChange={(event) =>
                    setBookingForm((current) => ({
                      ...current,
                      phoneNumber: event.target.value,
                    }))
                  }
                  placeholder="Phone number"
                  autoComplete="tel"
                  required
                />
              </label>
              <label>
                Select class
                <select
                  name="classSlug"
                  value={bookingForm.classSlug}
                  onChange={(event) =>
                    setBookingForm((current) => ({
                      ...current,
                      classSlug: event.target.value,
                    }))
                  }
                >
                  {classes.map((classItem) => (
                    <option value={classItem.slug} key={classItem.slug}>
                      {classItem.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Interest
                <input
                  type="text"
                  name="interest"
                  value={bookingForm.interest}
                  onChange={(event) =>
                    setBookingForm((current) => ({
                      ...current,
                      interest: event.target.value,
                    }))
                  }
                  placeholder="What are you interested in?"
                  required
                />
              </label>
              <label>
                Message body
                <textarea
                  name="messageBody"
                  rows="4"
                  value={bookingForm.messageBody}
                  onChange={(event) =>
                    setBookingForm((current) => ({
                      ...current,
                      messageBody: event.target.value,
                    }))
                  }
                  placeholder="Tell us about your goals and preferred schedule."
                  required
                ></textarea>
              </label>
              <button className="button button--solid" type="submit" disabled={submittingBooking}>
                {submittingBooking ? "Submitting..." : "Request Booking"}
              </button>
              {bookingState.message ? (
                <p className={`form-feedback form-feedback--${bookingState.type || "info"}`}>
                  {bookingState.message}
                </p>
              ) : null}
            </form>
          </div>
        </section>

        <section className="section section--capabilities reveal" id="membership">
          <div className="section-heading section-heading--wide">
            <p className="eyebrow">Membership & Packages</p>
            <h2>Sell intro offers first, then memberships once demand is consistent.</h2>
          </div>
          <div className="package-grid">
            {packages.map((item) => (
              <article className="package-card" key={item.slug}>
                <p className="eyebrow">{item.badge}</p>
                <h3>{item.name}</h3>
                <p className="package-price">{item.priceLabel}</p>
                <p>{item.description}</p>
                <ul className="meta-list">
                  {item.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
                <button
                  className="button button--solid"
                  type="button"
                  onClick={() => startCheckout(item.slug)}
                  disabled={startingCheckout === item.slug}
                >
                  {startingCheckout === item.slug ? "Starting..." : "Buy Package"}
                </button>
              </article>
            ))}
          </div>
          {checkoutState.message ? (
            <p className={`form-feedback form-feedback--${checkoutState.type || "info"}`}>
              {checkoutState.message}
            </p>
          ) : null}
        </section>

        <section className="faq-section reveal" id="faq">
          <div className="section-heading section-heading--wide">
            <p className="eyebrow">FAQ</p>
            <h2>Questions people ask before they commit.</h2>
          </div>
          <div className="faq-list">
            {faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;

              return (
                <article className={`faq-item${isOpen ? " is-open" : ""}`} key={faq.question}>
                  <button
                    className="faq-question"
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenFaqIndex(isOpen ? -1 : index)}
                  >
                    {faq.question}
                  </button>
                  <div className="faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="contact-section reveal" id="contact">
          <div className="section-heading">
            <p className="eyebrow">Contact</p>
            <h2>Start the conversation with the academy.</h2>
          </div>
          <div className="contact-layout">
            <div className="contact-copy">
              <p>
                This version is already positioned more like a premium product
                than a generic fitness page. The next refinement should be your
                real location, founder story, pricing structure, and booking
                flow.
              </p>
              <ul className="contact-details">
                <li>Email: hello@karakayaacademy.com</li>
                <li>Phone: +1 (000) 000-0000</li>
                <li>Location: Studio details to be added</li>
              </ul>
            </div>
            <form className="contact-form" onSubmit={handleInquirySubmit}>
              <label>
                First name
                <input
                  type="text"
                  name="firstName"
                  value={inquiryForm.firstName}
                  onChange={(event) =>
                    setInquiryForm((current) => ({
                      ...current,
                      firstName: event.target.value,
                    }))
                  }
                  placeholder="First name"
                  autoComplete="given-name"
                  required
                />
              </label>
              <label>
                Last name
                <input
                  type="text"
                  name="lastName"
                  value={inquiryForm.lastName}
                  onChange={(event) =>
                    setInquiryForm((current) => ({
                      ...current,
                      lastName: event.target.value,
                    }))
                  }
                  placeholder="Last name"
                  autoComplete="family-name"
                  required
                />
              </label>
              <label>
                Email address
                <input
                  type="email"
                  name="email"
                  value={inquiryForm.email}
                  onChange={(event) =>
                    setInquiryForm((current) => ({ ...current, email: event.target.value }))
                  }
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />
              </label>
              <label>
                Phone number
                <input
                  type="tel"
                  name="phoneNumber"
                  value={inquiryForm.phoneNumber}
                  onChange={(event) =>
                    setInquiryForm((current) => ({
                      ...current,
                      phoneNumber: event.target.value,
                    }))
                  }
                  placeholder="Phone number"
                  autoComplete="tel"
                  required
                />
              </label>
              <label>
                Interest
                <input
                  type="text"
                  name="interest"
                  value={inquiryForm.interest}
                  onChange={(event) =>
                    setInquiryForm((current) => ({ ...current, interest: event.target.value }))
                  }
                  placeholder="Private coaching, membership, consultation..."
                  required
                />
              </label>
              <label>
                Message body
                <textarea
                  name="messageBody"
                  rows="5"
                  value={inquiryForm.messageBody}
                  onChange={(event) =>
                    setInquiryForm((current) => ({
                      ...current,
                      messageBody: event.target.value,
                    }))
                  }
                  placeholder="Tell us what kind of training experience you're looking for."
                  required
                ></textarea>
              </label>
              <button className="button button--solid" type="submit" disabled={submittingInquiry}>
                {submittingInquiry ? "Submitting..." : "Send Inquiry"}
              </button>
              {inquiryState.message ? (
                <p className={`form-feedback form-feedback--${inquiryState.type || "info"}`}>
                  {inquiryState.message}
                </p>
              ) : null}
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}
