import React, { useState, useEffect } from "react";
import { RiAddLine, RiMore2Fill } from "@remixicon/react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Dropdown, Menu, Modal, message, Input, DatePicker, Button } from "antd";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const TodoListCard = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [formData, setFormData] = useState({ description: "", duedate: null });
  const [confirmModal, setConfirmModal] = useState({ visible: false, title: "", onOk: null });

  const { token, user } = useSelector((state) => state.auth);

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

  const handleTodoAction = async ({ id, description, duedate, isCompleted = null, isDeleted = false }) => {
    try {
      setLoading(true)
      const body = {
        p_userid: user?.id,
        p_todolistid: id || null,
        p_description: description || null,
        p_duedate: duedate ? duedate.format("YYYY-MM-DD") : null,
        p_iscompleted: isCompleted,
        p_isdeleted: isDeleted,
      };

      await axios.post("user/dashboard/todo/insert-edit-delete", body, {
        headers: { Authorization: `Bearer ${token}` },
      });

      await getTodoList();
      setShowModal(false);
      setSelectedTodo(null);
      setFormData({ description: "", duedate: null });
    } catch (error) {
      console.error("Error updating todo:", error);
      message.error("Action failed");
    } finally {
      setLoading(false)
    }
  };

  const showConfirm = ({ title, onOk }) => {
    setConfirmModal({ visible: true, title, onOk });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleTodoAction({
      id: selectedTodo?.id || null,
      description: formData.description,
      duedate: formData.duedate,
    });
  };

  const openModal = (todo = null) => {
    setSelectedTodo(todo);
    setFormData(
      todo
        ? { description: todo.description, duedate: todo.duedate ? dayjs(todo.duedate) : null }
        : { description: "", duedate: null }
    );
    setShowModal(true);
  };

  // Disable past dates
  const disabledDate = (current) => current && current < dayjs().startOf("day");

  return (
    <div className="bg-white p-6 rounded-2xl w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-lg font-semibold">To-do List</h2>
        <Button type="default" icon={<RiAddLine />} onClick={() => openModal()}>
          Add
        </Button>
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
            const dueInDays = todo.duedate ? dayjs(todo.duedate).diff(dayjs(), "day") : null;

            const menu = (
              <Menu>
                {!isCompleted && (
                  <Menu.Item
                    key="complete"
                    onClick={() =>
                      showConfirm({
                        title: "Mark this todo as complete?",
                        onOk: () => handleTodoAction({ id: todo.id, isCompleted: true }),
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
                      onOk: () => handleTodoAction({ id: todo.id, isDeleted: true }),
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
                className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 border-b border-gray-200 pb-3"
              >
                <input
                  type="checkbox"
                  checked={isCompleted}
                  className="form-checkbox h-5 w-5 text-gray-600 flex-shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium mb-1 ${isCompleted ? "text-gray-600 " : ""}`}>
                    {todo.description}
                  </p>
                  {dueInDays !== null && !isCompleted && (
                    <p
                      className={`text-xs ${dueInDays < 0
                          ? "text-red-500 font-semibold"
                          : dueInDays === 0
                            ? "text-orange-500 font-semibold"
                            : "text-gray-500"
                        }`}
                    >
                      {dueInDays < 0
                        ? `Overdue by ${Math.abs(dueInDays)} day${Math.abs(dueInDays) !== 1 ? "s" : ""}`
                        : dueInDays === 0
                          ? "Due today"
                          : `Due in ${dueInDays} day${dueInDays !== 1 ? "s" : ""}`}
                    </p>
                  )}
                </div>

                <div className="ml-auto self-start sm:self-auto">
                  <Dropdown overlay={menu} trigger={["hover"]} placement="bottomRight">
                    <Button icon={<RiMore2Fill />} type="text" />
                  </Dropdown>
                </div>
              </div>

            );
          })
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        open={showModal}
        title={selectedTodo ? "Edit Todo" : "Add Todo"}
        onCancel={() => setShowModal(false)}
        footer={null}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <Input
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter todo description"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Due Date</label>
            <DatePicker
              value={formData.duedate}
              onChange={(date) => setFormData({ ...formData, duedate: date })}
              disabledDate={disabledDate}
              style={{ width: "100%" }}
              required
            />
          </div>
          <div className="flex justify-end gap-3 pt-3">
            <Button onClick={() => setShowModal(false)}>Cancel</Button>
            <Button disabled={loading} type="primary" htmlType="submit">
              {selectedTodo ? "Update" : "Save"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Confirmation Modal */}
      <Modal
        open={confirmModal.visible}
        title={confirmModal.title}
        onOk={() => {
          confirmModal.onOk?.();
          setConfirmModal({ visible: false, title: "", onOk: null });
        }}
        onCancel={() => setConfirmModal({ visible: false, title: "", onOk: null })}
        okText="Yes"
        cancelText="No"
      />
    </div>
  );
};

export default TodoListCard;
