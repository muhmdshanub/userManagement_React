import { useState, useEffect } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import Loader from "../components/Loader";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useAddUserFromAdminMutation } from "../slices/adminApiSlice";
import { toast } from "react-toastify";

const AdminUserAddScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [image, setImage] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [addUserFromAdmin, { isLoading }] = useAddUserFromAdminMutation();

  

  

  const handleImage = (e) => {
    const file = e.target.files[0];
    setFileToBase(file);
  };

  const setFileToBase = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImage(reader.result);
    };
  };

  const clearPassword = () => {
    setPassword("");
    setConfirmPassword("");
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    // Validate name
    if (!name.trim()) {
      clearPassword();
      toast.error("Name is required");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      clearPassword();
      toast.error("Invalid email format");
      return;
    }

    // Validate password length
    if (password.length < 8) {
      clearPassword();
      toast.error("Password must be at least 8 characters long");
      return;
    }

    if (password !== confirmPassword) {
      clearPassword();
      toast.error("Passwords do not match");
    } else {
      try {
        const res = await addUserFromAdmin({ name, email, password, image }).unwrap();
        toast.success(`User ${name} added.`);
        setConfirmPassword("");
        setEmail("");
        setImage("");
        setName("");
        setPassword("")
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };
  return (

    <>
    <div className="pt-5 pl=5">
            {/* Use Link component for navigation */}
            <Link to="/admin/dashboard">
                <Button className="btn-info">DashBoard</Button>
            </Link>
      </div>
    <FormContainer>
      <h1>Add User</h1>
      
      <Form onSubmit={submitHandler}>
        <Form.Group className="my-2" controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="name"
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group className="my-2" controlId="email">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group className="my-2" controlId="image">
          <Form.Label>
            Profile Image <span className="text-muted">(optional)</span>
          </Form.Label>
          <Form.Control
            type="file"
            accept="image/*"
            onChange={(e) => handleImage(e)}
          />
        </Form.Group>

        <Form.Group className="my-2" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group className="my-2" controlId="confirmPassword">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Button type="submit" variant="primary" className="mt-3">
          Add User
        </Button>

        {isLoading && <Loader />}
      </Form>

      
    </FormContainer>
    </>
  );
};

export default AdminUserAddScreen;
