import React, { useState, useEffect } from "react";
import { Button, Table, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import { useDeleteUserMutation, useGetAllUsersQuery } from "../slices/adminApiSlice";
import { Link } from "react-router-dom";

const AdminDashboard = () => {


  const BASE_IMAGE_URL =' https://res.cloudinary.com/dozy35sfn/image/upload/v1713239944/users/baseImage.webp';
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [totalDocs, setTotalDocs] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [users, setUsers] = useState([]);
  const {
    data: usersData,
    isSuccess,
    isLoading,
    refetch,
  } = useGetAllUsersQuery({page, search});

  const [deleteUser] = useDeleteUserMutation();

  const fetchUsers = async () => {
    
    const result = await refetch();
    
    if (result.isSuccess) {
      setUsers(result.data.users.docs);
      setTotalDocs(result.data.totalDocs);

      // Calculate total number of pages
      const totalPagesCount = Math.ceil(result.data.totalDocs / 10); // Assuming limit is 10
      setTotalPages(totalPagesCount);
    
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  

  const handleSearch = () => {
    
    setPage(1); // Reset page number when searching
    fetchUsers();
    
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleAddUser = () => {
    // Navigate to add user page or open modal
  };

  const handleEditUser = (userId) => {
    // Navigate to edit user page or open modal
  };

  const handleDeleteUser = async (userId, name) => {
    try {
      const response = await deleteUser(userId).unwrap();
      // Show successful toast notification
      setPage(1);
      setSearch("");
      setTotalPages(1);
      setTotalDocs(0);
      fetchUsers();
      toast.success(`User ${name} is deleted.`)
    } catch (error) {
      // Show failure toast notification
      console.error("Error deleting user:", error);
      toast.error(error?.data?.message || error?.message || error);
    }
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex align-items-center mb-3">
          <Form.Control
            type="text"
            placeholder="Search users"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button onClick={handleSearch} className="ms-2 btn-dark">
            Search
          </Button>
        </div>
        <div>
          {/* Use Link component for navigation */}
          <Link to="/admin/user/add">
            <Button className="btn-success">Add User</Button>
          </Link>
        </div>
      </div>
      {isLoading ? (
        <p>Loading...</p>
      ) : isSuccess ? (
        <>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Profile Image</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    {/* Display profile image */}
                    <img
                      src={user?.image?.url || BASE_IMAGE_URL}
                      alt={`Profile of ${user.name}`}
                      style={{ width: "50px", height: "50px" }}
                    />
                  </td>
                  <td>
                    <Link to={`/admin/user/edit/${user._id}`}>
                      <Button className="btn-warning mx-1">Edit</Button>
                    </Link>
                    <Button
                      className="btn-danger mx-1"
                      onClick={() => handleDeleteUser(user._id, user.name)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          {/* Pagination controls */}
          <div>
            {page !== 1 && (
              <Button
                className="btn-dark px-2"
                onClick={handlePreviousPage}
                disabled={page === 1}
              >
                Previous
              </Button>
            )}
            {page < totalPages && (
              <Button
                className="btn-dark px-2 mx-1"
                onClick={handleNextPage}
                disabled={page === totalPages}
              >
                Next
              </Button>
            )}
            <span className="mx-5">
              Page {page} of {totalPages}
            </span>
          </div>
        </>
      ) : (
        <p>Error fetching users</p>
      )}
    </div>
  );
};

export default AdminDashboard;
