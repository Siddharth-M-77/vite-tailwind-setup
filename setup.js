#!/usr/bin/env node

const { execSync } = require("child_process");
const fs = require("fs");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Enter the project name: ", (projectName) => {
  try {
    console.log("Installing Vite...");
    execSync(`npx create-vite@latest ${projectName} -- --template react`, {
      stdio: "inherit",
    });

    console.log("Navigating to project directory...");
    process.chdir(projectName);

    console.log("Installing Tailwind CSS...");
    execSync("npm install -D tailwindcss postcss autoprefixer", {
      stdio: "inherit",
    });

    console.log("Initializing Tailwind CSS...");
    execSync("npx tailwindcss init -p", { stdio: "inherit" });

    // Ensure tailwind.config.js was created
    if (!fs.existsSync("tailwind.config.js")) {
      console.error("Tailwind configuration file was not created");
      rl.close();
      return;
    }

    // Configure Tailwind CSS
    const tailwindConfigContent = `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
`;
    fs.writeFileSync("tailwind.config.js", tailwindConfigContent);

    // Append Tailwind CSS directives to the main CSS file
    const cssDirectives = `
@tailwind base;
@tailwind components;
@tailwind utilities;
`;

    const cssFilePath = "src/index.css";
    if (!fs.existsSync(cssFilePath)) {
      fs.writeFileSync(cssFilePath, "");
    }

    const existingContent = fs.readFileSync(cssFilePath, "utf8");
    if (!existingContent.includes(cssDirectives)) {
      fs.writeFileSync(cssFilePath, existingContent + cssDirectives);
    }

    // Create the App.jsx with Tailwind setup
    const appContent = `
import React from "react";

function App() {
  return (
    <div className="flex justify-center items-center min-h-screen w-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-blue-500">Welcome to ${projectName}!</h1>
    </div>
  );
}

export default App;
`;

    // Create App.jsx in the src folder
    const appPath = "src/App.jsx";
    fs.writeFileSync(appPath, appContent);

    console.log(`Vite and Tailwind CSS setup complete in project: ${projectName}`);
    console.log("App.jsx has been created with a simple layout.");
  } catch (error) {
    console.error("Error setting up Vite and Tailwind CSS:", error.message);
  } finally {
    rl.close();
  }
});
