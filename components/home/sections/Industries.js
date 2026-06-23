'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

const SECTORS = [
  {
    num: '01',
    name: 'Corporate',
    desc: 'Offices, HQs, coworking floors',
    copy:
      'Employees rehearse office-specific hazards such as overloaded power strips, server-rack equipment failures, and breakroom fires inside familiar workplace layouts without live discharge or cleanup.',
    accent: '#ff8a3d',
    metric: '820+',
    metricLabel: 'teams onboarded',
    signal: 'office response scenarios',
  },
  {
    num: '02',
    name: 'Industrial',
    desc: 'Plants, factories, warehouses',
    copy:
      'Teams practice machinery fires, flammable-dust ignition, and production-floor response in repeatable high-pressure drills that build muscle memory without downtime.',
    accent: '#ff5a1f',
    metric: '24/7',
    metricLabel: 'shift-ready drills',
    signal: 'production-floor readiness',
  },
  {
    num: '03',
    name: 'Aviation',
    desc: 'Airports, cabins, hangars',
    copy:
      'Cabin crew and ground staff train for galley, engine, and cargo-hold incidents inside realistic layouts where protocol, speed, and coordination matter.',
    accent: '#ffb15a',
    metric: '3D',
    metricLabel: 'cabin scenarios',
    signal: 'cabin and ground coordination',
  },
  {
    num: '04',
    name: 'Maritime',
    desc: 'Ships, ports, offshore rigs',
    copy:
      'Crews prepare for engine-room blazes, fuel leaks, and confined-space fire response in environments where live training carries major operational risk.',
    accent: '#ff7033',
    metric: '0',
    metricLabel: 'live-burn risk',
    signal: 'confined-space emergency drills',
  },
  {
    num: '05',
    name: 'Energy',
    desc: 'Power, oil, gas, utilities',
    copy:
      'Technicians can rehearse arc-flash, turbine, and fuel-related emergency scenarios that are too dangerous and too disruptive to stage as live exercises.',
    accent: '#ffc168',
    metric: 'MR',
    metricLabel: 'field simulation',
    signal: 'high-risk field operations',
  },
  {
    num: '06',
    name: 'Education',
    desc: 'Schools, campuses, labs',
    copy:
      'Staff, students, and campus teams gain hands-on fire response practice across classrooms, dormitories, and laboratory settings with measurable outcomes.',
    accent: '#ff9452',
    metric: '100%',
    metricLabel: 'repeatable practice',
    signal: 'campus-wide readiness',
  },
];

export default function Industries() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = SECTORS[activeIndex];

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
          <p className="eyebrow">Industries / use cases</p>
          <h2 className="title">Built for every industry.</h2>
          <p className="big center industries-section__intro">
            FireSafeX adapts one premium fire-safety training platform to the environments where realism, repeatability,
            and measurable response practice matter most.
          </p>
        </motion.div>

        <div className="industries-spotlight">
          <div className="industries-spotlight__rail">
            {SECTORS.map((sector, index) => (
              <button
                key={sector.num}
                type="button"
                className={`ind ind--selector ${activeIndex === index ? 'is-active' : ''}`}
                onMouseEnter={() => setActiveIndex(index)}
                onFocus={() => setActiveIndex(index)}
                onClick={() => setActiveIndex(index)}
              >
                <span className="ind__index">{sector.num}</span>
                <span className="ind__title">{sector.name}</span>
                <span className="ind__signal">{sector.signal}</span>
              </button>
            ))}
          </div>

          <motion.div
            key={active.name}
            className="industries-spotlight__stage"
            initial={{ opacity: 0, y: 24, scale: 0.985, filter: 'blur(14px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="industries-spotlight__panel">
              <div className="industries-spotlight__panel-top">
                <span className="industries-spotlight__pill">{active.desc}</span>
                <span className="industries-spotlight__num">{active.num}</span>
              </div>

              <div className="industries-spotlight__title-wrap">
                <span className="industries-spotlight__ghost" aria-hidden="true">
                  {active.name}
                </span>
                <h3>{active.name}</h3>
              </div>

              <p className="industries-spotlight__copy">{active.copy}</p>

              <div className="industries-spotlight__metrics">
                <div className="industries-spotlight__metric">
                  <b>{active.metric}</b>
                  <span>{active.metricLabel}</span>
                </div>
                <div className="industries-spotlight__trace" aria-hidden="true">
                  <i></i>
                  <i></i>
                  <i></i>
                  <i></i>
                </div>
              </div>

              <div className="industries-spotlight__orbits" aria-hidden="true">
                <span className="industries-spotlight__orbit industries-spotlight__orbit--1"></span>
                <span className="industries-spotlight__orbit industries-spotlight__orbit--2"></span>
                <span className="industries-spotlight__orbit industries-spotlight__orbit--3"></span>
                <span className="industries-spotlight__node industries-spotlight__node--1"></span>
                <span className="industries-spotlight__node industries-spotlight__node--2"></span>
                <span className="industries-spotlight__node industries-spotlight__node--3"></span>
              </div>
            </div>

            <div className="industries-spotlight__sidebar" aria-hidden="true">
              {SECTORS.map((sector, index) => (
                <span
                  key={sector.num}
                  className={`industries-spotlight__mini ${activeIndex === index ? 'is-active' : ''}`}
                >
                  {sector.name}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
