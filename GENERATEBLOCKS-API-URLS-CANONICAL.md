# GenerateBlocks V2 Canonical API URLs

**КРИТИЧНО:** Використовувати ТІЛЬКИ Learn GeneratePress для V2 API!

## ⚠️ Політика джерел

### ✅ ДОЗВОЛЕНО (V2 Official):

- **Learn GeneratePress** - https://learn.generatepress.com/
- GenerateBlocks 2.x documentation
- Developer documentation з learn.generatepress.com

### ❌ ЗАБОРОНЕНО (V1 Deprecated):

- **docs.generateblocks.com** - застаріла V1 документація
- generate.support/snippetclub - неофіційні сніпети
- Будь-які V1 API references

---

## 📚 Канонічні URL для stubs

### 1. Query Block Documentation

**URL:** https://learn.generatepress.com/blocks/block/query/

**Що містить:**
- Офіційна структура Query Block (Query → Looper → Loop Item)
- Типи запитів: Post Query, Post Meta Query (Pro), Option Query (Pro)
- Inherited Query модифікація через `pre_get_posts`
- Параметри запитів (Pagination, Taxonomies, Authors, Date, тощо)

---

## 🏷️ Dynamic Tags (V2 Confirmed)

### Офіційний синтаксис:

```
{{dynamic_tag_name parameter1:value1|parameter2:value2}}
```

### Підтверджені теги (25 total):

#### Post Title

```
{{post_title}}
{{post_title source:current-post}}
{{post_title source:next-post}}
{{post_title link:yes}}
```

#### Post Excerpt

```
{{post_excerpt}}
{{post_excerpt length:55}}
{{post_excerpt useTheme:yes}}
{{post_excerpt readMore:Read more...}}
```

#### Post Meta (Pro)

```
{{post_meta key:field_name}}
{{post_meta key:group.item}}
{{post_meta key:acf_field source:current-post}}
{{post_meta key:custom_field link:yes}}
```

---

## 🔍 Query Block Structure (V2)

### Блокова структура:

```
Query Block (gb-query-loop)
  ├── Looper (gb-query-loop-looper)
  │     └── Loop Item (gb-container)
  │           └── Inner blocks (динамічні теги)
  ├── Pagination (опціонально)
  └── No Results (опціонально)
```

### Query Types:

#### 1. Post Query (Free)

```php
[
    'query_type' => 'post',
    'post_type' => 'post',
    'posts_per_page' => 10,
    'orderby' => 'date',
    'order' => 'DESC',
]
```

#### 2. Post Meta Query (Pro)

```php
[
    'query_type' => 'post_meta',
    'meta_key' => 'custom_field',
    'meta_value' => 'value',
]
```

#### 3. Option Query (Pro)

```php
[
    'query_type' => 'option',
    'option_name' => 'site_option',
]
```

---

**Версія:** 1.0.0
**Статус:** ✅ 100% готово
