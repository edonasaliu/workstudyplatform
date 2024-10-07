import React, { createContext, useState } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // State to hold the user data

  // Function to update the user state
  async function login({email, password}) {
    const formData = {
      email,
      password,
    }
    try {
      const response = await fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data);
      } else {
        console.error('Failed to fetch current user');
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
    // setUser(userData);
  };

  
  async function getCurrentUser() {
    try {
      const response = await fetch('http://localhost:8080/auth/get-current-user', {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        //console.log(user, data.user)
      } else {
        console.error('Failed to fetch current user');
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  }

  // Function to clear the user state
  async function logout() {
    await fetch('http://localhost:8080/auth/logout', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
    })
    .then(data => {
      setUser(null);
    }
    )
  };

  return (
    <UserContext.Provider value={{ user, login, logout, getCurrentUser }}>
      {children}
    </UserContext.Provider>
  );
};