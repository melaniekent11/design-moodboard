import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

export default function MoodboardGrid({ refreshTrigger }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Edit state
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editTags, setEditTags] = useState("");
  const [saving, setSaving] = useState(false);

  // Delete state
  const [deletingId, setDeletingId] = useState(null);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");

  const fetchItems = async () => {
    setLoading(true);
    setError(null);

    // Get the logged-in user
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setError("You must be logged in to view items");
      setLoading(false);
      return;
    }

    // Fetch only items belonging to this user
    const { data, error: fetchError } = await supabase
      .from("moodboard_items")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (fetchError) {
      setError(fetchError.message);
    } else {
      setItems(data || []);
    }

    setLoading(false);
  };

  // Fetch on mount and when refreshTrigger changes
  useEffect(() => {
    fetchItems();
  }, [refreshTrigger]);

  // Start editing an item
  const startEdit = (item) => {
    setEditingId(item.id);
    setEditTitle(item.title || "");
    setEditDescription(item.description || "");
    setEditTags(item.tags || "");
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
    setEditDescription("");
    setEditTags("");
  };

  // Save edited item to Supabase
  const saveEdit = async (itemId) => {
    setSaving(true);

    const { error: updateError } = await supabase
      .from("moodboard_items")
      .update({
        title: editTitle,
        description: editDescription,
        tags: editTags,
      })
      .eq("id", itemId);

    if (updateError) {
      setError(updateError.message);
    } else {
      // Update local state
      setItems((prev) =>
        prev.map((item) =>
          item.id === itemId
            ? { ...item, title: editTitle, description: editDescription, tags: editTags }
            : item
        )
      );
      cancelEdit();
    }

    setSaving(false);
  };

  // Delete item from Supabase
  const deleteItem = async (itemId) => {
    if (!window.confirm("Are you sure you want to delete this item?")) {
      return;
    }

    setDeletingId(itemId);

    const { error: deleteError } = await supabase
      .from("moodboard_items")
      .delete()
      .eq("id", itemId);

    if (deleteError) {
      setError(deleteError.message);
    } else {
      // Remove from local state
      setItems((prev) => prev.filter((item) => item.id !== itemId));
    }

    setDeletingId(null);
  };

  // Filter items by title or tags
  const filteredItems = items.filter((item) => {
    if (!searchQuery.trim()) return true;

    const query = searchQuery.toLowerCase();
    const titleMatch = item.title?.toLowerCase().includes(query);
    const tagsMatch = item.tags?.toLowerCase().includes(query);

    return titleMatch || tagsMatch;
  });

  if (loading) {
    return <p className="loading-message">Loading your moodboard...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  if (items.length === 0) {
    return <p className="empty-message">No inspirations yet. Add your first one!</p>;
  }

  return (
    <div className="moodboard-container">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by title or tags..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="clear-search-btn"
          >
            Clear
          </button>
        )}
      </div>

      {filteredItems.length === 0 ? (
        <p className="empty-message">No items match "{searchQuery}"</p>
      ) : (
        <div className="moodboard-grid">
          {filteredItems.map((item) => (
        <div key={item.id} className="moodboard-card">
          {item.image_url && (
            <div className="card-image">
              <img src={item.image_url} alt={item.title} />
            </div>
          )}

          <div className="card-content">
            {editingId === item.id ? (
              // Edit form
              <div className="edit-form">
                <div className="form-group">
                  <label htmlFor={`edit-title-${item.id}`}>Title</label>
                  <input
                    id={`edit-title-${item.id}`}
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor={`edit-description-${item.id}`}>Description</label>
                  <textarea
                    id={`edit-description-${item.id}`}
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor={`edit-tags-${item.id}`}>Tags</label>
                  <input
                    id={`edit-tags-${item.id}`}
                    type="text"
                    value={editTags}
                    onChange={(e) => setEditTags(e.target.value)}
                  />
                </div>

                <div className="edit-actions">
                  <button
                    onClick={() => saveEdit(item.id)}
                    disabled={saving}
                    className="save-btn"
                  >
                    {saving ? "Saving..." : "Save"}
                  </button>
                  <button
                    onClick={cancelEdit}
                    disabled={saving}
                    className="cancel-btn"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              // Display mode
              <>
                <h4 className="card-title">{item.title}</h4>

                {item.description && (
                  <p className="card-description">{item.description}</p>
                )}

                {item.tags && (
                  <div className="card-tags">
                    {item.tags.split(",").map((tag, index) => (
                      <span key={index} className="tag">
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                )}

                <div className="card-actions">
                  <button
                    onClick={() => startEdit(item)}
                    className="edit-btn"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="delete-btn"
                    disabled={deletingId === item.id}
                  >
                    {deletingId === item.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      ))}
        </div>
      )}
    </div>
  );
}
