import React from 'react';
import { Container } from 'react-bootstrap';
import { Outlet, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header'; // Import user header
import AdminHeader from './components/AdminHeader'; // Import admin header

const App = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      {isAdminRoute ? <AdminHeader /> : <Header />}
      <ToastContainer />
      <Container className="my-2">
        <Outlet />
      </Container>
    </>
  );
};

export default App;
