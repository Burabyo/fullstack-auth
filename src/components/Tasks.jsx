// src/components/Tasks.jsx
import React, { useEffect, useState } from 'react';
import api from '../api/axios';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [newTask, setNewTask] = useState('');

  const fetchTasks = async () => {
    const { data } = await api.get('/tasks');
    setTasks(data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async () => {
    if (!newTask.trim()) return;
    await api.post('/tasks', { title: newTask });
    setNewTask('');
    fetchTasks();
  };

  const toggleComplete = async (task) => {
    await api.put(`/tasks/${task.id}`, { status: task.status ? 0 : 1 });
    fetchTasks();
  };

  const deleteTask = async (taskId) => {
    await api.delete(`/tasks/${taskId}`);
    fetchTasks();
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.status === 1;
    if (filter === 'pending') return task.status === 0;
    return true;
  });

  return (
    <div className="max-w-md mx-auto p-4">
      <div className="flex space-x-2 mb-4">
        <input
          type="text"
          placeholder="New Task"
          value={newTask}
          onChange={e => setNewTask(e.target.value)}
          className="input flex-grow"
        />
        <button onClick={addTask} className="btn-primary">Add</button>
      </div>

      <div className="flex space-x-4 mb-4">
        {['all', 'completed', 'pending'].map(f => (
          <button
            key={f}
            className={`btn ${filter === f ? 'btn-active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <ul>
        {filteredTasks.map(task => (
          <li key={task.id} className="flex justify-between items-center p-2 border-b">
            <div>
              <input
                type="checkbox"
                checked={task.status === 1}
                onChange={() => toggleComplete(task)}
                className="mr-2"
              />
              <span className={task.status === 1 ? 'line-through' : ''}>
                {task.title}
              </span>
            </div>
            <button onClick={() => deleteTask(task.id)} className="btn btn-danger">
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
