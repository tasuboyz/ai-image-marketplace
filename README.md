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
│   │   ├── steem.controller.js  # Controller blockchain Steem
│   │   └── user.controller.js   # Controller utenti
│   ├── middleware/
│   │   ├── auth.middleware.js   # Middleware JWT
│   │   ├── upload.middleware.js # Middleware upload (multer)
│   │   ├── steem.middleware.js  # Middleware Steem validation
│   │   ├── validation.middleware.js # Validazione input
│   │   └── error.middleware.js  # Gestione errori
│   ├── models/
│   │   ├── User.js              # Modello utente (MongoDB)
│   │   ├── Image.js             # Modello immagine
│   │   ├── SteemPost.js         # Modello post Steem
│   │   └── Comment.js           # Modello commenti
│   ├── routes/
│   │   ├── auth.routes.js       # Route autenticazione
│   │   ├── image.routes.js      # Route immagini
│   │   ├── steem.routes.js      # Route blockchain
│   │   └── user.routes.js       # Route utenti
│   ├── services/
│   │   ├── steemAuth.service.js # Servizi autenticazione Steem
│   │   ├── steemPost.service.js # Servizi pubblicazione
│   │   ├── steemVoting.service.js # Servizi voting
│   │   ├── ipfs.service.js      # Servizi IPFS storage
│   │   ├── image.service.js     # Servizi immagini
│   │   ├── storage.service.js   # Gestione file storage
│   │   └── email.service.js     # Servizi email
│   ├── blockchain/
│   │   ├── steem.client.js      # Client Steem blockchain
│   │   ├── keychain.handler.js  # Handler Steem Keychain
│   │   ├── posting.operations.js # Operazioni posting
│   │   └── voting.operations.js # Operazioni voting
│   ├── utils/
│   │   ├── database.js          # Connessione DB
│   │   ├── logger.js            # Sistema logging
│   │   ├── imageProcessor.js    # Elaborazione immagini
│   │   ├── steemUtils.js        # Utility blockchain
│   │   └── validators.js        # Validatori
│   ├── config/
│   │   ├── database.js          # Config database
│   │   ├── steem.js             # Config Steem blockchain
│   │   ├── ipfs.js              # Config IPFS
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
  steemUsername: String,        // Username Steem
  steemPublicKey: String,       // Chiave pubblica Steem
  password: String (hashed),
  avatar: String (URL),
  bio: String,
  reputation: Number,           // Reputation Steem
  votingPower: Number,         // Current voting power
  steemPower: Number,          // STEEM Power amount
  totalEarnings: Number,       // Total STEEM/SBD earned
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
  url: String,                 // Local/Cloudinary URL
  ipfsHash: String,           // IPFS hash for blockchain
  steemUrl: String,           // Steem blockchain URL
  thumbnailUrl: String,
  category: String,
  tags: [String],
  aiModel: String,
  prompt: String,
  uploadedBy: ObjectId (ref: User),
  steemAuthor: String,        // Steem username
  steemPermlink: String,      // Steem permlink
  steemPostId: String,        // Steem post ID
  likes: Number,              // Local cache
  steemUpvotes: Number,       // Blockchain upvotes
  steemDownvotes: Number,     // Blockchain downvotes
  steemPayout: Number,        // STEEM/SBD earned
  downloads: Number,
  isPublic: Boolean,
  isOnBlockchain: Boolean,    // Posted to Steem
  blockchainStatus: String,   // pending, confirmed, failed
  createdAt: Date,
  updatedAt: Date,
  metadata: {
    size: Number,
    dimensions: { width: Number, height: Number },
    format: String,
    colorSpace: String,
    exif: Object              // Extended metadata
  }
}
```

### Collection: SteemPosts
```javascript
{
  _id: ObjectId,
  imageId: ObjectId (ref: Image),
  author: String,             // Steem username
  permlink: String,           // Unique post identifier
  title: String,
  body: String,               // Markdown content
  jsonMetadata: Object,       // Custom JSON data
  tags: [String],
  created: Date,
  lastUpdate: Date,
  netVotes: Number,
  totalPayoutValue: String,   // "X.XXX SBD"
  curatorPayoutValue: String,
  authorPayoutValue: String,
  pendingPayoutValue: String,
  cashoutTime: Date,
  isPayoutDeclined: Boolean,
  children: Number,           // Comment count
  beneficiaries: [{
    account: String,
    weight: Number            // Percentage (0-10000)
  }],
  voters: [{
    voter: String,
    weight: Number,
    rshares: String,
    time: Date
  }],
  status: String,             // active, paid_out, declined
  createdAt: Date,
  updatedAt: Date
}
```

### Collection: Comments
```javascript
{
  _id: ObjectId,
  imageId: ObjectId (ref: Image),
  parentId: ObjectId (ref: Comment), // For threading
  steemAuthor: String,        // Steem username
  steemPermlink: String,      // Comment permlink
  steemParentPermlink: String, // Parent post/comment
  content: String,            // Comment text
  jsonMetadata: Object,
  netVotes: Number,
  totalPayoutValue: String,
  pendingPayoutValue: String,
  cashoutTime: Date,
  depth: Number,              // Comment depth level
  children: [ObjectId],       // Child comments
  voters: [{
    voter: String,
    weight: Number,
    time: Date
  }],
  isEdited: Boolean,
  editTime: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Collection: Votes
```javascript
{
  _id: ObjectId,
  voter: String,              // Steem username
  author: String,             // Content author
  permlink: String,           // Content permlink
  weight: Number,             // Vote weight (-10000 to 10000)
  rshares: String,            // Reward shares
  votingPower: Number,        // Voter's VP when voted
  timestamp: Date,
  blockNum: Number,
  transactionId: String,
  contentType: String,        // 'post' or 'comment'
  imageId: ObjectId (ref: Image), // If vote on image post
  commentId: ObjectId (ref: Comment), // If vote on comment
  createdAt: Date
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
- `POST /api/auth/steem-login` - Login con Steem Keychain
- `GET /api/auth/profile` - Profilo utente corrente
- `PUT /api/auth/profile` - Aggiorna profilo
- `POST /api/auth/link-steem` - Collega account Steem

### Images
- `GET /api/images` - Lista immagini con filtri
- `GET /api/images/:id` - Dettagli immagine singola
- `POST /api/images` - Upload nuova immagine
- `POST /api/images/:id/publish` - Pubblica su blockchain Steem
- `PUT /api/images/:id` - Aggiorna immagine (solo proprietario)
- `DELETE /api/images/:id` - Elimina immagine (solo proprietario)
- `GET /api/images/user/:userId` - Immagini di un utente


<!--
### Blockchain Interactions
Queste azioni (voto, commento, follow, pubblicazione su Steem) sono gestite direttamente dal frontend tramite Steem Keychain e non richiedono API backend dedicate.
-->

### IPFS & Storage
- `POST /api/ipfs/upload` - Upload file su IPFS
- `GET /api/ipfs/:hash` - Retrieve file da IPFS
- `POST /api/ipfs/pin` - Pin file su IPFS
- `DELETE /api/ipfs/unpin/:hash` - Unpin file

### Categories
- `GET /api/categories` - Lista categorie disponibili
- `GET /api/categories/:name/images` - Immagini per categoria

### Analytics
- `GET /api/analytics/trending` - Immagini trending
- `GET /api/analytics/top-earners` - Top earning images
- `GET /api/analytics/user-stats/:username` - Statistiche utente
- `GET /api/analytics/platform-stats` - Statistiche piattaforma

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

### Fase 1 (MVP) - Base Marketplace
- [X] Setup base frontend/backend
- [X] Autenticazione Steem Keychain
- [X] Visualizzazione immagini dinamica
- [X] Galleria con filtri e categorie
- [X] Backend API per gestione immagini
- [ ] Upload base delle immagini (locale)

### Fase 2 (Blockchain Integration) - Steem Integration
- [ ] **Upload su Blockchain Steem**
  - [ ] Integrazione libreria per upload immagini su Steem
  - [ ] Generazione URL permanenti per immagini
  - [ ] Pubblicazione automatica come post Steem
  - [ ] Metadata immagini salvate on-chain
- [ ] **Sistema di Like Blockchain**
  - [ ] Implementazione upvote/downvote tramite Steem
  - [ ] Visualizzazione voti reali dalla blockchain
  - [ ] Integrazione wallet per voting power
- [ ] **Sistema Commenti Blockchain**
  - [ ] Commenti salvati come reply su Steem
  - [ ] Threading dei commenti
  - [ ] Moderazione decentralizzata
- [ ] **Monetizzazione**
  - [ ] Earnings da upvotes (STEEM/SBD)
  - [ ] Split rewards author/curatori
  - [ ] Dashboard earnings

### Fase 3 (Advanced Features) - Enhanced UX
- [ ] **AI-Powered Features**
  - [ ] Auto-tagging delle immagini
  - [ ] Suggerimenti prompts
  - [ ] Categorizzazione automatica
- [ ] **Social Features**
  - [ ] Follow/Following system
  - [ ] Feed personalizzato
  - [ ] Notifiche push
  - [ ] Badge e reputation system
- [ ] **Marketplace Features**
  - [ ] NFT integration
  - [ ] Licensing system
  - [ ] Commissioni sui download
  - [ ] Portfolio creators

### Fase 4 (Platform Expansion) - Ecosystem
- [ ] **Multi-blockchain Support**
  - [ ] Hive blockchain integration
  - [ ] Cross-chain bridge
  - [ ] Multi-wallet support
- [ ] **API & Developer Tools**
  - [ ] Public API endpoints
  - [ ] SDK per developers
  - [ ] Webhook system
- [ ] **Mobile & Desktop**
  - [ ] Progressive Web App
  - [ ] Mobile app (React Native)
  - [ ] Desktop app (Electron)

## 🔗 Blockchain Technical Requirements

### Steem Integration Architecture
```
Frontend (React)
    ↓
Steem Services Layer
    ↓
Steem Blockchain
    ├── Image Upload (via IPFS/Steemit)
    ├── Post Creation with metadata
    ├── Voting system (upvote/downvote)
    └── Comments as replies
```

### Required Libraries & Tools
- **Backend**: 
  - `beem` (Python) per upload e interazioni blockchain
  - `steem-js` (Node.js) alternativa JavaScript
  - IPFS client per storage distribuito
- **Frontend**:
  - `steem-keychain` per autenticazione
  - `steem-connect` per OAuth flow
  - WebSocket per real-time updates

### Blockchain Data Flow
1. **Upload Process**:
   ```
   User selects image → Frontend upload → Backend processes → 
   Upload to IPFS → Create Steem post → Return URL & permlink
   ```

2. **Interaction Flow**:
   ```
   User action (like/comment) → Steem Keychain signature → 
   Blockchain transaction → Update local cache → UI refresh
   ```

### Smart Contract Considerations
- **Post Format**: JSON metadata con link IPFS
- **Tags**: Categoria, AI-model, prompt-hash
- **Custom JSON**: Metadata estesi per filtering
- **Beneficiaries**: Revenue split configuration

## 📄 License

MIT License - vedi LICENSE file per dettagli.

## ⚠️ Limitazioni attuali e Note tecniche

- **Commenti, voti e pubblicazione su Steem**: Queste azioni sono già possibili direttamente dal frontend tramite Steem Keychain, senza necessità di backend intermedio. Lato frontend è possibile firmare e inviare transazioni per commentare, votare e pubblicare post su Steem.
- **Upload immagine e URL permanente**: Attualmente non è possibile, solo da frontend, caricare un'immagine e ottenere un URL permanente (es. IPFS o Steem CDN) in modo sicuro e affidabile. Questa parte richiede ancora una soluzione tecnica (es. backend Python con beem, bridge IPFS, o altro servizio di upload).
- **Nota**: La roadmap e l'architettura sono pensate per supportare in futuro anche questa funzionalità, non appena sarà individuata una soluzione cross-platform sicura e decentralizzata.
