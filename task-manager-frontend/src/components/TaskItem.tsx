// src/components/TaskItem.tsx
import React from 'react';

type Task = {
  id: number;
  title: string;
  completed: boolean;
};

type TaskItemProps = {
  task: Task;
  onToggleComplete: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (task: Task) => void;
};

export default function TaskItem({ task, onToggleComplete, onDelete, onEdit }: TaskItemProps) {
  return (
    <li className="p-2 border-b flex justify-between items-center">
      <span
        onClick={() => onToggleComplete(task.id)}
        className={`cursor-pointer ${task.completed ? 'line-through text-gray-500' : ''}`}
      >
        {task.title}
      </span>
      <div className="space-x-2">
        <button
          onClick={() => onEdit(task)}
          className="text-yellow-600 hover:underline"
          aria-label="Edit task"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="text-red-600 hover:underline"
          aria-label="Delete task"
        >
          Delete
        </button>
      </div>
    </li>
  );
}
