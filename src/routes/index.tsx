import { createFileRoute } from "@tanstack/react-router";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import confetti from "canvas-confetti";

export const Route = createFileRoute("/")({
  component: BirthdayApp,
});

/* ============================================================
   CONTENT — every editable string / media source lives here.
   The visual design (classes, layout, animations) does NOT
   depend on this object. Edit Mode only mutates values.
   ============================================================ */
const STORAGE_KEY = "birthday_content_v1";
const SESSION_EDIT_KEY = "birthday_edit_mode";

type Content = {
  welcome: {
    overline: string;
    titleLine: string;
    titleAccent: string;
    subtitle: string;
    button: string;
  };
  letter: {
    overline: string;
    title: string;
    greeting: string;
    paragraphs: string[];
    closing: string;
    signatureLine: string;
    signatureName: string;
  };
  timeline: {
    overline: string;
    title: string;
    items: { date: string; text: string }[];
  };
  gallery: {
    overline: string;
    title: string;
    note: string;
    captions: string[];
    images: (string | null)[];
  };
  reasons: {
    overline: string;
    title: string;
    items: { n: string; t: string; d: string }[];
  };
  letters: {
    overline: string;
    title: string;
    hint: string;
    items: { title: string; body: string }[];
  };
  dreams: {
    overline: string;
    title: string;
    items: { icon: string; t: string; d: string }[];
  };
  music: {
    overline: string;
    title: string;
    songTitle: string;
    songNote: string;
    playText: string;
    pauseText: string;
    replaceNote: string;
    audioUrl: string;
  };
  video: {
    overline: string;
    title: string;
    caption: string;
    replaceNote: string;
    videoUrl: string;
  };
  surprise: {
    overline: string;
    title: string;
    line1: string;
    line2: string;
    line3: string;
    line4: string;
    signatureLine: string;
    signatureName: string;
    button: string;
  };
  footer: string;
};

