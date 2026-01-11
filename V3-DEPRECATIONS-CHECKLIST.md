# v3.0.0 Deprecations Checklist

## 🔍 GREP КОМАНДИ ДЛЯ ПОШУКУ

```bash
# Всі deprecated елементи
grep -rn "@deprecated" inc/ --include="*.php"

# Deprecated CSS класи
grep -rn "\.lazy-load\|\.lazy-loading\|\.lazy-loaded\|\.lazy-error" css/ js/

# Legacy singleton getInstance()
grep -rn "::getInstance()" inc/

# Deprecated compat functions
grep -rn "medici_get_category_color\|medici_get_category_style" .
```

---

## 📁 ФАЙЛИ ДЛЯ ВИДАЛЕННЯ

| Файл | Причина | Заміна |
|------|--------|------|
| `inc/lead-integrations.php` | @deprecated 2.7.0 | `inc/lead/IntegrationManager.php` |
| `inc/generatepress.php:371` | `medici_get_related_posts()` | `medici_get_related_posts_cached()` |

---

## 🎫 CSS КЛАСИ ДЛЯ ВИДАЛЕННЯ

**Файл:** `css/components/lazy-load.css` (рядки 254-295)

| Старий клас | Новий клас (BEM) |
|----------|------|
| `.lazy-load` | `.lazy-image` |
| `.lazy-loading` | `.lazy-image--loading` |
| `.lazy-loaded` | `.lazy-image--loaded` |
| `.lazy-error` | `.lazy-image--error` |

**Перед видаленням:** оновити `js/module-loader.js:122`

---

## 🔧 PHP ФУНКЦІЄ ДЛЯ ВИДАЛЕННЯ

**Файл:** `inc/blog/compat-functions.php`

```
medici_get_category_color()      → CategoryColorService::getColor()
medici_get_category_style()      → CategoryColorService::getStyle()
medici_parse_headings_from_content() → TOCService::parseHeadings()
medici_add_heading_ids_to_content()  → TOCService::addHeadingIds()
medici_generate_toc_for_post()   → TOCService::generate()
medici_get_saved_toc()           → TOCService::getSaved()
medici_is_toc_enabled()          → TOCService::isEnabled()
medici_render_toc()              → TOCService::render()
medici_get_toc_headings_count()  → TOCService::getHeadingsCount()
medici_has_toc_content()         → TOCService::hasContent()
medici_get_toc_array()           → TOCService::getArray()
medici_regenerate_all_toc()      → TOCService::regenerateAll()
```

---

## ⚡ SINGLETON PATTERN → DI CONTAINER

| Старий виклик | Новий виклик |
|---------|----------|
| `BlogModule::getInstance()` | `medici_container()->get('blog.module')` |
| `EventsModule::getInstance()` | `medici_container()->get('events.module')` |
| `IntegrationManager::getInstance()` | `medici_container()->get('lead.integration_manager')` |

---

## ✅ CHECKLIST ПЕРЕД РЕЛІЗОМ

- [ ] `grep -rn "@deprecated 2" inc/` — перевірити всі deprecated
- [ ] Оновити `js/module-loader.js` на `.lazy-image`
- [ ] Видалити deprecated CSS з `lazy-load.css`
- [ ] Видалити `inc/lead-integrations.php`
- [ ] Видалити `compat-functions.php` (якщо не використовується)
- [ ] Оновити CHANGELOG.md
- [ ] Запустити `composer phpstan` — перевірити типи
- [ ] Запустити тести на staging

---

**Останнє оновлення:** 2026-01-04
**Статус:** ✅ 100% готово
