// import React from 'react';
// import { RiAddLine } from '@remixicon/react';

// const todos = [
//   {
//     id: 1,
//     title: 'Upload story for adidas campaign',
//     due: '2 Days',
//     completed: true,
//   },
//   {
//     id: 2,
//     title: 'Responds to brief for Samsung',
//     due: '2 Days',
//     completed: false,
//   },
//   {
//     id: 3,
//     title: 'Upload story for adidas campaign',
//     due: '2 Days',
//     completed: true,
//   },
//   {
//     id: 4,
//     title: 'Reel approved by Puma',
//     due: '2 Days',
//     completed: false,
//   },
//   {
//     id: 5,
//     title: 'Reel approved by Puma',
//     due: '5 Days',
//     completed: true,
//   },
// ];

// const TodoListCard = () => {
//   return (
//     <div className="bg-white p-6 rounded-2xl w-full">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-5">
//         <h2 className="text-lg font-semibold">To-do List</h2>
//         <button className="border border-gray-300 rounded-full px-3 py-1 text-sm flex items-center gap-1">
//           <RiAddLine className="inline" /> Add
//         </button>
//       </div>

//       {/* Todo Items */}
//       <div className="space-y-4">
//         {todos.map((todo) => (
//           <div key={todo.id} className="flex items-center gap-4 border-b-1 border-gray-200 pb-3">
//             <input
//               type="checkbox"
//               checked={todo.completed}
//               readOnly
//               className="mt-1 form-checkbox h-5 w-5 text-blue-600"
//             />
//             <div>
//               <p className="text-sm font-medium mb-2">{todo.title}</p>
//               <p className="text-xs text-gray-500">Due In: {todo.due}</p>
//             </div>
//             <i className="ri-more-2-fill ml-auto text-gray-400 hover:text-gray-600 cursor-pointer"></i>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default TodoListCard;




import React, { useState, useEffect } from "react";
import { RiAddLine } from "@remixicon/react";
import axios from "axios";
import { useSelector } from "react-redux";

const TodoListCard = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [formData, setFormData] = useState({ description: "", duedate: "" });

  const { token, user } = useSelector((state) => state.auth);

  // Fetch Todos (example endpoint, adjust as needed)
  const getTodoList = async () => {
    try {
      setLoading(true);
      const res = await axios.get("user/dashboard/todo-list", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTodos(res.data.data || []);
    } catch (error) {
      console.error("Error fetching todos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTodoList();
  }, []);

  // 🧩 One unified API call
  const handleTodoAction = async ({
    id,
    description,
    duedate,
    isCompleted = null,
    isDeleted = false,
  }) => {
    try {
      const body = {
        p_userid: user?.id,
        p_todolistid: id || null,
        p_description: description || null,
        p_duedate: duedate || null,
        p_iscompleted: isCompleted,
        p_isdeleted: isDeleted,
      };

      await axios.post("user/dashboard/todo/insert-edit-delete", body, {
        headers: { Authorization: `Bearer ${token}` },
      });

      await getTodoList();
      setShowModal(false);
      setSelectedTodo(null);
      setFormData({ description: "", duedate: "" });
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  // Form submit → add or edit
  const handleSubmit = (e) => {
    e.preventDefault();
    handleTodoAction({
      id: selectedTodo?.id || null,
      description: formData.description,
      duedate: formData.duedate,
    });
  };

  // Open modal
  const openModal = (todo = null) => {
    setSelectedTodo(todo);
    setFormData(
      todo
        ? { description: todo.title, duedate: todo.due }
        : { description: "", duedate: "" }
    );
    setShowModal(true);
  };

  return (
    <div className="bg-white p-6 rounded-2xl w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-lg font-semibold">To-do List</h2>
        <button
          onClick={() => openModal()}
          className="border border-gray-300 rounded-full px-3 py-1 text-sm flex items-center gap-1"
        >
          <RiAddLine className="inline" /> Add
        </button>
      </div>

      {/* Todos */}
      <div className="space-y-4">
        {loading ? (
          <p>Loading...</p>
        ) : todos.length === 0 ? (
          <p className="text-gray-400 text-sm">No todos yet.</p>
        ) : (
          todos.map((todo) => (
            <div
              key={todo.id}
              className="flex items-center gap-4 border-b border-gray-200 pb-3"
            >
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() =>
                  handleTodoAction({
                    id: todo.id,
                    isCompleted: !todo.completed,
                  })
                }
                className="mt-1 form-checkbox h-5 w-5 text-blue-600 cursor-pointer"
              />
              <div>
                <p
                  className={`text-sm font-medium mb-1 ${
                    todo.completed ? "line-through text-gray-400" : ""
                  }`}
                >
                  {todo.title}
                </p>
                <p className="text-xs text-gray-500">Due In: {todo.due}</p>
              </div>

              {/* Action buttons */}
              <div className="ml-auto flex items-center gap-2">
                <button
                  onClick={() => openModal(todo)}
                  className="text-blue-500 text-xs font-medium hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() =>
                    handleTodoAction({ id: todo.id, isDeleted: true })
                  }
                  className="text-red-500 text-xs font-medium hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-[90%] max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              {selectedTodo ? "Edit Todo" : "Add Todo"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md p-2 text-sm"
                  placeholder="Enter todo description"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  value={formData.duedate}
                  onChange={(e) =>
                    setFormData({ ...formData, duedate: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md p-2 text-sm"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded-md text-sm text-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm"
                >
                  {selectedTodo ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoListCard;
