// src/pages/TaskListPage.tsx
import React, { useState, useEffect } from 'react';
import API from '../axios';
import { FaCheckCircle, FaRegCircle } from 'react-icons/fa';

export interface Task {
  id: number;
  title: string;
  completed: boolean;
  created_at: string;
}

// Tailwind helper to keep CSS tidy
const tabStyle = (active: boolean) =>
  `px-4 py-2 cursor-pointer ${active ? 'bg-blue-500 text-white' : 'text-gray-500 hover:bg-gray-100'}`;

export default function TaskListPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [error, setError] = useState('');

  // 1️⃣ Load tasks on mount
  useEffect(() => {
    API.get<Task[]>('/tasks')
      .then(res => setTasks(res.data))
      .catch(() => setError('⚠️ Failed to load tasks'));
  }, []);

  // 2️⃣ Helper to add a new task
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

  // 3️⃣ Toggle completed status
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

  // 4️⃣ Filter rendering
  const filtered = tasks.filter(task =>
    filter === 'completed' ? task.completed :
    filter === 'pending' ? !task.completed :
    true
  );

  return (
    <div className="max-w-lg mx-auto mt-12 p-6 bg-gradient-to-b from-indigo-100 to-white rounded-lg shadow-xl">
      <h1 className="text-4xl font-bold text-center text-indigo-700 mb-6">🎭 Your Tasks</h1>

      {/* Add Task Form */}
      <form onSubmit={addTask} className="flex gap-4 mb-6">
        <input
          type="text"
          className="flex-grow p-3 border rounded-lg focus:outline-indigo-400"
          placeholder="What’s your next big idea?"
          value={newTask}
          onChange={e => setNewTask(e.target.value)}
        />
        <button type="submit" className="bg-indigo-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-indigo-700">
          Add It!
        </button>
      </form>
      {error && <p className="text-red-600 mb-4">{error}</p>}

      {/* Tabs */}
      <div className="flex justify-center gap-4 mb-4">
        <span className={tabStyle(filter === 'all')} onClick={() => setFilter('all')}>All</span>
        <span className={tabStyle(filter === 'pending')} onClick={() => setFilter('pending')}>Pending</span>
        <span className={tabStyle(filter === 'completed')} onClick={() => setFilter('completed')}>Completed</span>
      </div>

      {/* Task List */}
      <ul>
        {filtered.length === 0 && (
          <li className="text-center text-gray-500 py-4">No {filter} tasks yet…</li>
        )}
        {filtered.map(task => (
          <li
            key={task.id}
            className={`p-4 rounded-lg mb-2 flex justify-between items-center ${
              task.completed ? 'bg-gray-200 line-through text-gray-500' : 'bg-white shadow'
            } hover:shadow-lg transition`}
          >
            <span>{task.title}</span>
            <button onClick={() => toggleDone(task)}>
              {task.completed ? (
                <FaCheckCircle className="text-green-500 text-xl" />
              ) : (
                <FaRegCircle className="text-gray-400 text-xl hover:text-indigo-500" />
              )}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