const DEFAULT_CONTENT: Content = {
  welcome: {
    overline: "with all my love",
    titleLine: "Happy Birthday,",
    titleAccent: "Srivaru",
    subtitle: "A little journey through our love, made with all my heart.",
    button: "Begin Our Story ❤",
  },
  letter: {
    overline: "a letter for you",
    title: "From My Heart",
    greeting: "My Dearest Srivaru,",
    paragraphs: [
      "Happy Birthday to the most wonderful person in my life.",
      "From the day you came into my life, everything has felt brighter and more meaningful. Thank you for being my biggest strength, my safest place, and the reason behind so many of my smiles.",
      "I admire your honesty, caring heart, protectiveness, naughty side and amazing sense of humour.",
      "Every day with you reminds me how lucky I am.",
      "Our journey since 24 March 2024 has been the most beautiful chapter of my life.",
    ],
    closing: "Happy Birthday, my love.",
    signatureLine: "Forever Yours,",
    signatureName: "Pooja ❤️",
  },
  timeline: {
    overline: "our story",
    title: "Our Journey",
    items: [
      { date: "24 March 2024", text: "Our forever began ❤️" },
      { date: "Chapter II", text: "Our happiest memories" },
      { date: "Chapter III", text: "Every laugh we shared" },
      { date: "Chapter IV", text: "Every adventure together" },
      { date: "Chapter V", text: "Every dream we hold" },
    ],
  },
  gallery: {
    overline: "captured moments",
    title: "Memory Gallery",
    note: "Placeholders you can replace with our photos ✨",
    captions: ["our moment", "our moment", "our moment", "our moment", "our moment", "our moment"],
    images: [null, null, null, null, null, null],
  },
  reasons: {
    overline: "my favourite things",
    title: "Reasons I Love You",
    items: [
      { n: "01", t: "Your honesty", d: "You are true — always. It is the safest thing I know." },
      { n: "02", t: "Your caring heart", d: "The way you love makes the world feel gentler." },
      { n: "03", t: "Your protection", d: "With you, I have never had to be afraid of anything." },
      { n: "04", t: "Your naughty smile", d: "That mischief in your eyes still makes me blush." },
      { n: "05", t: "Your sense of humour", d: "You turn ordinary days into pure joy." },
      { n: "06", t: "You make me feel safe", d: "Your arms are the softest place I have ever known." },
      { n: "07", t: "You are my best friend", d: "Every secret, every silly thought — always yours." },
      { n: "08", t: "You are my forever", d: "Every road in me leads home to you." },
    ],
  },
  letters: {
    overline: "little envelopes",
    title: "Open When…",
    hint: "tap an envelope to open it",
    items: [
      { title: "Open when you miss me", body: "Close your eyes. I'm right there — in every breath, in every heartbeat. Distance is just a number; you are always with me." },
      { title: "Open when you're sad", body: "Remember your smile is my favourite view in the whole world. Whatever it is, we will face it together. I love you, always." },
      { title: "Open when you need strength", body: "You are braver than you think and stronger than you know. And on the days you forget — I'll remind you. I believe in you completely." },
      { title: "Open when you can't sleep", body: "Imagine my arms around you. My heartbeat is your lullaby tonight. Dream sweetly, my love. I'll be there in the morning." },
      { title: "Open when you feel loved", body: "Good. Because you are. Endlessly, completely, and forever. Every single day. Just as you are." },
    ],
  },
  dreams: {
    overline: "together forever",
    title: "Our Dreams",
    items: [
      { icon: "🏡", t: "Our little home", d: "A cozy corner of the world that's only ours." },
      { icon: "✈️", t: "Travel the world", d: "Sunsets in Santorini, snowfall in Kashmir, and everything in between." },
      { icon: "🌊", t: "Beach mornings", d: "Coffee, your hand in mine, and the sound of the sea." },
      { icon: "👶", t: "A family of our own", d: "A little one with your eyes and my smile." },
      { icon: "🌱", t: "Growing old together", d: "Wrinkles, grey hair, and still holding hands." },
    ],
  },
  music: {
    overline: "our song",
    title: "A Melody for You",
    songTitle: "Perfect — Ed Sheeran",
    songNote: "the song that always reminds me of you",
    playText: "Play our song ❤",
    pauseText: "Pause the moment ❤",
    replaceNote: "replaceable with our actual song later",
    audioUrl:
      "https://cdn.pixabay.com/download/audio/2022/10/25/audio_31c9f5f9a2.mp3?filename=romantic-piano-love-story-13440.mp3",
  },
  video: {
    overline: "just for you",
    title: "A Video Message",
    caption: "Every word I couldn't say — right here, from my heart to yours. 💕",
    replaceNote: "replace with your own recorded message",
    videoUrl: "https://cdn.pixabay.com/video/2022/12/12/142467-780956618_tiny.mp4",
  },
  surprise: {
    overline: "one last thing",
    title: "A Final Surprise",
    line1: "If someone asked me what my greatest blessing is...",
    line2: "My answer will always be YOU.",
    line3: "Happy Birthday, Amar.",
    line4: "I love you endlessly.",
    signatureLine: "Forever Yours,",
    signatureName: "Pooja ❤️",
    button: "I'll choose you in every lifetime ❤",
  },
  footer: "made with love, for you • 24.03.2024",
};

/* ============================================================
   Edit Mode context
   ============================================================ */
type EditCtx = {
  content: Content;
  editMode: boolean;
  setEditMode: (v: boolean) => void;
  setField: (path: string, value: unknown) => void;
  resetAll: () => void;
};

const EditContext = createContext<EditCtx | null>(null);

function deepMerge<T>(base: T, override: unknown): T {
  if (!override || typeof override !== "object" || Array.isArray(override)) {
    return (override === undefined ? base : (override as T));
  }
  if (typeof base !== "object" || base === null || Array.isArray(base)) return base;
  const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
  for (const k of Object.keys(override as Record<string, unknown>)) {
    out[k] = deepMerge((base as Record<string, unknown>)[k], (override as Record<string, unknown>)[k]);
  }
  return out as T;
}

