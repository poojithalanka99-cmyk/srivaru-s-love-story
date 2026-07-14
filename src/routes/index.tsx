import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import confetti from "canvas-confetti";

/* -------------------- Open When Letters -------------------- */
const OPEN_WHEN = [
  { title: "Open when you miss me", body: "Close your eyes. I'm right there — in every breath, in every heartbeat. Distance is just a number; you are always with me." },
  { title: "Open when you're sad", body: "Remember your smile is my favourite view in the whole world. Whatever it is, we will face it together. I love you, always." },
  { title: "Open when you need strength", body: "You are braver than you think and stronger than you know. And on the days you forget — I'll remind you. I believe in you completely." },
  { title: "Open when you can't sleep", body: "Imagine my arms around you. My heartbeat is your lullaby tonight. Dream sweetly, my love. I'll be there in the morning." },
  { title: "Open when you feel loved", body: "Good. Because you are. Endlessly, completely, and forever. Every single day. Just as you are." },
];

function OpenWhenLetters() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  return (
    <Section id="letters">
      <SectionTitle overline="little envelopes" title="Open When…" />
      <p className="mt-3 text-center text-sm italic text-[oklch(0.5_0.04_15)]">tap an envelope to open it</p>
      <div className="mt-8 grid grid-cols-2 gap-3">
        {OPEN_WHEN.map((l, i) => {
          const isOpen = openIdx === i;
          return (
            <button
              key={i}
              onClick={() => setOpenIdx(isOpen ? null : i)}
              className={`glass-card shadow-soft group relative overflow-hidden rounded-2xl p-4 text-left transition-all duration-500 ${isOpen ? "col-span-2 row-span-2" : "hover:scale-[1.03]"}`}
              style={{ minHeight: isOpen ? "220px" : "120px" }}
            >
              <div className="text-3xl">{isOpen ? "💌" : "✉️"}</div>
              <p className="mt-2 font-serif text-sm italic text-[oklch(0.35_0.08_15)]">{l.title}</p>
              {isOpen && (
                <p className="animate-fade-up mt-3 font-display text-[15px] leading-relaxed text-[oklch(0.4_0.05_15)]">{l.body}</p>
              )}
            </button>
          );
        })}
      </div>
    </Section>
  );
}

/* -------------------- Our Dreams -------------------- */
const DREAMS = [
  { icon: "🏡", t: "Our little home", d: "A cozy corner of the world that's only ours." },
  { icon: "✈️", t: "Travel the world", d: "Sunsets in Santorini, snowfall in Kashmir, and everything in between." },
  { icon: "🌊", t: "Beach mornings", d: "Coffee, your hand in mine, and the sound of the sea." },
  { icon: "👶", t: "A family of our own", d: "A little one with your eyes and my smile." },
  { icon: "🌱", t: "Growing old together", d: "Wrinkles, grey hair, and still holding hands." },
];

