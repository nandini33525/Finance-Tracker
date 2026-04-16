# 💰 Finwise — Personal Finance Tracker

A full-stack MERN (MongoDB, Express, React, Node.js) finance tracker with JWT authentication, per-user data persistence, and a beautiful dark UI.

---

## 📁 Project Structure

```
finwise-app/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── middleware/
│   │   ├── auth.js               # JWT protect middleware
│   │   └── validate.js           # express-validator rules
│   ├── models/
│   │   ├── User.js               # User schema (bcrypt password hashing)
│   │   ├── Expense.js            # Expense schema
│   │   └── Goal.js               # Goal schema (with virtual fields)
│   ├── routes/
│   │   ├── auth.js               # POST /register, /login, GET /me, PUT /profile, /password
│   │   ├── expenses.js           # Full CRUD for expenses (user-scoped)
│   │   └── goals.js              # Full CRUD for goals (user-scoped)
│   ├── server.js                 # Express entry point
│   └── package.json
│
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── UI.jsx            # Panel, BtnP, BtnG, Field, Modal, Alert, DonutChart…
│       │   └── Sidebar.jsx       # Navigation sidebar
│       ├── constants/
│       │   └── categories.js     # CAT_COLORS, CAT_ICONS, CATEGORIES
│       ├── hooks/
│       │   ├── useAuth.js        # Login, register, logout, updateProfile, changePassword
│       │   ├── useExpenses.js    # Full CRUD + real-time state sync
│       │   └── useGoals.js       # Full CRUD + real-time state sync
│       ├── pages/
│       │   ├── LandingPage.jsx   # Public marketing page
│       │   ├── AuthPage.jsx      # Sign in / Sign up
│       │   ├── DashboardPage.jsx # Overview with all widgets
│       │   ├── ExpensesPage.jsx  # Expense CRUD with filters
│       │   └── OtherPages.jsx    # Analytics, Insights, Goals, Settings, Profile
│       ├── styles/
│       │   └── global.css        # Animations, utility classes, fonts
│       ├── utils/
│       │   ├── api.js            # Axios instance with JWT interceptor
│       │   └── formatters.js     # fmt(), todayStr(), greeting()…
│       ├── App.js                # Root routing logic
│       └── index.js              # React entry point
│
├── .env                          # Root env (backend reads this)
└── README.md
```

---

## 🚀 Setup & Run

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier works perfectly)

---

### 1. Clone / unzip the project

```bash
cd finwise-app
```

---

### 2. Configure Environment Variables

Edit the root `.env` file:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/finwise?retryWrites=true&w=majority
JWT_SECRET=your_random_64_char_secret_here
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000
```

**Generate a strong JWT secret:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

### 3. Start the Backend

```bash
cd backend
npm install
npm run dev          # Starts on http://localhost:5000
```

You should see:
```
✅  MongoDB connected: cluster0.xxxxx.mongodb.net
🚀  Server running on http://localhost:5000  [development]
```

---

### 4. Start the Frontend

```bash
cd ../frontend
npm install
npm start            # Starts on http://localhost:3000
```

---

## 🔑 How Data Persistence Works

| Action | What Happens |
|--------|-------------|
| **Register** | New User document created in MongoDB; JWT issued |
| **Login** | JWT issued; stored in `localStorage` |
| **Use app** | Every API call sends JWT → backend scopes data to `req.user._id` |
| **Logout** | JWT removed from `localStorage`; **MongoDB data untouched** |
| **Login again** | Same JWT flow → all expenses and goals restored from DB |
| **Different user logs in** | Different `_id` → different data; zero overlap |

---

## 🛡️ API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Sign in, get JWT |
| GET  | `/api/auth/me` | Get current user (protected) |
| PUT  | `/api/auth/profile` | Update profile (protected) |
| PUT  | `/api/auth/password` | Change password (protected) |

### Expenses (all protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/expenses` | All user's expenses |
| POST   | `/api/expenses` | Create expense |
| PUT    | `/api/expenses/:id` | Update expense |
| DELETE | `/api/expenses/:id` | Delete expense |

### Goals (all protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/goals` | All user's goals |
| POST   | `/api/goals` | Create goal |
| PUT    | `/api/goals/:id` | Update goal |
| DELETE | `/api/goals/:id` | Delete goal |

---

## 🌐 Deploy

### Backend → Render / Railway
1. Push to GitHub
2. Create Web Service → connect repo
3. Build command: `npm install`
4. Start command: `node server.js`
5. Add env vars (MONGO_URI, JWT_SECRET, CLIENT_URL)

### Frontend → Vercel
1. Push `frontend/` to GitHub (or as subdirectory)
2. Import to Vercel
3. Add `REACT_APP_API_URL=https://your-backend.onrender.com/api`
4. Deploy

---

## 🐛 Delete Bug Fix (from earlier)

The original "undefined ID" bug is fixed in `routes/expenses.js`:

```js
// ✅ FIXED — uses _id (MongoDB ObjectId) and scopes to current user
const expense = await Expense.findOneAndDelete({
  _id:  req.params.id,   // Correct field name
  user: req.user._id,    // Security: user can only delete their own
});
```

And in the frontend `useExpenses.js`:
```js
// ✅ FIXED — uses expense._id not expense.id
await api.delete(`/expenses/${id}`);
setExpenses((prev) => prev.filter((e) => e._id !== id));
```
