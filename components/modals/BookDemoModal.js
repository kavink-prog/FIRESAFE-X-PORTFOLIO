'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

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
  fullName: 'Full name',
  company: 'Company / organisation',
  email: 'Email address',
  phone: 'Phone number',
  participants: 'Number of participants',
  trainingDate: 'Preferred training date',
  requirements: 'Training requirements',
};

const FIELD_LIMITS = {
  fullName: 120,
  company: 200,
  email: 254,
  phone: 40,
  requirements: 4000,
};

function getLocalDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function validateField(name, value, minDate) {
  const text = String(value).trim();
  if (!text) return `${REQUIRED_LABELS[name]} is required.`;

  if (FIELD_LIMITS[name] && text.length > FIELD_LIMITS[name]) {
    return `${REQUIRED_LABELS[name]} must be ${FIELD_LIMITS[name]} characters or fewer.`;
  }

  if (name === 'fullName' && !/[\p{L}\p{N}]/u.test(text)) {
    return 'Enter a valid full name.';
  }
  if (name === 'company' && !/[\p{L}\p{N}]/u.test(text)) {
    return 'Enter a valid company or organisation.';
  }
  if (name === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)) {
    return 'Enter a valid email address.';
  }
  if (name === 'phone') {
    const digits = text.replace(/\D/g, '');
    if (!/^[+\d().\-\s]+$/.test(text) || digits.length < 8 || digits.length > 15) {
      return 'Enter a valid phone number with 8 to 15 digits.';
    }
  }
  if (name === 'participants') {
    if (!/^\d+$/.test(text) || Number(text) < 1 || Number(text) > 100000) {
      return 'Participants must be a whole number between 1 and 100,000.';
    }
  }
  if (name === 'trainingDate') {
    const date = new Date(`${text}T00:00:00Z`);
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(text) ||
      !Number.isFinite(date.getTime()) ||
      date.toISOString().slice(0, 10) !== text
    ) {
      return 'Enter a valid training date.';
    }
    if (text < minDate) return 'Training date cannot be in the past.';
  }

  return '';
}

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

  const minDate = useMemo(getLocalDate, []);

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
      requestAnimationFrame(() => triggerRef.current?.focus?.());
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
    const site = document.querySelector('.fx-site');
    const previousInert = site?.inert;
    if (site) site.inert = true;
    const previousOverflow = document.body.style.overflow;
    const previousHtmlOverflow = html.style.overflow;

    document.body.style.overflow = 'hidden';
    html.style.overflow = 'hidden';

    return () => {
      if (site) site.inert = previousInert;
      html.style.overflow = previousHtmlOverflow;
      document.body.style.overflow = previousOverflow;
    };
  }, [isRendered]);

  const validateForm = () => {
    const nextErrors = {};

    Object.keys(REQUIRED_LABELS).forEach((key) => {
      const error = validateField(key, form[key], minDate);
      if (error) nextErrors[key] = error;
    });

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

  const handleBlur = (event) => {
    const { name, value } = event.target;
    const error = validateField(name, value, minDate);
    setErrors((current) => {
      const next = { ...current };
      if (error) next[name] = error;
      else delete next[name];
      return next;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitSuccess(false);
    setSubmitError('');

    if (!validateForm()) {
      requestAnimationFrame(() =>
        panelRef.current?.querySelector('[aria-invalid="true"]')?.focus(),
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const url = process.env.NEXT_PUBLIC_CONVEX_URL;
      if (!url) throw new Error('BOOKING_SERVICE_UNAVAILABLE');
      const [{ ConvexHttpClient }, { api }] = await Promise.all([
        import('convex/browser'),
        import('@/convex/_generated/api'),
      ]);
      const convex = new ConvexHttpClient(url);
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
      setSubmitError(
        'We could not send your request. Please try again or email hello@firesafex.ai.',
      );
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
      <div
        className="book-demo-modal__backdrop"
        aria-hidden="true"
        onMouseDown={closeModal}
      ></div>
      <div
        className="book-demo-modal__panel"
        ref={panelRef}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="book-demo-modal__close"
          onClick={closeModal}
          aria-label="Close booking form"
        >
          <span></span>
          <span></span>
        </button>

        <div className="book-demo-modal__intro">
          <p className="book-demo-modal__label">Book a live demo</p>
          <h2 id="book-demo-title">Let’s plan your live demo.</h2>
          <p>Bring FireSafeX to your workplace. Tell us about your team and we’ll help you explore the training experience.</p>
          <small>All fields are required.</small>
        </div>

        <form
          className="book-demo-modal__form"
          noValidate
          onSubmit={handleSubmit}
        >
          <label className="book-demo-modal__field">
            <span>Full name</span>
            <input
              type="text"
              name="fullName"
              autoComplete="name"
              required
              maxLength={FIELD_LIMITS.fullName}
              value={form.fullName}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter your full name"
              aria-invalid={Boolean(errors.fullName)}
              aria-describedby={
                errors.fullName ? 'demo-fullName-error' : undefined
              }
            />
            {errors.fullName ? (
              <small id="demo-fullName-error">{errors.fullName}</small>
            ) : null}
          </label>

          <label className="book-demo-modal__field">
            <span>Company / organisation</span>
            <input
              type="text"
              name="company"
              autoComplete="organization"
              required
              maxLength={FIELD_LIMITS.company}
              value={form.company}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter your company or organization"
              aria-invalid={Boolean(errors.company)}
              aria-describedby={
                errors.company ? 'demo-company-error' : undefined
              }
            />
            {errors.company ? (
              <small id="demo-company-error">{errors.company}</small>
            ) : null}
          </label>

          <label className="book-demo-modal__field">
            <span>Email address</span>
            <input
              type="email"
              spellCheck={false}
              name="email"
              autoComplete="email"
              required
              maxLength={FIELD_LIMITS.email}
              value={form.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter your email address"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'demo-email-error' : undefined}
            />
            {errors.email ? (
              <small id="demo-email-error">{errors.email}</small>
            ) : null}
          </label>

          <label className="book-demo-modal__field">
            <span>Phone number</span>
            <input
              type="tel"
              name="phone"
              autoComplete="tel"
              required
              maxLength={FIELD_LIMITS.phone}
              value={form.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter your phone number"
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={errors.phone ? 'demo-phone-error' : undefined}
            />
            {errors.phone ? (
              <small id="demo-phone-error">{errors.phone}</small>
            ) : null}
          </label>

          <label className="book-demo-modal__field">
            <span>Number of participants</span>
            <input
              type="number"
              name="participants"
              inputMode="numeric"
              autoComplete="off"
              required
              min="1"
              max="100000"
              step="1"
              value={form.participants}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter expected participants"
              aria-invalid={Boolean(errors.participants)}
              aria-describedby={
                errors.participants ? 'demo-participants-error' : undefined
              }
            />
            {errors.participants ? (
              <small id="demo-participants-error">{errors.participants}</small>
            ) : null}
          </label>

          <label className="book-demo-modal__field">
            <span>Preferred training date</span>
            <input
              type="date"
              name="trainingDate"
              autoComplete="off"
              required
              min={minDate}
              value={form.trainingDate}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-invalid={Boolean(errors.trainingDate)}
              aria-describedby={
                errors.trainingDate ? 'demo-trainingDate-error' : undefined
              }
            />
            {errors.trainingDate ? (
              <small id="demo-trainingDate-error">{errors.trainingDate}</small>
            ) : null}
          </label>

          <label className="book-demo-modal__field book-demo-modal__field--full">
            <span>Training requirements</span>
            <textarea
              name="requirements"
              autoComplete="off"
              required
              maxLength={FIELD_LIMITS.requirements}
              rows="3"
              value={form.requirements}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Tell us about your training goals, locations, or program requirements"
              aria-invalid={Boolean(errors.requirements)}
              aria-describedby={
                errors.requirements ? 'demo-requirements-error' : undefined
              }
            ></textarea>
            {errors.requirements ? (
              <small id="demo-requirements-error">{errors.requirements}</small>
            ) : null}
          </label>

          <div className="book-demo-modal__footer book-demo-modal__field--full">
            <div className="book-demo-modal__status" aria-live="polite">
              {submitSuccess ? (
                <p className="book-demo-modal__status-success">
                  Your demo request has been sent. Our team will contact you
                  shortly.
                </p>
              ) : null}
              {submitError ? (
                <p className="book-demo-modal__status-error">{submitError}</p>
              ) : null}
            </div>

            <button
              type="submit"
              className="fx-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending request…' : 'Book a live demo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
