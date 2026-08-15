"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

const WEDDING_DATE = new Date("2026-11-30T10:00:00+05:30");

type Countdown = { days: number; hours: number; minutes: number; seconds: number };

function getCountdown(): Countdown {
  const distance = Math.max(0, WEDDING_DATE.getTime() - Date.now());
  return {
    days: Math.floor(distance / 86_400_000),
    hours: Math.floor((distance / 3_600_000) % 24),
    minutes: Math.floor((distance / 60_000) % 60),
    seconds: Math.floor((distance / 1_000) % 60),
  };
}

const particles = Array.from({ length: 22 }, (_, index) => ({
  id: index,
  left: `${(index * 37 + 9) % 100}%`,
  delay: `${(index % 8) * -1.15}s`,
  duration: `${7 + (index % 6) * 1.35}s`,
  size: `${4 + (index % 4) * 2}px`,
}));

export default function Home() {
  const [opened, setOpened] = useState(false);
  const [opening, setOpening] = useState(false);
  const [countdown, setCountdown] = useState<Countdown | null>(null);
  const [guest, setGuest] = useState("Dear Family & Friends");
  const [toast, setToast] = useState("");

  useEffect(() => {
    const queryGuest = new URLSearchParams(window.location.search).get("guest");
    if (queryGuest?.trim()) setGuest(`Dear ${queryGuest.trim()}`);
    const update = () => setCountdown(getCountdown());
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const countdownUnits = useMemo(
    () => [
      ["Days", countdown?.days ?? "—"],
      ["Hours", countdown?.hours ?? "—"],
      ["Minutes", countdown?.minutes ?? "—"],
      ["Seconds", countdown?.seconds ?? "—"],
    ],
    [countdown],
  );

  function openInvitation() {
    setOpening(true);
    window.setTimeout(() => setOpened(true), 850);
  }

  function showToast(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 3200);
  }

  function openWhatsApp(answer: "yes" | "no") {
    const response = answer === "yes"
      ? "We are delighted to celebrate with you! 💍✨"
      : "Thank you for inviting us. Sadly, we will not be able to attend.";
    const text = encodeURIComponent(
      `${response}\n\nWedding of Gimhan & Disna — 30 November 2026, Wasana Hotel, Akuressa.`,
    );
    window.open(`https://wa.me/?text=${text}`, "_blank", "noopener,noreferrer");
    showToast(answer === "yes" ? "Wonderful — see you there!" : "Your warm wishes mean a lot to us.");
  }

  async function shareInvitation() {
    const shareData = {
      title: "Gimhan & Disna — Wedding Invitation",
      text: "Join us as we celebrate our wedding on 30 November 2026.",
      url: window.location.href,
    };
    if (navigator.share) {
      await navigator.share(shareData).catch(() => undefined);
      return;
    }
    await navigator.clipboard.writeText(window.location.href);
    showToast("Invitation link copied");
  }

  return (
    <main className="site-shell">
      {!opened && (
        <section className={`opening-screen ${opening ? "is-opening" : ""}`} aria-label="Open wedding invitation">
          <div className="opening-glow" />
          <div className="envelope-wrap">
            <div className="envelope">
              <div className="envelope-back" />
              <div className="letter-preview">
                <span className="eyebrow">A celebration of love</span>
                <strong>G <i>&amp;</i> D</strong>
                <span>30 · 11 · 2026</span>
              </div>
              <div className="envelope-front" />
              <div className="envelope-flap" />
              <button className="wax-seal" type="button" onClick={openInvitation} aria-label="Open invitation">
                <span>G&amp;D</span>
              </button>
            </div>
            <p>We have something beautiful to share</p>
            <button className="open-button" type="button" onClick={openInvitation}>
              <span>Open our invitation</span><span aria-hidden="true">↗</span>
            </button>
          </div>
        </section>
      )}

      <div className={`invitation ${opened ? "is-visible" : ""}`} aria-hidden={!opened}>
        <div className="ambient" aria-hidden="true">
          {particles.map((particle) => (
            <i key={particle.id} style={{
              left: particle.left,
              animationDelay: particle.delay,
              animationDuration: particle.duration,
              width: particle.size,
              height: particle.size,
            }} />
          ))}
        </div>

        <nav className="floating-nav" aria-label="Invitation navigation">
          <a href="#details">Details</a>
          <a href="#schedule">The day</a>
          <button type="button" onClick={shareInvitation}>Share</button>
        </nav>

        <section className="hero" id="top">
          <div className="hero-orbit orbit-one" aria-hidden="true" />
          <div className="hero-orbit orbit-two" aria-hidden="true" />
          <div className="hero-card">
            <div className="corner-flourish top-left" aria-hidden="true">✦</div>
            <div className="corner-flourish top-right" aria-hidden="true">✦</div>
            <p className="guest-name">{guest}</p>
            <p className="save-date">Save the date</p>
            <div className="monogram" aria-label="Gimhan and Disna"><span>G</span><i>&amp;</i><span>D</span></div>
            <div className="fine-rule"><span>two hearts · one story</span></div>
            <h1><span>Gimhan</span><i>&amp;</i><span>Disna</span></h1>
            <p className="sinhala-line">අපගේ ජීවිතයේ සුන්දරම දිනයට ඔබගේ පැමිණීම ආදරයෙන් බලාපොරොත්තු වෙමු.</p>
            <div className="hero-date"><span>Monday</span><strong>30</strong><span>November<br />2026</span></div>
            <p className="hero-place">Wasana Hotel · Akuressa</p>
            <a className="scroll-cue" href="#countdown"><span>Discover our day</span><i aria-hidden="true">↓</i></a>
          </div>
        </section>

        <section className="countdown-section" id="countdown">
          <p className="section-kicker">Counting down to forever</p>
          <h2>Our next chapter begins in</h2>
          <div className="countdown-grid" aria-live="polite">
            {countdownUnits.map(([label, value]) => (
              <div className="countdown-unit" key={label}>
                <strong>{value}</strong><span>{label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="portrait-section" aria-label="Gimhan and Disna">
          <div className="portrait-copy">
            <p className="section-kicker">Our favourite chapter</p>
            <h2>Together is a beautiful place to be</h2>
            <p>Two lives, one promise, and a lifetime of moments waiting to be written.</p>
            <div className="portrait-signature">Gimhan <span>&amp;</span> Disna</div>
          </div>
          <figure className="portrait-frame">
            <Image
              className="portrait-image"
              src="/couple.jpg"
              alt="Gimhan and Disna"
              width={1148}
              height={2044}
              sizes="(max-width: 820px) 88vw, 460px"
              unoptimized
            />
            <span className="photo-sparkle photo-sparkle-one" aria-hidden="true">✦</span>
            <span className="photo-sparkle photo-sparkle-two" aria-hidden="true">✦</span>
          </figure>
        </section>

        <section className="details-section" id="details">
          <div className="section-heading">
            <p className="section-kicker">You are cordially invited</p>
            <h2>Where love meets celebration</h2>
            <p>With joyful hearts, together with our families, we invite you to witness our vows and celebrate the beginning of our forever.</p>
          </div>

          <div className="detail-grid">
            <article className="detail-card">
              <span className="card-index">01</span><p className="card-label">The date</p>
              <h3>Monday<br />30 November</h3><p>2026 · from 10:00 in the morning</p>
              <a href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Gimhan%20%26%20Disna%20Wedding&dates=20261130T043000Z/20261130T093000Z&details=Wedding%20celebration%20of%20Gimhan%20and%20Disna&location=Wasana%20Hotel%2C%20Akuressa" target="_blank" rel="noreferrer">
                Add to calendar <span>↗</span>
              </a>
            </article>

            <article className="detail-card featured-card">
              <span className="card-index">02</span><p className="card-label">The venue</p>
              <h3>Wasana<br />Hotel</h3><p>Akuressa, Sri Lanka</p>
              <a href="https://www.google.com/maps/search/?api=1&query=Wasana+Hotel+Akuressa" target="_blank" rel="noreferrer">
                Open in maps <span>↗</span>
              </a>
            </article>

            <article className="detail-card">
              <span className="card-index">03</span><p className="card-label">The celebration</p>
              <h3>Love · Joy<br />&amp; Dancing</h3><p>Lunch reception to follow the ceremony</p>
              <a href="#schedule">View the day <span>↓</span></a>
            </article>
          </div>
        </section>

        <section className="schedule-section" id="schedule">
          <div className="schedule-intro">
            <p className="section-kicker">The celebration</p><h2>A little look at our day</h2>
            <p>Come for the vows, stay for the memories. Every moment will feel more special with you there.</p>
          </div>
          <div className="timeline">
            <div className="timeline-item"><time>10:00 AM</time><span className="timeline-dot" /><div><small>First chapter</small><h3>The Ceremony</h3><p>Witness the moment we say “I do”.</p></div></div>
            <div className="timeline-item"><time>11:30 AM</time><span className="timeline-dot" /><div><small>Together</small><h3>Photos &amp; Wishes</h3><p>Smiles, hugs and beautiful memories.</p></div></div>
            <div className="timeline-item"><time>12:30 PM</time><span className="timeline-dot" /><div><small>Celebrate</small><h3>Lunch &amp; Dancing</h3><p>Good food, happy hearts and a full dance floor.</p></div></div>
          </div>
        </section>

        <section className="rsvp-section" id="rsvp">
          <div className="rsvp-card">
            <div className="rsvp-monogram" aria-hidden="true">G<span>&amp;</span>D</div>
            <p className="section-kicker">Kindly respond</p><h2>Will you celebrate with us?</h2>
            <p>Your presence would make our day complete. Please let us know your answer through WhatsApp.</p>
            <div className="rsvp-actions">
              <button className="primary-action" type="button" onClick={() => openWhatsApp("yes")}>Joyfully attending <span>♥</span></button>
              <button className="secondary-action" type="button" onClick={() => openWhatsApp("no")}>Celebrating from afar</button>
            </div>
            <small>Please respond before 01 November 2026</small>
          </div>
        </section>

        <footer>
          <div className="footer-mark">G <span>&amp;</span> D</div><p>With love, Gimhan &amp; Disna</p><p className="footer-date">30 · 11 · 2026</p>
          <a href="#top" aria-label="Back to top">↑</a>
        </footer>
      </div>

      {toast && <div className="toast" role="status">{toast}</div>}
    </main>
  );
}
