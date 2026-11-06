import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  BookOpen,
  Download,
  FileText,
  Code,
  ImageIcon,
  LifeBuoy,
  ListChecks,
  Monitor,
  Music,
  ShieldCheck,
  Smartphone,
  Wifi,
  Projector,
  Mic2,
} from 'lucide-react';
import { useLocalized } from '@/hooks/useLocalized';
import { SELAH_REPO } from '@/legal/selahContent';

/*
 * Página de presentación de Selah (oortega14.com/apps/selah).
 * Tiene su propia identidad (morado y dorado, como el ícono) en vez del estilo holograma del portafolio.
 * Cuando una tienda apruebe la app, poner aquí su enlace y el botón se activa solo.
 */
const STORE = {
  appStore: null as string | null,
  playStore: null as string | null,
  microsoftStore: null as string | null,
};
const RELEASES = `${SELAH_REPO}/releases/latest`;
const GUIDE = `${SELAH_REPO}/raw/main/docs/Guia-voluntarios-Selah.pdf`;
const IMG = '/apps/selah';

const c = {
  bg: '#110c22',
  bgSoft: '#1a1333',
  card: '#211940',
  line: 'rgba(207, 194, 255, 0.14)',
  text: '#efeaff',
  muted: '#b8addb',
  lilac: '#cfc2ff',
  purple: '#5a3bc8',
  gold: '#e9c46a',
};

