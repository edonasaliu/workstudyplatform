# Work-Study Platform Frontend

Welcome to the frontend repository of the Work-Study Platform, the user-facing portion of Minerva University's all-in-one solution to streamline work-study programs.

# Frontend Structure 

The frontend of the Work-Study Platform is structured for modularity and ease of development. Here's the layout of our React-based frontend:

- `frontend/`
  - `node_modules/` - Contains all the npm packages
  - `public/` - Public files like HTML templates and icons
  - `src/` - Source files for the React application
    - `components/` - Reusable components
      - `Footer.js` - Footer component
      - `footer.test.js` - Tests for the footer component
      - `NavbarComponent.js` - Navigation bar component
      - `NavbarComponent.test.js` - Tests for the navigation bar component
    - `contexts/` - React contexts for state management
      - `ApiProvider.js` - Provides the API context
      - `UserContext.js` - Manages the user state context
    - `hooks/` - Custom React hooks
      - `ApiClient.js` - Hook for API client logic
    - `views/` - React components representing pages
      - `Dashboard.css` - Styles for the dashboard
      - `Dashboard.js` - Dashboard view component
      - `EditJobPage.js` - Edit job page component
      - `EmployerDashboard.css` - Styles for the employer dashboard
      - `EmployerDashboard.js` - Employer dashboard component
      - `EmployersPage.js` - Employers page component
      - `FindJobPage.css` - Styles for the find job page
      - `Findjob.js` - Find job page component
      - `HomePage.js` - Home page component
      - `JobDescriptionPage.js` - Job description page component
      - `LoginPage.js` - Login page component
      - `RegisterPage.js` - Registration page component
      - `StudentApply.js` - Student application component
    - `App.css` - Global styles for the app
    - `App.js` - Main React application component
    - `index.css` - Base styles
    - `index.js` - Entry point for the React application
  - `.gitignore` - Specifies intentionally untracked files to ignore
  - `package-lock.json` - Automatically generated file for any operations where npm modifies the node_modules tree or package.json
  - `package.json` - Manifest file for the project
  - `README.md` - Documentation for the frontend

## 🌟 Description

We've created a React-based frontend that offers an intuitive and responsive user experience. It allows Minerva University students to seamlessly browse and apply for work-study positions, and for administrators to manage postings and applications. 

## 🚀 Getting Started with the Frontend

### Prerequisites

Before setting up the frontend, make sure you have the following installed:

- Node.js & npm: [Download Here](https://nodejs.org/)

### Installation and Setup

Clone the repository and navigate to the frontend directory:

```bash
git clone https://github.com/minerva-university/WorkStudyPlatform.git
cd WorkStudyPlatform/frontend
```

### Running the Platform
To start the frontend application, run:

```bash
npm start
```

Your default web browser should open automatically to localhost:3000 where you can view and interact with the application.

## Technologies Used

The frontend of the Minerva Workstudy Platform is developed using technologies that ensure a dynamic and responsive user experience, while simultaneously being at an appropriate level for CS162 students as developers. Here are the main technologies our team has implemented:

- **React**: A declarative, efficient, and flexible JavaScript library for building user interfaces. It lets us compose complex UIs from small and isolated pieces of code called "components".
- **React Router**: A collection of navigational components that compose declaratively with our application, allowing us to build single-page applications with navigation without the page refreshing as the user navigates.
- **React Bootstrap**: The most popular front-end framework rebuilt for React. It provides a set of accessible and reusable components that are commonly used in web applications.
- **React Toastify**: Allows us to add notifications to our app with ease. It's highly customizable and can be used to display informational, success, warning, or error messages.
- **React Icons**: Utilizes ES6 imports that allow us to include only the icons that our application is using, significantly improving our project's performance by reducing the size of the bundle.
- **Formik**: A small group of React components and hooks for building forms in React. It helps with handling form submission, input validation, and form state management.
- **Yup**: A JavaScript schema builder for value parsing and validation. It pairs nicely with Formik to handle complex validation requirements.

These technologies were chosen for their robustness, flexibility, and community support. They enable us to build a powerful yet user-friendly interface, providing an excellent experience for both students and administrators.


### 🤝 Contributing
We welcome contributions! Please refer to the CONTRIBUTING.md file for guidelines on how to make the Work-Study Platform even better.

For further details on the backend setup and testing, please refer to our backend README documentation.

