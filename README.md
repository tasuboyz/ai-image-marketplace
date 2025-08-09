# AI Image Marketplace

Un marketplace di immagini generate da AI costruito con React + TypeScript + Vite e backend Node.js, dove gli utenti possono visualizzare, caricare e gestire immagini AI.

## 📋 Analisi del Progetto Attuale

### Stato Corrente
- **Frontend**: React 19.1.1 + TypeScript + Vite
- **Immagini Esistenti**: 2 categorie principali in `public/images/`:
  - `GrimReaper/`: 3 immagini AI
  - `LandScape/`: 23 immagini paesaggistiche (incluso `prompt.txt`)
- **Setup**: Configurazione base Vite con ESLint

### Struttura Attuale
```
ai-image-marketplace/
├── public/
│   └── images/
│       ├── GrimReaper/           # 3 immagini
│       └── LandScape/            # 23 immagini + prompt.txt
├── src/
│   ├── App.tsx                   # Componente principale base
│   ├── main.tsx                  # Entry point
│   └── assets/
└── package.json                  # Dipendenze React/Vite
```

## 🎯 Architettura Proposta

### Frontend (React + Vite)
```
src/
├── components/
│   ├── common/
│   │   ├── Header.tsx           # Navigazione principale
│   │   ├── Footer.tsx           # Footer del sito
│   │   ├── LoadingSpinner.tsx   # Componente loading
│   │   └── Modal.tsx            # Modal riutilizzabile
│   ├── gallery/
│   │   ├── ImageGallery.tsx     # Griglia principale immagini
│   │   ├── ImageCard.tsx        # Card singola immagine
│   │   ├── ImageModal.tsx       # Modal dettaglio immagine
│   │   ├── CategoryFilter.tsx   # Filtro per categoria
│   │   └── SearchBar.tsx        # Barra di ricerca
│   ├── upload/
│   │   ├── UploadForm.tsx       # Form caricamento
│   │   ├── ImagePreview.tsx     # Anteprima immagine
│   │   └── ProgressBar.tsx      # Barra progresso upload
│   └── auth/
│       ├── LoginForm.tsx        # Form login
│       ├── RegisterForm.tsx     # Form registrazione
│       └── UserProfile.tsx      # Profilo utente
├── pages/
│   ├── Home.tsx                 # Homepage marketplace
│   ├── Gallery.tsx              # Pagina galleria
│   ├── Upload.tsx               # Pagina upload
│   ├── Profile.tsx              # Profilo utente
│   └── ImageDetail.tsx          # Dettaglio immagine
├── hooks/
│   ├── useImages.ts             # Hook gestione immagini
│   ├── useAuth.ts               # Hook autenticazione
│   └── useUpload.ts             # Hook upload
├── services/
│   ├── api.ts                   # Client API
│   ├── steemAuth.service.ts     # Autenticazione Steem Keychain
│   └── image.service.ts         # Servizi immagini
├── types/
│   ├── Image.ts                 # Tipi TypeScript
│   ├── User.ts                  # Tipi utente
│   └── api.ts                   # Tipi API
├── utils/
│   ├── imageUtils.ts            # Utility immagini
│   ├── validation.ts            # Validazione form
│   └── constants.ts             # Costanti
└── styles/
    ├── globals.css              # Stili globali
    ├── components/              # Stili componenti
    └── pages/                   # Stili pagine
```

### Backend (Node.js + Express)
```
backend/
├── src/
│   ├── controllers/
│   │   ├── auth.controller.js   # Controller autenticazione
│   │   ├── image.controller.js  # Controller immagini
│   │   └── user.controller.js   # Controller utenti
│   ├── middleware/
│   │   ├── auth.middleware.js   # Middleware JWT
│   │   ├── upload.middleware.js # Middleware upload (multer)
│   │   ├── validation.middleware.js # Validazione input
│   │   └── error.middleware.js  # Gestione errori
│   ├── models/
│   │   ├── User.js              # Modello utente (MongoDB)
│   │   └── Image.js             # Modello immagine
│   ├── routes/
│   │   ├── auth.routes.js       # Route autenticazione
│   │   ├── image.routes.js      # Route immagini
│   │   └── user.routes.js       # Route utenti
│   ├── services/
│   │   ├── steemAuth.service.js # Servizi autenticazione Steem
│   │   ├── image.service.js     # Servizi immagini
│   │   ├── storage.service.js   # Gestione file storage
│   │   └── email.service.js     # Servizi email
│   ├── utils/
│   │   ├── database.js          # Connessione DB
│   │   ├── logger.js            # Sistema logging
│   │   ├── imageProcessor.js    # Elaborazione immagini
│   │   └── validators.js        # Validatori
│   ├── config/
│   │   ├── database.js          # Config database
│   │   ├── cloudinary.js        # Config storage cloud
│   │   └── jwt.js               # Config JWT
│   └── app.js                   # Setup Express
├── uploads/                     # Directory upload locali
├── logs/                        # File di log
├── tests/                       # Test suite
└── package.json
```

## 🗄️ Schema Database (MongoDB)

### Collection: Users
```javascript
{
  _id: ObjectId,
  username: String,
  email: String,
  password: String (hashed),
  avatar: String (URL),
  bio: String,
  createdAt: Date,
  updatedAt: Date,
  isActive: Boolean
}
```

