'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const SECTORS = [
  {
    num: '01',
    name: 'Corporate',
    desc: 'Offices, HQs, coworking floors',
    copy:
      'Employees rehearse office-specific hazards such as overloaded power strips, server-rack equipment failures, and breakroom fires inside familiar workplace layouts without live discharge or cleanup.',
    accent: '#ff8a3d',
    metric: 'OFFICE',
    metricLabel: 'workplace scenarios',
    signal: 'office response scenarios',
    icon: 'corporate',
    scenarios: ['Electrical loads', 'Server rooms', 'Breakrooms'],
  },
  {
    num: '02',
    name: 'Industrial',
    desc: 'Plants, factories, warehouses',
    copy:
      'Teams practice machinery fires, flammable-dust ignition, and production-floor response in repeatable high-pressure drills that build muscle memory without downtime.',
    accent: '#ff5a1f',
    metric: 'PLANT',
    metricLabel: 'operational settings',
    signal: 'production-floor readiness',
    icon: 'industrial',
    scenarios: ['Machinery', 'Combustible dust', 'Production floors'],
  },
  {
    num: '03',
    name: 'Aviation',
    desc: 'Airports, cabins, hangars',
    copy:
      'Cabin crew and ground staff train for galley, engine, and cargo-hold incidents inside realistic layouts where protocol, speed, and coordination matter.',
    accent: '#ffb15a',
    metric: 'AIR',
    metricLabel: 'aviation contexts',
    signal: 'cabin and ground coordination',
    icon: 'aviation',
    scenarios: ['Galley', 'Engine', 'Cargo hold'],
  },
  {
    num: '04',
    name: 'Maritime',
    desc: 'Ships, ports, offshore rigs',
    copy:
      'Crews prepare for engine-room blazes, fuel leaks, and confined-space fire response in environments where live training carries major operational risk.',
    accent: '#ff7033',
    metric: 'SEA',
    metricLabel: 'maritime contexts',
    signal: 'confined-space emergency drills',
    icon: 'maritime',
    scenarios: ['Engine room', 'Fuel leak', 'Confined space'],
  },
  {
    num: '05',
    name: 'Energy',
    desc: 'Power, oil, gas, utilities',
    copy:
      'Technicians can rehearse arc-flash, turbine, and fuel-related emergency scenarios that are too dangerous and too disruptive to stage as live exercises.',
    accent: '#ffc168',
    metric: 'FIELD',
    metricLabel: 'energy operations',
    signal: 'high-risk field operations',
    icon: 'energy',
    scenarios: ['Arc flash', 'Turbine', 'Fuel systems'],
  },
  {
    num: '06',
    name: 'Education',
    desc: 'Schools, campuses, labs',
    copy:
      'Staff, students, and campus teams gain hands-on fire response practice across classrooms, dormitories, and laboratory settings with measurable outcomes.',
    accent: '#ff9452',
    metric: 'CAMPUS',
    metricLabel: 'education settings',
    signal: 'campus-wide readiness',
    icon: 'education',
    scenarios: ['Classroom', 'Dormitory', 'Laboratory'],
  },
];

function IndustryIcon({ type }) {
  const common = { fill: 'none', stroke: 'currentColor', strokeWidth: '1.7', strokeLinecap: 'round', strokeLinejoin: 'round' };
  if (type === 'industrial') return <svg viewBox="0 0 64 64" aria-hidden="true" {...common}><path d="M8 52V27l16 8V24l16 9V14h10v38z"/><path d="M15 52V42h8v10M31 52V41h8v11M40 14h10M44 9h6"/></svg>;
  if (type === 'aviation') return <svg viewBox="0 0 64 64" aria-hidden="true" {...common}><path d="M8 35l19-6 9-18 6 2-4 18 15 5c4 1 5 5 2 7l-18-2-8 13-5-1 2-14-14 1z"/></svg>;
  if (type === 'maritime') return <svg viewBox="0 0 64 64" aria-hidden="true" {...common}><path d="M8 38h48l-6 13H16zM20 38V23h24v15M27 23V14h10v9"/><path d="M9 55c5 3 10 3 15 0 5 3 11 3 16 0 5 3 10 3 15 0"/></svg>;
  if (type === 'energy') return <svg viewBox="0 0 64 64" aria-hidden="true" {...common}><path d="M36 7L17 35h13l-3 22 20-31H34z"/><circle cx="32" cy="32" r="27"/></svg>;
  if (type === 'education') return <svg viewBox="0 0 64 64" aria-hidden="true" {...common}><path d="M7 25l25-13 25 13-25 13zM15 31v16c10 7 24 7 34 0V31M55 27v18"/></svg>;
  return <svg viewBox="0 0 64 64" aria-hidden="true" {...common}><path d="M12 54V18h28v36M40 30h12v24M20 27h5M31 27h3M20 36h5M31 36h3M20 45h5M31 45h3M7 54h50"/></svg>;
}

