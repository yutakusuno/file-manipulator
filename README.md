# file-manipulator

The file-manipulator is a Node.js application that showcases the usage of the built-in [fs](https://nodejs.org/api/fs.html) module, which provides access to the file system. With this module, you can perform various file system operations such as reading, writing, updating, and deleting files, as well as retrieving file and directory information.

## Features

- **Simulation of File System Operations**: This application simulates how file system operations work within an operating system environment.
- **Non-blocking and Blocking I/O Methods**: The `fs` module offers methods for both non-blocking and blocking I/O. This application provides endpoints for both types of methods, allowing us to understand how to call these methods and their respective processing flows.

## Getting Started

To get started with file-manipulator, follow these steps:

**Clone the Repository**: Clone this repository to your local machine using the following command:

```bash
git clone https://github.com/yutakusuno/file-manipulator.git
```

**Install Dependencies**: Navigate into the cloned repository directory and install the required dependencies using bun:

```bash
cd file-manipulator
```

frontend

```bash
cd frontend
bun install
```

backend

```bash
cd backend
bun install
```

**Run the Applications**: Once the dependencies are installed, you can run the applications using the following command:

frontend

```bash
bun run dev
```

backend

```bash
bun --watch run index.ts
```

Explore Endpoints: The application will be running locally, and you can explore the provided endpoints for simulating file system operations.

## Usage

- **Non-blocking I/O Endpoints**: These endpoints simulate file system operations using non-blocking I/O methods. They are suitable for scenarios where you want to perform operations asynchronously without blocking the event loop.
- **Blocking I/O Endpoints**: These endpoints simulate file system operations using blocking I/O methods. They are suitable for scenarios where you want to perform operations synchronously and block the event loop until the operation completes.
