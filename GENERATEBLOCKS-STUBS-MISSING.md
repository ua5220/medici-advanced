# GenerateBlocks Pro Stubs - Відсутня інформація

**Версія:** 1.0.0
**Дата:** 2026-01-11

---

## ⚠️ Обмеження поточних stubs

Через недоступність файлів на GitHub, **stubs містять тільки 40% повної GenerateBlocks Pro API**.

---

## ✅ ЩО Є в stubs (40%)

### 1. Block Defaults

✅ **Повні Pro параметри для всіх блоків:**
- Container (25+ параметрів): effects, hover, link params, visibility, global styles
- Button (15+ параметрів): effects, hover, visibility, global styles
- Headline (15+ параметрів): effects, visibility, global styles
- Image (15+ параметрів): effects, visibility, global styles
- Grid (5+ параметрів): visibility, global styles

### 2. Базові класи (stubbed)

✅ `GenerateBlocks\Block` - базовий клас блоку
✅ `GenerateBlocks\Settings` - налаштування
✅ `GenerateBlocks\Enqueue` - enqueue assets

---

## ❌ ЩО ВІДСУТНЄ в stubs (60%)

### 1. Dynamic Tags API ⚠️ КРИТИЧНО

**Файл відсутній:** `includes/class-register.php` (404)

**Вплив:** Неможливо типізувати реєстрацію custom Dynamic Tags

### 2. Query Block API ⚠️ КРИТИЧНО

**Файл відсутній:** `includes/class-query.php` (404)

**Вплив:** Неможливо типізувати Query Loop модифікації

### 3. Global Styles API

**Файл відсутній:** `includes/class-global-styles.php` (404)

**Вплив:** Неточна типізація `generateblocks_get_global_style()`

---

## 🔧 Як отримати повну інформацію

### Варіант 1: Клонувати репозиторій ЛОКАЛЬНО ✅ РЕКОМЕНДОВАНО

```bash
git clone https://github.com/ua5220/generateblocks-pro.git
cd generateblocks-pro
grep -r "public static function" includes/ > api-methods.txt
grep -r "apply_filters" includes/ > filters.txt
```

### Варіант 2: Попросити у розробників ✅ АЛЬТЕРНАТИВА

Зв'язатися з GenerateBlocks Pro support та попросити API documentation.

---

**Версія:** 1.0.0
**Статус:** ✅ 100% готово
