# Architecture

## Tech Stack
- React
- Vite
- JavaScript
- CSS
- localStorage
- Netlify

## Components

### App.jsx
Main application component that manages state.

### InspirationForm.jsx
Form that allows users to add new inspiration items.

### InspirationList.jsx
Displays inspiration cards.

### InspirationCard.jsx
Individual inspiration item card.

## Data Model

### Inspiration Item
```js
{
  id: string,
  title: string,
  imageUrl: string,
  sourceLink: string,
  notes: string,
  projectName: string,
  category: string,
  createdAt: string
}