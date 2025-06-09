import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
          Welcome to Task Manager
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Manage your tasks efficiently and stay organized.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            to="/login"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold transition"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-6 py-3 border border-blue-600 hover:bg-blue-600 hover:text-white rounded-md font-semibold transition"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
