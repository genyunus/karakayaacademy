"use client";

import { useEffect, useRef, useState } from "react";

import SiteHeader from "./site-header";
import { classes, faqs, packages } from "../lib/site-data";

const initialInquiry = {
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  interest: "",
  messageBody: "",
  consent: false,
};

const initialBooking = {
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  interest: "",
  messageBody: "",
  classSlug: classes[0]?.slug ?? "",
  consent: false,
};

export default function HomePage() {
  const introVideoRef = useRef(null);
  const [openFaqIndex, setOpenFaqIndex] = useState(-1);
  const [inquiryForm, setInquiryForm] = useState(initialInquiry);
  const [bookingForm, setBookingForm] = useState(initialBooking);
  const [inquiryState, setInquiryState] = useState({ type: "", message: "" });
  const [bookingState, setBookingState] = useState({ type: "", message: "" });
  const [submittingInquiry, setSubmittingInquiry] = useState(false);
  const [submittingBooking, setSubmittingBooking] = useState(false);

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

  useEffect(() => {
    const video = introVideoRef.current;

    if (!video) {
      return undefined;
    }

    const attemptPlay = () => {
      video.muted = true;
      const playPromise = video.play();

      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(() => {});
      }
    };

    attemptPlay();
    video.addEventListener("loadeddata", attemptPlay);

    return () => video.removeEventListener("loadeddata", attemptPlay);
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

  return (
    <div className="page-shell">
      <SiteHeader />

      <main id="top">
        <section className="intro-video" aria-label="Academy introduction">
          <video
            ref={introVideoRef}
            className="intro-video__media"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          >
            <source src="/assets/video/intro.MP4" type="video/mp4" />
          </video>
        </section>

        <section className="section section--difference reveal" id="difference">
          <div className="section-heading section-heading--wide section-heading--difference">
            <p className="eyebrow">What Differentiates Us</p>
            <h2>Technique, intent, and real progression in every session.</h2>
          </div>
          <figure className="photo-panel photo-panel--featured">
            <img
              src="/assets/images/IMG_9395.JPG"
              alt="Coach observing a client during a boxing session."
            />
          </figure>
          <div className="difference-points difference-points--stacked">
            <article>
              <span>01</span>
              <h3>Focused private coaching</h3>
              <p>
                Every session is personalized around your goals, your current
                level, and the adjustments you need to keep improving.
              </p>
            </article>
            <article>
              <span>02</span>
              <h3>Boxing supported by performance training</h3>
              <p>
                Strength, conditioning, and movement work are programmed to make
                the boxing better, not compete with it.
              </p>
            </article>
            <article>
              <span>03</span>
              <h3>Premium, supportive environment</h3>
              <p>
                The atmosphere is calm, professional, and motivating so you can
                stay consistent and train with purpose.
              </p>
            </article>
          </div>
        </section>

        <section className="hero reveal is-visible" id="booking" aria-label="Book a Class">
          <div className="hero__backdrop"></div>
          <div className="hero__inner">
            <div className="hero__content">
              <p className="eyebrow">Book a Class</p>
              <h1>Boxing, strength, and conditioning in one focused system.</h1>
              <p className="hero__summary">
                Private sessions and high-attention training designed to build
                confidence, sharpen skill, and improve the way you move.
              </p>
              <div className="hero__actions">
                <a className="button button--solid" href="#booking-form">
                  Book a Class
                </a>
                <a className="button button--ghost" href="#pricing">
                  Pricing
                </a>
                <a className="button button--ghost" href="#contact">
                  Send Inquiry
                </a>
              </div>
            </div>

            <form
              className="contact-form hero-form"
              id="booking-form"
              onSubmit={handleBookingSubmit}
            >
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
              <label className="consent-field">
                <input
                  type="checkbox"
                  name="consent"
                  checked={bookingForm.consent}
                  onChange={(event) =>
                    setBookingForm((current) => ({
                      ...current,
                      consent: event.target.checked,
                    }))
                  }
                  required
                />
                <span>
                  I agree to receive calls, emails, and text messages from Karakaya
                  Academy about my booking request. Consent is not a condition of
                  purchase. Message and data rates may apply.
                </span>
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

        <section className="section section--packages reveal" id="pricing">
          <div className="section-heading section-heading--wide section-heading--pricing">
            <p className="eyebrow">Pricing</p>
            <h2>Choose the format that matches how you want to train.</h2>
          </div>
          <div className="package-grid">
            {packages.map((item) => (
              <article className="package-card" key={item.slug}>
                <div className="package-card__content">
                  <p className="eyebrow">{item.badge}</p>
                  <h3>{item.name}</h3>
                  <p className="package-price">{item.priceLabel}</p>
                  {item.secondaryPriceLabel ? (
                    <p className="package-subprice">{item.secondaryPriceLabel}</p>
                  ) : null}
                  <p>{item.description}</p>
                  <ul className="meta-list">
                    {item.features.map((feature) => (
                      <li key={feature}>{feature}</li>
                    ))}
                  </ul>
                </div>
                <a className="button button--solid package-card__cta" href="#booking-form">
                  Buy Package
                </a>
              </article>
            ))}
          </div>
        </section>

        <section className="faq-section reveal" id="faq">
          <div className="section-heading section-heading--wide section-heading--faq">
            <p className="eyebrow">FAQ</p>
            <h2>Questions before your first session.</h2>
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
          <div className="section-heading section-heading--contact">
            <p className="eyebrow">Contact</p>
            <h2>Start the conversation.</h2>
          </div>
          <div className="contact-layout">
            <div className="contact-copy">
              <a
                className="map-card"
                href="https://www.google.com/maps/search/?api=1&query=733+North+Kings+Road,+West+Hollywood,+California,+90069"
                target="_blank"
                rel="noreferrer"
                aria-label="Open Karakaya Academy location in Google Maps"
              >
                <iframe
                  title="Karakaya Academy location map"
                  src="https://www.google.com/maps?q=733+North+Kings+Road,+West+Hollywood,+California,+90069&output=embed"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
                <span className="map-card__badge">Open in Google Maps</span>
              </a>
              <p>
                Reach out for questions, private training details, or to find
                the best starting point for your goals.
              </p>
              <ul className="contact-details">
                <li>
                  Email: <a href="mailto:support@karakayaacademy.com">support@karakayaacademy.com</a>
                </li>
                <li>
                  Phone: <a href="tel:+13107601846">+1-310-760-1846</a>
                </li>
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
                    setInquiryForm((current) => ({
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
                  rows="5"
                  value={inquiryForm.messageBody}
                  onChange={(event) =>
                    setInquiryForm((current) => ({
                      ...current,
                      messageBody: event.target.value,
                    }))
                  }
                  placeholder="Tell us what you're looking for."
                  required
                ></textarea>
              </label>
              <label className="consent-field">
                <input
                  type="checkbox"
                  name="consent"
                  checked={inquiryForm.consent}
                  onChange={(event) =>
                    setInquiryForm((current) => ({
                      ...current,
                      consent: event.target.checked,
                    }))
                  }
                  required
                />
                <span>
                  I agree to receive calls, emails, and text messages from Karakaya
                  Academy about my inquiry. Consent is not a condition of purchase.
                  Message and data rates may apply.
                </span>
              </label>
              <button className="button button--solid" type="submit" disabled={submittingInquiry}>
                {submittingInquiry ? "Sending..." : "Send Inquiry"}
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
