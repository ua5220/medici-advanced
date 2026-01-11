# 🔐 WordPress Security (CVE 2024-2025)

**Мета:** Універсальний довідник з безпеки WordPress на основі аналізу вразливостей 2024-2025.

---

## 1. Ландшафт загроз 2024-2025

**Статистика вразливостей:**

- **Плагіни:** 96% всіх CVE (зростання на 34% порівняно з 2023)
- **Теми:** 3.5% вразливостей
- **WordPress Core:** 0.5% (переважно Authenticated XSS, низький імпакт)

**Критичні тренди:**

- **Supply Chain Attacks** — компрометація розробників, бекдори в легітимних оновленнях
- **Mass Exploitation** — автоматизовані атаки протягом 24-48 годин після публікації PoC
- **Unauthenticated RCE** — найнебезпечніший вектор (CVSS 9.0-10.0)

---

## 2. Критичні патерни вразливостей

### A. Unprotected File Upload (CVSS 10.0)

**Проблема:** Незахищене завантаження файлів без валідації типу та авторизації.

```php
// ❌ ВРАЗЛИВИЙ КОД (CVE-2025-6327 pattern)
function ajax_upload() {
    move_uploaded_file($_FILES['file']['tmp_name'], $target);
}
add_action('wp_ajax_nopriv_upload', 'ajax_upload'); // Неавтентифікований!

// ✅ БЕЗПЕЧНИЙ КОД
function ajax_upload() {
    // 1. Перевірка nonce
    check_ajax_referer('upload_nonce');
    
    // 2. Перевірка прав користувача
    if (!current_user_can('upload_files')) {
        wp_die('Недостатньо прав');
    }
    
    // 3. Whitelist типів файлів
    $allowed = ['jpg', 'jpeg', 'png', 'gif'];
    $type = wp_check_filetype($_FILES['file']['name']);
    if (!in_array($type['ext'], $allowed)) {
        wp_die('Недозволений тип');
    }
    
    // 4. Використання WordPress API
    wp_handle_upload($_FILES['file'], ['test_form' => false]);
}
add_action('wp_ajax_upload', 'ajax_upload'); // Тільки залогінені
```

---

### B. SQL Injection через Partial Sanitization

**Проблема:** Часткова санітизація параметрів запиту, відсутність prepared statements.

```php
// ❌ ВРАЗЛИВИЙ КОД (CVE-2025-12197 pattern)
$orderby = esc_sql($_GET['orderby']);
$where = 'AND ' . $_GET['where']; // Не санітизовано!
$query = "SELECT * FROM posts WHERE status = 1 $where ORDER BY $orderby";

// ✅ БЕЗПЕЧНИЙ КОД
$allowed_orderby = ['date', 'title', 'id'];
$orderby = in_array($_GET['orderby'], $allowed_orderby) 
    ? $_GET['orderby'] 
    : 'date';

$meta_key = sanitize_text_field($_GET['meta_key']);
$query = $wpdb->prepare(
    "SELECT * FROM posts WHERE meta_key = %s ORDER BY $orderby",
    $meta_key
);
```

**Правило:** Завжди використовуй `$wpdb->prepare()` для динамічних значень + whitelist для `ORDER BY`.

---

### C. Insecure REST API

**Проблема:** REST API endpoints без `permission_callback` або з `__return_true`.

```php
// ❌ ВРАЗЛИВИЙ КОД (CVE-2024-25600 pattern)
register_rest_route('api/v1', '/admin', [
    'callback' => 'do_admin_action',
    'permission_callback' => '__return_true', // КРИТИЧНА ПОМИЛКА!
]);

// ✅ БЕЗПЕЧНИЙ КОД
register_rest_route('api/v1', '/admin', [
    'callback' => 'do_admin_action',
    'permission_callback' => function() {
        return current_user_can('manage_options');
    },
    'args' => [
        'id' => [
            'validate_callback' => function($param) {
                return is_numeric($param);
            },
            'sanitize_callback' => 'absint',
        ],
    ],
]);
```

**Правило:** Кожен REST endpoint ПОВИНЕН мати `permission_callback` з перевіркою capabilities.

---

## 3. Security Audit Checklist

**Перед кожним коммітом перевір:**

### ✅ Input Validation

