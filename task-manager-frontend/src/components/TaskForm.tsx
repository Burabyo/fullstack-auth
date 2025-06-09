// src/components/TaskForm.tsx
import React, { useState, useEffect } from 'react';

type TaskFormProps = {
  initialTitle?: string;
  initialCompleted?: boolean;
  onSubmit: (title: string, completed: boolean) => void;
  submitLabel?: string;
};

export default function TaskForm({
  initialTitle = '',
  initialCompleted = false,
  onSubmit,
  submitLabel = 'Save',
}: TaskFormProps) {
  const [title, setTitle] = useState(initialTitle);
  const [completed, setCompleted] = useState(initialCompleted);

  useEffect(() => {
    setTitle(initialTitle);
    setCompleted(initialCompleted);
  }, [initialTitle, initialCompleted]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() === '') return;
    onSubmit(title, completed);
    setTitle('');
    setCompleted(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-center">
      <input
        type="text"
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Task title"
        className="border rounded p-2 flex-grow"
      />
      <label className="flex items-center gap-1">
        <input
          type="checkbox"
          checked={completed}
          onChange={e => setCompleted(e.target.checked)}
        />
        Completed
      </label>
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        {submitLabel}
      </button>
    </form>
  );
}
