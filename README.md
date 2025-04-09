# Bocal
[*english*](#En)

Bocal est une application qui combine un lecteur RSS et un gestionnaire de liens.
Elle permet aux utilisateurs de suivre leurs sites préférés et d'organiser leurs liens dans un seul endroit.

# Demo
Lien: [bocal.fyi](https://bocal.fyi)

# Stack

- Next.js
- TailwindCSS
- shadcn/ui
- next-intl (i18n)
- PostgreSQL
- DrizzleORM
- Auth.js (authentification)

# Installation

1. Cloner le repo

2. Installer les dépendances : `pnpm install` (**installer pnpm au préalable**)

3. Setup PostgreSQL

    * Créer une base de données PostgreSQL (avec Docker/docker-compose)
    ```yml
    # docker-compose.yml
    services:
      postgres:
        container_name: bocal-postgres
        image: postgres
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
        container_name: container-pgadmin
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
  
    * Lancer la base de données: `docker-compose up -d # docker-compose down`

5. Crée un ficher `.env` et configurer les variables d'environnement ([set up OAuth avec GitHub et Google](https://authjs.dev/getting-started/authentication/oauth))
```bash
APP_URL="http://localhost:3000"
AUTH_GITHUB_ID=""
AUTH_GITHUB_SECRET=""
AUTH_GOOGLE_ID=""
AUTH_GOOGLE_SECRET=""
# pnpm auth secret - https://authjs.dev/getting-started/installation
AUTH_SECRET=""
DATABASE_URL="postgres://.../bocal" (voir docker-compose.yml)
```

5. Lancer les migrations: `pnpm drizzle-kit push` (le schéma de la base de données est basé sur les modèles de [Auth.js](https://authjs.dev/))

6. Démarrer le serveur de développement: `pnpm dev`

7. Ouvrir [http://localhost:3000](http://localhost:3000) dans votre navigateur pour voir le résultat.

8. Vous pouvez aussi utiliser drizzle-kit studio pour intéragir avec la base de données : `pnpm drizzle-kit studio`

---
# En

# Bocal

Bocal is an application that combines an RSS reader with a bookmark manager. It allows users to follow their favorite websites and organize their links in one place.

# Demo
Link: [bocal.dnncrye.dev](https://bocal.dnncrye.dev)

# Tech Stack

Next.js
TailwindCSS
shadcn/ui
next-intl (i18n)
PostgreSQL
DrizzleORM
Auth.js (authentication)

# Installation

1. Clone the repository

2. Install dependencies: `pnpm install` (**setup pnpm in needed**)

3. Setup PostgreSQL
    * Create a docker-compose.yml file:
    ```yml
    # docker-compose.yml
    services:
      postgres:
        container_name: bocal-postgres
        image: postgres
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
        container_name: container-pgadmin
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
    * Start the database: `docker-compose up -d # docker-compose down`

4. Create a .env file in the root directory and configure the environment variables ([set up OAuth avec GitHub et Google](https://authjs.dev/getting-started/authentication/oauth))
```bash
APP_URL="http://localhost:3000"
AUTH_GITHUB_ID=""
AUTH_GITHUB_SECRET=""
AUTH_GOOGLE_ID=""
AUTH_GOOGLE_SECRET=""
# pnpm auth secret - https://authjs.dev/getting-started/installation
AUTH_SECRET=""
DATABASE_URL="postgres://.../bocal" (see docker-compose.yml)
```

5. Run the migrations: `pnpm drizzle-kit push`

6. Start the development server: `pnpm dev`

7. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

8. You can also use drizzle-kit studio to interact with the database: `pnpm drizzle-kit studio`
