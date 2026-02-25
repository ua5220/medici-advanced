/**
 * Mobile Hamburger Menu — JavaScript
 * ====================================
 * Точка входу: initMobileNav()
 *
 * Елементи:
 *   #mobile-menu-toggle  — кнопка-бургер
 *   #mobile-nav          — overlay з навігацією
 *
 * JS-hooks (без CSS-правил, згідно FRONTEND-CONVENTIONS.md):
 *   .js-nav-toggle   — кнопка-тригер
 *   .js-mobile-nav   — overlay root
 *   .js-nav-backdrop — фоновий overlay
 *   .js-nav-close    — кнопка закриття всередині drawer
 *
 * Стани (CSS-класи, якими керує JS):
 *   .mobile-nav--open          — overlay відкрито
 *   .nav-header__toggle--open  — кнопка в стані «хрест»
 *
 * Доступність:
 *   - aria-expanded на кнопці
 *   - aria-hidden="true" на body при відкритому overlay
 *   - Фокус пастка всередині drawer
 *   - Закриття клавішею Escape
 *   - Відновлення фокусу на кнопці після закриття
 *
 * Використання:
 *   import { initMobileNav } from './mobile-menu.js';
 *   document.addEventListener('DOMContentLoaded', initMobileNav);
 *   // або
 *   document.addEventListener('DOMContentLoaded', () => initMobileNav());
 */

'use strict';

/* =============================================================================
   Константи
   ============================================================================= */
const SELECTORS = {
  toggle: '#mobile-menu-toggle',
  nav: '#mobile-nav',
  backdrop: '.js-nav-backdrop',
  closeBtn: '.js-nav-close',
};

const CLASSES = {
  navOpen: 'mobile-nav--open',
  toggleOpen: 'nav-header__toggle--open',
};

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), ' +
  'select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/* =============================================================================
   initMobileNav()
   ============================================================================= */

/**
 * Ініціалізує мобільне меню.
 * Викликати після DOM-ready.
 *
 * @returns {Function|null} Функція деструктора (знімає всі обробники),
 *                          або null якщо елементи не знайдено.
 */
function initMobileNav() {
  const toggle = document.querySelector(SELECTORS.toggle);
  const nav = document.querySelector(SELECTORS.nav);

  if (!toggle || !nav) {
    return null;
  }

  const backdrop = nav.querySelector(SELECTORS.backdrop);
  const closeBtn = nav.querySelector(SELECTORS.closeBtn);

  /* ------------------------------------------------------------------
     Внутрішній стан
     ------------------------------------------------------------------ */
  let isOpen = false;

  /* ------------------------------------------------------------------
     openMenu / closeMenu
     ------------------------------------------------------------------ */
  function openMenu() {
    isOpen = true;

    nav.removeAttribute('hidden');

    // Невеликий timeout щоб браузер застосував display перед transition
    requestAnimationFrame(() => {
      nav.classList.add(CLASSES.navOpen);
      toggle.classList.add(CLASSES.toggleOpen);
      toggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      trapFocus();
    });
  }

  function closeMenu() {
    isOpen = false;

    nav.classList.remove(CLASSES.navOpen);
    toggle.classList.remove(CLASSES.toggleOpen);
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';

    // Ховаємо overlay після завершення CSS-переходу
    const drawer = nav.querySelector('.mobile-nav__drawer');
    if (drawer) {
      drawer.addEventListener(
        'transitionend',
        () => {
          if (!isOpen) {
            nav.setAttribute('hidden', '');
          }
        },
        { once: true }
      );
    } else {
      nav.setAttribute('hidden', '');
    }

    // Повертаємо фокус на кнопку
    toggle.focus();
  }

  /* ------------------------------------------------------------------
     Toggle
     ------------------------------------------------------------------ */
  function toggleMenu() {
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  /* ------------------------------------------------------------------
     Focus trap
     ------------------------------------------------------------------ */
  function trapFocus() {
    const focusable = Array.from(nav.querySelectorAll(FOCUSABLE)).filter(
      (el) => !el.closest('[hidden]')
    );

    if (!focusable.length) return;

    // Перемістити фокус на перший елемент drawer
    focusable[0].focus();

    function handleTab(e) {
      if (e.key !== 'Tab') return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    nav.addEventListener('keydown', handleTab);

    // Знімаємо обробник при закритті
    nav.addEventListener(
      'keydown',
      function removeTrap(e) {
        if (!isOpen) {
          nav.removeEventListener('keydown', handleTab);
          nav.removeEventListener('keydown', removeTrap);
        }
      },
      { passive: true }
    );
  }

  /* ------------------------------------------------------------------
     Event listeners
     ------------------------------------------------------------------ */
  // Кнопка-бургер
  toggle.addEventListener('click', toggleMenu);

  // Кнопка закриття всередині drawer
  if (closeBtn) {
    closeBtn.addEventListener('click', closeMenu);
  }

  // Клік по backdrop
  if (backdrop) {
    backdrop.addEventListener('click', closeMenu);
  }

  // Клавіша Escape
  function handleKeydown(e) {
    if (e.key === 'Escape' && isOpen) {
      closeMenu();
    }
  }
  document.addEventListener('keydown', handleKeydown);

  // Закриття при ресайзі на desktop (> 1024px)
  const mq = window.matchMedia('(min-width: 1024px)');
  function handleResize(e) {
    if (e.matches && isOpen) {
      closeMenu();
    }
  }
  mq.addEventListener('change', handleResize);

  /* ------------------------------------------------------------------
     Деструктор — для SSR/SPA або hot-reload
     ------------------------------------------------------------------ */
  function destroy() {
    toggle.removeEventListener('click', toggleMenu);
    if (closeBtn) closeBtn.removeEventListener('click', closeMenu);
    if (backdrop) backdrop.removeEventListener('click', closeMenu);
    document.removeEventListener('keydown', handleKeydown);
    mq.removeEventListener('change', handleResize);

    if (isOpen) {
      closeMenu();
    }
  }

  return destroy;
}

/* =============================================================================
   Export
   ============================================================================= */
// ES-модуль
export { initMobileNav };

// UMD / глобальний fallback для WordPress (без збірника)
if (typeof window !== 'undefined') {
  window.initMobileNav = initMobileNav;
}