function OurDreams() {
  return (
    <Section id="dreams">
      <SectionTitle overline="together forever" title="Our Dreams" />
      <div className="mt-8 space-y-4">
        {DREAMS.map((d, i) => (
          <div key={i} className="animate-fade-up glass-card shadow-soft flex items-center gap-4 rounded-2xl p-5" style={{ animationDelay: `${i * 0.08}s` }}>
            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-rose text-2xl">{d.icon}</div>
            <div className="min-w-0">
              <p className="font-serif text-lg italic text-[oklch(0.32_0.07_15)]">{d.t}</p>
              <p className="font-display text-[15px] text-[oklch(0.5_0.04_15)]">{d.d}</p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* -------------------- Music -------------------- */
function MusicSection() {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) { a.pause(); setPlaying(false); }
    else { a.play().then(() => setPlaying(true)).catch(() => setPlaying(false)); }
  };

  return (
    <Section id="music">
      <SectionTitle overline="our song" title="A Melody for You" />
      <div className="glass-card shadow-soft animate-fade-up mt-8 rounded-3xl p-8 text-center">
        <div className={`mx-auto grid h-28 w-28 place-items-center rounded-full bg-gradient-gold text-5xl text-white shadow-gold ${playing ? "animate-heart-beat" : ""}`}>
          {playing ? "🎶" : "🎵"}
        </div>
        <p className="mt-6 font-serif text-xl italic text-[oklch(0.32_0.07_15)]">Perfect — Ed Sheeran</p>
        <p className="mt-1 font-display text-sm italic text-[oklch(0.5_0.04_15)]">the song that always reminds me of you</p>
        <div className="mt-6">
          <GlowButton onClick={toggle} className="text-sm">
            {playing ? "Pause the moment ❤" : "Play our song ❤"}
          </GlowButton>
        </div>
        <audio
          ref={audioRef}
          loop
          onEnded={() => setPlaying(false)}
          src="https://cdn.pixabay.com/download/audio/2022/10/25/audio_31c9f5f9a2.mp3?filename=romantic-piano-love-story-13440.mp3"
        />
        <p className="mt-4 text-xs italic text-[oklch(0.55_0.04_15)]">replaceable with our actual song later</p>
      </div>
    </Section>
  );
}

/* -------------------- Video Message -------------------- */
function VideoMessage() {
  return (
    <Section id="video">
      <SectionTitle overline="just for you" title="A Video Message" />
      <div className="glass-card shadow-soft animate-fade-up mt-8 overflow-hidden rounded-3xl p-4">
        <div className="relative aspect-[9/12] w-full overflow-hidden rounded-2xl bg-gradient-rose">
          <video
            controls
            playsInline
            className="h-full w-full object-cover"
            poster=""
          >
            <source src="https://cdn.pixabay.com/video/2022/12/12/142467-780956618_tiny.mp4" type="video/mp4" />
          </video>
        </div>
        <p className="mt-4 text-center font-display text-[15px] italic text-[oklch(0.4_0.05_15)]">
          Every word I couldn't say — right here, from my heart to yours. 💕
        </p>
        <p className="mt-1 text-center text-xs italic text-[oklch(0.55_0.04_15)]">replace with your own recorded message</p>
      </div>
    </Section>
  );
}


export const Route = createFileRoute("/")({
  component: BirthdayApp,
});

/* -------------------- Floating Hearts -------------------- */
function FloatingHearts() {
  const hearts = useMemo(
    () =>
      Array.from({ length: 18 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 12 + Math.random() * 22,
        duration: 8 + Math.random() * 10,
        delay: Math.random() * 12,
        opacity: 0.35 + Math.random() * 0.5,
      })),
    [],
  );
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {hearts.map((h) => (
        <span
          key={h.id}
          className="animate-float-heart absolute bottom-0 text-rose"
          style={{
            left: `${h.left}%`,
            fontSize: `${h.size}px`,
            animationDuration: `${h.duration}s`,
            animationDelay: `${h.delay}s`,
            opacity: h.opacity,
            filter: "drop-shadow(0 0 6px oklch(0.78 0.13 20 / 0.5))",
          }}
        >
          ❤
        </span>
      ))}
    </div>
  );
}

/* -------------------- Glow Button -------------------- */
function GlowButton({
  children,
  onClick,
  className = "",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`animate-glow-pulse animate-gradient bg-gradient-button relative inline-flex items-center justify-center rounded-full px-8 py-4 font-serif text-base font-semibold tracking-wide text-white transition-transform duration-300 hover:scale-105 active:scale-95 ${className}`}
    >
      <span className="relative z-10">{children}</span>
    </button>
  );
}

/* -------------------- Section Wrapper -------------------- */
function Section({
  children,
  id,
  className = "",
}: {
  children: React.ReactNode;
  id?: string;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={`relative z-10 mx-auto w-full max-w-md px-5 py-16 ${className}`}
    >
      {children}
    </section>
  );
}

function Divider() {
  return (
    <div className="my-2 flex items-center justify-center gap-3">
      <span className="h-px w-12 bg-gradient-to-r from-transparent to-[oklch(0.78_0.13_85)]" />
      <span className="text-gold text-lg">❦</span>
      <span className="h-px w-12 bg-gradient-to-l from-transparent to-[oklch(0.78_0.13_85)]" />
    </div>
  );
}

/* -------------------- Welcome -------------------- */
function Welcome({ onBegin }: { onBegin: () => void }) {
  return (
    <Section id="welcome" className="flex min-h-screen flex-col items-center justify-center text-center">
      <div className="animate-fade-up" style={{ animationDelay: "0.1s" }}>
        <p className="font-script text-gold text-2xl">with all my love</p>
      </div>
      <div className="animate-heart-beat my-6 text-6xl" style={{ filter: "drop-shadow(0 0 20px oklch(0.72 0.15 18 / 0.5))" }}>
        ❤️
      </div>
      <h1
        className="animate-fade-up font-serif text-5xl leading-tight text-[oklch(0.35_0.08_15)] sm:text-6xl"
        style={{ animationDelay: "0.3s" }}
      >
        Happy Birthday,
        <br />
        <span className="gold-text font-display italic">Srivaru</span>
      </h1>
      <p
        className="animate-fade-up mt-6 max-w-sm font-display text-lg italic text-[oklch(0.45_0.06_15)]"
        style={{ animationDelay: "0.6s" }}
      >
        A little journey through our love, made with all my heart.
      </p>
      <Divider />
      <div className="animate-fade-up mt-8" style={{ animationDelay: "0.9s" }}>
        <GlowButton onClick={onBegin}>Begin Our Story ❤</GlowButton>
      </div>
      <p className="mt-16 animate-bounce text-2xl text-rose/70">↓</p>
    </Section>
  );
}