export default function Industries() {
  const [activeIndex, setActiveIndex] = useState(0);
  const tabListRef = useRef(null);
  const active = SECTORS[activeIndex];

  useEffect(() => {
    if (window.innerWidth > 640) return;
    const list = tabListRef.current;
    const tab = list?.querySelectorAll('[role="tab"]')[activeIndex];
    if (!list || !tab) return;
    list.scrollTo({
      left: Math.max(0, tab.offsetLeft - (list.clientWidth - tab.clientWidth) / 2),
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    });
  }, [activeIndex]);

  const selectIndustry = (index) => setActiveIndex(((index % SECTORS.length) + SECTORS.length) % SECTORS.length);

  const handleTabKeyDown = (event, index) => {
    const keyTargets = {
      ArrowRight: index + 1,
      ArrowDown: index + 1,
      ArrowLeft: index - 1,
      ArrowUp: index - 1,
      Home: 0,
      End: SECTORS.length - 1,
    };
    if (!(event.key in keyTargets)) return;
    event.preventDefault();
    const nextIndex = ((keyTargets[event.key] % SECTORS.length) + SECTORS.length) % SECTORS.length;
    selectIndustry(nextIndex);
    window.requestAnimationFrame(() => {
      tabListRef.current?.querySelectorAll('[role="tab"]')[nextIndex]?.focus();
    });
  };

  return (
    <section id="industries" className="industries-section" style={{ '--industry-accent': active.accent }}>
      <div className="industries-section__ambient" aria-hidden="true">
        <span className="industries-section__glow industries-section__glow--1"></span>
        <span className="industries-section__glow industries-section__glow--2"></span>
        <span className="industries-section__gridline"></span>
        <span className="industries-section__beam industries-section__beam--1"></span>
        <span className="industries-section__beam industries-section__beam--2"></span>
      </div>

      <div className="industries-section__inner">
        <motion.div
          className="industries-section__hero"
          initial={{ opacity: 0, y: 36, filter: 'blur(12px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="industries-section__hero-top">
            <span className="industries-section__micro">Practical MR training</span>
            <span className="industries-section__micro">AI assessment</span>
            <span className="industries-section__micro">Enterprise deployment</span>
          </div>
          <p className="eyebrow">Fire safety training by industry</p>
          <h2 className="title">Built for every industry.</h2>
          <p className="big center industries-section__intro">
            Apply the connected FireSafeX training workflow to different operating environments while keeping practical
            assessment, records, and program visibility consistent.
          </p>
        </motion.div>

        <div className="industries-spotlight">
          <div ref={tabListRef} className="industries-spotlight__rail" role="tablist" aria-label="Industries">
            {SECTORS.map((sector, index) => (
              <button
                key={sector.num}
                type="button"
                role="tab"
                id={`industry-tab-${index}`}
                aria-controls="industry-panel"
                aria-selected={activeIndex === index}
                tabIndex={activeIndex === index ? 0 : -1}
                className={`ind ind--selector ${activeIndex === index ? 'is-active' : ''}`}
                onFocus={() => selectIndustry(index)}
                onClick={() => selectIndustry(index)}
                onKeyDown={(event) => handleTabKeyDown(event, index)}
              >
                <span className="ind__index">{sector.num}</span>
                <span className="ind__title">{sector.name}</span>
                <span className="ind__signal">{sector.signal}</span>
              </button>
            ))}
          </div>

          <motion.div
            key={active.name}
            id="industry-panel"
            role="tabpanel"
            tabIndex={0}
            aria-labelledby={`industry-tab-${activeIndex}`}
            className="industries-spotlight__stage"
            initial={{ opacity: 0, y: 24, scale: 0.985, filter: 'blur(14px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="industries-spotlight__panel">
              <div className="industries-spotlight__content">
                <div className="industries-spotlight__panel-top">
                  <span className="industries-spotlight__pill">{active.desc}</span>
                  <span className="industries-spotlight__num">{active.num} / {String(SECTORS.length).padStart(2, '0')}</span>
                </div>

                <div className="industries-spotlight__title-wrap"><h3>{active.name}</h3></div>
                <p className="industries-spotlight__copy">{active.copy}</p>

                <div className="industries-spotlight__scenarios" aria-label={`${active.name} training scenarios`}>
                  {active.scenarios.map((scenario) => <span key={scenario}>{scenario}</span>)}
                </div>
              </div>

              <div className="industries-spotlight__visual" aria-hidden="true">
                <span className="industries-spotlight__visual-ring"></span>
                <div className="industries-spotlight__icon"><IndustryIcon type={active.icon} /></div>
                <div className="industries-spotlight__metric">
                  <b>{active.metric}</b>
                  <span>{active.metricLabel}</span>
                </div>
                <small>{active.signal}</small>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
