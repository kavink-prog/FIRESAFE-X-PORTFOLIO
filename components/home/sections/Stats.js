'use client';

import { motion, useReducedMotion } from 'framer-motion';

const FEATURES = [
  {
    title: 'Multi-Language AI Instructor',
    description:
      'Train users in their preferred language through AI-powered theory lessons, voice interactions, and expert guidance. Create a more accessible and engaging learning experience for global teams.',
    icon: 'globe',
  },
  {
    title: 'Region-Based Content',
    description:
      'Adapt training content, simulations, and safety procedures to regional regulations, standards, and operational requirements without rebuilding the platform.',
    icon: 'map',
  },
  {
    title: 'Role-Based Training',
    description:
      'Deliver customized learning experiences for employees, safety officers, supervisors, instructors, and administrators with configurable access and training paths.',
    icon: 'roles',
  },
  {
    title: 'Multiple AI Personas',
    description:
      'Choose from customizable AI instructors and 3D trainer avatars to create organization-specific learning experiences.',
    icon: 'personas',
  },
  {
    title: 'Admin-Controlled Experience',
    description:
      'Control session duration, assessments, permissions, content visibility, and training workflows through a centralized management system.',
    icon: 'control',
  },
  {
    title: 'Enterprise Customization',
    description:
      "Customize branding, workflows, compliance requirements, and training objectives to match your organization's needs.",
    icon: 'modular',
  },
];

const COORDINATES = [
  'NA 37.7749 / -122.4194',
  'EU 48.8566 / 2.3522',
  'MEA 25.2048 / 55.2708',
  'APAC 1.3521 / 103.8198',
];

const NODES = [
  { top: '12%', left: '14%', delay: 0 },
  { top: '20%', right: '12%', delay: 1.2 },
  { top: '54%', left: '8%', delay: 2.3 },
  { bottom: '18%', right: '16%', delay: 3.1 },
  { bottom: '10%', left: '28%', delay: 4.2 },
];

function Icon({ type }) {
  switch (type) {
    case 'globe':
      return (
        <svg viewBox="0 0 64 64" aria-hidden="true">
          <circle cx="32" cy="32" r="21" />
          <path d="M12 32h40M32 11c6 6 10 13 10 21S38 47 32 53M32 11c-6 6-10 13-10 21s4 15 10 21M18 19c4 3 9 5 14 5s10-2 14-5M18 45c4-3 9-5 14-5s10 2 14 5" />
        </svg>
      );
    case 'map':
      return (
        <svg viewBox="0 0 64 64" aria-hidden="true">
          <path d="M10 16l14-5 16 6 14-5v36l-14 5-16-6-14 5z" />
          <path d="M24 11v36M40 17v36" />
          <circle cx="44" cy="24" r="4" />
        </svg>
      );
    case 'roles':
      return (
        <svg viewBox="0 0 64 64" aria-hidden="true">
          <circle cx="20" cy="23" r="7" />
          <circle cx="44" cy="20" r="6" />
          <circle cx="38" cy="42" r="8" />
          <path d="M10 46c2-7 8-11 15-11s13 4 15 11M35 30c2-4 6-6 11-6 5 0 9 2 11 6M24 29c3 4 7 7 12 8" />
        </svg>
      );
    case 'personas':
      return (
        <svg viewBox="0 0 64 64" aria-hidden="true">
          <path d="M18 45c0-8 6-14 14-14s14 6 14 14" />
          <circle cx="32" cy="22" r="8" />
          <path d="M12 15l8 4M52 15l-8 4M14 51l9-4M50 51l-9-4" />
          <circle cx="12" cy="15" r="3" />
          <circle cx="52" cy="15" r="3" />
          <circle cx="14" cy="51" r="3" />
          <circle cx="50" cy="51" r="3" />
        </svg>
      );
    case 'control':
      return (
        <svg viewBox="0 0 64 64" aria-hidden="true">
          <rect x="12" y="12" width="40" height="40" rx="10" />
          <path d="M22 24h20M22 32h10M22 40h16" />
          <circle cx="43" cy="32" r="4" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 64 64" aria-hidden="true">
          <path d="M12 20h40v24H12z" />
          <path d="M20 20V12h24v8M24 32h16M32 24v16" />
        </svg>
      );
  }
}