### Collection: Images
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  filename: String,
  originalName: String,
  url: String,
  thumbnailUrl: String,
  category: String,
  tags: [String],
  aiModel: String,
  prompt: String,
  uploadedBy: ObjectId (ref: User),
  likes: Number,
  downloads: Number,
  isPublic: Boolean,
  createdAt: Date,
  updatedAt: Date,
  metadata: {
    size: Number,
    dimensions: { width: Number, height: Number },
    format: String,
    colorSpace: String
  }
}
```

## 🚀 Funzionalità Principali

### Frontend Features
- ✅ **Galleria Immagini**: Visualizzazione grid responsive
- ✅ **Filtri e Ricerca**: Per categoria, tag, autore
- ✅ **Upload Immagini**: Drag & drop con anteprima
- ✅ **Autenticazione**: Login/Register con JWT
- ✅ **Profilo Utente**: Gestione immagini personali
- ✅ **Modal Dettagli**: View completo con metadata
- ✅ **Responsive Design**: Mobile-first approach

### Backend Features
- ✅ **API RESTful**: CRUD completo per immagini
- ✅ **Autenticazione JWT**: Secure endpoints
- ✅ **Upload Manager**: Multer + validazione
- ✅ **Image Processing**: Resize, thumbnails, ottimizzazione
- ✅ **Storage Cloud**: Cloudinary integration
- ✅ **Database**: MongoDB con Mongoose
- ✅ **Validation**: Input sanitization
- ✅ **Error Handling**: Centralized error management

## 🛠️ Tecnologie Stack

### Frontend
- **React 19.1.1**: UI Framework
- **TypeScript**: Type safety
- **Vite**: Build tool e dev server
- **React Router**: Routing
- **Axios**: HTTP client
- **React Hook Form**: Form management
- **Framer Motion**: Animazioni
- **Tailwind CSS**: Styling
- **React Query**: State management asincrono

### Backend
- **Node.js**: Runtime JavaScript
- **Express.js**: Web framework
- **MongoDB**: Database NoSQL
- **Mongoose**: ODM per MongoDB
- **JWT**: Autenticazione
- **Multer**: File upload
- **Sharp**: Image processing
- **Cloudinary**: Cloud storage
- **Joi**: Validation
- **Winston**: Logging
- **Helmet**: Security headers
- **CORS**: Cross-origin requests

## 📦 Setup e Installazione

### Prerequisites
- Node.js 18+
- MongoDB 5.0+
- Account Cloudinary (opzionale)

### Frontend Setup
```bash
# Installa dipendenze aggiuntive
npm install react-router-dom axios react-hook-form framer-motion @tailwindcss/forms
npm install -D tailwindcss postcss autoprefixer @types/node
```

### Backend Setup
```bash
# Crea directory backend
mkdir backend && cd backend

# Inizializza progetto Node.js
npm init -y

# Installa dipendenze
npm install express mongoose jsonwebtoken bcryptjs multer sharp cloudinary cors helmet joi winston dotenv
npm install -D nodemon jest supertest
```

## 🔄 API Endpoints

### Authentication
- `POST /api/auth/register` - Registrazione utente
- `POST /api/auth/login` - Login utente
- `GET /api/auth/profile` - Profilo utente corrente
- `PUT /api/auth/profile` - Aggiorna profilo

### Images
- `GET /api/images` - Lista immagini con filtri
- `GET /api/images/:id` - Dettagli immagine singola
- `POST /api/images` - Upload nuova immagine
- `PUT /api/images/:id` - Aggiorna immagine (solo proprietario)
- `DELETE /api/images/:id` - Elimina immagine (solo proprietario)
- `GET /api/images/user/:userId` - Immagini di un utente

### Categories
- `GET /api/categories` - Lista categorie disponibili
- `GET /api/categories/:name/images` - Immagini per categoria

## 🎨 Design System

### Color Palette
```css
:root {
  --primary: #6366f1;      /* Indigo */
  --secondary: #8b5cf6;    /* Violet */
  --accent: #f59e0b;       /* Amber */
  --background: #f8fafc;   /* Slate 50 */
  --surface: #ffffff;      /* White */
  --text-primary: #1e293b; /* Slate 800 */
  --text-secondary: #64748b; /* Slate 500 */
  --border: #e2e8f0;       /* Slate 200 */
  --error: #ef4444;        /* Red 500 */
  --success: #10b981;      /* Emerald 500 */
}
```

### Typography
- **Headers**: Inter font family
- **Body**: System UI stack
- **Code**: Fira Code

## 🔧 Development Workflow

### Frontend Development
```bash
npm run dev          # Dev server su http://localhost:5173
npm run build        # Build produzione
npm run preview      # Preview build
npm run lint         # ESLint check
```

### Backend Development
```bash
npm run dev          # Server con nodemon su port 3000
npm run start        # Produzione
npm run test         # Test suite
npm run test:watch   # Test in watch mode
```

### Environment Variables

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:3000/api
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_APP_NAME=AI Image Marketplace
```

#### Backend (.env)
```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/ai-marketplace
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
UPLOAD_MAX_SIZE=10485760
ALLOWED_FORMATS=jpg,jpeg,png,webp
```

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Build ottimizzato con Vite
2. Deploy su CDN globale
3. Environment variables per produzione

### Backend (Railway/Heroku/DigitalOcean)
1. Deploy container Docker
2. MongoDB Atlas per database
3. Cloudinary per storage immagini
4. PM2 per process management

## 📈 Roadmap

### Fase 1 (MVP)
- [X] Setup base frontend/backend
- [X] Autenticazione utenti
- [ ] Upload e visualizzazione immagini
- [ ] Galleria con filtri base

### Fase 2 (Enhanced)
- [ ] Sistema di like e commenti
- [ ] Categorizzazione avanzata
- [ ] Search intelligente
- [ ] Dashboard amministratore

### Fase 3 (Advanced)
- [ ] AI-powered tagging automatico
- [ ] Sistema di vendita/acquisto
- [ ] API pubblica
- [ ] Mobile app (React Native)

## 📄 License

MIT License - vedi LICENSE file per dettagli.
