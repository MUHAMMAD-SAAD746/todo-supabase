import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import "./App.css";

function App() {
  const [task, setTask] = useState("");
  const [todos, setTodos] = useState([]);
  const [editingId, setEditingId] = useState(null);

  // Fetch Todos
  const getTodos = async () => {
    const { data, error } = await supabase
      .from("todos")
      .select("*")
      .order("id", { ascending: false });

    if (!error) {
      setTodos(data);
    }
  };

  // Add Todo
  const addTodo = async () => {
    if (!task) return;

    const { error } = await supabase
      .from("todos")
      .insert([{ task }]);

    if (!error) {
      setTask("");
      getTodos();
    }
  };

  // Delete Todo
  const deleteTodo = async (id) => {
    const { error } = await supabase
      .from("todos")
      .delete()
      .eq("id", id);

    if (!error) {
      getTodos();
    }
  };

  // Start Edit
  const startEdit = (todo) => {
    setTask(todo.task);
    setEditingId(todo.id);
  };

  // Update Todo
  const updateTodo = async () => {
    if (!task) return;

    const { error } = await supabase
      .from("todos")
      .update({ task })
      .eq("id", editingId);

    if (!error) {
      setTask("");
      setEditingId(null);
      getTodos();
    }
  };

  useEffect(() => {
    getTodos();
  }, []);

  return (
    <div className="container">
      <div className="todo-box">
        <h1>Todo App</h1>

        <div className="input-group">
          <input
            type="text"
            placeholder="Enter task..."
            value={task}
            onChange={(e) => setTask(e.target.value)}
          />

          {editingId ? (
            <button
              className="update-btn"
              onClick={updateTodo}
            >
              Update
            </button>
          ) : (
            <button
              className="add-btn"
              onClick={addTodo}
            >
              Add
            </button>
          )}
        </div>

        <div className="todo-list">
          {todos.map((todo) => (
            <div className="todo-item" key={todo.id}>
              <p>{todo.task}</p>

              <div className="btn-group">
                <button
                  className="edit-btn"
                  onClick={() => startEdit(todo)}
                >
                  Edit
                </button>

                <button
                  className="delete-btn"
                  onClick={() => deleteTodo(todo.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;