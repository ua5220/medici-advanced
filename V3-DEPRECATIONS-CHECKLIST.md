# v3.0.0 Deprecations Checklist

**Мета:** Універсальний checklist для видалення deprecated коду при major version upgrade.

---

## 🔍 GREP КОМАНДИ ДЛЯ ПОШУКУ

```bash
# Всі deprecated елементи
grep -rn "@deprecated" inc/ --include="*.php"

# Deprecated CSS класи
grep -rn "\.lazy-load\|\.lazy-loading\|\.lazy-loaded\|\.lazy-error" css/ js/

# Legacy singleton getInstance()
grep -rn "::getInstance()" inc/

# Deprecated compat functions
grep -rn "get_category_color\|get_category_style" .
```

---

## 📁 TYPICAL FILES TO REMOVE

| Pattern | Причина | Рекомендована заміна |
|---------|--------|---------------------|
| `inc/*-integrations.php` | @deprecated | Module-based structure |
| Compat functions | Legacy support | Service classes |
| Singleton classes | Anti-pattern | DI Container |

**Приклад:**

```
inc/legacy-integrations.php  → inc/integrations/Manager.php
inc/compat-functions.php     → inc/services/*.php
```

---

## 🎨 CSS MIGRATION: Legacy → BEM

**Pattern:** Non-BEM класи → BEM naming

| Старий клас | Новий клас (BEM) |
|-------------|------------------|
| `.lazy-load` | `.lazy-image` |
| `.lazy-loading` | `.lazy-image--loading` |
| `.lazy-loaded` | `.lazy-image--loaded` |
| `.lazy-error` | `.lazy-image--error` |

**Migration steps:**

1. Знайти всі входження старих класів
2. Оновити JavaScript references (якщо є)
3. Замінити CSS класи
4. Видалити deprecated CSS rules

---

## 🔧 PHP FUNCTIONS MIGRATION

**Pattern:** Global functions → Service classes

```php
// ❌ Deprecated (v2.x)
get_category_color($term_id);
get_category_style($term_id);
parse_headings_from_content($content);
add_heading_ids_to_content($content);
generate_toc_for_post($post_id);
get_saved_toc($post_id);
is_toc_enabled($post_id);
render_toc($post_id);
get_toc_headings_count($post_id);
has_toc_content($post_id);
get_toc_array($post_id);
regenerate_all_toc();

// ✅ Modern (v3.0+)
CategoryColorService::getColor($term_id);
CategoryColorService::getStyle($term_id);
TOCService::parseHeadings($content);
TOCService::addHeadingIds($content);
TOCService::generate($post_id);
TOCService::getSaved($post_id);
TOCService::isEnabled($post_id);
TOCService::render($post_id);
TOCService::getHeadingsCount($post_id);
TOCService::hasContent($post_id);
TOCService::getArray($post_id);
TOCService::regenerateAll();
```

---

## ⚡ SINGLETON PATTERN → DI CONTAINER

**Anti-pattern:** Singleton з `getInstance()`

```php
// ❌ Deprecated (v2.x)
BlogModule::getInstance()->doSomething();
EventsModule::getInstance()->register();
IntegrationManager::getInstance()->sync();

// ✅ Modern (v3.0+) - DI Container
$container->get('blog.module')->doSomething();
$container->get('events.module')->register();
$container->get('integration_manager')->sync();
```

**Migration steps:**

1. Створити service definitions у container
2. Замінити всі `getInstance()` на `$container->get()`
3. Видалити `getInstance()` methods з класів
4. Додати constructor injection

---

## ✅ PRE-RELEASE CHECKLIST

**Перед релізом v3.0.0:**

- [ ] `grep -rn "@deprecated 2" inc/` — перевірити всі deprecated since v2.x
- [ ] Оновити JavaScript на нові CSS класи
- [ ] Видалити deprecated CSS rules
- [ ] Видалити deprecated файли
- [ ] Видалити compat-functions.php (якщо не використовується)
- [ ] Оновити CHANGELOG.md з breaking changes
- [ ] Запустити `composer phpstan` — перевірити типи
- [ ] Запустити unit tests
- [ ] Запустити тести на staging
- [ ] Створити migration guide для користувачів

---

## 📝 MIGRATION GUIDE TEMPLATE

**Для користувачів проекту:**

```markdown
# Migration Guide: v2.x → v3.0.0

## Breaking Changes

### 1. CSS Classes (BEM)

**Before (v2.x):**
```html
<img class="lazy-load">
```

**After (v3.0):**
```html
<img class="lazy-image">
```

### 2. PHP Functions

**Before (v2.x):**
```php
get_category_color($term_id);
```

**After (v3.0):**
```php
CategoryColorService::getColor($term_id);
```

### 3. Singleton Pattern

**Before (v2.x):**
```php
BlogModule::getInstance();
```

**After (v3.0):**
```php
$container->get('blog.module');
```

## Automated Migration

```bash
# Run migration script
php bin/migrate-v3.php
```
```

---

**Версія:** 1.0.0
**Дата:** 11 січня 2026
**Статус:** ✅ 100% готово
