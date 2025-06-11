import React, { useState, useEffect } from 'react';
import API from '../axios';
import { FaCheckCircle, FaRegCircle, FaTrashAlt, FaSignOutAlt, FaUserSlash } from 'react-icons/fa';

export interface Task {
  id: number;
  title: string;
  completed: boolean;
  created_at: string;
}

const tabStyle = (active: boolean) =>
  `px-4 py-2 cursor-pointer rounded-md ${
    active ? 'bg-indigo-500 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-700'
  } transition`;

export default function TaskListPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [error, setError] = useState('');

  useEffect(() => {
    API.get<Task[]>('/tasks')
      .then(res => setTasks(res.data))
      .catch(() => setError('⚠️ Failed to load tasks'));
  }, []);

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const text = newTask.trim();
    if (!text) return setError('Please type a task!');
    try {
      const res = await API.post<Task>('/tasks', { title: text });
      setTasks(prev => [...prev, { ...res.data, completed: false }]);
      setNewTask('');
    } catch {
      setError('⚠️ Could not add task');
    }
  };

  const toggleDone = async (task: Task) => {
    const updated = { ...task, completed: !task.completed };
    setTasks(prev => prev.map(t => (t.id === task.id ? updated : t)));
    try {
      await API.put(`/tasks/${task.id}`, { completed: updated.completed });
    } catch {
      setTasks(prev => prev.map(t => (t.id === task.id ? task : t)));
      setError('⚠️ Update failed');
    }
  };

  const deleteTask = async (id: number) => {
    try {
      await API.delete(`/tasks/${id}`);
      setTasks(prev => prev.filter(t => t.id !== id));
    } catch {
      setError('⚠️ Could not delete task');
    }
  };

  const logout = async () => {
    try {
      await API.post('/logout');
      window.location.href = '/login';
    } catch {
      setError('⚠️ Logout failed');
    }
  };

  const deleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action is irreversible.')) return;
    try {
      await API.delete('/user');
      window.location.href = '/register';
    } catch {
      setError('⚠️ Could not delete account');
    }
  };

  const filtered = tasks.filter(task =>
    filter === 'completed' ? task.completed : filter === 'pending' ? !task.completed : true
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col items-center py-12 px-4 text-gray-100">
      <div className="w-[70vw] max-w-4xl bg-gray-900 rounded-xl shadow-xl p-8 flex flex-col gap-8">
        <h1 className="text-5xl font-extrabold text-center text-indigo-400 mb-8 select-none">
          🎭 Your Tasks
        </h1>

        <form onSubmit={addTask} className="flex gap-4">
          <input
            type="text"
            className="flex-grow p-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-200"
            placeholder="What’s your next big idea?"
            value={newTask}
            onChange={e => setNewTask(e.target.value)}
          />
          <button
            type="submit"
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg shadow hover:bg-indigo-700 transition"
          >
            Add It!
          </button>
        </form>

        {error && <p className="text-red-500">{error}</p>}

        <div className="flex justify-center gap-4 mb-6">
          <span className={tabStyle(filter === 'all')} onClick={() => setFilter('all')}>
            All
          </span>
          <span className={tabStyle(filter === 'pending')} onClick={() => setFilter('pending')}>
            Pending
          </span>
          <span className={tabStyle(filter === 'completed')} onClick={() => setFilter('completed')}>
            Completed
          </span>
        </div>

        <ul className="flex flex-col gap-3 max-h-[60vh] overflow-y-auto">
          {filtered.length === 0 && (
            <li className="text-center text-gray-400 py-4 select-none">No {filter} tasks yet…</li>
          )}
          {filtered.map(task => (
            <li
              key={task.id}
              className={`p-4 rounded-lg flex justify-between items-center transition-shadow ${
                task.completed
                  ? 'bg-gray-700 line-through text-gray-400'
                  : 'bg-gray-800 shadow hover:shadow-indigo-700'
              }`}
            >
              <span className="cursor-pointer select-none" onClick={() => toggleDone(task)}>
                {task.title}
              </span>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => toggleDone(task)}
                  aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
                  className="text-indigo-400 hover:text-indigo-600 text-xl transition"
                >
                  {task.completed ? <FaCheckCircle /> : <FaRegCircle />}
                </button>
                <button
                  onClick={() => deleteTask(task.id)}
                  aria-label="Delete task"
                  className="text-red-500 hover:text-red-700 text-xl transition"
                >
                  <FaTrashAlt />
                </button>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-8 border-t border-gray-700 pt-6 flex justify-center gap-12 select-none">
          <button
            onClick={logout}
            className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg shadow hover:bg-indigo-700 transition"
          >
            <FaSignOutAlt />
            Logout
          </button>

          <button
            onClick={deleteAccount}
            className="flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg shadow hover:bg-red-700 transition"
          >
            <FaUserSlash />
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}