function getPath(obj: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc == null) return undefined;
    return (acc as Record<string, unknown>)[key];
  }, obj);
}

function setPath<T>(obj: T, path: string, value: unknown): T {
  const keys = path.split(".");
  const clone: unknown = Array.isArray(obj) ? [...(obj as unknown[])] : { ...(obj as Record<string, unknown>) };
  let cur: Record<string, unknown> | unknown[] = clone as Record<string, unknown>;
  for (let i = 0; i < keys.length - 1; i++) {
    const k = keys[i];
    const next = (cur as Record<string, unknown>)[k];
    const copy: unknown = Array.isArray(next) ? [...(next as unknown[])] : { ...(next as Record<string, unknown>) };
    (cur as Record<string, unknown>)[k] = copy;
    cur = copy as Record<string, unknown>;
  }
  (cur as Record<string, unknown>)[keys[keys.length - 1]] = value;
  return clone as T;
}

function EditProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<Content>(DEFAULT_CONTENT);
  const [editMode, setEditModeState] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setContent(deepMerge(DEFAULT_CONTENT, JSON.parse(raw)));
    } catch {
      /* ignore */
    }
    try {
      const params = new URLSearchParams(window.location.search);
      const flag =
        params.get("edit") === "1" ||
        sessionStorage.getItem(SESSION_EDIT_KEY) === "1";
      if (params.get("edit") === "1") {
        sessionStorage.setItem(SESSION_EDIT_KEY, "1");
        const url = new URL(window.location.href);
        url.searchParams.delete("edit");
        window.history.replaceState({}, "", url.toString());
      }
      setEditModeState(flag);
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  const persist = useCallback((next: Content) => {
    setContent(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* quota */
    }
  }, []);

  const setField = useCallback(
    (path: string, value: unknown) => {
      persist(setPath(content, path, value));
    },
    [content, persist],
  );

  const setEditMode = useCallback((v: boolean) => {
    setEditModeState(v);
    try {
      if (v) sessionStorage.setItem(SESSION_EDIT_KEY, "1");
      else sessionStorage.removeItem(SESSION_EDIT_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const resetAll = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    setContent(DEFAULT_CONTENT);
  }, []);

  const value = useMemo(
    () => ({ content, editMode, setEditMode, setField, resetAll }),
    [content, editMode, setEditMode, setField, resetAll],
  );

  if (!hydrated) return null;
  return <EditContext.Provider value={value}>{children}</EditContext.Provider>;
}

function useEdit() {
  const ctx = useContext(EditContext);
  if (!ctx) throw new Error("useEdit outside provider");
  return ctx;
}

/* Editable text — displays value as-is; when editMode is on,
   becomes contentEditable with a subtle dashed outline that does
   not affect layout (uses outline, not border). */
function E({
  path,
  as = "span",
  className = "",
  block = false,
}: {
  path: string;
  as?: keyof HTMLElementTagNameMap;
  className?: string;
  block?: boolean;
}) {
  const { content, editMode, setField } = useEdit();
  const raw = getPath(content, path);
  const value = typeof raw === "string" ? raw : "";
  const Tag = as as unknown as "span";
  if (!editMode) {
    if (block) {
      return (
        <Tag className={className}>
          {value.split("\n").map((line, i) => (
            <span key={i}>
              {i > 0 && <br />}
              {line}
            </span>
          ))}
        </Tag>
      );
    }
    return <Tag className={className}>{value}</Tag>;
  }
  return (
    <Tag
      className={`${className} outline outline-1 outline-dashed outline-rose/50 rounded`}
      contentEditable
      suppressContentEditableWarning
      spellCheck={false}
      onBlur={(e) => {
        const next = (e.currentTarget as HTMLElement).innerText;
        if (next !== value) setField(path, next);
      }}
    >
      {value}
    </Tag>
  );
}

/* Media upload chip — appears only in edit mode. Reads a File as
   a data URL and stores it in localStorage. */
function MediaUpload({
  path,
  accept,
  label,
}: {
  path: string;
  accept: string;
  label: string;
}) {
  const { editMode, setField } = useEdit();
  if (!editMode) return null;
  return (
    <label className="absolute inset-x-2 bottom-2 z-30 cursor-pointer rounded-full bg-black/70 px-3 py-1.5 text-center text-[11px] font-medium text-white backdrop-blur-sm">
      {label}
      <input
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = () => setField(path, reader.result as string);
          reader.readAsDataURL(file);
        }}
      />
    </label>
  );
}