/* -------------------- Letter -------------------- */
function Letter() {
  return (
    <Section id="letter">
      <SectionTitle overline="a letter for you" title="From My Heart" />
      <div className="glass-card shadow-soft mt-8 rounded-3xl p-7">
        <div className="mb-4 flex justify-center">
          <span className="text-gold text-3xl">✦</span>
        </div>
        <div className="space-y-4 font-display text-[17px] leading-relaxed text-[oklch(0.32_0.06_15)]">
          <p className="font-serif text-xl italic text-rose">My Dearest Srivaru,</p>
          <p>Happy Birthday to the most wonderful person in my life.</p>
          <p>
            From the day you came into my life, everything has felt brighter and more meaningful.
            Thank you for being my biggest strength, my safest place, and the reason behind so many
            of my smiles.
          </p>
          <p>
            I admire your honesty, caring heart, protectiveness, naughty side and amazing sense
            of humour.
          </p>
          <p>Every day with you reminds me how lucky I am.</p>
          <p>
            Our journey since <span className="text-rose font-semibold">24 March 2024</span> has been
            the most beautiful chapter of my life.
          </p>
          <p className="font-serif text-xl italic text-rose">Happy Birthday, my love.</p>
          <div className="pt-4 text-right">
            <p className="font-script text-2xl text-rose">Forever Yours,</p>
            <p className="font-script text-3xl gold-text">Pooja ❤️</p>
          </div>
        </div>
      </div>
    </Section>
  );
}

