# NEVORA Folder Structure

Version: 1.0

Status: Production Ready

---

# Philosophy

The folder structure must prioritize:

- Scalability
- Maintainability
- Discoverability
- Separation of Concerns

Every file should have one obvious place.

Never duplicate responsibility.

---

# Root Structure

```

NEVORA/
│
├── .claude/
├── .cursor/
├── docs/
├── frontend/
├── backend/
├── assets/
├── scripts/
├── tools/
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
└── README.md

```

---

# Frontend

```

frontend/
│
├── app/
├── components/
├── features/
├── hooks/
├── lib/
├── services/
├── store/
├── types/
├── utils/
├── constants/
├── styles/
├── assets/
└── public/

```

---

# App Router

```

app/
│
├── layout.tsx
├── page.tsx
├── loading.tsx
├── error.tsx
├── not-found.tsx
│
├── shop/
├── blog/
├── about/
├── contact/

```

---

# Components

Reusable components only.

```

components/
│
├── ui/
├── layout/
├── navigation/
├── cards/
├── buttons/
├── forms/
├── animations/
└── shared/

```

Never put business logic here.

---

# Features

Each feature owns everything it needs.

```

features/
│
├── homepage/
│
│   ├── components/
│   ├── hooks/
│   ├── services/
│   ├── types/
│   ├── utils/
│   ├── constants/
│   └── data/
│
├── products/
├── cart/
├── checkout/
├── auth/
└── blog/

```

Features should never depend directly on each other.

---

# Services

```

services/
│
├── api/
├── auth/
├── analytics/
├── payment/
└── newsletter/

```

---

# Store

```

store/
│
├── cart/
├── theme/
├── user/
└── wishlist/

```

Only global state belongs here.

---

# Types

```

types/
│
├── product.ts
├── order.ts
├── user.ts
├── review.ts
└── common.ts

```

No duplicate interfaces.

---

# Constants

```

constants/
│
├── colors.ts
├── routes.ts
├── animation.ts
├── spacing.ts
└── typography.ts

```

---

# Utils

```

utils/
│
├── currency.ts
├── slug.ts
├── date.ts
├── validation.ts
└── helpers.ts

```

Pure functions only.

---

# Assets

```

assets/
│
├── fonts/
├── icons/
├── images/
├── videos/
└── audio/

```

---

# Public

```

public/
│
├── favicon.ico
├── robots.txt
├── sitemap.xml
└── manifest.json

```

---

# Naming Rules

Folders

kebab-case

Examples

```

coffee-experience

product-card

```

Files

PascalCase

```

Hero.tsx

Navbar.tsx

Footer.tsx

```

Hooks

```

useScroll.ts

useTheme.ts

```

Types

```

Product.ts

Order.ts

```

---

# Import Rules

Allowed

```

Feature

↓

Shared Components

↓

Utilities

↓

Types

```

Forbidden

```

Feature A

↓

Feature B

```

Use shared modules instead.

---

# Dependency Direction

```

App

↓

Features

↓

Shared Components

↓

Utilities

↓

Types

```

Never reverse the dependency flow.

---

# Future Expansion

The structure must support:

- Mobile App
- Admin Dashboard
- CMS
- AI Services
- Analytics
- Internationalization
- Payments
- Microservices

without major restructuring.

---

# Folder Rules

Every folder must have a clear purpose.

If a folder contains only one file for a long period,
reconsider whether it should exist.

Avoid "misc", "temp", or "new" folders.

---

# Definition of Success

A new developer should understand the project structure within 10 minutes.

The location of every file should be predictable.
