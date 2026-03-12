# Design Moodboard

## Project Description
Design Moodboard is a web application that allows UX/UI designers to save and organize design inspiration for different projects. Users can create inspiration entries with titles, descriptions, image URLs, and tags, then manage them through editing, deleting, and filtering tools. The goal of the project is to help designers keep creative references organized in one place for future design work.

## Features
1. User sign up with Supabase authentication
2. User login and logout
3. Add moodboard items with a title, description, image URL, and tag
4. View saved moodboard items in a card-based layout
5. Edit existing moodboard items
6. Delete moodboard items
7. Search or filter moodboard items by title or tag
8. User-specific data so each user only sees their own moodboard items

## Tech Stack
- React
- Vite
- JavaScript
- CSS
- Supabase Authentication
- Supabase Database
- GitHub
- Netlify

## Setup Instructions
1. Clone the repository
2. Open the project folder in VS Code
3. Run `npm install`
4. Create a Supabase project
5. Add your Supabase Project URL and anon key in `src/supabaseClient.js`
6. Run `npm run dev`
7. Open the local development link in your browser

## Architecture Overview
The frontend was built with React and Vite. The application uses separate pages for login, signup, and the user dashboard. Supabase handles both authentication and the cloud database. The dashboard page is responsible for fetching, displaying, creating, updating, and deleting moodboard items for the currently logged-in user.

## Database Structure
The main database table is `moodboard_items`.

Fields used in the table:
- `id`
- `user_id`
- `title`
- `description`
- `image_url`
- `tags`

Row Level Security policies are used so authenticated users can only create, read, update, and delete their own moodboard items.

## Known Bugs or Limitations
- Image uploads currently use image URLs instead of direct file uploads
- The layout is responsive, but additional polish could improve the mobile experience further
- Tags are currently stored as a simple text field rather than a more advanced multi-tag system

## What I Learned
This project helped me understand how AI can support full-stack web development, but also showed me that I still need to carefully test and review everything it generates. AI was especially helpful for scaffolding components, debugging Supabase policies, and improving the UI structure. I learned that clear prompts and step-by-step iteration lead to much better results than trying to generate everything at once. I also gained more confidence working with authentication, cloud databases, and deployment.