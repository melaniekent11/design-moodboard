# Architecture

## Tech Stack
- React
- Vite
- JavaScript
- CSS
- Supabase Authentication
- Supabase PostgreSQL Database
- Netlify (deployment)

## Application Structure

### App.jsx
Main router component that manages application routes including Login, Signup, and Dashboard pages.

### Login.jsx
Handles user authentication by allowing existing users to log in using Supabase Auth.

### Signup.jsx
Allows new users to create an account using Supabase authentication.

### Dashboard.jsx
Main application page where users manage their moodboard items. This component handles:
- fetching items from the database
- creating new moodboard entries
- editing existing entries
- deleting entries
- filtering/searching items

## Database Structure

Table: `moodboard_items`

Fields:
{
  id: number,
  title: string,
  description: string,
  image_url: string,
  tags: string,
  user_id: string
}

Each record is associated with a specific authenticated user through the `user_id` field.

## Security

Row Level Security (RLS) policies are enabled in Supabase so that users can only:

- read their own moodboard items
- insert new items tied to their user account
- update their own items
- delete their own items