const content = {
  es: {
    metaTitle: 'Selah — letras y Biblia para el videobeam de tu iglesia',
    tagline: 'Letras y Biblia en el videobeam de tu iglesia, controladas desde el celular.',
    sub: 'Pensado para los voluntarios: se aprende en minutos. Gratis, de código abierto, sin publicidad y sin cuentas.',
    ctaWindows: 'Descargar para Windows',
    ctaHow: 'Cómo funciona',
    pills: ['Gratis', 'Código abierto', 'Sin publicidad', 'Sin cuentas'],
    howTitle: 'Cómo funciona',
    how: [
      { icon: Projector, t: 'El computador al proyector', d: 'Instala Selah en el computador de la iglesia y conéctalo al videobeam o al TV con un cable HDMI.' },
      { icon: Wifi, t: 'El celular al mismo Wi-Fi', d: 'Abre Selah Remoto o el navegador del celular. Encuentra el computador sola y pide una clave de 4 números.' },
      { icon: Smartphone, t: 'Pasa la letra desde donde estés', d: 'Siguiente estrofa, coro, Biblia o pantalla en negro, desde el computador o desde cualquier celular.' },
    ],
    featTitle: 'Todo lo que necesita el culto',
    feats: [
      { icon: Music, t: 'Canciones', d: 'Tu cancionero con búsqueda por título o por cualquier frase. Salta al coro o al puente con un toque. Importa OpenLyrics y Holyrics.' },
      { icon: BookOpen, t: 'Biblia', d: 'Reina-Valera 1909 y Versión Biblia Libre incluidas. Escribe «Juan 3:16», busca por frase o muestra dos traducciones a la vez.' },
      { icon: ListChecks, t: 'Lista del culto', d: 'Prepara canciones, lecturas, anuncios y la predicación, y avanza con «Siguiente elemento».' },
      { icon: ImageIcon, t: 'Anuncios y fondos', d: 'Fotos y videos (también desde el celular), cuenta regresiva, alertas, el logo de la iglesia y fondos animados.' },
      { icon: Mic2, t: 'Escenario y transmisión', d: 'Vista para músicos y predicador con el tiempo de la predicación, y letras con fondo transparente para OBS.' },
      { icon: ShieldCheck, t: 'Seguro y privado', d: 'Nadie más en el Wi-Fi puede mover la letra sin la clave. No se recopila ningún dato: todo queda en tu computador.' },
    ],
    shotsTitle: 'El control remoto',
    shotsSub: 'Selah Remoto para iPhone y Android. También funciona desde el navegador del celular, sin instalar nada.',
    shots: ['Canción en pantalla', 'Lista del culto', 'Biblia', 'Versículo en pantalla', 'Buscar canciones', 'Más opciones'],
    pcAlt: 'Pantalla del operador de Selah en el computador',
    dlTitle: 'Descargas',
    dlSoon: 'Próximamente',
    dl: {
      windows: { t: 'Windows', d: 'Instalador .msi (Windows 10 y 11). Se actualiza solo.', b: 'Descargar' },
      ms: { t: 'Microsoft Store', d: 'La misma versión, instalada y actualizada por la tienda.' },
      ios: { t: 'iPhone', d: 'Selah Remote en la App Store. iOS 17 o más nuevo.' },
      play: { t: 'Google Play', d: 'Selah Remoto para Android.' },
      apk: { t: 'Android (APK)', d: 'Descarga directa desde GitHub, para cualquier Android 7 o más nuevo.', b: 'Descargar' },
    },
    helpTitle: 'Ayuda',
    help: [
      { icon: FileText, t: 'Guía para voluntarios (PDF)', href: GUIDE, ext: true },
      { icon: LifeBuoy, t: 'Soporte y preguntas', href: '/apps/selah/support', ext: false },
      { icon: ShieldCheck, t: 'Política de privacidad', href: '/apps/selah/privacy', ext: false },
      { icon: Code, t: 'Código fuente', href: SELAH_REPO, ext: true },
    ],
    meaning: '«Selah» aparece en los Salmos como una pausa para detenerse y meditar.',
    footer: 'Hecho por Oscar Ortega · Licencia MIT',
  },
  en: {
    metaTitle: 'Selah — lyrics and Bible for your church projector',
    tagline: "Lyrics and Bible on your church's projector, controlled from your phone.",
    sub: 'Made for volunteers: you learn it in minutes. Free, open source, no ads and no accounts.',
    ctaWindows: 'Download for Windows',
    ctaHow: 'How it works',
    pills: ['Free', 'Open source', 'No ads', 'No accounts'],
    howTitle: 'How it works',
    how: [
      { icon: Projector, t: 'Computer to projector', d: "Install Selah on the church computer and connect it to the projector or TV with an HDMI cable." },
      { icon: Wifi, t: 'Phone on the same Wi-Fi', d: "Open Selah Remote or the phone's browser. It finds the computer by itself and asks for a 4-digit PIN." },
      { icon: Smartphone, t: 'Advance lyrics from anywhere', d: 'Next verse, chorus, Bible or black screen, from the computer or from any phone.' },
    ],
    featTitle: 'Everything the service needs',
    feats: [
      { icon: Music, t: 'Songs', d: 'Your songbook, searchable by title or any line. Jump to the chorus or bridge with one tap. Imports OpenLyrics and Holyrics.' },
      { icon: BookOpen, t: 'Bible', d: 'Spanish Reina-Valera 1909 and Versión Biblia Libre included. Type "John 3:16", search by phrase or show two translations at once.' },
      { icon: ListChecks, t: 'Service order', d: 'Prepare songs, readings, announcements and the sermon, then move on with "Next item".' },
      { icon: ImageIcon, t: 'Announcements and backgrounds', d: 'Photos and videos (also from your phone), countdown, alerts, the church logo and animated backgrounds.' },
      { icon: Mic2, t: 'Stage and streaming', d: "Stage display for musicians and preacher with the sermon timer, and lyrics with a transparent background for OBS." },
      { icon: ShieldCheck, t: 'Safe and private', d: 'Nobody else on the Wi-Fi can change the slides without the PIN. No data is collected: everything stays on your computer.' },
    ],
    shotsTitle: 'The remote control',
    shotsSub: "Selah Remote for iPhone and Android. It also works from the phone's browser, with nothing to install.",
    shots: ['Song on screen', 'Service order', 'Bible', 'Verse on screen', 'Song search', 'More options'],
    pcAlt: 'Selah operator screen on the computer',
    dlTitle: 'Downloads',
    dlSoon: 'Coming soon',
    dl: {
      windows: { t: 'Windows', d: '.msi installer (Windows 10 and 11). Updates itself.', b: 'Download' },
      ms: { t: 'Microsoft Store', d: 'The same version, installed and updated by the store.' },
      ios: { t: 'iPhone', d: 'Selah Remote on the App Store. iOS 17 or newer.' },
      play: { t: 'Google Play', d: 'Selah Remote for Android.' },
      apk: { t: 'Android (APK)', d: 'Direct download from GitHub, for Android 7 or newer.', b: 'Download' },
    },
    helpTitle: 'Help',
    help: [
      { icon: FileText, t: 'Volunteer guide (PDF, Spanish)', href: GUIDE, ext: true },
      { icon: LifeBuoy, t: 'Support and FAQ', href: '/apps/selah/support', ext: false },
      { icon: ShieldCheck, t: 'Privacy policy', href: '/apps/selah/privacy', ext: false },
      { icon: Code, t: 'Source code', href: SELAH_REPO, ext: true },
    ],
    meaning: '"Selah" appears in the Psalms as a pause to stop and reflect.',
    footer: 'Made by Oscar Ortega · MIT License',
  },
};

