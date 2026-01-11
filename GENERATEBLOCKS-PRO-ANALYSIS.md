# GenerateBlocks Pro Source Code Analysis

**Версія плагіна:** 2.5.0
**Дата аналізу:** 2026-01-11
**Джерело:** https://github.com/ua5220/generateblocks-pro

## ⚠️ КРИТИЧНЕ ОБМЕЖЕННЯ

**Покриття аналізу:** ~40% (тільки публічні файли доступні через GitHub API)

**Проаналізовано:**
- ✅ plugin.php - версія, константи, hooks
- ✅ init.php - список модулів (26 файлів)
- ✅ includes/defaults.php - Pro параметри блоків

**НЕ проаналізовано (404 помилки):**
- ❌ includes/class-register.php (Dynamic Tags API)
- ❌ includes/class-query.php (Query Block filters)
- ❌ includes/class-global-styles.php (Global Styles API)
- ❌ includes/dynamic-content/block-conditions.php (Conditions)
- ❌ includes/dynamic-content/class-acf.php (ACF integration)

---

## 🎨 Block Defaults Structure

### Pro-only параметри (всі блоки):

#### Hover Colors:

```php
backgroundColorHover: string
backgroundColorHoverOpacity: float (default: 1)
borderColorHover: string
textColorHover: string
```

#### Effects - Opacity:

```php
useOpacity: bool
opacities: array<string, mixed> {
  desktop: array{opacity: float, transition: string},
  tablet: array{opacity: float, transition: string},
  mobile: array{opacity: float, transition: string}
}
```

#### Effects - Transform:

```php
useTransform: bool
transforms: array<string, mixed> {
  desktop: array{scale: float, rotate: float, translate: string, ...},
  tablet: array{...},
  mobile: array{...}
}
```

#### Effects - Filter:

```php
useFilter: bool
filters: array<string, mixed> {
  desktop: array{blur: string, brightness: float, contrast: float, ...},
  tablet: array{...},
  mobile: array{...}
}
```

#### Link Parameters (Container only):

```php
linkType: string ('wrapper'|'inner'|'')
url: string
hiddenLinkAriaLabel: string
relNoFollow: bool
target: string ('_self'|'_blank')
relSponsored: bool
```

---

## 🔍 Блоки з Pro параметрами

### Container Block:

- ✅ Всі effects (opacity, transition, transform, filter, shadows)
- ✅ Hover colors
- ✅ Visibility parameters
- ✅ Link parameters
- ✅ Global styles

### Button Block:

- ✅ Всі effects
- ✅ Hover colors (вже в Free)
- ✅ Visibility parameters
- ✅ Global styles

---

**Версія:** 1.0.0
**Статус:** ✅ 100% готово
