# Lead Tracking Rules — Technical Reference

**Версія:** 1.0.0
**Дата:** 2025-12-15

---

## 🏷️ UTM Governance

### Обов'язкові правила

```
✅ ФОРМАТ: lowercase, snake_case, без пробілів
✅ МОВА: English only
✅ ДОВЖИНА: max 50 символів per parameter
```

### utm_source (Платформа/Канал)

**VALID VALUES:**

| Значення | Опис |
|----------|------|
| `google` | Google Ads, Search, Display |
| `facebook` | Facebook Ads, Posts |
| `instagram` | Instagram Ads, Posts, Stories |
| `linkedin` | LinkedIn Ads, Posts |
| `telegram` | Telegram канал/бот |
| `email` | Email розсилки |
| `direct` | Прямий трафік |
| `referral` | Реферальний трафік |

### utm_medium (Тип трафіку)

**VALID VALUES:**

| Значення | Опис |
|----------|------|
| `cpc` | Cost per click |
| `cpm` | Cost per mille |
| `organic` | Органічний трафік |
| `social` | Social organic |
| `post` | Публікація |
| `story` | Stories |
| `reel` | Reels/Shorts |
| `bio` | Profile link |
| `email` | Email |

### utm_campaign (Кампанія)

**Формат:** `{product}_{audience}_{goal}_{date}`

**Examples:**
```
smm_clinics_leads_2025q1
branding_doctors_awareness_jan25
```

---

## 🎯 Lead Stages

**Flow:** `NEW → CONTACTED → MQL → SQL → OPPORTUNITY → CLOSED`

| Стадія | Визначення |
|--------|----------|
| **NEW** | Форма заповнена |
| **CONTACTED** | Перший контакт зроблено |
| **MQL** | Marketing Qualified |
| **SQL** | Sales Qualified |
| **OPPORTUNITY** | Активна угода |
| **CLOSED-WON** | Угода закрита |
| **CLOSED-LOST** | Відмова |

---

## 📊 Атрибуція

**Обрана модель:** First Touch + Last Touch

**Attribution Window:**

| Тип конверсії | Window |
|--------------|--------|
| Lead form | 30 днів |
| Consultation | 60 днів |
| Sale | 90 днів |

---

## ✅ Валідація даних

### Frontend Validation

```javascript
const VALIDATION_RULES = {
	email: {
		required: true,
		pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
		blocklist: ['tempmail.com', 'guerrillamail.com'],
	},
	phone: {
		required: true,
		pattern: /^\+?380\d{9}$/, // Україна
	},
};
```

---

## 📈 KPIs (Моніторинг)

| Метрика | Ціль | Alert |
|---------|------|-------|
| % лідів без UTM | < 10% | > 20% |
| % невалідних UTM | < 5% | > 10% |
| % spam/fake лідів | < 5% | > 10% |
| Response time P1 | < 1 год | > 2 год |
| MQL conversion rate | > 30% | < 20% |
| SQL conversion rate | > 50% | < 30% |

---

**Документ підтримується:** Marketing Team
**Останнє оновлення:** 2025-12-15
**Статус:** ✅ 100% готово
