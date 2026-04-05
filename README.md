# ⚡ NextFlow AI — Workflow Automation Builder

A modern **no-code workflow builder** inspired by Krea.ai, built with **Next.js, React Flow, Prisma, and Clerk**.

Users can visually create workflows with nodes like Text, Image, Video, LLM, Crop, and Extract Frame, and execute them with real-time chaining and parallel processing.

<img width="1910" height="874" alt="image" src="https://github.com/user-attachments/assets/f2bed4ba-3f5e-4d34-a154-2c82e6fee828" />


---

## 🚀 Features


### 🧠 Core Functionality
- Drag & drop workflow builder (React Flow)
- Node-based execution system
- Input/output chaining between nodes
- Parallel execution of independent nodes
- Convergence handling (multiple inputs → one node)

---

### 🧩 Supported Nodes
- 📝 Text Node
- 🖼 Upload Image Node
- 🎥 Upload Video Node
- 🤖 LLM Node (Gemini API)
- ✂️ Crop Image Node (mock / extendable)
- 🎞 Extract Frame Node (mock / extendable)

---

### 🎯 Execution Engine
- Dependency graph-based execution
- Recursive node execution
- Handles:
  - Sequential flows
  - Parallel flows
  - Multi-input convergence

---

### 📊 History System
- Run history tracking
- Node-level results storage
- Right-side history panel UI

---

### 🔐 Authentication (Clerk)
- Secure login/signup
- Protected routes
- User-based workflow system

---

### 🎨 UI/UX
- Dark modern UI (Krea-inspired)
- Glassmorphism panels
- Smooth animations
- Responsive layout

---

## 🛠 Tech Stack

| Tech | Usage |
|------|------|
| Next.js 14 | App Router |
| React Flow | Workflow canvas |
| Tailwind CSS | Styling |
| Clerk | Authentication |
| Prisma | ORM |
| PostgreSQL | Database |
| Gemini API | LLM integration |

---

## ⚙️ Installation

```bash
git clone https://github.com/your-username/nextflow-ai.git
cd nextflow-ai
npm install

🔑 Environment Variables

Create .env file:

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key
CLERK_SECRET_KEY=your_key

DATABASE_URL=your_db_url

NEXT_PUBLIC_GEMINI_API_KEY=your_key
▶️ Run Locally
npm run dev

App runs at:

http://localhost:3000
🧪 Example Workflow
Add Text Node
Connect to LLM Node
Run workflow
View output in logs/history
📁 Folder Structure
app/
  api/
    run/
    workflow/
    history/
components/
  Canvas.tsx
  Sidebar.tsx
  Navbar.tsx
  RightPanel.tsx
  nodes/
store/
  useStore.ts
🚀 Deployment

Deploy easily on Vercel:

vercel
📌 Future Improvements
Real FFmpeg integration (crop/extract)
Trigger.dev async execution
Live node execution animation
Workflow templates
Export as shareable links


👨‍💻 Author
Bambam Kumar Gupta
B.Tech — MNNIT Allahabad
