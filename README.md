# SocialMedia Chat App

Messaging project with authentication, direct chat, and group channels. Backend in Node.js + Prisma, frontend in React/Vite, and real-time communication with Socket.IO (WebSockets).

## 🧩 Repository structure

- `Backend/`
  - `NodeRouters.js`: Express server + Socket.IO with JWT authentication and CORS.
  - `src/`:
    - `models/`: protected routes and REST endpoints.
    - `Messages/`: endpoints for direct messages (create, edit, delete).
    - `GroupMessages/`: endpoints for channel messages.
    - `middleware/TokenVerify.auth.js`: validates JWT and sets `req.user`/`req.login`.
    - `socket/index.js`: socket logic in reusable module (for later refactor).
  - `prisma/`:
    - `schema.prisma`: data models for `users`, `logins`, `direct_messages`, `messages`, `channels`, etc.
    - `db.js`: Prisma client.

- `fronted/` (frontend)
  - `src/App.jsx`, `src/main.jsx`: React app entry and routes.
  - `src/Context/`: global state providers (user data, theme, sidebar).
  - `src/Components/Content/`: direct and group chat pages.
  - `src/utils/socket.js`: Socket.IO client (dynamic URL and websocket transport).
  - `src/Pages/LoginPage.jsx`: login form that posts to `/public/login`.

## ⚙️ Main dependencies

- Backend:
  - `express`, `cors`, `cookie-parser`, `jsonwebtoken`, `socket.io`, `prisma`, `bcrypt`
- Frontend:
  - `react`, `react-dom`, `react-router-dom`, `react-hook-form`, `socket.io-client`

## 🛠️ Environment variables

### Backend (`Backend/.env`)
- `JWT_SECRET` (JWT secret key)
- `DATABASE_URL` (PostgreSQL connection string for Render or local)
- `PORT` (optional, default `3000`)

### Frontend (`fronted/.env`)
- `VITE_API_URL=https://socialmedia-khe0.onrender.com` (or your deployed backend URL)

## 🚀 Local run instructions

### Backend

```bash
cd Backend
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

### Frontend

```bash
cd fronted
npm install
npm run dev
```

## 🔐 Authentication and sockets

- Login at `/public/login` sets a cookie named `token` with `httpOnly`, `sameSite: none`, and `secure: true`.
- Middleware `TokenVerify.auth.js` reads the cookie or `Authorization` header and verifies JWT.
- Socket.IO backend validates JWT from:
  - `socket.handshake.auth.token` (preferred)
  - `socket.handshake.headers.cookie` (fallback cookie token)

- Important socket events:
  - Direct chat: `join_room`, `send_message`, `receive_message`
  - Channel chat: `join_channel`, `send_message_room`, `receive_message_room`

## 💬 Message persistence

- `db.direct_messages.create(...)` saves direct entries in `direct_messages` table.
- `db.messages.create(...)` saves channel entries in `messages` table.

## 🧰 Known REST routes

- `POST /public/login` (login and set token cookie)
- `GET /public/logout`
- `POST /private/Start_Message_ByID/:receiverid` (open a direct message thread, empty starter message)
- `PUT /private/Update_Direct_Messages/:messageid`
- `GET /private/Direct_Messages/:senderid`
- `GET /private/Get_channel_messages/:channelid`

## 🐞 Common troubleshooting

1. If sockets do not connect:
   - Check `src/utils/socket.js` and `VITE_API_URL` value.
   - Open DevTools Network > WS to verify handshake and auth token.
2. If messages are not stored: 
   - Confirm `socket.on("send_message")` fires and server does not disconnect before operation.
   - Check `direct_messages` table and Prisma migrations.
3. CORS: Verify `allowedOrigins` in `NodeRouters.js` includes both frontend and Render URL.

## 📦 Deployment (Render)

- Backend: configure branch and build command in Render.
  - Example: `npm install && npx prisma generate && npx prisma migrate deploy && npm start`
- Frontend: build via `npm run build` and serve `dist` (Netlify/Vercel/GH Pages + API on Render)
- Ensure `VITE_API_URL` points to the deployed backend URL on render.

## 🧩 Final notes

- `fronted/src/utils/socket.js` has dynamic backend URL and fallback to localhost.
- For cross-site cookie restrictions, prefer using token in socket auth (`handshake.auth`) from localStorage.



