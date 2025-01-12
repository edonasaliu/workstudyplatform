import React, { useContext, useEffect } from 'react';
import './App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UserContext, UserProvider } from './contexts/UserContext';  
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import NavbarComponent from './components/NavbarComponent';
import HomePage from './views/HomePage';
import EmployersPage from './views/Managers/EmployersPage';
import LoginPage from './views/LoginPage';
import RegisterPage from './views/RegisterPage';
import Findjob from './views/students/Findjob';
import CTDResourcesPage from './views/students/Dashboard';
import FooterComponent from './components/Footer';
import EmployerDashboard from './views/Managers/EmployerDashboard';
import StudentApply from './views/students/StudentApply';
import JobDescriptionPage from './views/Managers/JobDescriptionPage';
import EditJobPage from './views/Managers/EditJobPage';
import AdminDashboard from './views/admin/AdminDashboard';
import JobPostingDashboard from './views/admin/JobPostingDashboard';
import TeamsOverview from './views/admin/TeamsOverview';
import WSPositionTracker from './views/admin/WSPositionTracker';



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
              
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/job-posting-dashboard" element={<JobPostingDashboard />} />
              <Route path="/admin/ws-position-tracker" element={<WSPositionTracker />} />

              <Route path="/Dashboard" element={<CTDResourcesPage />} />
              <Route path="/employer-dashboard" element={<EmployerDashboard />} />
              <Route path="/apply" element={<StudentApply />} />
              <Route path="*" element={<h1>Not Found</h1>} />
              <Route path="/edit-job/:jobId" element={<EditJobPage />} />
              <Route path="/job-description" element={<JobDescriptionPage />} />
              <Route path="/admin/teams" element={<TeamsOverview />} />
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
