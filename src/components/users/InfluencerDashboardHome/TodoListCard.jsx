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
import { RiAddLine, RiMore2Fill } from "@remixicon/react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Dropdown, Menu, Modal, message } from "antd";

const TodoListCard = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [formData, setFormData] = useState({ description: "", duedate: "" });

  // ✅ New confirm modal state
  const [confirmModal, setConfirmModal] = useState({
    visible: false,
    title: "",
    onOk: null,
  });

  const { token, user } = useSelector((state) => state.auth);

  // Fetch Todos
  const getTodoList = async () => {
    try {
      setLoading(true);
      const res = await axios.get("user/dashboard/todo-list", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTodos(res.data.data || []);
    } catch (error) {
      console.error("Error fetching todos:", error);
      message.error("Failed to fetch todos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTodoList();
  }, []);

  // Unified API call
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
      message.error("Action failed");
    }
  };

  // ✅ Replacement for Modal.confirm
  const showConfirm = ({ title, onOk }) => {
    setConfirmModal({
      visible: true,
      title,
      onOk,
    });
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    handleTodoAction({
      id: selectedTodo?.id || null,
      description: formData.description,
      duedate: formData.duedate,
    });
  };

  // Open modal for Add/Edit
  const openModal = (todo = null) => {
    setSelectedTodo(todo);
    setFormData(
      todo
        ? {
            description: todo.description,
            duedate: todo.duedate?.split("T")[0] || "",
          }
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

      {/* Todo List */}
      <div className="space-y-4">
        {loading ? (
          <p>Loading...</p>
        ) : todos.length === 0 ? (
          <p className="text-gray-400 text-sm">No todos yet.</p>
        ) : (
          todos.map((todo) => {
            const isCompleted = todo.iscompleted;

            const menu = (
              <Menu>
                {!isCompleted && (
                  <Menu.Item
                    key="complete"
                    onClick={() =>
                      showConfirm({
                        title: "Mark this todo as complete?",
                        onOk: () =>
                          handleTodoAction({
                            id: todo.id,
                            isCompleted: true,
                          }),
                      })
                    }
                  >
                    Mark as Complete
                  </Menu.Item>
                )}
                <Menu.Item key="edit" onClick={() => openModal(todo)}>
                  Edit
                </Menu.Item>
                <Menu.Item
                  key="delete"
                  danger
                  onClick={() =>
                    showConfirm({
                      title: "Are you sure you want to delete this todo?",
                      onOk: () =>
                        handleTodoAction({ id: todo.id, isDeleted: true }),
                    })
                  }
                >
                  Delete
                </Menu.Item>
              </Menu>
            );

            return (
              <div
                key={todo.id}
                className="flex items-center gap-4 border-b border-gray-200 pb-3"
              >
                <input
                  type="checkbox"
                  checked={isCompleted}
                  disabled={isCompleted}
                  onChange={() =>
                    !isCompleted &&
                    showConfirm({
                      title: "Mark this todo as complete?",
                      onOk: () =>
                        handleTodoAction({
                          id: todo.id,
                          isCompleted: true,
                        }),
                    })
                  }
                  className="mt-1 form-checkbox h-5 w-5 text-blue-600 cursor-pointer disabled:opacity-50"
                />

                <div>
                  <p
                    className={`text-sm font-medium mb-1 ${
                      isCompleted ? "line-through text-gray-400" : ""
                    }`}
                  >
                    {todo.description}
                  </p>
                  <p className="text-xs text-gray-500">
                    Due: {todo.duedate?.split("T")[0]}
                  </p>
                </div>

                {/* Dropdown menu */}
                <div className="ml-auto">
                  <Dropdown
                    overlay={menu}
                    trigger={["hover"]}
                    placement="bottomRight"
                  >
                    <button className="p-1 rounded hover:bg-gray-100">
                      <RiMore2Fill className="text-gray-600" />
                    </button>
                  </Dropdown>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add/Edit Modal */}
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
                  {selectedTodo ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ✅ Confirmation Modal (React-based, works in React 19) */}
      <Modal
        open={confirmModal.visible}
        title={confirmModal.title}
        onOk={() => {
          confirmModal.onOk?.();
          setConfirmModal({ visible: false, title: "", onOk: null });
        }}
        onCancel={() =>
          setConfirmModal({ visible: false, title: "", onOk: null })
        }
        okText="Yes"
        cancelText="No"
      />
    </div>
  );
};

export default TodoListCard;
