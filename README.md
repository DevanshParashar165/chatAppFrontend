# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# 💬 ChatApp – Modern Realtime Chat UI (Frontend)

ChatApp is a modern, responsive and interactive chat application interface inspired by platforms like WhatsApp and Messenger. The goal of the project is to provide a seamless chatting experience with an attractive UI, animated transitions, and multi-section layout — including a sidebar, chat window and user information panel. This repository contains the complete **frontend** of the application built using **React and Tailwind CSS**, structured for scalability and easy integration with a backend (Node.js + MongoDB + Socket.io).

---

## 🚀 Features

✔ Fully responsive and mobile-friendly UI  
✔ Sidebar with user list and search bar  
✔ Chat window with sent & received message bubbles  
✔ Media preview inside message container  
✔ Auto-scroll to latest message  
✔ Right sidebar for user profile and shared media gallery  
✔ Login & Signup pages with two-step account creation  
✔ Smooth navigation using React Router  
✔ Modern glassmorphism and gradient UI design  

---

## 🏗️ Tech Stack

| Technology | Usage |
|-----------|--------|
| **React.js** | Component-based frontend architecture |
| **React Router** | Client-side routing |
| **Tailwind CSS** | Styling & responsive UI |
| **JavaScript (ES6+)** | Core language |
| **Axios (future integration)** | API communication |
| **Cloudinary (future integration)** | Image/Video uploads |
| **Vite / CRA** | Build and development environment |

---

## 📁 Folder Structure


---

## 🔍 Page & Component Breakdown

### 🏠 HomePage
- Displays chat dashboard
- Dynamically switches between **2-column** and **3-column** layout based on selected user
- Includes Sidebar, ChatContainer, and RightSidebar

### 🟩 Sidebar
- Developer list with online/offline status
- Search user bar
- Dropdown menu with Edit Profile & Logout
- Select user → open chat

### 💭 ChatContainer
- Chat messages UI (sender/receiver layout)
- Auto-scroll to bottom
- Image and text message support (dummy data for now)
- Message input box + gallery icon + send button

### 🧑‍🤝‍🧑 RightSidebar
- Shows selected user profile
- Bio and activity preview
- Shared media gallery
- Logout button (UI only)

### 🔐 LoginPage
- Dual-mode: **Sign Up ↔ Login**
- Two-step signup → user details → bio entry
- Clean & responsive UI

---

## 🖼 Screenshots (Optional)
> Add UI screenshots here once available for better presentation

---

## 🔧 How to Run Locally

```bash
# Clone the repository
git clone <repo-url>

# Navigate to project folder
cd chatapp-frontend

# Install dependencies
npm install

# Start development server
npm run dev

