# Bocal

[![Production Deployment](https://github.com/mtlaso/bocal/actions/workflows/deploy-production.yml/badge.svg)](https://github.com/mtlaso/bocal/actions/workflows/deploy-production.yml)

**[English](#english)** | **[Français](#français)**

---

## English

Bocal is a modern web application that combines an RSS reader with a bookmark manager. It allows users to follow their favorite websites and organize their links in one centralized location.

### 🌟 Features

- **RSS Feed Reader**: Subscribe to and read RSS feeds from your favorite websites
- **Bookmark Manager**: Save and organize links with tags and categories
- **Internationalization**: Available in multiple languages
- **Modern UI**: Clean, responsive design with dark/light theme support
- **Authentication**: Secure OAuth login with GitHub and Google
- **Performance**: Built with Next.js 15 and modern web technologies

### 🚀 Demo

Live demo: **[bocal.fyi](https://bocal.fyi)**

### 🛠 Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: TailwindCSS + shadcn/ui components
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Auth.js (NextAuth.js)
- **Internationalization**: next-intl
- **Testing**: Vitest + React Testing Library
- **Code Quality**: Biome for linting and formatting
- **Deployment**: Vercel

### 📋 Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [pnpm](https://pnpm.io/) package manager
- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/) for the database
- [Git](https://git-scm.com/) for version control

### 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/mtlaso/bocal.git
   cd bocal
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up PostgreSQL database**

   Create a `docker-compose.yml` file in your root directory:
   
   ```yml
   services:
     postgres:
       container_name: bocal-postgres
       image: postgres:15
       hostname: localhost
       ports:
         - "5432:5432"
       environment:
         POSTGRES_USER: admin
         POSTGRES_PASSWORD: root
         POSTGRES_DB: bocal
       volumes:
         - postgres-data:/var/lib/postgresql/data
       restart: unless-stopped
 
     pgadmin:
       container_name: bocal-pgadmin
       image: dpage/pgadmin4
       depends_on:
         - postgres
       ports:
         - "5050:80"
       environment:
         PGADMIN_DEFAULT_EMAIL: admin@admin.admin
         PGADMIN_DEFAULT_PASSWORD: admin
       restart: unless-stopped
 
   volumes:
     postgres-data:
   ```

   Start the database:
   ```bash
   docker-compose up -d
   ```

4. **Configure environment variables**

   Create a `.env.local` file in the root directory:
   
   ```bash
   # App Configuration
   APP_URL="http://localhost:3000"
   
   # Authentication (OAuth)
   # Get these from: https://authjs.dev/getting-started/authentication/oauth
   AUTH_GITHUB_ID="your_github_client_id"
   AUTH_GITHUB_SECRET="your_github_client_secret"
   AUTH_GOOGLE_ID="your_google_client_id"
   AUTH_GOOGLE_SECRET="your_google_client_secret"
   
   # Generate a secret: pnpm auth secret
   # Or: openssl rand -base64 32
   AUTH_SECRET="your_auth_secret"
   
   # Database
   DATABASE_URL="postgres://admin:root@localhost:5432/bocal"
   ```

5. **Run database migrations**
   ```bash
   pnpm migration:generate
   pnpm migration:migrate
   ```

6. **Start the development server**
   ```bash
   pnpm dev
   ```

7. **Open the application**
   
   Visit [http://localhost:3000](http://localhost:3000) in your browser.

### 🧪 Development

#### Available Scripts

```bash
# Development
pnpm dev              # Start development server with Turbopack
pnpm build            # Build for production
pnpm start            # Start production server

# Code Quality
pnpm lint             # Run Biome linter
pnpm lint:fix         # Fix linting issues
pnpm type-check       # Run TypeScript type checking

# Testing
pnpm test             # Run tests in watch mode
pnpm test:run         # Run tests once
pnpm test:ui          # Run tests with UI
pnpm test:coverage    # Run tests with coverage

# Analysis
pnpm analyze          # Analyze bundle size

# Database
pnpm migration:generate    # Generate new migrations
pnpm migration:migrate     # Run migrations
```

#### Database Management

Interact with your database using Drizzle Studio:
```bash
pnpm drizzle-kit studio
```

Access pgAdmin at [http://localhost:5050](http://localhost:5050) with:
- Email: `admin@admin.admin`
- Password: `admin`

#### OAuth Setup

1. **GitHub OAuth**:
   - Go to GitHub Settings → Developer settings → OAuth Apps
   - Create a new OAuth app with callback URL: `http://localhost:3000/api/auth/callback/github`

2. **Google OAuth**:
   - Go to Google Cloud Console → APIs & Services → Credentials
   - Create OAuth 2.0 credentials with callback URL: `http://localhost:3000/api/auth/callback/google`

### 🧪 Testing

The project uses Vitest for testing with React Testing Library:

- Tests are located in `src/test/` directory
- Test files use `.test.tsx` or `.spec.tsx` extensions
- Test utilities are available in `src/test/utils.tsx`

### 📦 Deployment

The project is configured for deployment on Vercel:

1. Push your changes to GitHub
2. Connect your repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy automatically on push to main branch

### 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests and linting (`pnpm test:run && pnpm lint`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### 📝 License

This project is licensed under the MIT License.

---

## Français

Bocal est une application web moderne qui combine un lecteur RSS et un gestionnaire de liens. Elle permet aux utilisateurs de suivre leurs sites préférés et d'organiser leurs liens dans un seul endroit.

### 🌟 Fonctionnalités

- **Lecteur RSS**: Abonnez-vous et lisez les flux RSS de vos sites préférés
- **Gestionnaire de liens**: Sauvegardez et organisez vos liens avec des tags et catégories
- **Internationalisation**: Disponible en plusieurs langues
- **Interface moderne**: Design propre et responsive avec support thème sombre/clair
- **Authentification**: Connexion OAuth sécurisée avec GitHub et Google
- **Performance**: Construit avec Next.js 15 et les technologies web modernes

### 🚀 Démo

Démo en ligne: **[bocal.fyi](https://bocal.fyi)**

### 🛠 Stack Technique

- **Framework**: Next.js 15 avec App Router
- **Langage**: TypeScript
- **Styles**: TailwindCSS + composants shadcn/ui
- **Base de données**: PostgreSQL avec Drizzle ORM
- **Authentification**: Auth.js (NextAuth.js)
- **Internationalisation**: next-intl
- **Tests**: Vitest + React Testing Library
- **Qualité de code**: Biome pour le linting et formatage
- **Déploiement**: Vercel

### 📋 Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- [Node.js](https://nodejs.org/) (v18 ou supérieur)
- [pnpm](https://pnpm.io/) gestionnaire de paquets
- [Docker](https://www.docker.com/) et [Docker Compose](https://docs.docker.com/compose/) pour la base de données
- [Git](https://git-scm.com/) pour le contrôle de version

### 🔧 Installation

1. **Cloner le repository**
   ```bash
   git clone https://github.com/mtlaso/bocal.git
   cd bocal
   ```

2. **Installer les dépendances**
   ```bash
   pnpm install
   ```

3. **Configurer la base de données PostgreSQL**

   Créez un fichier `docker-compose.yml` à la racine :
   
   ```yml
   services:
     postgres:
       container_name: bocal-postgres
       image: postgres:15
       hostname: localhost
       ports:
         - "5432:5432"
       environment:
         POSTGRES_USER: admin
         POSTGRES_PASSWORD: root
         POSTGRES_DB: bocal
       volumes:
         - postgres-data:/var/lib/postgresql/data
       restart: unless-stopped
 
     pgadmin:
       container_name: bocal-pgadmin
       image: dpage/pgadmin4
       depends_on:
         - postgres
       ports:
         - "5050:80"
       environment:
         PGADMIN_DEFAULT_EMAIL: admin@admin.admin
         PGADMIN_DEFAULT_PASSWORD: admin
       restart: unless-stopped
 
   volumes:
     postgres-data:
   ```

   Démarrer la base de données :
   ```bash
   docker-compose up -d
   ```

4. **Configurer les variables d'environnement**

   Créez un fichier `.env.local` à la racine :
   
   ```bash
   # Configuration de l'app
   APP_URL="http://localhost:3000"
   
   # Authentification (OAuth)
   # Obtenez ces valeurs depuis : https://authjs.dev/getting-started/authentication/oauth
   AUTH_GITHUB_ID="votre_github_client_id"
   AUTH_GITHUB_SECRET="votre_github_client_secret"
   AUTH_GOOGLE_ID="votre_google_client_id"
   AUTH_GOOGLE_SECRET="votre_google_client_secret"
   
   # Générez un secret : pnpm auth secret
   # Ou : openssl rand -base64 32
   AUTH_SECRET="votre_auth_secret"
   
   # Base de données
   DATABASE_URL="postgres://admin:root@localhost:5432/bocal"
   ```

5. **Exécuter les migrations**
   ```bash
   pnpm migration:generate
   pnpm migration:migrate
   ```

6. **Démarrer le serveur de développement**
   ```bash
   pnpm dev
   ```

7. **Ouvrir l'application**
   
   Visitez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

### 🧪 Développement

#### Scripts Disponibles

```bash
# Développement
pnpm dev              # Démarrer le serveur de dev avec Turbopack
pnpm build            # Build pour la production
pnpm start            # Démarrer le serveur de production

# Qualité de Code
pnpm lint             # Exécuter le linter Biome
pnpm lint:fix         # Corriger les problèmes de linting
pnpm type-check       # Vérification des types TypeScript

# Tests
pnpm test             # Exécuter les tests en mode watch
pnpm test:run         # Exécuter les tests une fois
pnpm test:ui          # Exécuter les tests avec UI
pnpm test:coverage    # Exécuter les tests avec couverture

# Analyse
pnpm analyze          # Analyser la taille du bundle

# Base de données
pnpm migration:generate    # Générer de nouvelles migrations
pnpm migration:migrate     # Exécuter les migrations
```

#### Gestion de la Base de Données

Interagissez avec votre base de données via Drizzle Studio :
```bash
pnpm drizzle-kit studio
```

Accédez à pgAdmin sur [http://localhost:5050](http://localhost:5050) avec :
- Email : `admin@admin.admin`
- Mot de passe : `admin`

### 🤝 Contribution

1. Forkez le repository
2. Créez une branche feature (`git checkout -b feature/fonctionnalite-incroyable`)
3. Faites vos modifications
4. Exécutez les tests et le linting (`pnpm test:run && pnpm lint`)
5. Commitez vos changements (`git commit -m 'Ajout fonctionnalité incroyable'`)
6. Poussez vers la branche (`git push origin feature/fonctionnalite-incroyable`)
7. Ouvrez une Pull Request

### 📝 Licence

Ce projet est sous licence MIT.
