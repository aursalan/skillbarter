# 🔄 Skill Barter

> A modern, full-stack platform where people exchange what they know for what they want.

- **Direct Value Exchange:** Facilitates a community-driven ecosystem for "bartering" expertise, from coding and design to language learning and manual crafts.
- **Secure Authentication:** Features a custom-built, secure session management system using JWT (JSON Web Tokens) and HTTP-only cookies.
- **Real-time Discovery:** An interactive "Explore" mode with dynamic client-side filtering and optimistic UI updates for trade management.
- **Modern Tech Stack:** Leverages the latest Next.js features, including Server Actions, React 19 hooks, and the cutting-edge Tailwind CSS.

## Table of Contents

1. [Tech Stack and Prerequisites](#1-tech-stack-and-prerequisites)
2. [Architecture](#2-architecture)
3. [How to Install and Run the Project](#3-how-to-install-and-run-the-project)
4. [How to Use the Project](#4-how-to-use-the-project)
5. [Future Improvements](#5-future-improvements)
6. [License](#6-license)

## 1. Tech Stack and Prerequisites

**Frontend:** Next.js 16, React 19, Tailwind CSS v4.\
**Backend:** Next.js 16, PostgreSQL.\
**Prerequisites:** Git, Render account.

## 2. Architecture

**Server-Side Security:** Implemented a `proxy.ts` layer to protect sensitive routes (/explore, /create, /trade, /mytrades) at the edge.\
**State Management:** Used React 19 useActionState and useTransition for seamless form submissions and loading states.\
**Optimistic UI:** Trade status toggles and deletions reflect instantly in the UI before server confirmation to enhance user perception of speed.\
**Database Singleton:** Utilizes a connection pool singleton pattern to handle database scaling within the Next.js execution environment.

## 3. How to Install and Run the Project

**1. Clone the Repository:**
```
git clone https://github.com/aursalan/skill-barter.git
cd skill-barter
```

**2. Setup the Database:**
- Create a PostgreSQl instance in Render and execute the following SQL commands to initialize your tables:
```
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE trades (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    skill_offered VARCHAR(100) NOT NULL,
    skill_wanted VARCHAR(100) NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'OPEN',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**3. Configure Environment Variables:**
- Create a `.env.local` file in the root directory and add the following:
```
DATABASE_URL=postgres://username:password@localhost:5432/skillbarter
JWT_SECRET=your_ultra_secure_secret_key
```

**4. Install Dependencies & Run:**
```
npm install
npm run dev
```
The application will be available at http://localhost:3000

## 4. How to Use the Project

Once the application is running, open your browser and navigate to http://localhost:3000.

- **Landing Page:** View a scrolling marquee of recently listed skills and learn about the platform’s mission.
- **Authentication:** Sign up with your name and email to create a profile.
- **Explore:** Browse open trades from other users. Use the search bar to filter by specific skills or keywords.
- **Post a Trade:** List a skill you are proficient in and specify what you'd like to learn in return.
- **Manage Trades:** Visit "My Trades" to edit your listings, toggle them between 'Open' and 'Closed', or delete them entirely.
- **Connect:** Click "Send Mail" on an exchange to open a pre-filled email template addressed to the skill provider.

##  5. Future Improvements

- **Internal Messaging:** Integrated chat system to negotiate trades without leaving the platform.
-  **AI Matching:** Using vector embeddings to suggest the most compatible trade partners based on "Skills Offered" vs "Skills Wanted."

## 6. License
This project is licensed under the [MIT](LICENSE) License.
