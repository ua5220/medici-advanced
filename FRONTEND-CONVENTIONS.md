# Frontend Conventions — Medici Agency

> **Мета:** Консистентність CSS/JS коду та чітке розділення styling vs behavior.
> **Версія:** 1.0.0

---

## 🎯 BEM Naming Convention

### Формат

```
.block {}
.block__element {}
.block--modifier {}
.block__element--modifier {}
```

### Правила

| Правило | Приклад ✅ | Антипатерн ❌ |
|---------|-----------|---------------|
| Block = компонент | `.card` | `.cardComponent` |
| Element = частина block | `.card__title` | `.card-title`, `.cardTitle` |
| Modifier = варіант | `.card--featured` | `.card.featured`, `.card-featured` |
| Lowercase + hyphens | `.blog-card` | `.blogCard`, `.BlogCard` |
| Max 2 рівні вкладеності | `.card__header` | `.card__header__title__text` |

### Приклади для Medici

```css
/* ✅ ПРАВИЛЬНО: BEM */
.lead-form {}
.lead-form__input {}
.lead-form__input--error {}
.lead-form__submit {}
.lead-form__submit--loading {}
.lead-form--compact {}

/* ❌ НЕПРАВИЛЬНО: Хаотичний naming */
.leadForm {}
.lead-form-input {}
.lead-form .input.error {}
.submitBtn {}
```

### Компоненти Medici (стандартизація)

```css
/* Navigation */
.nav-header {}
.nav-header__logo {}
.nav-header__menu {}
.nav-header__item {}
.nav-header__item--active {}
.nav-header--sticky {}

/* Cards */
.service-card {}
.service-card__icon {}
.service-card__title {}
.service-card__description {}
.service-card--featured {}

/* Blog */
.blog-card {}
.blog-card__image {}
.blog-card__meta {}
.blog-card__title {}
.blog-card__excerpt {}
.blog-card--horizontal {}

/* Lead Form */
.lead-form {}
.lead-form__field {}
.lead-form__label {}
.lead-form__input {}
.lead-form__input--error {}
.lead-form__error-message {}
.lead-form__submit {}
.lead-form__submit--loading {}
.lead-form--inline {}

/* Hero */
.hero-section {}
.hero-section__content {}
.hero-section__title {}
.hero-section__subtitle {}
.hero-section__cta {}
.hero-section--fullscreen {}

/* Footer */
.site-footer {}
.site-footer__column {}
.site-footer__nav {}
.site-footer__social {}
.site-footer__copyright {}
```

---

## 🔧 JavaScript Hooks (`js-*` класи)

### Проблема

```html
<!-- ❌ ПОГАНО: Один клас для styling І behavior -->
<button class="submit-btn">Submit</button>

<style>
	.submit-btn { background: blue; }
</style>

<script>
	document.querySelector('.submit-btn').addEventListener('click', ...);
</script>
```

### Рішення: Розділення concerns

```html
<!-- ✅ ДОБРЕ: Окремі класи для styling та JS -->
<button class="lead-form__submit js-form-submit">Submit</button>

<style>
	.lead-form__submit { background: blue; }
</style>

<script>
	document.querySelector('.js-form-submit').addEventListener('click', ...);
</script>
```

### Правила `js-*` класів

| Правило | Опис |
|---------|------|
| Prefix `js-` | Всі JS hooks починаються з `js-` |
| Без styling | `js-*` класи НІКОЛИ не мають CSS правил |
| Descriptive | Описують behavior, не appearance |
| Lowercase + hyphens | `js-toggle-menu`, не `jsToggleMenu` |

### Стандартні hooks для Medici

```html
<!-- Forms -->
<form class="lead-form js-lead-form">
  <input class="lead-form__input js-form-input" data-validate="email">
  <button class="lead-form__submit js-form-submit"></button>
</form>

<!-- Navigation -->
<nav class="nav-header js-nav">
  <button class="nav-header__toggle js-nav-toggle">Menu</button>
  <ul class="nav-header__menu js-nav-menu"></ul>
</nav>

<!-- Modals -->
<button class="cta-button js-modal-trigger" data-modal="consultation"></button>
<div class="modal js-modal" data-modal-id="consultation">
  <button class="modal__close js-modal-close"></button>
</div>

<!-- Accordions/FAQ -->
<div class="faq-item js-accordion-item">
  <button class="faq-item__question js-accordion-trigger"></button>
  <div class="faq-item__answer js-accordion-content"></div>
</div>
```

---

## 📋 Checklist для Code Review

### CSS

- [ ] Всі класи відповідають BEM конвенції
- [ ] Немає camelCase або PascalCase
- [ ] Немає глибокої вкладеності (max 2 рівні)
- [ ] Модифікатори використовують `--`
- [ ] Елементи використовують `__`

### JavaScript

- [ ] Всі DOM selectors використовують `js-*` класи
- [ ] `js-*` класи НЕ мають CSS правил
- [ ] Конфігурація через `data-*` атрибути

---

**Версія:** 1.0.0
**Дата:** 11 січня 2026
**Статус:** ✅ 100% готово
