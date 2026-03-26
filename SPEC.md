# BASE - Full-Stack E-commerce & Tech Studio Platform

## Project Overview
- **Project Name**: BASE
- **Type**: Full-stack E-commerce & Digital Studio Platform
- **Core Functionality**: A premium e-commerce marketplace combined with a digital studio offering web development services. Features real-time inventory, WebSocket-based chat/notifications, and BFF architecture.
- **Target Users**: Fashion-conscious consumers seeking premium items, and businesses seeking digital studio services.

---

## UI/UX Specification

### Layout Structure

#### Global Layout
- **Header**: Fixed position, transitions from transparent (at top) to solid white on scroll. Height: 72px.
- **Main Content**: Full-width with max-width of 1440px, centered. Horizontal padding: 48px (desktop), 24px (mobile).
- **Footer**: Minimalist, 1px black top border, dark background (#222222), white text.

#### Responsive Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Visual Design

#### Color Palette
| Token | Hex | Usage |
|-------|-----|-------|
| White | #FFFFFF | Primary background |
| Off-White | #F4F4F4 | Secondary backgrounds, cards |
| Cement | #E8E8E8 | Borders, dividers |
| Charcoal | #222222 | Secondary text, footer bg |
| Jet Black | #000000 | Primary text, borders, buttons |
| Accent | #333333 | Hover states |

#### Typography
- **Font Family**: "Inter", "Helvetica Neue", system-ui, sans-serif
- **Font Weights**:
  - Light: 300
  - Regular: 400
  - Medium: 500
  - Bold: 700
- **Font Sizes**:
  - Display: 64px / 72px line-height
  - H1: 48px / 56px
  - H2: 36px / 44px
  - H3: 24px / 32px
  - Body: 16px / 24px
  - Small: 14px / 20px
  - Caption: 12px / 16px

#### Spacing System
- Base unit: 8px
- Spacing scale: 8, 16, 24, 32, 48, 64, 96, 128px

#### Visual Effects
- **Borders**: 1px solid #000000 for separators
- **Shadows**: None (brutalist aesthetic)
- **Background Shapes**: CSS-based geometric shapes (half-circles, overlapping squares)
- **Animations**:
  - Page transitions: fade-in 300ms ease-out
  - Hover scale: transform: scale(1.02) with 200ms ease
  - Toast notifications: slide-in from right, 400ms cubic-bezier

### Components

#### Header
- Logo (left): "BASE" text logo, 700 weight
- Navigation (center): "Moda", "Marketplace", "Studio", "Contacto"
- Actions (right): Notification bell icon, Cart icon with item count badge
- States: transparent → solid white on scroll

#### Product Card
- Image container: 4:5 aspect ratio
- Hover: Image slight zoom, "Añadir al carrito" button appears
- Details: Product name (14px), price (16px bold), condition badge

#### Buttons
- Primary: Black background, white text, 1px border, 48px height
- Secondary: White background, black text, 1px black border
- Hover: Invert colors with 200ms transition

#### Search Bar (Marketplace)
- Sticky position below header
- Debounced input (300ms)
- Filter dropdowns: Price range, Condition, Brand, Category

#### Chat Widget
- Floating button bottom-right (56px circle)
- Expanded: 360px × 480px chat window
- Black/white theme with 1px borders

#### Toast Notifications
- Fixed top-right position
- Slide-in animation
- Auto-dismiss after 4 seconds
- Types: success (black bg), info (white bg with black border)

---

## Functionality Specification

### Core Features

#### 1. Homepage (/)
- Hero section with split-screen layout
- Entry points to Marketplace and Studio
- Featured products grid (from local JSON)
- Geometric background decorations

#### 2. Marketplace (/marketplace)
- Advanced search with filters:
  - Price range (min/max inputs)
  - Condition (Nuevo, Usado, Reacondicionado)
  - Brand (from API)
  - Category (from API + local)
- 3-column product grid (desktop), 2-column (tablet), 1-column (mobile)
- Pagination or infinite scroll
- Results from both local JSON and MercadoLibre API via BFF

#### 3. Product Details (/marketplace/producto/[id])
- Image gallery (main + thumbnails)
- Product specifications
- Real-time stock indicator (WebSocket)
- Add to cart / Buy now actions
- Related products

#### 4. Cart (/carrito)
- Item list with quantity controls
- Subtotal calculation
- Dynamic shipping estimation
- Proceed to checkout button

#### 5. Checkout (/checkout)
- Multi-step form:
  1. Shipping information
  2. Payment method (mock)
  3. Order review
- Order summary sidebar (fixed on desktop)
- 1px line separators between fields

#### 6. Dashboard (/dashboard)
- Sidebar navigation:
  - Mis Pedidos (Orders)
  - Perfil (Profile)
  - Configuración (Settings)
- Order status tracking (real-time via WebSocket)
- Saved items list

#### 7. Studio Services (/studio/servicios)
- Service cards: Full Stack, UI/UX Design, System Optimization
- Technical descriptions
- Contact CTA
- Geometric design accents

### Data Handling

#### Local JSON Data
- Products catalog (initial demo data)
- Categories list
- User profiles (for dashboard demo)

#### BFF API Routes
- `GET /api/products` - Fetch products (merges local + MercadoLibre)
- `GET /api/products/[id]` - Single product details
- `GET /api/categories` - Categories list
- `GET /api/search` - Search with filters
- `POST /api/cart` - Cart operations
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders

#### External API (MercadoLibre)
- Product search via BFF only
- Category browsing via BFF
- Mock authentication for demo

### Real-Time Features (WebSocket)

#### Notifications
- Stock updates
- Order status changes
- Chat messages
- Cart actions

#### Support Chat
- WebSocket connection for live chat
- Message history (in-memory for demo)
- Typing indicators
- Unread message badges

---

## Technical Architecture

### Tech Stack
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: CSS Modules + CSS Variables
- **State Management**: React Context + useReducer
- **Real-Time**: Socket.io (client + server)
- **Data**: Local JSON files

### Project Structure
```
/app
  /api
    /products
    /cart
    /orders
    /socket
  /(routes)
    /page.tsx (homepage)
    /marketplace/page.tsx
    /marketplace/producto/[id]/page.tsx
    /carrito/page.tsx
    /checkout/page.tsx
    /dashboard/page.tsx
    /studio/servicios/page.tsx
/components
  /ui (buttons, inputs, cards)
  /layout (header, footer, sidebar)
  /features (search, cart, chat)
/lib
  /data (local JSON)
  /api (BFF utilities)
  /hooks (custom hooks)
  /context (state management)
/styles
  /globals.css
  /variables.css
```

---

## Acceptance Criteria

### Visual Checkpoints
- [ ] Header transitions from transparent to solid white on scroll
- [ ] All pages have fade-in animation
- [ ] 1px black borders on all separators
- [ ] Geometric background shapes visible on homepage
- [ ] Product cards have hover scale effect
- [ ] Chat widget is visible bottom-right
- [ ] Toast notifications slide in from top-right

### Functional Checkpoints
- [ ] Marketplace search returns results from local + API
- [ ] Filters work correctly (price, condition, brand, category)
- [ ] Add to cart updates cart count in header
- [ ] Cart displays correct item totals
- [ ] Checkout form validates required fields
- [ ] Dashboard shows mock order data
- [ ] WebSocket connection establishes for real-time features

### Technical Checkpoints
- [ ] No direct API calls from frontend to MercadoLibre
- [ ] All data flows through BFF API routes
- [ ] TypeScript compiles without errors
- [ ] Build completes successfully
