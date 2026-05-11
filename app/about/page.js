import SiteHeader from "../../components/site-header";

export default function AboutPage() {
  return (
    <div className="about-page">
      <SiteHeader />
      <main className="about-page__main">
        <section className="about-hero">
          <div className="about-hero__overlay"></div>
          <div className="about-hero__content">
            <p className="eyebrow">About Us</p>
            <h1>Karakaya Academy</h1>
            <div className="about-copy">
              <p>
                At Karakaya Academy, we help clients build strength, discipline,
                and confidence through focused, personalized training. Our
                private one-on-one sessions are designed to improve both
                physical performance and mental resilience in a professional,
                motivating, and supportive environment.
              </p>
              <p>
                Our training approach combines boxing, functional strength
                training, conditioning, and movement-based workouts to create a
                complete athletic experience for every level. Whether you are
                just starting out, learning boxing fundamentals, improving your
                fitness, building endurance, or pushing your performance to the
                next level, each session is tailored to your goals, ability, and
                progress.
              </p>
              <p>
                We believe training is more than a workout. It is a commitment
                to consistency, focus, and self-improvement. Our mission is to
                deliver a high-quality coaching experience where every client
                feels challenged, supported, and inspired to become stronger.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
