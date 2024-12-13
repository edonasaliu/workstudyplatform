# Work-Study Platform

Welcome to the Work-Study Platform repository, the all-in-one solution to streamline Minerva University's work-study programs.

## 🎯 Description

### Problem Statement
At Minerva University, the current decentralized system for managing work-study programs poses challenges of inefficiency, lack of transparency, and administrative burden. Students struggle to find and apply for opportunities, while managers and administrators face difficulties in managing the program.

### Key Features
The Work-Study Platform addresses these problems by providing the following key features:

1. Student Dashboard: Provides students with a streamlined interface to view job postings, apply to positions, and log their work hours.
2. Manager Dashboard: Enables managers to post job opportunities, review student applications, and monitor assigned tasks.
3. Admin Dashboard: Allows administrators to oversee the entire work-study program, including managing work-study teams, student data, and generating detailed reports.
4. WA Position Tracker: A centralized feature that enables administrators to upload and manage detailed data about students and their work-study roles.
5. Login/Register Authentication: The platform provides a secure registration and login system with role-based access controls for students, managers, and administrators.

## 📹 Demo

```
https://drive.google.com/file/d/1gm2E15OBBtmdrJEewnDpHAOJY0annv9w/view?usp=sharing 
```

## 📝 Product Spec

```
https://bloom-mandrill-704.notion.site/Work-Study-Platform-Product-Spec-b78131d0d64d4e1f8a1ddadfa72f22bc
```

## Designs
```
https://www.figma.com/file/cWsl7d673trOaDM1MZWd8C/Final-Designs-for-Work-study-platforms?type=design&node-id=0%3A1&mode=design&t=Ms3hNBhmosKu59bb-1
```

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:

- **Node.js & npm**: Get them [here](https://nodejs.org/).

### Installing and Running the Platform

#### Backend Setup

1. **Clone the Backend Repository**
    ```bash
    git clone https://github.com/edonasaliu/workstudyplatform-private.git
    cd workstudyplatform-private
    ```

2. **Create and Activate the Virtual Environment**
    - For Windows:
      ```powershell
      python -m venv venv
      venv\Scripts\activate
      ```
    - For macOS and Linux:
      ```bash
      python3 -m venv .venv
      source .venv/bin/activate
      ```

3. **Install Backend Dependencies**
    ```bash
    pip install -r requirements.txt 
    # If you face issues:
    # pip install -r ./backend/requirements.txt
    ```

4. **Run the Flask Backend**
    - To start the backend server, use:
      ```bash
      python3 app.py # Use python for windows
      ```

5. **Run Backend Tests**
    - To run tests and ensure backend functionality:
      ```bash
      python3 -m unittest test_app.py # Use python windows
      ```

#### Frontend Setup


1. **Install Dependencies**
    Jump into the frontend and set it up.
    ```bash
    cd frontend
    npm install
    ```

2. **Start the App**
    Use your local server!
    ```bash
    npm start
    ```
    Visit [localhost:3000](http://localhost:3000/) and see the magic.

## 🤝 Contributing to WorkStudyPlatform

Visit the [CONTRIBUTING.md](https://github.com/edonasaliu/workstudyplatform-private/blob/main/CONTRIBUTING.md) file and Join us in enhancing Minerva University's work-study program, making it more efficient and accessible for all students!