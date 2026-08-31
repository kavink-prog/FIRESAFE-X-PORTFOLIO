'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';
import { STORY_META, STORY_SECTIONS } from '@/data/story-content';

const INITIAL_FORM = {
  fullName: '',
  company: '',
  email: '',
  phone: '',
  participants: '',
  trainingDate: '',
  requirements: '',
};

const REQUIRED_LABELS = {
  fullName: 'Full Name',
  company: 'Company / Organization Name',
  email: 'Email Address',
  phone: 'Phone Number',
  participants: 'Number of Participants',
  trainingDate: 'Preferred Training Date',
  requirements: 'Message / Requirements',
};

export default function BookDemoModal() {
  const closeTimerRef = useRef(null);
  const panelRef = useRef(null);
  const triggerRef = useRef(null);
  const [isRendered, setIsRendered] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});

  const minDate = useMemo(() => new Date().toISOString().split('T')[0], []);
  const convex = useMemo(() => {
    const url = process.env.NEXT_PUBLIC_CONVEX_URL;
    return url ? new ConvexHttpClient(url) : null;
  }, []);

  const closing = STORY_SECTIONS.at(-1);

  const openModal = (trigger) => {
    window.clearTimeout(closeTimerRef.current);
    triggerRef.current = trigger ?? document.activeElement;
    setIsRendered(true);
    requestAnimationFrame(() => setIsOpen(true));
  };

  const closeModal = () => {
    setIsOpen(false);
    window.clearTimeout(closeTimerRef.current);
    closeTimerRef.current = window.setTimeout(() => {
      setIsRendered(false);
      setIsSubmitting(false);
      setSubmitError('');
      setErrors({});
      triggerRef.current?.focus?.();
    }, 280);
  };

  useEffect(() => {
    const handleTriggerClick = (event) => {
      const trigger = event.target.closest('[data-book-demo]');
      if (!trigger) return;

      event.preventDefault();
      openModal(trigger);
    };

    document.addEventListener('click', handleTriggerClick);

    return () => {
      document.removeEventListener('click', handleTriggerClick);
      window.clearTimeout(closeTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) return undefined;

    const panel = panelRef.current;
    const focusableSelector =
      'button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), a[href]';
    panel?.querySelector(focusableSelector)?.focus();

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeModal();
        return;
      }
      if (event.key !== 'Tab' || !panel) return;

      const focusable = [...panel.querySelectorAll(focusableSelector)];
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable.at(-1);

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (!isRendered) return undefined;

    const html = document.documentElement;
    const previousOverflow = document.body.style.overflow;
    const previousHtmlOverflow = html.style.overflow;

    document.body.style.overflow = 'hidden';
    html.style.overflow = 'hidden';

    return () => {
      html.style.overflow = previousHtmlOverflow;
      document.body.style.overflow = previousOverflow;
    };
  }, [isRendered]);

  const validateForm = () => {
    const nextErrors = {};

    Object.entries(REQUIRED_LABELS).forEach(([key, label]) => {
      if (!String(form[key]).trim()) {
        nextErrors[key] = `${label} is required.`;
      }
    });

    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = 'Enter a valid email address.';
    }

    const digits = form.phone.replace(/\D/g, '');
    if (form.phone && digits.length < 8) {
      nextErrors.phone = 'Enter a valid phone number.';
    }

    if (form.participants && Number(form.participants) < 1) {
      nextErrors.participants = 'Participants must be at least 1.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => {
      if (!current[name]) return current;
      const next = { ...current };
      delete next[name];
      return next;
    });
    setSubmitError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitSuccess(false);
    setSubmitError('');

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      if (!convex) throw new Error('BOOKING_SERVICE_UNAVAILABLE');
      await convex.mutation(api.demoRequests.create, {
        fullName: form.fullName.trim(),
        company: form.company.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        participants: Number(form.participants),
        trainingDate: form.trainingDate,
        requirements: form.requirements.trim(),
        source: 'firesafex.ai homepage',
      });
      setSubmitSuccess(true);
      setForm(INITIAL_FORM);
      setErrors({});
    } catch (_) {
      setSubmitError('We could not send your request. Please try again or email hello@firesafex.ai.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isRendered) return null;

  return (
    <div
      className={`book-demo-modal ${isOpen ? 'is-open' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="book-demo-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) closeModal();
      }}
    >
      <div className="book-demo-modal__backdrop" aria-hidden="true" onMouseDown={closeModal}></div>
      <div
        className="book-demo-modal__panel"
        ref={panelRef}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button type="button" className="book-demo-modal__close" onClick={closeModal} aria-label="Close booking form">
          <span></span>
          <span></span>
        </button>

        <div className="book-demo-modal__intro">
          <p className="eyebrow">{STORY_META.cta}</p>
          <h2 id="book-demo-title">{closing.title}</h2>
          <p>{closing.subtitle}</p>
          <p>{closing.body}</p>
        </div>

        <form className="book-demo-modal__form" noValidate onSubmit={handleSubmit}>
          <label className="book-demo-modal__field">
            <span>Full Name</span>
            <input
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              aria-invalid={Boolean(errors.fullName)}
            />
            {errors.fullName ? <small>{errors.fullName}</small> : null}
          </label>

          <label className="book-demo-modal__field">
            <span>Company / Organization Name</span>
            <input
              type="text"
              name="company"
              value={form.company}
              onChange={handleChange}
              placeholder="Enter your company or organization"
              aria-invalid={Boolean(errors.company)}
            />
            {errors.company ? <small>{errors.company}</small> : null}
          </label>

          <label className="book-demo-modal__field">
            <span>Email Address</span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email address"
              aria-invalid={Boolean(errors.email)}
            />
            {errors.email ? <small>{errors.email}</small> : null}
          </label>

          <label className="book-demo-modal__field">
            <span>Phone Number</span>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
              aria-invalid={Boolean(errors.phone)}
            />
            {errors.phone ? <small>{errors.phone}</small> : null}
          </label>

          <label className="book-demo-modal__field">
            <span>Number of Participants</span>
            <input
              type="number"
              name="participants"
              min="1"
              value={form.participants}
              onChange={handleChange}
              placeholder="Enter expected participants"
              aria-invalid={Boolean(errors.participants)}
            />
            {errors.participants ? <small>{errors.participants}</small> : null}
          </label>

          <label className="book-demo-modal__field">
            <span>Preferred Training Date</span>
            <input
              type="date"
              name="trainingDate"
              min={minDate}
              value={form.trainingDate}
              onChange={handleChange}
              aria-invalid={Boolean(errors.trainingDate)}
            />
            {errors.trainingDate ? <small>{errors.trainingDate}</small> : null}
          </label>

          <label className="book-demo-modal__field book-demo-modal__field--full">
            <span>Message / Requirements</span>
            <textarea
              name="requirements"
              rows="5"
              value={form.requirements}
              onChange={handleChange}
              placeholder="Tell us about your training goals, locations, or program requirements"
              aria-invalid={Boolean(errors.requirements)}
            ></textarea>
            {errors.requirements ? <small>{errors.requirements}</small> : null}
          </label>

          <div className="book-demo-modal__footer book-demo-modal__field--full">
            <div className="book-demo-modal__status" aria-live="polite">
              {submitSuccess ? (
                <p className="book-demo-modal__status-success">
                  Your demo request has been sent. Our team will contact you shortly.
                </p>
              ) : null}
              {submitError ? <p className="book-demo-modal__status-error">{submitError}</p> : null}
            </div>

            <button type="submit" className="btn btn--blue" disabled={isSubmitting}>
              {isSubmitting ? 'Sending Request...' : closing.cta}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