const SHOTS = [
  '01-cancion-en-pantalla',
  '02-lista-del-culto',
  '03-biblia-juan-3',
  '04-versiculo-en-pantalla',
  '05-canciones',
  '06-mas-opciones',
];

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-center mb-12" style={{ color: c.text }}>
      {children}
    </h2>
  );
}

function DownloadCard({
  icon: Icon,
  title,
  desc,
  href,
  label,
  soon,
}: {
  icon: typeof Monitor;
  title: string;
  desc: string;
  href: string | null;
  label: string;
  soon: string;
}) {
  return (
    <div className="rounded-2xl p-6 flex flex-col gap-3" style={{ background: c.card, border: `1px solid ${c.line}` }}>
      <div className="flex items-center gap-3">
        <Icon size={22} color={c.gold} />
        <h3 className="text-lg font-semibold" style={{ color: c.text }}>{title}</h3>
      </div>
      <p className="text-sm leading-relaxed flex-1" style={{ color: c.muted }}>{desc}</p>
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-transform hover:-translate-y-0.5"
          style={{ background: c.lilac, color: '#1b1238' }}
        >
          <Download size={16} /> {label}
        </a>
      ) : (
        <span
          className="inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm"
          style={{ border: `1px dashed ${c.line}`, color: c.muted }}
        >
          {soon}
        </span>
      )}
    </div>
  );
}