/* Toolbar shown while editing */
function EditToolbar() {
  const { editMode, setEditMode, resetAll } = useEdit();
  if (!editMode) return null;
  return (
    <div className="fixed bottom-4 right-4 z-[100] flex items-center gap-2 rounded-full bg-black/85 px-3 py-2 text-xs font-medium text-white shadow-lg backdrop-blur">
      <span className="rounded-full bg-rose/90 px-2 py-0.5 text-[10px] uppercase tracking-wider">
        Edit mode
      </span>
      <button
        onClick={() => {
          if (window.confirm("Reset all edits to the original content?")) resetAll();
        }}
        className="rounded-full px-2 py-1 hover:bg-white/10"
      >
        Reset
      </button>
      <button
        onClick={() => setEditMode(false)}
        className="rounded-full bg-white/15 px-3 py-1 hover:bg-white/25"
      >
        Exit
      </button>
    </div>
  );
}

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
  onHoldStart,
  onHoldEnd,
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  onHoldStart?: () => void;
  onHoldEnd?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      onPointerDown={onHoldStart}
      onPointerUp={onHoldEnd}
      onPointerLeave={onHoldEnd}
      onPointerCancel={onHoldEnd}
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
  children: ReactNode;
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

function SectionTitle({ overlinePath, titlePath }: { overlinePath: string; titlePath: string }) {
  return (
    <div className="text-center">
      <E as="p" path={overlinePath} className="text-gold font-serif text-xs uppercase tracking-[0.35em]" />
      <E as="h2" path={titlePath} className="mt-2 font-serif text-4xl italic text-[oklch(0.32_0.07_15)]" />
      <div className="mt-4">
        <Divider />
      </div>
    </div>
  );
}

/* -------------------- Welcome (ORIGINAL DESIGN) -------------------- */
function Welcome({ onBegin }: { onBegin: () => void }) {
  const { setEditMode, editMode } = useEdit();
  const holdTimer = useRef<number | null>(null);

  const startHold = () => {
    if (editMode) return;
    holdTimer.current = window.setTimeout(() => {
      setEditMode(true);
    }, 3000);
  };
  const endHold = () => {
    if (holdTimer.current) {
      clearTimeout(holdTimer.current);
      holdTimer.current = null;
    }
  };

  return (
    <Section id="welcome" className="flex min-h-screen flex-col items-center justify-center text-center">
      <div className="animate-fade-up" style={{ animationDelay: "0.1s" }}>
        <E as="p" path="welcome.overline" className="font-script text-gold text-2xl" />
      </div>
      <div
        className="animate-heart-beat my-6 text-6xl select-none"
        style={{ filter: "drop-shadow(0 0 20px oklch(0.72 0.15 18 / 0.5))" }}
        onPointerDown={startHold}
        onPointerUp={endHold}
        onPointerLeave={endHold}
        onPointerCancel={endHold}
      >
        ❤️
      </div>
      <h1
        className="animate-fade-up font-serif text-5xl leading-tight text-[oklch(0.35_0.08_15)] sm:text-6xl"
        style={{ animationDelay: "0.3s" }}
      >
        <E as="span" path="welcome.titleLine" />
        <br />
        <E as="span" path="welcome.titleAccent" className="gold-text font-display italic" />
      </h1>
      <p
        className="animate-fade-up mt-6 max-w-sm font-display text-lg italic text-[oklch(0.45_0.06_15)]"
        style={{ animationDelay: "0.6s" }}
      >
        <E as="span" path="welcome.subtitle" />
      </p>
      <Divider />
      <div className="animate-fade-up mt-8" style={{ animationDelay: "0.9s" }}>
        {editMode ? (
          <span className="inline-block">
            <GlowButton>
              <E as="span" path="welcome.button" />
            </GlowButton>
          </span>
        ) : (
          <GlowButton onClick={onBegin}>
            <E as="span" path="welcome.button" />
          </GlowButton>
        )}
      </div>
      <p className="mt-16 animate-bounce text-2xl text-rose/70">↓</p>
    </Section>
  );
}

