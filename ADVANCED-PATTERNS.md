# 🚀 Advanced Architecture Patterns

**Мета:** Універсальні design patterns для масштабування WordPress проектів.

---

## 1. Dependency Injection Container

### PSR-11 Container Implementation

```php
namespace App\Core;

class Container implements \ArrayAccess {
    private array $services = [];
    private array $instances = [];

    public function service(callable $callable): callable {
        return function ($c) use ($callable) {
            static $object;
            return $object ?? ($object = $callable($c));
        };
    }

    public function get($id) {
        if (!isset($this->instances[$id])) {
            $this->instances[$id] = call_user_func($this->services[$id], $this);
        }
        return $this->instances[$id];
    }

    public function offsetGet($offset): mixed {
        return $this->get($offset);
    }

    public function offsetSet($offset, $value): void {
        $this->services[$offset] = $value;
    }

    public function offsetExists($offset): bool {
        return isset($this->services[$offset]);
    }

    public function offsetUnset($offset): void {
        unset($this->services[$offset], $this->instances[$offset]);
    }
}

// Usage
$container = new Container();
$container['cache'] = $container->service(function ($c) {
    return new CacheManager();
});
```

---

## 2. PSR-4 Autoloading

### Directory Structure

```
project/
├── composer.json
├── src/
│   ├── Blog/
│   ├── Performance/
│   └── Integrations/
└── functions.php
```

### composer.json

```json
{
    "autoload": {
        "psr-4": {
            "App\\": "src/"
        }
    }
}
```

**Переваги:**
- Автоматичне завантаження класів
- Краща IDE підтримка
- Стандартизація коду

---

## 3. Repository Pattern для WordPress

### Data Access Abstraction

```php
namespace App\Blog;

class PostRepository {
    public function __construct(private readonly \wpdb $wpdb) {}

    public function findFeaturedPosts(int $limit = 6): array {
        return (new \WP_Query([
            'post_type' => 'post',
            'posts_per_page' => $limit,
            'meta_key' => 'featured',
            'meta_value' => '1',
        ]))->posts;
    }

    public function incrementViews(int $post_id): bool {
        return false !== $this->wpdb->query(
            $this->wpdb->prepare(
                "INSERT INTO {$this->wpdb->postmeta} (post_id, meta_key, meta_value)
                VALUES (%d, 'views', 1)
                ON DUPLICATE KEY UPDATE meta_value = meta_value + 1",
                $post_id
            )
        );
    }
}
```

**Переваги:**
- Легше тестувати (mock repository)
- Бізнес-логіка відокремлена від WordPress API
- Переиспользуемый код

---

## 4. Advanced Performance Patterns

### A. Object Caching with Transients

```php
namespace App\Cache;

class CacheManager {
    private const PREFIX = 'app_';

    public function remember(
        string $key,
        callable $callback,
        int $ttl = 3600
    ): mixed {
        $value = get_transient(self::PREFIX . $key);
        if (false !== $value) {
            return $value;
        }

        $value = $callback();
        set_transient(self::PREFIX . $key, $value, $ttl);
        return $value;
    }

    public function forget(string $key): void {
        delete_transient(self::PREFIX . $key);
    }
}
```

### B. Custom Database Indexes

```php
// Для швидкого пошуку за meta
global $wpdb;
$wpdb->query(
    "CREATE INDEX idx_views ON {$wpdb->postmeta} (meta_key, meta_value(10))"
);
```

---

## 5. REST API Endpoints

### Headless WordPress Integration

```php
namespace App\Api;

class BlogRestController {
    public function register(): void {
        register_rest_route('api/v1', '/posts/featured', [
            'methods' => 'GET',
            'callback' => [$this, 'getFeaturedPosts'],
            'permission_callback' => '__return_true',
            'args' => [
                'per_page' => [
                    'default' => 6,
                    'sanitize_callback' => 'absint',
                    'validate_callback' => fn($v) => $v > 0 && $v <= 50,
                ],
            ],
        ]);
    }

    public function getFeaturedPosts(\WP_REST_Request $request) {
        $per_page = $request->get_param('per_page');
        $posts = (new \WP_Query([
            'posts_per_page' => $per_page,
            'meta_key' => 'featured',
            'meta_value' => '1',
        ]))->posts;

        return new \WP_REST_Response($posts);
    }
}
```

---

## 6. Static Analysis & Code Quality

### PHPStan Configuration

```yaml
# phpstan.neon
parameters:
    level: 8
    paths: [src, inc]
    bootstrapFiles: [wordpress-stubs.php]
```

### Composer Scripts

```json
"scripts": {
    "phpstan": "phpstan analyse",
    "phpcs": "phpcs --standard=WordPress src/",
    "test": "phpunit"
}
```

### GitHub Actions

```yaml
# .github/workflows/code-quality.yml
name: Code Quality
on: [push, pull_request]
jobs:
    phpstan:
        runs-on: ubuntu-latest
        steps:
            - uses: actions/checkout@v3
            - run: composer install
            - run: composer phpstan
```

---

## 7. Production Performance & Monitoring

### Core Web Vitals

| Метрика | Target |
|---------|--------|
| LCP | < 2.0s |
| INP | < 100ms |
| CLS | < 0.05 |

### Query Monitoring

```php
add_action('shutdown', function () {
    if (defined('SAVEQUERIES') && SAVEQUERIES) {
        global $wpdb;
        error_log(sprintf(
            'Queries: %d, Time: %.4fs',
            count($wpdb->queries),
            array_sum(wp_list_pluck($wpdb->queries, 1))
        ));
    }
});
```

### Recommended Tools

- **Perfmatters** — Script management
- **Query Monitor** — Debug WordPress queries
- **PHPStan** — Static analysis
- **WordPress VIP Code Analysis** — Security scanning

---

## 8. Service Locator Pattern

### Alternative to DI (use DI when possible)

```php
namespace App;

class ServiceLocator {
    private static array $services = [];

    public static function register(string $id, callable $factory): void {
        self::$services[$id] = $factory;
    }

    public static function get(string $id) {
        if (!isset(self::$services[$id])) {
            throw new Exception("Service not found: $id");
        }
        return call_user_func(self::$services[$id]);
    }
}

// Usage
ServiceLocator::register('posts', function () {
    return new PostRepository(global_wpdb());
});

$posts = ServiceLocator::get('posts');
```

---

## 9. Best Practices Checklist

- [ ] Use namespaces for all classes
- [ ] Implement PSR-4 autoloading
- [ ] Separate business logic from WordPress API
- [ ] Use repository pattern for data access
- [ ] Implement DI container for dependencies
- [ ] Add static analysis (PHPStan level 8)
- [ ] Monitor Core Web Vitals
- [ ] Cache expensive operations
- [ ] Use custom database indexes
- [ ] Implement REST API endpoints for headless

---

**Версія:** 1.0.0
**Дата:** 11 січня 2026
**Статус:** ✅ 100% універсально