function FeatureCard({ feature, index }) {
  return (
    <motion.article
      className="stats__feature-card"
      initial={{ opacity: 0, y: 36, scale: 0.96, filter: 'blur(10px)' }}
      whileInView={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.24 }}
      transition={{ duration: 0.72, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        event.currentTarget.style.setProperty('--mx', `${x}px`);
        event.currentTarget.style.setProperty('--my', `${y}px`);
      }}
    >
      <div className="stats__feature-icon">
        <Icon type={feature.icon} />
      </div>
      <h3>{feature.title}</h3>
      <p>{feature.description}</p>
      <span className="stats__feature-sheen" aria-hidden="true"></span>
    </motion.article>
  );
}

export default function Stats() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="analytics" className="stats stats--global">
      <div className="stats__bg" aria-hidden="true">
        <div className="stats__gridlines"></div>
        <div className="stats__scanlines"></div>
        <div className="stats__rays"></div>
        <div className="stats__paths">
          <span className="stats__path stats__path--one"></span>
          <span className="stats__path stats__path--two"></span>
          <span className="stats__path stats__path--three"></span>
        </div>
        <div className="stats__coordinates">
          {COORDINATES.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
        <div className="stats__particles">
          {Array.from({ length: 18 }, (_, index) => (
            <span key={index} style={{ '--i': index }}></span>
          ))}
        </div>
      </div>

      <div className="stats__inner stats__inner--global">
        <motion.div
          className="stats__hero stats__hero--global"
          initial={{ opacity: 0, y: 40, filter: 'blur(14px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, amount: 0.45 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="stats__eyebrow-pill">Global Deployment Ready</span>
          <h2 className="stats__title-global">
            AI-Powered Fire Safety Training.
            <br />
            Adapted to Every Language, Region, and Role.
          </h2>
          <p className="stats__lede stats__lede--global">
            FireSafeX is built for organizations operating across multiple countries, languages, industries, and
            compliance frameworks. Deliver localized fire-safety training experiences with multilingual AI guidance,
            region-specific safety content, and customizable training workflows for every type of user.
          </p>
        </motion.div>

        <div className="stats__stage-wrap">
          <motion.div
            className="stats__stage"
            initial={{ opacity: 0, scale: 0.9, y: 36 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="stats__stage-glow"></div>
            <div className="stats__stage-rings">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <div className="stats__stage-beams">
              <span></span>
              <span></span>
            </div>
            <div className="stats__stage-nodes">
              {NODES.map((node, index) => (
                <span key={index} style={{ ...node, '--delay': node.delay }}></span>
              ))}
            </div>
            <div className="stats__stage-panel">
              <motion.video
                className="stats__stage-video"
                src="/assets/videos/global/firesafex-product-video-training.mp4"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                initial={shouldReduceMotion ? false : { scale: 1.04 }}
                whileInView={shouldReduceMotion ? {} : { scale: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
              />
            </div>
          </motion.div>

          <svg className="stats__connections" viewBox="0 0 1200 740" aria-hidden="true">
            <defs>
              <linearGradient id="statsConnection" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="rgba(106,239,255,0)" />
                <stop offset="0.52" stopColor="rgba(106,239,255,0.95)" />
                <stop offset="1" stopColor="rgba(62,126,255,0)" />
              </linearGradient>
            </defs>
            <motion.path
              d="M600 325C484 282 370 242 246 170"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 0.85 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 1.1, delay: 0.2 }}
            />
            <motion.path
              d="M600 325C700 250 846 196 1002 188"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 0.85 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 1.1, delay: 0.34 }}
            />
            <motion.path
              d="M600 325C504 420 382 522 260 596"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 0.85 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 1.1, delay: 0.48 }}
            />
            <motion.path
              d="M600 325C704 414 838 506 988 566"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 0.85 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 1.1, delay: 0.62 }}
            />
            <motion.circle
              cx="600"
              cy="325"
              r="5"
              initial={{ opacity: 0, scale: 0.6 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            />
          </svg>
        </div>

        <div className="stats__grid stats__grid--global">
          {FEATURES.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
