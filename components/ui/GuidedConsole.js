'use client';

import { useRef } from 'react';

export default function GuidedConsole({
  idPrefix,
  ariaLabel,
  items,
  activeIndex,
  onChange,
  className = '',
  getTabAriaLabel,
  renderTab,
  renderPanel,
  containerRef,
  interactionProps,
  autoAdvance,
}) {
  const tabListRef = useRef(null);

  const select = (index, moveFocus = false) => {
    const nextIndex = (index + items.length) % items.length;
    onChange(nextIndex);
    if (moveFocus) {
      requestAnimationFrame(() => {
        tabListRef.current?.querySelectorAll('[role="tab"]')[nextIndex]?.focus();
      });
    }
  };

  const handleKeyDown = (event, index) => {
    const targets = {
      ArrowRight: index + 1,
      ArrowDown: index + 1,
      ArrowLeft: index - 1,
      ArrowUp: index - 1,
      Home: 0,
      End: items.length - 1,
    };
    if (!(event.key in targets)) return;
    event.preventDefault();
    select(targets[event.key], true);
  };

  return (
    <div
      className={`guided-console ${className}`.trim()}
      ref={containerRef}
      {...interactionProps}
    >
      <div className="guided-console__tabs" ref={tabListRef} role="tablist" aria-label={ariaLabel}>
        {items.map((item, index) => {
          const isActive = activeIndex === index;
          return (
            <button
              key={item.id || item.title || index}
              type="button"
              role="tab"
              id={`${idPrefix}-tab-${index}`}
              aria-controls={`${idPrefix}-panel-${index}`}
              aria-selected={isActive}
              aria-label={getTabAriaLabel?.(item, index)}
              tabIndex={isActive ? 0 : -1}
              className={`guided-console__tab ${isActive ? 'is-active' : ''}`}
              onClick={() => select(index)}
              onKeyDown={(event) => handleKeyDown(event, index)}
            >
              {renderTab(item, index, isActive)}
            </button>
          );
        })}
      </div>

      {autoAdvance ? (
        <div className="guided-console__autoplay">
          <span
            key={autoAdvance.progressKey}
            className={autoAdvance.isPaused ? 'is-paused' : ''}
            style={{ '--console-cycle-duration': `${autoAdvance.intervalMs}ms` }}
            aria-hidden="true"
          ></span>
          <button
            type="button"
            onClick={autoAdvance.onToggle}
            aria-label={autoAdvance.isUserPaused ? `Resume automatic ${ariaLabel}` : `Pause automatic ${ariaLabel}`}
            aria-pressed={autoAdvance.isUserPaused}
          >
            <i aria-hidden="true">{autoAdvance.isUserPaused ? '▶' : 'Ⅱ'}</i>
            <small>{autoAdvance.isUserPaused ? 'Play' : 'Auto'}</small>
          </button>
        </div>
      ) : null}

      <div className="guided-console__panels">
        {items.map((item, index) => {
          const isActive = activeIndex === index;
          return (
            <section
              key={item.id || item.title || index}
              id={`${idPrefix}-panel-${index}`}
              role="tabpanel"
              aria-labelledby={`${idPrefix}-tab-${index}`}
              className={`guided-console__panel ${isActive ? 'is-active' : ''}`}
              hidden={!isActive}
            >
              {renderPanel(item, index, isActive)}
            </section>
          );
        })}
      </div>
    </div>
  );
}
