import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

export default function Dashboard() {
  const [items, setItems] = useState([]);
  const [title, setTitle] = useState("");

  // FETCH ITEMS FROM DATABASE
  const fetchItems = async () => {
    const { data, error } = await supabase
      .from("moodboard_items")
      .select("*");

    if (error) {
      console.log(error);
    } else {
      setItems(data);
    }
  };

  // RUN WHEN PAGE LOADS
  useEffect(() => {
    fetchItems();
  }, []);

  // ADD ITEM
  const addItem = async () => {
    await supabase
      .from("moodboard_items")
      .insert([{ title: title }]);

    fetchItems();
  };

  return (
    <div>
      <h2>Your Moodboard</h2>

      <input
        placeholder="Inspiration title"
        onChange={(e) => setTitle(e.target.value)}
      />

      <button onClick={addItem}>Add</button>

      {items.map((item) => (
        <div key={item.id}>
          {item.title}
        </div>
      ))}
    </div>
  );
}