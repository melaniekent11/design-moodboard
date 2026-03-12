import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function Dashboard() {
  const [items, setItems] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [tag, setTag] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editTag, setEditTag] = useState("");

  const navigate = useNavigate();

  const fetchItems = async () => {
    const user = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from("moodboard_items")
      .select("*")
      .eq("user_id", user.data.user.id)
      .order("id", { ascending: false });

    if (error) {
      alert(error.message);
      console.log(error);
    } else {
      setItems(data || []);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const addItem = async () => {
    const user = await supabase.auth.getUser();

    const { error } = await supabase
      .from("moodboard_items")
      .insert([
        {
          title,
          description,
          image_url: imageUrl,
          tags: tag,
          user_id: user.data.user.id,
        },
      ]);

    if (error) {
      alert(error.message);
      console.log(error);
    } else {
      setTitle("");
      setDescription("");
      setImageUrl("");
      setTag("");
      fetchItems();
    }
  };

  const deleteItem = async (id) => {
    const { error } = await supabase
      .from("moodboard_items")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
      console.log(error);
    } else {
      fetchItems();
    }
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setEditTitle(item.title || "");
    setEditDescription(item.description || "");
    setEditTag(item.tags || "");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
    setEditDescription("");
    setEditTag("");
  };

  const saveEdit = async (id) => {
    const { error } = await supabase
      .from("moodboard_items")
      .update({
        title: editTitle,
        description: editDescription,
        tags: editTag,
      })
      .eq("id", id);

    if (error) {
      alert(error.message);
      console.log(error);
    } else {
      cancelEdit();
      fetchItems();
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const filteredItems = items.filter((item) => {
    const titleMatch = item.title
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());

    const tagMatch = item.tags
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());

    return titleMatch || tagMatch;
  });

  return (
    <div className="dashboard-page">
      <div className="dashboard-shell">
        <div className="dashboard-header">
          <h2>Your Moodboard</h2>
          <button className="logout-button" onClick={logout}>
            Logout
          </button>
        </div>

        <div className="add-form">
          <input
            placeholder="Inspiration title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            placeholder="Image URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />

          <input
            placeholder="Tag or category"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
          />

          <textarea
            placeholder="Description or notes"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <button onClick={addItem}>Add Moodboard Item</button>
        </div>

        <div className="add-form" style={{ marginTop: "0", marginBottom: "24px" }}>
          <input
            placeholder="Search by title or tag"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {filteredItems.length === 0 ? (
          <div className="empty-state">
            No inspiration matches your search or no items have been added yet.
          </div>
        ) : (
          <div className="moodboard-grid">
            {filteredItems.map((item) => (
              <div className="moodboard-card" key={item.id}>
                <img
                  src={
                    item.image_url?.trim()
                      ? item.image_url
                      : "https://placehold.co/600x400?text=Design+Inspiration"
                  }
                  alt={item.title}
                />

                <div className="card-content">
                  {editingId === item.id ? (
                    <>
                      <input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        style={{ marginBottom: "10px" }}
                      />

                      <textarea
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        style={{ marginBottom: "10px", width: "100%" }}
                      />

                      <input
                        value={editTag}
                        onChange={(e) => setEditTag(e.target.value)}
                        style={{ marginBottom: "10px" }}
                      />

                      <div className="card-actions">
                        <button onClick={() => saveEdit(item.id)}>Save</button>
                        <button onClick={cancelEdit}>Cancel</button>
                      </div>
                    </>
                  ) : (
                    <>
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>

                      {item.tags && <span className="card-tag">{item.tags}</span>}

                      <div className="card-actions">
                        <button onClick={() => startEdit(item)}>Edit</button>
                        <button onClick={() => deleteItem(item.id)}>Delete</button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}