<div align="center">
  <img src="https://pjsuotdulrodtiddbawr.supabase.co/storage/v1/object/public/logo/Logo%20SIRGA.png" alt="SIRGA Logo" width="200"/>

  # SIRGA - Sistem Informasi Silsilah Keluarga 🌳

  **Preserve your family roots. Connect generations. Visualize your legacy.**

  [![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)](https://react.dev/)
  [![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
  [![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
  [![React Flow](https://img.shields.io/badge/React_Flow-Interactive-FF0072?style=for-the-badge)](https://reactflow.dev/)

</div>

---

## 📖 About SIRGA

**SIRGA** stands for *Sistem Informasi Silsilah Keluarga* (Family Tree Information System). 

As an IT Enthusiast, I realized the importance of knowing our roots and keeping the family history alive. However, tracking extended family lineages manually can be confusing and prone to being lost over time. Thus, **SIRGA** was born—a modern, interactive, and secure web application designed to help families easily visualize, manage, and preserve their generational tree.

## ✨ Key Features

- 🕸️ **Interactive Family Tree Diagram**: Beautifully rendered using `React Flow` with automated hierarchical layout via `Dagre`. Supports panning, zooming, and interactive nodes.
- 🔐 **Role-Based Access Control**:
  - **Admin**: Has absolute control via a Secret Key. Can delete members, suspend users, and view audit logs.
  - **Contributor**: Family members can register, log in, and add/edit profiles seamlessly without risking accidental deletions.
- 🗄️ **Cloud Database & Storage**: Powered by Supabase PostgreSQL for relational data mapping and Storage for uploading profile photos.
- 📝 **Activity Audit Logs**: Every modification (Add/Edit/Delete) is meticulously tracked by the system to ensure data integrity and accountability.
- 🌓 **Modern UI & Themes**: Built with Tailwind CSS, featuring a sleek, responsive design with smooth animations and seamless Light/Dark mode toggling.
- 🌐 **Bilingual (i18n)**: Fully supports both English and Bahasa Indonesia.

## 🛠️ Technology Stack

| Category | Technology |
|---|---|
| **Frontend Framework** | [Next.js (App Router)](https://nextjs.org/) & [React](https://react.dev/) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) & [Lucide Icons](https://lucide.dev/) |
| **Tree Visualization** | [React Flow](https://reactflow.dev/) + [Dagre](https://github.com/dagrejs/dagre) |
| **Backend & Auth** | [Supabase](https://supabase.com/) (PostgreSQL + Auth + Storage) |
| **Notifications** | [React Hot Toast](https://react-hot-toast.com/) |

## 🚀 Getting Started

To run this project locally, follow these steps:

### 1. Clone the repository
```bash
git clone https://github.com/MhdFarhan17/familytree.git
cd familytree
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env.local` file in the root directory and configure your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🗃️ Database Architecture

The application relies on three primary tables in Supabase:
1. `family_members`: Stores detailed individual data (name, birth, parents, spouse, etc.).
2. `profiles`: Automatically created via trigger when a new user registers in Auth.
3. `activity_logs`: Tracks all CRUD operations performed by authenticated users.

*(Note: Row Level Security (RLS) is configured to safely manage read/write access).*

---

<div align="center">
  <p>Built with ❤️ for the family by <b>Muhammad Farhan</b>.</p>
</div>
