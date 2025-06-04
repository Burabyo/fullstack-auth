import React, { useState, useEffect } from 'react';
import api from '../api/axios';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'completed', 'pending'
  const [error, setError] = useState('');

  const token = localStorage.getItem('authToken');

  // Set Axios auth header once
  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, [token]);

  // Fetch tasks from API
  const fetchTasks = async () => {
    try {
      const response = await api.get('/tasks');
      setTasks(response.data);
    } catch (err) {
      setError('Failed to load tasks');
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Add new task
  const addTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      const response = await api.post('/tasks', { title: newTaskTitle });
      setTasks(prev => [...prev, response.data]);
      setNewTaskTitle('');
    } catch {
      setError('Failed to add task');
    }
  };

  // Delete task
  const deleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks(prev => prev.filter(task => task.id !== id));
    } catch {
      setError('Failed to delete task');
    }
  };

  // Toggle task completion
  const toggleComplete = async (id, currentStatus) => {
    try {
      const response = await api.put(`/tasks/${id}`, { status: currentStatus ? 0 : 1 });
      setTasks(prev => prev.map(task => task.id === id ? response.data : task));
    } catch {
      setError('Failed to update task');
    }
  };

  // Filter tasks locally
  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.status === 1;
    if (filter === 'pending') return task.status === 0;
    return true; // all
  });

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Your Tasks</h2>

      {/* Add Task Form */}
      <form onSubmit={addTask} className="flex mb-4">
        <input
          type="text"
          placeholder="Add new task..."
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          className="flex-grow p-2 border rounded-l"
        />
        <button type="submit" className="bg-green-600 text-white px-4 rounded-r hover:bg-green-700 transition">
          Add
        </button>
      </form>

      {/* Filter Buttons */}
      <div className="mb-4 space-x-2">
        <button
          className={`px-3 py-1 rounded ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button
          className={`px-3 py-1 rounded ${filter === 'completed' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setFilter('completed')}
        >
          Completed
        </button>
        <button
          className={`px-3 py-1 rounded ${filter === 'pending' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setFilter('pending')}
        >
          Pending
        </button>
      </div>

      {/* Error message */}
      {error && <p className="text-red-600 mb-4">{error}</p>}

      {/* Task List */}
      <ul>
        {filteredTasks.length === 0 ? (
          <p>No tasks to display</p>
        ) : (
          filteredTasks.map(task => (
            <li key={task.id} className="flex items-center justify-between mb-2 p-2 border rounded">
              <div>
                <input
                  type="checkbox"
                  checked={task.status === 1}
                  onChange={() => toggleComplete(task.id, task.status === 1)}
                  className="mr-2"
                />
                <span className={task.status === 1 ? 'line-through text-gray-500' : ''}>{task.title}</span>
              </div>
              <button
                onClick={() => deleteTask(task.id)}
                className="text-red-600 hover:text-red-800"
                title="Delete task"
              >
                &times;
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