/* -------------------- Timeline -------------------- */
function Timeline() {
  const items = [
    { date: "24 March 2024", text: "Our forever began ❤️" },
    { date: "Chapter II", text: "Our happiest memories" },
    { date: "Chapter III", text: "Every laugh we shared" },
    { date: "Chapter IV", text: "Every adventure together" },
    { date: "Chapter V", text: "Every dream we hold" },
  ];
  return (
    <Section id="journey">
      <SectionTitle overline="our story" title="Our Journey" />
      <div className="relative mt-10 pl-8">
        <div className="absolute left-3 top-2 bottom-2 w-px bg-gradient-to-b from-[oklch(0.78_0.13_85)] via-[oklch(0.72_0.15_18)] to-transparent" />
        {items.map((it, i) => (
          <div
            key={i}
            className="animate-fade-up relative mb-8 last:mb-0"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <span
              className="shadow-gold absolute -left-[26px] top-1 grid h-5 w-5 place-items-center rounded-full bg-gradient-gold text-[10px] text-white"
              aria-hidden
            >
              ❤
            </span>
            <div className="glass-card rounded-2xl p-4">
              <p className="text-gold font-serif text-xs uppercase tracking-[0.2em]">{it.date}</p>
              <p className="mt-1 font-display text-lg text-[oklch(0.32_0.06_15)]">{it.text}</p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* -------------------- Gallery -------------------- */
function Gallery() {
  const tiles = [
    { grad: "linear-gradient(135deg, oklch(0.92 0.06 20), oklch(0.78 0.13 18))", icon: "🌹" },
    { grad: "linear-gradient(135deg, oklch(0.94 0.05 40), oklch(0.82 0.12 85))", icon: "💕" },
    { grad: "linear-gradient(135deg, oklch(0.9 0.07 15), oklch(0.75 0.14 20))", icon: "✨" },
    { grad: "linear-gradient(135deg, oklch(0.95 0.04 60), oklch(0.85 0.1 45))", icon: "💫" },
    { grad: "linear-gradient(135deg, oklch(0.88 0.08 20), oklch(0.7 0.16 15))", icon: "🌸" },
    { grad: "linear-gradient(135deg, oklch(0.93 0.05 30), oklch(0.8 0.12 25))", icon: "💖" },
  ];
  return (
    <Section id="gallery">
      <SectionTitle overline="captured moments" title="Memory Gallery" />
      <p className="mt-3 text-center text-sm italic text-[oklch(0.5_0.04_15)]">
        Placeholders you can replace with our photos ✨
      </p>
      <div className="mt-8 grid grid-cols-2 gap-3">
        {tiles.map((t, i) => (
          <div
            key={i}
            className={`animate-fade-up shadow-soft group relative aspect-[3/4] overflow-hidden rounded-2xl ${
              i % 3 === 0 ? "row-span-2 aspect-[3/5]" : ""
            }`}
            style={{ background: t.grad, animationDelay: `${i * 0.08}s` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/20" />
            <div className="absolute inset-0 grid place-items-center text-5xl opacity-80 transition-transform duration-500 group-hover:scale-110">
              {t.icon}
            </div>
            <div className="absolute bottom-2 left-2 right-2 rounded-lg bg-white/40 px-2 py-1 text-center font-serif text-xs italic text-white backdrop-blur-sm">
              our moment
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* -------------------- Swipe Cards -------------------- */
const REASONS = [
  { n: "01", t: "Your honesty", d: "You are true — always. It is the safest thing I know." },
  { n: "02", t: "Your caring heart", d: "The way you love makes the world feel gentler." },
  { n: "03", t: "Your protection", d: "With you, I have never had to be afraid of anything." },
  { n: "04", t: "Your naughty smile", d: "That mischief in your eyes still makes me blush." },
  { n: "05", t: "Your sense of humour", d: "You turn ordinary days into pure joy." },
  { n: "06", t: "You make me feel safe", d: "Your arms are the softest place I have ever known." },
  { n: "07", t: "You are my best friend", d: "Every secret, every silly thought — always yours." },
  { n: "08", t: "You are my forever", d: "Every road in me leads home to you." },
];

function ReasonsCards() {
  const [index, setIndex] = useState(0);
  const startX = useRef<number | null>(null);
  const deltaX = useRef(0);
  const [drag, setDrag] = useState(0);

  const go = useCallback((dir: 1 | -1) => {
    setIndex((i) => (i + dir + REASONS.length) % REASONS.length);
    setDrag(0);
  }, []);

  const onStart = (x: number) => {
    startX.current = x;
    deltaX.current = 0;
  };
  const onMove = (x: number) => {
    if (startX.current == null) return;
    deltaX.current = x - startX.current;
    setDrag(deltaX.current);
  };
  const onEnd = () => {
    if (Math.abs(deltaX.current) > 60) {
      go(deltaX.current < 0 ? 1 : -1);
    } else {
      setDrag(0);
    }
    startX.current = null;
    deltaX.current = 0;
  };

  return (
    <Section id="reasons">
      <SectionTitle overline="my favourite things" title="Reasons I Love You" />
      <div
        className="relative mx-auto mt-10 h-[360px] w-full max-w-sm select-none"
        onTouchStart={(e) => onStart(e.touches[0].clientX)}
        onTouchMove={(e) => onMove(e.touches[0].clientX)}
        onTouchEnd={onEnd}
        onMouseDown={(e) => onStart(e.clientX)}
        onMouseMove={(e) => e.buttons === 1 && onMove(e.clientX)}
        onMouseUp={onEnd}
        onMouseLeave={onEnd}
      >
        {REASONS.map((r, i) => {
          const offset = (i - index + REASONS.length) % REASONS.length;
          const isTop = offset === 0;
          const isNext = offset === 1;
          const isSecond = offset === 2;
          if (!isTop && !isNext && !isSecond) return null;
          const scale = isTop ? 1 : isNext ? 0.94 : 0.88;
          const y = isTop ? 0 : isNext ? 18 : 34;
          const rot = isTop ? drag * 0.05 : 0;
          const tx = isTop ? drag : 0;
          const opacity = isTop ? 1 : isNext ? 0.85 : 0.5;
          return (
            <div
              key={r.n}
              className="glass-card shadow-soft absolute inset-0 flex flex-col items-center justify-center rounded-[2rem] p-8 text-center"
              style={{
                transform: `translateX(${tx}px) translateY(${y}px) rotate(${rot}deg) scale(${scale})`,
                transition: startX.current ? "none" : "transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.3s",
                zIndex: 10 - offset,
                opacity,
              }}
            >
              <span className="text-gold font-serif text-sm tracking-[0.3em]">{r.n}</span>
              <div className="my-4 text-3xl">❤️</div>
              <h3 className="font-serif text-3xl italic text-[oklch(0.35_0.08_15)]">{r.t}</h3>
              <p className="mt-4 max-w-[16rem] font-display text-base leading-relaxed text-[oklch(0.5_0.05_15)]">
                {r.d}
              </p>
            </div>
          );
        })}
      </div>
      <div className="mt-6 flex items-center justify-center gap-4">
        <button
          onClick={() => go(-1)}
          className="glass-card grid h-11 w-11 place-items-center rounded-full text-rose transition hover:scale-110"
          aria-label="Previous"
        >
          ←
        </button>
        <div className="flex gap-1.5">
          {REASONS.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-6 bg-gradient-gold" : "w-1.5 bg-[oklch(0.85_0.05_20)]"
              }`}
            />
          ))}
        </div>
        <button
          onClick={() => go(1)}
          className="glass-card grid h-11 w-11 place-items-center rounded-full text-rose transition hover:scale-110"
          aria-label="Next"
        >
          →
        </button>
      </div>
      <p className="mt-4 text-center text-xs italic text-[oklch(0.55_0.04_15)]">
        swipe to see the next reason
      </p>
    </Section>
  );
}

/* -------------------- Section Title -------------------- */
function SectionTitle({ overline, title }: { overline: string; title: string }) {
  return (
    <div className="text-center">
      <p className="text-gold font-serif text-xs uppercase tracking-[0.35em]">{overline}</p>
      <h2 className="mt-2 font-serif text-4xl italic text-[oklch(0.32_0.07_15)]">{title}</h2>
      <div className="mt-4">
        <Divider />
      </div>
    </div>
  );
}

/* -------------------- Final Surprise -------------------- */
function fireConfetti() {
  const colors = ["#f7c6d0", "#f0a5b6", "#e8b25e", "#f7e4c0", "#ffffff"];
  const end = Date.now() + 2500;
  (function frame() {
    confetti({
      particleCount: 4,
      angle: 60,
      spread: 70,
      origin: { x: 0, y: 0.7 },
      colors,
      shapes: ["circle"],
      scalar: 0.9,
    });
    confetti({
      particleCount: 4,
      angle: 120,
      spread: 70,
      origin: { x: 1, y: 0.7 },
      colors,
      shapes: ["circle"],
      scalar: 0.9,
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
  confetti({
    particleCount: 120,
    spread: 100,
    origin: { y: 0.6 },
    colors,
  });
}

function FinalSurprise({ visible }: { visible: boolean }) {
  const fired = useRef(false);
  useEffect(() => {
    if (visible && !fired.current) {
      fired.current = true;
      setTimeout(fireConfetti, 300);
    }
  }, [visible]);

  return (
    <Section id="surprise" className="pb-24 pt-12">
      <SectionTitle overline="one last thing" title="A Final Surprise" />
      <div className="glass-card shadow-soft animate-fade-up mt-8 rounded-3xl p-8 text-center">
        <div className="mb-6 flex justify-center gap-2 text-2xl">
          <span>✨</span>
          <span className="animate-heart-beat">❤️</span>
          <span>✨</span>
        </div>
        <div className="space-y-5 font-display text-[17px] leading-relaxed text-[oklch(0.32_0.06_15)]">
          <p className="italic">If someone asked me what my greatest blessing is...</p>
          <p className="font-serif text-2xl italic gold-text">My answer will always be YOU.</p>
          <p className="font-serif text-xl italic text-rose">Happy Birthday, Amar.</p>
          <p>I love you endlessly.</p>
          <div className="pt-3">
            <p className="font-script text-2xl text-rose">Forever Yours,</p>
            <p className="font-script text-3xl gold-text">Pooja ❤️</p>
          </div>
        </div>
        <div className="mt-8">
          <GlowButton onClick={fireConfetti} className="text-sm sm:text-base">
            I'll choose you in every lifetime ❤
          </GlowButton>
        </div>
      </div>
      <p className="mt-10 text-center font-script text-xl text-rose/70">
        made with love, for you • 24.03.2024
      </p>
    </Section>
  );
}

/* -------------------- Main App -------------------- */
function BirthdayApp() {
  const [started, setStarted] = useState(false);
  const [surpriseVisible, setSurpriseVisible] = useState(false);
  const surpriseRef = useRef<HTMLDivElement | null>(null);

  const handleBegin = () => {
    setStarted(true);
    setTimeout(() => {
      document.getElementById("letter")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  useEffect(() => {
    const el = document.getElementById("surprise");
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setSurpriseVisible(true)),
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [started]);

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-gradient-hero">
      <FloatingHearts />
      <Welcome onBegin={handleBegin} />
      {started && (
        <>
          <Letter />
          <Timeline />
          <Gallery />
          <ReasonsCards />
          <OpenWhenLetters />
          <OurDreams />
          <MusicSection />
          <VideoMessage />
          <div ref={surpriseRef}>
            <FinalSurprise visible={surpriseVisible} />
          </div>

        </>
      )}
    </main>
  );
}