/* -------------------- Letter -------------------- */
function Letter() {
  const { content } = useEdit();
  return (
    <Section id="letter">
      <SectionTitle overlinePath="letter.overline" titlePath="letter.title" />
      <div className="glass-card shadow-soft mt-8 rounded-3xl p-7">
        <div className="mb-4 flex justify-center">
          <span className="text-gold text-3xl">✦</span>
        </div>
        <div className="space-y-4 font-display text-[17px] leading-relaxed text-[oklch(0.32_0.06_15)]">
          <E as="p" path="letter.greeting" className="font-serif text-xl italic text-rose" />
          {content.letter.paragraphs.map((_, i) => (
            <E key={i} as="p" path={`letter.paragraphs.${i}`} block />
          ))}
          <E as="p" path="letter.closing" className="font-serif text-xl italic text-rose" />
          <div className="pt-4 text-right">
            <E as="p" path="letter.signatureLine" className="font-script text-2xl text-rose" />
            <E as="p" path="letter.signatureName" className="font-script text-3xl gold-text" />
          </div>
        </div>
      </div>
    </Section>
  );
}

/* -------------------- Timeline -------------------- */
function Timeline() {
  const { content } = useEdit();
  return (
    <Section id="journey">
      <SectionTitle overlinePath="timeline.overline" titlePath="timeline.title" />
      <div className="relative mt-10 pl-8">
        <div className="absolute left-3 top-2 bottom-2 w-px bg-gradient-to-b from-[oklch(0.78_0.13_85)] via-[oklch(0.72_0.15_18)] to-transparent" />
        {content.timeline.items.map((_, i) => (
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
              <E
                as="p"
                path={`timeline.items.${i}.date`}
                className="text-gold font-serif text-xs uppercase tracking-[0.2em]"
              />
              <E
                as="p"
                path={`timeline.items.${i}.text`}
                className="mt-1 font-display text-lg text-[oklch(0.32_0.06_15)]"
              />
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* -------------------- Gallery -------------------- */
function Gallery() {
  const { content } = useEdit();
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
      <SectionTitle overlinePath="gallery.overline" titlePath="gallery.title" />
      <E as="p" path="gallery.note" className="mt-3 text-center text-sm italic text-[oklch(0.5_0.04_15)]" />
      <div className="mt-8 grid grid-cols-2 gap-3">
        {tiles.map((t, i) => {
          const img = content.gallery.images[i];
          return (
            <div
              key={i}
              className={`animate-fade-up shadow-soft group relative aspect-[3/4] overflow-hidden rounded-2xl ${
                i % 3 === 0 ? "row-span-2 aspect-[3/5]" : ""
              }`}
              style={{ background: t.grad, animationDelay: `${i * 0.08}s` }}
            >
              {img ? (
                <img src={img} alt="" className="absolute inset-0 h-full w-full object-cover" />
              ) : (
                <>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/20" />
                  <div className="absolute inset-0 grid place-items-center text-5xl opacity-80 transition-transform duration-500 group-hover:scale-110">
                    {t.icon}
                  </div>
                </>
              )}
              <div className="absolute bottom-2 left-2 right-2 rounded-lg bg-white/40 px-2 py-1 text-center font-serif text-xs italic text-white backdrop-blur-sm">
                <E as="span" path={`gallery.captions.${i}`} />
              </div>
              <MediaUpload path={`gallery.images.${i}`} accept="image/*" label={img ? "Replace photo" : "Add photo"} />
            </div>
          );
        })}
      </div>
    </Section>
  );
}

/* -------------------- Reasons Cards -------------------- */
function ReasonsCards() {
  const { content, editMode } = useEdit();
  const REASONS = content.reasons.items;
  const [index, setIndex] = useState(0);
  const startX = useRef<number | null>(null);
  const deltaX = useRef(0);
  const [drag, setDrag] = useState(0);

  const go = useCallback(
    (dir: 1 | -1) => {
      setIndex((i) => (i + dir + REASONS.length) % REASONS.length);
      setDrag(0);
    },
    [REASONS.length],
  );

  const onStart = (x: number) => {
    if (editMode) return;
    startX.current = x;
    deltaX.current = 0;
  };
  const onMove = (x: number) => {
    if (startX.current == null) return;
    deltaX.current = x - startX.current;
    setDrag(deltaX.current);
  };
  const onEnd = () => {
    if (Math.abs(deltaX.current) > 60) go(deltaX.current < 0 ? 1 : -1);
    else setDrag(0);
    startX.current = null;
    deltaX.current = 0;
  };

  return (
    <Section id="reasons">
      <SectionTitle overlinePath="reasons.overline" titlePath="reasons.title" />
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
              <E as="span" path={`reasons.items.${i}.n`} className="text-gold font-serif text-sm tracking-[0.3em]" />
              <div className="my-4 text-3xl">❤️</div>
              <E as="h3" path={`reasons.items.${i}.t`} className="font-serif text-3xl italic text-[oklch(0.35_0.08_15)]" />
              <E
                as="p"
                path={`reasons.items.${i}.d`}
                className="mt-4 max-w-[16rem] font-display text-base leading-relaxed text-[oklch(0.5_0.05_15)]"
              />
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

/* -------------------- Open When Letters -------------------- */
function OpenWhenLetters() {
  const { content, editMode } = useEdit();
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  return (
    <Section id="letters">
      <SectionTitle overlinePath="letters.overline" titlePath="letters.title" />
      <E as="p" path="letters.hint" className="mt-3 text-center text-sm italic text-[oklch(0.5_0.04_15)]" />
      <div className="mt-8 grid grid-cols-2 gap-3">
        {content.letters.items.map((_, i) => {
          const isOpen = openIdx === i || editMode;
          return (
            <button
              key={i}
              onClick={() => !editMode && setOpenIdx(isOpen && !editMode ? null : i)}
              className={`glass-card shadow-soft group relative overflow-hidden rounded-2xl p-4 text-left transition-all duration-500 ${isOpen ? "col-span-2 row-span-2" : "hover:scale-[1.03]"}`}
              style={{ minHeight: isOpen ? "220px" : "120px" }}
            >
              <div className="text-3xl">{isOpen ? "💌" : "✉️"}</div>
              <E
                as="p"
                path={`letters.items.${i}.title`}
                className="mt-2 font-serif text-sm italic text-[oklch(0.35_0.08_15)]"
              />
              {isOpen && (
                <E
                  as="p"
                  path={`letters.items.${i}.body`}
                  block
                  className="animate-fade-up mt-3 font-display text-[15px] leading-relaxed text-[oklch(0.4_0.05_15)]"
                />
              )}
            </button>
          );
        })}
      </div>
    </Section>
  );
}

/* -------------------- Our Dreams -------------------- */
function OurDreams() {
  const { content } = useEdit();
  return (
    <Section id="dreams">
      <SectionTitle overlinePath="dreams.overline" titlePath="dreams.title" />
      <div className="mt-8 space-y-4">
        {content.dreams.items.map((d, i) => (
          <div
            key={i}
            className="animate-fade-up glass-card shadow-soft flex items-center gap-4 rounded-2xl p-5"
            style={{ animationDelay: `${i * 0.08}s` }}
          >
            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-rose text-2xl">
              <E as="span" path={`dreams.items.${i}.icon`} />
            </div>
            <div className="min-w-0">
              <E as="p" path={`dreams.items.${i}.t`} className="font-serif text-lg italic text-[oklch(0.32_0.07_15)]" />
              <E as="p" path={`dreams.items.${i}.d`} className="font-display text-[15px] text-[oklch(0.5_0.04_15)]" />
            </div>
            {/* preserve d.icon reference to avoid TS unused warning */}
            <span className="hidden">{d.icon}</span>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* -------------------- Music -------------------- */
function MusicSection() {
  const { content, editMode, setField } = useEdit();
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) {
      a.pause();
      setPlaying(false);
    } else {
      a.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    }
  };

  return (
    <Section id="music">
      <SectionTitle overlinePath="music.overline" titlePath="music.title" />
      <div className="glass-card shadow-soft animate-fade-up mt-8 rounded-3xl p-8 text-center">
        <div
          className={`mx-auto grid h-28 w-28 place-items-center rounded-full bg-gradient-gold text-5xl text-white shadow-gold ${playing ? "animate-heart-beat" : ""}`}
        >
          {playing ? "🎶" : "🎵"}
        </div>
        <E as="p" path="music.songTitle" className="mt-6 font-serif text-xl italic text-[oklch(0.32_0.07_15)]" />
        <E as="p" path="music.songNote" className="mt-1 font-display text-sm italic text-[oklch(0.5_0.04_15)]" />
        <div className="mt-6">
          <GlowButton onClick={toggle} className="text-sm">
            <E as="span" path={playing ? "music.pauseText" : "music.playText"} />
          </GlowButton>
        </div>
        <audio ref={audioRef} loop onEnded={() => setPlaying(false)} src={content.music.audioUrl} />
        <E as="p" path="music.replaceNote" className="mt-4 text-xs italic text-[oklch(0.55_0.04_15)]" />
        {editMode && (
          <div className="mt-4 space-y-2 rounded-2xl bg-white/50 p-3 text-left text-xs">
            <label className="block font-medium text-[oklch(0.35_0.08_15)]">Music URL</label>
            <input
              type="url"
              defaultValue={content.music.audioUrl}
              onBlur={(e) => setField("music.audioUrl", e.target.value)}
              className="w-full rounded-md border border-rose/30 bg-white/80 px-2 py-1"
              placeholder="https://…"
            />
            <label className="mt-2 block cursor-pointer rounded-full bg-black/70 px-3 py-1.5 text-center text-white">
              Upload audio from phone
              <input
                type="file"
                accept="audio/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  const r = new FileReader();
                  r.onload = () => setField("music.audioUrl", r.result as string);
                  r.readAsDataURL(f);
                }}
              />
            </label>
          </div>
        )}
      </div>
    </Section>
  );
}

/* -------------------- Video -------------------- */
function VideoMessage() {
  const { content, editMode, setField } = useEdit();
  return (
    <Section id="video">
      <SectionTitle overlinePath="video.overline" titlePath="video.title" />
      <div className="glass-card shadow-soft animate-fade-up mt-8 overflow-hidden rounded-3xl p-4">
        <div className="relative aspect-[9/12] w-full overflow-hidden rounded-2xl bg-gradient-rose">
          <video key={content.video.videoUrl} controls playsInline className="h-full w-full object-cover">
            <source src={content.video.videoUrl} type="video/mp4" />
          </video>
        </div>
        <E
          as="p"
          path="video.caption"
          className="mt-4 text-center font-display text-[15px] italic text-[oklch(0.4_0.05_15)]"
        />
        <E as="p" path="video.replaceNote" className="mt-1 text-center text-xs italic text-[oklch(0.55_0.04_15)]" />
        {editMode && (
          <div className="mt-4 space-y-2 rounded-2xl bg-white/50 p-3 text-left text-xs">
            <label className="block font-medium text-[oklch(0.35_0.08_15)]">Video URL</label>
            <input
              type="url"
              defaultValue={content.video.videoUrl}
              onBlur={(e) => setField("video.videoUrl", e.target.value)}
              className="w-full rounded-md border border-rose/30 bg-white/80 px-2 py-1"
              placeholder="https://…"
            />
            <label className="mt-2 block cursor-pointer rounded-full bg-black/70 px-3 py-1.5 text-center text-white">
              Upload video from phone
              <input
                type="file"
                accept="video/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  const r = new FileReader();
                  r.onload = () => setField("video.videoUrl", r.result as string);
                  r.readAsDataURL(f);
                }}
              />
            </label>
          </div>
        )}
      </div>
    </Section>
  );
}

/* -------------------- Final Surprise -------------------- */
function fireConfetti() {
  const colors = ["#f7c6d0", "#f0a5b6", "#e8b25e", "#f7e4c0", "#ffffff"];
  const end = Date.now() + 2500;
  (function frame() {
    confetti({ particleCount: 4, angle: 60, spread: 70, origin: { x: 0, y: 0.7 }, colors, shapes: ["circle"], scalar: 0.9 });
    confetti({ particleCount: 4, angle: 120, spread: 70, origin: { x: 1, y: 0.7 }, colors, shapes: ["circle"], scalar: 0.9 });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
  confetti({ particleCount: 120, spread: 100, origin: { y: 0.6 }, colors });
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
      <SectionTitle overlinePath="surprise.overline" titlePath="surprise.title" />
      <div className="glass-card shadow-soft animate-fade-up mt-8 rounded-3xl p-8 text-center">
        <div className="mb-6 flex justify-center gap-2 text-2xl">
          <span>✨</span>
          <span className="animate-heart-beat">❤️</span>
          <span>✨</span>
        </div>
        <div className="space-y-5 font-display text-[17px] leading-relaxed text-[oklch(0.32_0.06_15)]">
          <E as="p" path="surprise.line1" className="italic" />
          <E as="p" path="surprise.line2" className="font-serif text-2xl italic gold-text" />
          <E as="p" path="surprise.line3" className="font-serif text-xl italic text-rose" />
          <E as="p" path="surprise.line4" />
          <div className="pt-3">
            <E as="p" path="surprise.signatureLine" className="font-script text-2xl text-rose" />
            <E as="p" path="surprise.signatureName" className="font-script text-3xl gold-text" />
          </div>
        </div>
        <div className="mt-8">
          <GlowButton onClick={fireConfetti} className="text-sm sm:text-base">
            <E as="span" path="surprise.button" />
          </GlowButton>
        </div>
      </div>
      <E as="p" path="footer" className="mt-10 text-center font-script text-xl text-rose/70" />
    </Section>
  );
}

/* -------------------- Main App -------------------- */
function BirthdayAppInner() {
  const { editMode } = useEdit();
  const [started, setStarted] = useState(false);
  const [surpriseVisible, setSurpriseVisible] = useState(false);
  const surpriseRef = useRef<HTMLDivElement | null>(null);

  // In edit mode, expand every section so the user can edit them all.
  const showAll = started || editMode;

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
  }, [showAll]);

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-gradient-hero">
      <FloatingHearts />
      <Welcome onBegin={handleBegin} />
      {showAll && (
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
      <EditToolbar />
    </main>
  );
}

function BirthdayApp() {
  return (
    <EditProvider>
      <BirthdayAppInner />
    </EditProvider>
  );
}
