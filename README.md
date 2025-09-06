# Trampo Fácil — Ionic Vue (mobile-first)

Mobile app with **Vue 3 + Ionic Vue + Pinia + Vue Router + Tailwind**. 
**Health-check screen removed**.

## Endpoints
POST /auth/sign-in
POST /auth/worker/sign-up
GET /job/categories
GET /job/category/:categoryId/occupations
GET /locales/states
GET /locales/state/:code/cities
GET /worker/paginated

## Run
cp .env.example .env
npm i
npm run dev
