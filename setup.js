import { execSync } from "child_process";
import fs from "fs";
import readline from "readline";

// Create readline interface to get project name from user
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Enter the project name: ", (projectName) => {
  try {
    console.log("Installing Vite...");
    execSync(`npm create vite@latest ${projectName} -- --template react`, {
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

    // Configure Tailwind CSS
    const tailwindConfigContent = `
    /** @type {import('tailwindcss').Config} */
    module.exports = {
      content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
      theme: {
        extend: {},
      },
      plugins: [],
    };
    `;
    fs.writeFileSync("tailwind.config.js", tailwindConfigContent);

    // Append Tailwind CSS directives to the main CSS file without overwriting
    const cssDirectives = `
@tailwind base;
@tailwind components;
@tailwind utilities;
`;

    // Read existing content of index.css, if any, and append the Tailwind directives
    const cssFilePath = "src/index.css";
    const existingContent = fs.existsSync(cssFilePath)
      ? fs.readFileSync(cssFilePath, "utf8")
      : "";

    if (!existingContent.includes(cssDirectives)) {
      fs.writeFileSync(cssFilePath, existingContent + cssDirectives);
    }

    console.log(`Vite and Tailwind CSS setup complete in project: ${projectName}`);
  } catch (error) {
    console.error("Error setting up Vite and Tailwind CSS:", error);
  } finally {
    rl.close();
  }
});
