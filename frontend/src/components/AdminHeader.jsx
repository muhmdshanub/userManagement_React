import React from 'react';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { FaSignOutAlt } from 'react-icons/fa';
import { LinkContainer } from 'react-router-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useAdminLogoutMutation } from '../slices/adminApiSlice';
import { logoutAdmin } from '../slices/adminAuthSlice'; // Import logoutAdmin action

const AdminHeader = () => {
  const { adminInfo } = useSelector((state) => state.adminAuth); // Access admin info from state
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutAdminApiCall] = useAdminLogoutMutation(); // Use logoutAdmin mutation

  const logoutAdminHandler = async () => {
    try {
      await logoutAdminApiCall().unwrap(); // Call logoutAdmin mutation
      dispatch(logoutAdmin()); // Dispatch logoutAdmin action
      navigate('/admin/login'); // Redirect to admin login page
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header>
      <Navbar bg="warning" variant="warning" expand="lg" collapseOnSelect>
        <Container>
          <LinkContainer to="/admin/dashboard">
            <Navbar.Brand className='text-light'>Admin</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              {adminInfo ? (
                <NavDropdown title={adminInfo.name} id="username">
                  <NavDropdown.Item onClick={logoutAdminHandler}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : null}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default AdminHeader;