- [ ] `$_GET`, `$_POST`, `$_REQUEST` санітизовані (`sanitize_text_field`, `absint`, `esc_url`)
- [ ] REST API має `validate_callback` та `sanitize_callback`
- [ ] Whitelist для `ORDER BY`, `WHERE`, dynamic SQL parts
- [ ] File uploads обмежені за типом (whitelist extensions)

### ✅ Authentication & Authorization

- [ ] AJAX endpoints без `nopriv` мають `check_ajax_referer()`
- [ ] REST API має `permission_callback` з `current_user_can()`
- [ ] Admin functions перевіряють `manage_options` або еквівалент
- [ ] File operations перевіряють `upload_files` capability

### ✅ Database Security

- [ ] Завжди `$wpdb->prepare()` для динамічних запитів
- [ ] Whitelist для `ORDER BY` та інших dynamic parts
- [ ] Escape функції: `esc_sql()` тільки для whitelist values

### ✅ Output Escaping

- [ ] `esc_html()` для text content
- [ ] `esc_url()` для URLs
- [ ] `esc_attr()` для HTML attributes
- [ ] `wp_kses_post()` для HTML content

---

## 4. Hardening Best Practices

### Security Headers

**Content Security Policy (CSP):**

```php
header("Content-Security-Policy: " . implode('; ', [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' *.googletagmanager.com",
    "style-src 'self' 'unsafe-inline' fonts.googleapis.com",
    "font-src 'self' data: fonts.gstatic.com",
    "img-src 'self' data: https:",
    "connect-src 'self' *.google-analytics.com",
    "frame-src 'self' youtube.com youtube-nocookie.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
]));
```

**Cross-Origin Headers:**

```php
header('Cross-Origin-Resource-Policy: cross-origin');
header('Cross-Origin-Opener-Policy: same-origin-allow-popups');
header('Cross-Origin-Embedder-Policy: unsafe-none');
```

**Security Headers:**

```php
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: SAMEORIGIN');
header('Referrer-Policy: strict-origin-when-cross-origin');
header('Permissions-Policy: geolocation=(), microphone=(), camera=()');
```

---

### Disable Risky Features

**XML-RPC (якщо не потрібен):**

```php
add_filter('xmlrpc_enabled', '__return_false');
```

**File Editor:**

```php
define('DISALLOW_FILE_EDIT', true);
```

**Directory Listing:**

```apache
# .htaccess
Options -Indexes
```

---

## 5. Security Scanning Tools

### Automated Scanners

- **WPScan** - CLI vulnerability scanner (безкоштовно)
- **Sucuri SiteCheck** - Online scanner
- **Wordfence** - Plugin з firewall та scanner
- **iThemes Security** - Security hardening plugin

### Manual Testing

```bash
# WPScan - сканування вразливостей
wpscan --url https://example.com --api-token YOUR_TOKEN

# Grep для небезпечних патернів
grep -r "wp_ajax_nopriv" . --include="*.php"
grep -r "__return_true" . --include="*.php"
grep -r "\$_GET\|\$_POST\|\$_REQUEST" . --include="*.php"
```

---

## 6. Incident Response Plan

### При виявленні вразливості:

1. **Ізолюй** - закрий доступ до вразливого endpoint
2. **Patch** - застосуй hotfix негайно
3. **Audit** - перевір logs на ознаки exploitation
4. **Update** - оновлюй плагіни/теми до patched версій
5. **Monitor** - активуй додаткове логування

### Security Logging

```php
function log_security_event($type, $details) {
    $log_entry = [
        'timestamp' => current_time('mysql'),
        'type' => $type,
        'user_id' => get_current_user_id(),
        'ip' => $_SERVER['REMOTE_ADDR'],
        'details' => $details,
    ];
    
    error_log(json_encode($log_entry));
}

// Приклад використання
log_security_event('unauthorized_access', [
    'endpoint' => $_SERVER['REQUEST_URI'],
    'capability' => 'manage_options',
]);
```

---

## 7. Resources

**Official:**
- WordPress Security Handbook: https://developer.wordpress.org/advanced-administration/security/
- WPScan Vulnerability Database: https://wpscan.com/
- CVE Details WordPress: https://www.cvedetails.com/vendor/2337/Wordpress.html

**Community:**
- OWASP Top 10: https://owasp.org/www-project-top-ten/
- WordPress Security White Paper: https://wordpress.org/about/security/

---

**Версія:** 1.0.0
**Дата:** 11 січня 2026
**Статус:** ✅ 100% готово
