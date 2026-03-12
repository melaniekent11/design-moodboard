import { useState } from "react";
import { supabase } from "../supabaseClient";

export default function MoodboardForm({ onItemAdded }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Get the logged-in user
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setError("You must be logged in to add items");
      setLoading(false);
      return;
    }

    // Insert item linked to user
    const { error: insertError } = await supabase
      .from("moodboard_items")
      .insert([
        {
          title,
          description,
          image_url: imageUrl,
          tags,
          user_id: user.id,
        },
      ]);

    if (insertError) {
      setError(insertError.message);
    } else {
      // Clear form on success
      setTitle("");
      setDescription("");
      setImageUrl("");
      setTags("");

      // Notify parent to refresh list
      if (onItemAdded) {
        onItemAdded();
      }
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="moodboard-form">
      <h3>Add Inspiration</h3>

      {error && <p className="error-message">{error}</p>}

      <div className="form-group">
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter title"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe this inspiration"
          rows={3}
        />
      </div>

      <div className="form-group">
        <label htmlFor="imageUrl">Image URL</label>
        <input
          id="imageUrl"
          type="url"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <div className="form-group">
        <label htmlFor="tags">Tags</label>
        <input
          id="tags"
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="e.g., typography, color, layout"
        />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? "Adding..." : "Add to Moodboard"}
      </button>
    </form>
  );
}
