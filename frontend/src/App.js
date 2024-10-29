import React, { useContext, useEffect } from 'react';
import './App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UserContext, UserProvider } from './contexts/UserContext';  // Ensure UserProvider is imported
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import NavbarComponent from './components/NavbarComponent';
import HomePage from './views/HomePage';
import EmployersPage from './views/EmployersPage';
import LoginPage from './views/LoginPage';
import RegisterPage from './views/RegisterPage';
import Findjob from './views/Findjob';
import CTDResourcesPage from './views/Dashboard';
import FooterComponent from './components/Footer';
import EmployerDashboard from './views/EmployerDashboard';
import StudentApply from './views/StudentApply';
import JobDescriptionPage from './views/JobDescriptionPage';
import EditJobPage from './views/EditJobPage';
import AdminDashboard from './views/AdminDashboard'; 

function App() {
  const { getCurrentUser, user } = useContext(UserContext);

  useEffect(() => {
    const fetchUser = async () => {
      await getCurrentUser();
    };
    fetchUser();
    // eslint-disable-next-line
  }, []);

  return (
    <BrowserRouter>
      <div className='wrapper'>
        <NavbarComponent />
        <div className='main-content'>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/employers" element={<EmployersPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/find-job" element={<Findjob />} />
              
              {/* Add the Admin Dashboard route */}
              <Route path="/admin-dashboard" element={<AdminDashboard />} />

              <Route path="/Dashboard" element={<CTDResourcesPage />} />
              <Route path="/employer-dashboard" element={<EmployerDashboard />} />
              <Route path="/apply" element={<StudentApply />} />
              <Route path="*" element={<h1>Not Found</h1>} />
              <Route path="/edit-job/:jobId" element={<EditJobPage />} />
              <Route path="/job-description" element={<JobDescriptionPage />} />
            </Routes>
        </div>
        <FooterComponent />
      </div>      
      <ToastContainer />
    </BrowserRouter>
  );
}

export default function WrappedApp() {
  return (
    <UserProvider>  {/* Wrap the entire app in UserProvider */}
      <App />
    </UserProvider>
  );
}
