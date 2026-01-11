# 🎨 Modern JavaScript & CSS Architecture

**Мета:** Універсальний довідник сучасних frontend патернів для WordPress.

---

## 1. Modern ES6+ JavaScript для WordPress

### ES6 Modules замість глобальних змінних

```javascript
// src/utils/api.js
export const fetchPosts = async (perPage = 6) => {
    const response = await fetch(`/wp-json/wp/v2/posts?per_page=${perPage}`);
    if (!response.ok) throw new Error('Failed to fetch posts');
    return response.json();
};

// src/main.js
import { fetchPosts } from './utils/api.js';

document.addEventListener('DOMContentLoaded', async () => {
    const posts = await fetchPosts(10);
    console.log(posts);
});
```

### Destructuring та Spread Operator

```javascript
// Immutable state updates
const [posts, setPosts] = useState([]);
setPosts([...posts, newPost]); // ✅ Не мутує масив

// Object destructuring
const { title, content, author } = post;
```

**Інтеграція:** Використовувати `@wordpress/scripts` для Webpack збірки, модульна структура `js/src/`.

---

## 2. Gutenberg Block Development

### block.json — стандарт WordPress 5.8+

```json
{
    "apiVersion": 3,
    "name": "namespace/featured-post",
    "title": "Featured Post Card",
    "category": "custom-blocks",
    "attributes": {
        "postId": { "type": "number", "default": 0 },
        "showExcerpt": { "type": "boolean", "default": true }
    },
    "supports": {
        "align": ["wide", "full"],
        "color": { "background": true, "text": true }
    },
    "editorScript": "file:./index.js",
    "render": "file:./render.php"
}
```

### Dynamic Block з Server-Side Rendering

```php
// render.php
$post = get_post($attributes['postId']);
?>
<article <?php echo get_block_wrapper_attributes(); ?>>
    <h3><?php echo esc_html($post->post_title); ?></h3>
</article>
```

### React Hooks у Gutenberg

```javascript
import { useSelect } from '@wordpress/data';

const PostSelector = () => {
    const posts = useSelect((select) =>
        select('core').getEntityRecords('postType', 'post')
    );

    return (
        <select>
            {posts?.map((p) => (
                <option>{p.title.rendered}</option>
            ))}
        </select>
    );
};
```

---

## 3. CSS Architecture — BEM + ITCSS

### ITCSS (Inverted Triangle CSS) — 7 шарів

```
01-settings/    # Змінні ($color-primary, $spacing)
02-tools/       # Mixins, functions (без CSS output)
03-generic/     # Reset, normalize
04-elements/    # HTML tags (body, h1, a)
05-objects/     # Layout patterns (.o-container, .o-grid)
06-components/  # UI компоненти (.c-card, .c-button) - BEM
07-utilities/   # Helpers (.u-mt-2, .u-hidden) з !important
```

### BEM Naming Convention

```css
.post-card {} /* Block */
.post-card__title {} /* Element */
.post-card--featured {} /* Modifier */

/* Приклад */
.post-card {
    background: white;
    border-radius: 12px;

    &__image {
        width: 100%;
        aspect-ratio: 16/9;
    }

    &__title {
        font-size: 1.5rem;
    }

    &--featured {
        border: 3px solid var(--accent);
    }
}
```

---

## 4. Performance Optimization

### A. REST API Caching (Redis)

```php
class REST_API_Cache {
    private $redis;
    private $ttl = 300; // 5 хвилин

    public function get_cached_response($result, $server, $request) {
        if ($request->get_method() !== 'GET') {
            return $result;
        }

        $cache_key = 'rest_api:' . md5($request->get_route());
        $cached = $this->redis->get($cache_key);

        return $cached ? json_decode($cached) : $result;
    }
}
add_filter(
    'rest_pre_dispatch',
    [new REST_API_Cache(), 'get_cached_response'],
    10,
    3
);
```

### B. Core Web Vitals Optimization

```php
// LCP — Preload критичних ресурсів
add_action('wp_head', function () {
    echo '<link rel="preload" as="image" href="hero.jpg" fetchpriority="high">';
}, 1);
```

```css
/* CLS — Fixed dimensions */
.hero-image {
    width: 100%;
    aspect-ratio: 16/9; /* Запобігає layout shift */
    object-fit: cover;
}
```

```javascript
// INP — Event delegation
document.querySelector('.cards-container').addEventListener('click', (e) => {
    const card = e.target.closest('.card');
    if (card) handleClick(card);
});
```

### C. Code Splitting та Lazy Loading

```javascript
// Динамічний імпорт
const loadComments = async () => {
    const { initComments } = await import('./comments.js');
    initComments();
};

// Intersection Observer
const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
        loadComments();
        observer.disconnect();
    }
});
observer.observe(document.querySelector('#comments-trigger'));
```

---

## 5. Core Web Vitals Targets

| Метрика | Target | Інструмент |
|---------|--------|----------|
| **LCP** | < 2.0s | Preload, defer CSS |
| **INP** | < 100ms | Event delegation, minimal JS |
| **CLS** | < 0.05 | Fixed dimensions, avoid layout shifts |

---

**Версія:** 1.0.0
**Дата:** 11 січня 2026
**Статус:** ✅ 100% універсально
