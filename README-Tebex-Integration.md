# Tebex Payment Integration voor React + Node.js

Deze integratie voegt Tebex betalingen toe aan je React website met een veilige Node.js backend.

## 📁 Project Structuur

```
deltamc website/
├── project/          # React frontend (Vite)
├── backend/          # Node.js + Express backend
├── admin-panel/      # Admin panel
└── README-Tebex-Integration.md
```

## 🚀 Lokale Setup & Testen

### 1. Backend Setup

```bash
# Ga naar backend directory
cd backend

# Installeer dependencies
npm install

# Kopieer environment bestand
cp .env.example .env

# Bewerk .env bestand met je Tebex credentials
# TEBEX_SECRET=jouw_tebex_secret
# TEBEX_ACCOUNT_ID=jouw_account_id
# TEBEX_PACKAGE_ID=jouw_custom_package_id
```

### 2. Frontend Setup

```bash
# Ga naar project directory
cd ../project

# Installeer dependencies (als nog niet gedaan)
npm install
```

### 3. Servers Starten

```bash
# Terminal 1: Start backend server
cd backend
npm run dev
# Server draait op http://localhost:3001

# Terminal 2: Start frontend
cd ../project
npm run dev
# Frontend draait op http://localhost:5173
```

### 4. Test de Integratie

1. **Open browser** naar `http://localhost:5173`
2. **Voeg items toe** aan winkelwagen
3. **Ga naar checkout**
4. **Vul formulier in** en klik "Betalen"
5. **Wordt doorgestuurd** naar Tebex checkout
6. **Test success/cancel** flows:
   - Success: `http://localhost:5173/payment/success`
   - Cancel: `http://localhost:5173/payment/cancel`

## 🔧 Tebex Setup

### 1. Tebex Account
- Maak account aan op [tebex.io](https://tebex.io)
- Ga naar "Stores" > "Webstore" > "Settings" > "API"

### 2. API Credentials
- Kopieer je **Secret Key**
- Vind je **Account ID** in de URL of instellingen
- Voeg toe aan `backend/.env`

### 3. Custom Amount Package
- Ga naar "Packages" > "Create Package"
- Kies **"Custom Amount"** type
- Stel prijsbereik in (bijv. €0.01 - €500)
- Kopieer **Package ID** naar `.env`

### 4. Webhooks (Optioneel maar Aanbevolen)
- Ga naar "Webstore" > "Settings" > "Webhooks"
- Voeg webhook toe: `https://jouwdomain.com/api/webhook`
- Selecteer events: `payment.completed`, `payment.declined`

## 📋 API Endpoints

### Backend (localhost:3001)
- `POST /api/create-checkout` - Maak Tebex checkout aan
- `POST /api/webhook` - Ontvang Tebex webhooks
- `GET /api/health` - Health check

### Frontend Routes
- `/checkout` - Checkout pagina
- `/payment/success` - Betaling gelukt
- `/payment/cancel` - Betaling geannuleerd

## 🌐 Deployment naar VPS (Linux + Nginx)

### 1. Server Voorbereiding

```bash
# Update server
sudo apt update && sudo apt upgrade -y

# Installeer Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Installeer Nginx
sudo apt install nginx -y

# Installeer PM2 voor process management
sudo npm install -g pm2

# Installeer Certbot voor SSL (optioneel)
sudo apt install certbot python3-certbot-nginx -y
```

### 2. Project Deployen

```bash
# Clone je repository
git clone https://github.com/jouw-repo/deltamc-website.git
cd deltamc-website

# Backend build & start
cd backend
npm install --production
cp .env.example .env
# Bewerk .env met productie waarden
pm2 start server.js --name "tebex-backend"
pm2 save
pm2 startup

# Frontend build
cd ../project
npm install
npm run build

# Frontend files naar Nginx
sudo cp -r dist/* /var/www/html/
```

### 3. Nginx Configuratie

```bash
# Bewerk Nginx config
sudo nano /etc/nginx/sites-available/default
```

**Nginx Config:**
```nginx
server {
    listen 80;
    server_name jouwdomain.com;

    # Frontend (React SPA)
    location / {
        root /var/www/html;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Test en herstart Nginx
sudo nginx -t
sudo systemctl restart nginx
```

### 4. Environment Variables Aanpassen

**Voor productie, wijzig in `backend/.env`:**
```env
PORT=3001
FRONTEND_URL=https://jouwdomain.com

# Tebex credentials (zelfde als lokaal)
TEBEX_SECRET=jouw_tebex_secret
TEBEX_ACCOUNT_ID=jouw_account_id
TEBEX_PACKAGE_ID=jouw_custom_package_id
```

### 5. SSL Certificaat (Optioneel)

```bash
# Let's Encrypt SSL
sudo certbot --nginx -d jouwdomain.com
```

### 6. Firewall Configuratie

```bash
# Alleen HTTP/HTTPS toestaan
sudo ufw allow 'Nginx Full'
sudo ufw --force enable
```

## 🔒 Beveiliging

### Environment Variables
- **Nooit** API keys in frontend code plaatsen
- Gebruik altijd server-side API calls
- `.env` bestand niet committen naar Git

### Webhook Verificatie
```javascript
// In backend/server.js webhook endpoint
const signature = req.headers['x-tebex-signature'];
// Verificeer signature met je secret
```

### Rate Limiting
Overweeg rate limiting toe te voegen aan API endpoints.

## 🐛 Troubleshooting

### Backend Start Fouten
```bash
# Check Node.js versie
node --version

# Check dependencies
cd backend && npm ls

# Check environment variables
cat .env
```

### Tebex API Fouten
- Controleer API credentials
- Check Tebex dashboard voor errors
- Controleer package configuratie

### Frontend Build Issues
```bash
# Clear cache en rebuild
cd project
rm -rf node_modules/.vite
npm run build
```

## 📞 Support

Voor vragen over deze integratie:
1. Check Tebex documentatie: https://docs.tebex.io/
2. Controleer server logs: `pm2 logs tebex-backend`
3. Test lokaal eerst voordat je deployed

## 🔄 Workflow Samenvatting

1. **Lokaal testen** met bovenstaande setup
2. **Tebex account** configureren
3. **Environment variables** invullen
4. **Deploy naar VPS** met Nginx
5. **SSL certificaat** toevoegen
6. **Webhooks configureren** voor productie

De integratie is ontworpen om **zonder code changes** van lokaal naar productie te gaan - alleen `.env` aanpassen!