export default function SelahLanding() {
  const { locale } = useLocalized();
  const { i18n } = useTranslation();
  const t = content[locale];

  useEffect(() => {
    const prev = document.title;
    document.title = t.metaTitle;
    return () => {
      document.title = prev;
    };
  }, [t.metaTitle]);

  return (
    <div style={{ background: c.bg, color: c.text, minHeight: '100vh' }}>
      {/* Barra superior */}
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 py-5 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-3">
          <img src={`${IMG}/icono.svg`} alt="" width={36} height={36} className="rounded-lg" />
          <span className="text-xl font-bold tracking-tight">Selah</span>
        </a>
        <div className="flex items-center gap-1 text-xs font-semibold uppercase">
          {(['es', 'en'] as const).map((loc) => (
            <button
              key={loc}
              type="button"
              onClick={() => void i18n.changeLanguage(loc)}
              className="px-2.5 py-1.5 rounded-md"
              style={{
                color: locale === loc ? c.text : c.muted,
                background: locale === loc ? c.card : 'transparent',
              }}
            >
              {loc}
            </button>
          ))}
        </div>
      </nav>

      {/* Portada */}
      <header id="top" className="relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(60% 50% at 50% 0%, rgba(90,59,200,0.45), transparent 70%)`,
          }}
        />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-20 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <img
              src={`${IMG}/icono.svg`}
              alt="Selah"
              width={88}
              height={88}
              className="rounded-[22px] mb-6 shadow-2xl"
            />
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05] mb-5">
              {t.tagline}
            </h1>
            <p className="text-lg leading-relaxed mb-8" style={{ color: c.muted }}>{t.sub}</p>
            <div className="flex flex-wrap gap-3 mb-8">
              <a
                href={STORE.microsoftStore ?? RELEASES}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full px-6 py-3 font-semibold transition-transform hover:-translate-y-0.5"
                style={{ background: c.gold, color: '#241a05' }}
              >
                <Download size={18} /> {t.ctaWindows}
              </a>
              <a
                href="#como-funciona"
                className="inline-flex items-center gap-2 rounded-full px-6 py-3 font-semibold"
                style={{ border: `1px solid ${c.line}`, color: c.text }}
              >
                {t.ctaHow}
              </a>
            </div>
            <ul className="flex flex-wrap gap-2">
              {t.pills.map((p) => (
                <li
                  key={p}
                  className="text-xs font-semibold rounded-full px-3 py-1"
                  style={{ background: c.bgSoft, color: c.lilac, border: `1px solid ${c.line}` }}
                >
                  {p}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative pb-10 sm:pb-0">
            <img
              src={`${IMG}/operador.jpg`}
              alt={t.pcAlt}
              width={1229}
              height={620}
              className="w-full rounded-xl shadow-2xl"
              style={{ border: `1px solid ${c.line}` }}
            />
            <img
              src={`${IMG}/01-cancion-en-pantalla.jpg`}
              alt={t.shots[0]}
              width={600}
              height={1304}
              className="absolute -bottom-8 left-2 sm:-left-6 w-[30%] max-w-[170px] rounded-[18px] shadow-2xl"
              style={{ border: `4px solid #000` }}
            />
          </div>
        </div>
      </header>

      {/* Cómo funciona */}
      <section id="como-funciona" className="py-20 px-4 sm:px-6" style={{ background: c.bgSoft }}>
        <div className="max-w-6xl mx-auto">
          <SectionTitle>{t.howTitle}</SectionTitle>
          <ol className="grid md:grid-cols-3 gap-6">
            {t.how.map((s, i) => (
              <li key={s.t} className="rounded-2xl p-6" style={{ background: c.card, border: `1px solid ${c.line}` }}>
                <div className="flex items-center gap-3 mb-4">
                  <span
                    className="w-9 h-9 rounded-full grid place-items-center font-bold"
                    style={{ background: c.gold, color: '#241a05' }}
                  >
                    {i + 1}
                  </span>
                  <s.icon size={22} color={c.lilac} />
                </div>
                <h3 className="text-lg font-semibold mb-2">{s.t}</h3>
                <p className="text-sm leading-relaxed" style={{ color: c.muted }}>{s.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Funciones */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <SectionTitle>{t.featTitle}</SectionTitle>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {t.feats.map((f) => (
              <div key={f.t} className="rounded-2xl p-6" style={{ background: c.card, border: `1px solid ${c.line}` }}>
                <f.icon size={26} color={c.gold} className="mb-4" />
                <h3 className="text-lg font-semibold mb-2">{f.t}</h3>
                <p className="text-sm leading-relaxed" style={{ color: c.muted }}>{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Capturas del celular */}
      <section className="py-20" style={{ background: c.bgSoft }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <SectionTitle>{t.shotsTitle}</SectionTitle>
          <p className="text-center -mt-8 mb-10 max-w-2xl mx-auto" style={{ color: c.muted }}>{t.shotsSub}</p>
        </div>
        <div className="flex gap-5 overflow-x-auto px-4 sm:px-6 pb-4 snap-x snap-mandatory max-w-6xl mx-auto">
          {SHOTS.map((s, i) => (
            <figure key={s} className="shrink-0 w-[60%] sm:w-[220px] snap-center">
              <img
                src={`${IMG}/${s}.jpg`}
                alt={t.shots[i]}
                width={600}
                height={1304}
                loading="lazy"
                className="w-full rounded-[22px]"
                style={{ border: `1px solid ${c.line}` }}
              />
              <figcaption className="text-center text-sm mt-3" style={{ color: c.muted }}>{t.shots[i]}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* Descargas */}
      <section id="descargas" className="py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <SectionTitle>{t.dlTitle}</SectionTitle>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <DownloadCard icon={Monitor} title={t.dl.windows.t} desc={t.dl.windows.d} href={RELEASES} label={t.dl.windows.b} soon={t.dlSoon} />
            <DownloadCard icon={Monitor} title={t.dl.ms.t} desc={t.dl.ms.d} href={STORE.microsoftStore} label={t.dl.ms.t} soon={t.dlSoon} />
            <DownloadCard icon={Smartphone} title={t.dl.ios.t} desc={t.dl.ios.d} href={STORE.appStore} label="App Store" soon={t.dlSoon} />
            <DownloadCard icon={Smartphone} title={t.dl.play.t} desc={t.dl.play.d} href={STORE.playStore} label="Google Play" soon={t.dlSoon} />
            <DownloadCard icon={Smartphone} title={t.dl.apk.t} desc={t.dl.apk.d} href={RELEASES} label={t.dl.apk.b} soon={t.dlSoon} />
          </div>
        </div>
      </section>

      {/* Ayuda */}
      <section className="py-20 px-4 sm:px-6" style={{ background: c.bgSoft }}>
        <div className="max-w-6xl mx-auto">
          <SectionTitle>{t.helpTitle}</SectionTitle>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {t.help.map((h) => {
              const inner = (
                <>
                  <h.icon size={20} color={c.lilac} />
                  <span className="font-medium">{h.t}</span>
                </>
              );
              const cls = 'flex items-center gap-3 rounded-xl px-5 py-4 transition-colors hover:brightness-125';
              const style = { background: c.card, border: `1px solid ${c.line}` };
              return h.ext ? (
                <a key={h.t} href={h.href} target="_blank" rel="noopener noreferrer" className={cls} style={style}>
                  {inner}
                </a>
              ) : (
                <Link key={h.t} to={h.href} className={cls} style={style}>
                  {inner}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <footer className="py-12 px-4 sm:px-6 text-center text-sm" style={{ color: c.muted }}>
        <p className="italic mb-3">{t.meaning}</p>
        <p>
          © {new Date().getFullYear()} · {t.footer} ·{' '}
          <Link to="/" style={{ color: c.lilac }}>oortega14.com</Link>
        </p>
      </footer>
    </div>
  );
}
