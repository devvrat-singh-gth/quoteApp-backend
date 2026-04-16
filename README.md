# ⚙️ QuoteVault Backend

Backend API for **QuoteVault**, built using Node.js, Express, and MongoDB.
It handles all quote operations including creation, retrieval, updating, deletion, and password-based access control.

---

## 🚀 Features

* **RESTful API** for quotes (CRUD operations)
* **Password-protected** specific quotes
* **Master password** override functionality
* **MongoDB** database integration with Mongoose
* **Input validation** and robust error handling

---

## 🛠️ Tech Stack

* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB + Mongoose
* **Utilities:** `dotenv`, `cors`

---

## 🏗️ Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/your-username/quoteApp-backend.git
cd quoteApp-backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
MASTER_PASSWORD=your_admin_password
```

### 4. Run the server

```bash
# Development (Auto-restart)
npm run dev

# Production
npm start
```

---

## 📡 API Endpoints

**Base URL:** `/api/v1/quotes`

| Method | Endpoint      | Description                                       |
| ------ | ------------- | ------------------------------------------------- |
| GET    | `/`           | Welcome message                                   |
| GET    | `/quotes`     | Get all quotes                                    |
| POST   | `/quotes`     | Create a new quote                                |
| GET    | `/quotes/:id` | Get single quote (password required if protected) |
| PUT    | `/quotes/:id` | Update quote (requires password)                  |
| DELETE | `/quotes/:id` | Delete quote (requires password)                  |

---

## 🔐 Password Logic

* **Protection:** Quotes can be optionally protected with a password
* **Verification:** Required for editing or deleting
* **Master Key:** A master password can override any individual quote password
* ⚠️ **Note:** Passwords are currently stored in plain text (security improvement pending)

---

## ⚠️ Error Handling

* **400** → Invalid ID Format
* **401** → Incorrect Password
* **404** → Quote Not Found
* **500** → Internal Server Error

---

## 🎯 Future Improvements

* User authentication (JWT + bcrypt)
* Hashing quote passwords for security
* Rate limiting & API throttling
* Role-based access control (RBAC)
