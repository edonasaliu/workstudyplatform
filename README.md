# Work-Study Platform

Welcome to the Work-Study Platform repository, the all-in-one solution to streamline Minerva University's work-study programs.

## 🎯 Description

### Problem Statement

At Minerva University, the current decentralized system for managing work-study programs poses a set of challenges:

- **Inefficiency**: Students navigate through various communication channels (primarily email, Telegram, and Notion) to find and apply to work-study opportunities, which is time-consuming and can lead to missed opportunities and miscommunications. 
- **Lack of Transparency**: Limited information on work-study positions and requirements hinders informed decision-making, on part of both managers and students. Students report issues of not understanding 1) what positions exist/are open, 2) deadlines, 3) requirements for various positions, 4) managers for various positions, and 5) feeling like their talents aren't considered in the work study allocation process. Managers report frustration that they don't receive students particularly interested in a given position (unless they personally recruit such a student). 
- **Administrative Burden**: Minerva work-study administrators grapple with aquiring/sharing relevant  information for various positions and managing student applications. In the current state, if a student is not "chosen" specifically by a manager, students are randomly assigned to open positions, as there is no system for students to indicate position preferences. 

## 👥 Group Demo
```
https://player.vimeo.com/video/895162778?badge=0&autopause=0&player_id=0&app_id=58479

or

https://drive.google.com/file/d/1csv6UDoKSwBuZ4YzQcVKbId0PVrblbrs/view?usp=sharing
```

## 📝 Product Spec

    ```
    https://bloom-mandrill-704.notion.site/Work-Study-Platform-Product-Spec-b78131d0d64d4e1f8a1ddadfa72f22bc

    ```
    
##  Designs
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
    git clone https://github.com/minerva-university/WorkStudyPlatform.git
    cd WorkStudyPlatform
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

Visit the [CONTRIBUTING.md](https://github.com/minerva-university/WorkStudyPlatform/blob/main/CONTRIBUTING.md
) file and Join us in enhancing Minerva University's work-study program, making it more efficient and accessible for all students!

---

