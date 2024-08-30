# Global Visual CCS Project

## Project Overview

Global Visual CCS is a web application designed to visualize global Carbon Capture and Storage (CCS) data. The project is divided into two parts: the frontend, built with Vue.js and Element Plus, and the backend, which provides API services and file upload functionality based on Node.js.

The project aims to display CCS data for different countries and regions under various scenarios through visualizations such as charts and maps. It supports user-defined data file uploads and updates CCS data for specific scenarios.

## Directory Structure

### Frontend (global_visual_ccs)

- `dist/`: Compiled production files for deploying the application.
- `node_modules/`: Third-party libraries and tools managed by npm.
- `public/`: Contains public assets such as `index.html`, which is the entry HTML file for the application.
- `src/`: Source code directory, including the following subdirectories and files:
  - `assets/`: Static resources such as images and stylesheets.
  - `components/`: Vue components directory, containing reusable Vue components.
  - `router/`: Project routing configuration files that manage page navigation within the application.
  - `views/`: Vue page view files, including the main pages:
    - `BubbleChart.vue`: A page that displays bubble charts to show CCS data for different countries.
    - `GlobalMap.vue`: A page that displays a global map, showing the geographical distribution of CCS data.
    - `HistogramChart.vue`: A page that displays histograms to show data frequency distribution.
    - `IntroductionPage.vue`: The introduction page of the project, summarizing the project's goals and content.
    - `testPlotly.vue`: A page to test Plotly.js charts, used for debugging and displaying chart functionality.
    - `UploadFile.vue`: A file upload page that allows users to upload CSV or Excel files in specific formats to update scenario data.
  - `App.vue`: The root component of the application, responsible for the overall layout and rendering.
  - `main.js`: The entry file of the application that initializes the Vue instance and mounts it to the DOM.
- `.gitignore`: Git configuration file that specifies files and directories to ignore, preventing them from being committed to version control.
- `babel.config.js`: Babel configuration file that defines JavaScript compilation rules, supporting ES6+ syntax conversion.
- `jsconfig.json`: JavaScript project configuration file that defines path aliases and type-checking configurations.
- `package-lock.json` & `package.json`: Project dependency management files that define the libraries and their versions used by the project.

### Backend (global_visual_ccs_api)

- `data/`: Stores the data files required by the project. The backend API reads data from this directory to serve the frontend.
- `node_modules/`: Third-party libraries managed by npm.
- `uploads/`: File upload directory where files uploaded by users through the frontend are stored for subsequent use.
- `server.js`: The main file of the backend service, responsible for starting the Node.js server, providing API interfaces, and handling file upload requests.
- `package-lock.json` & `package.json`: Project dependency management files that define the libraries and their versions used by the project.

## Installation and Running

### 1. Install Node.js and npm

Before starting, ensure that Node.js and npm (Node.js package manager) are installed on your system. If not, follow these steps to install:

#### Windows

1. Visit the [Node.js official website](https://nodejs.org/) to download the Windows installer (.msi file).
2. Double-click the downloaded `.msi` file and follow the prompts to complete the installation.
3. After installation, open the Command Prompt (shortcut: Win + R, type `cmd`, and press Enter), and enter the following commands to verify the installation:

   ```bash
   node -v
   npm -v
   ```

   If the installation is successful, the Node.js and npm version numbers will be displayed.

#### macOS

1. Visit the [Node.js official website](https://nodejs.org/) to download the macOS installer (.pkg file).
2. Double-click the downloaded `.pkg` file and follow the prompts to complete the installation.
3. After installation, open Terminal, and enter the following commands to verify the installation:

   ```bash
   node -v
   npm -v
   ```

   If the installation is successful, the Node.js and npm version numbers will be displayed.

### 2. Globally Install Vue CLI

To manage the project using Vue.js's CLI tools, you need to install Vue CLI globally:

```bash
npm install -g @vue/cli
```

After installation, you can use the `vue` command to create and manage Vue.js projects.

### 3. Clone the Project Repository

Before installing and running the project, you need to clone the project repository from GitHub. Execute the following commands:

```bash
git clone <your-project-repo-url>
cd <your-project-folder-name>
```

### 4. Install Project Dependencies

After cloning the project and navigating to the project directory, you need to install the project's dependencies.

#### If `node_modules` Directory is Missing

If the `node_modules` directory is missing from the project (i.e., dependencies are not installed), you need to run the following command to install all required dependencies:

```bash
npm install
```

This command will install all necessary dependencies based on the configuration in the `package.json` file.

#### If `node_modules` Directory is Present

If the `node_modules` directory is already present in the project, you typically do not need to reinstall the dependencies. However, if you want to ensure that the dependencies are up to date, you can run the following command:

```bash
npm update
```

### 5. Start the Project

#### Start the Frontend

Navigate to the `global_visual_ccs` directory and run the following command to start the frontend project:

```bash
npm run serve
```

Usually, the frontend project will run on `localhost:8081`. You can access this address in your web browser to view the application.

#### Start the Backend

Navigate to the `global_visual_ccs_api` directory and run the following command to start the backend server:

```bash
node server.js
```

The backend server will run on `localhost:8080` by default, providing API services and file upload functionality for the frontend.

## Summary

Following the above steps, you should be able to successfully install and run the Global Visual CCS project. The frontend part of this project provides an interactive user interface, while the backend handles API requests and file uploads. You can visualize data and analyze global Carbon Capture and Storage potential under different scenarios.

If you encounter any issues during installation or running, please refer to the relevant sections in this README or consult the official documentation for Vue.js and Node.js.
```
