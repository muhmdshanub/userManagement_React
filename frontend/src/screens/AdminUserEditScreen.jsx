import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import { useUpdateUserFromAdminMutation,useGetSingleUserQuery } from "../slices/adminApiSlice";

const AdminUserEditScreen = () => {
  const { userId } = useParams();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [image, setImage] = useState("");
  const [oldImage, setOldImage] = useState("");
  const {
    data,
    isSuccess,
    refetch,
  } = useGetSingleUserQuery(userId);
  
 const [UpdateUserFromAdmin, {isLoading}] = useUpdateUserFromAdminMutation();



 const fetchUser = async () => {
    
    const result = await refetch();
    
    if (result.isSuccess) {
      setEmail(result.data.email);
      setName(result.data.name); 
      if(result?.data?.image){
        setOldImage(data?.image?.url)
      }
    
    }
  };

  useEffect(() => {
    fetchUser()
  }, []);

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



  const submitHandler = async (e) => {
    e.preventDefault();
    if (name.length > 0 && !validateName(name)) {
      toast.error("Please enter a valid name (letters and spaces only)");
      return;
    }
    if (email && !validateEmail(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    if (password && !validatePassword(password)) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
    } else {
      try {
        const updatedUserdata ={
            name,
            email,
            password
        }

        if(image){
            updatedUserdata.image = image;
        }

        const res = await UpdateUserFromAdmin({
          userId, data:updatedUserdata
        }).unwrap();
        setPassword("");
        setConfirmPassword("");
        toast.success("User details updated successfully");
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const validateName = (name) => {
    const nameRegex = /^[a-zA-Z\s]+$/;
    return nameRegex.test(name);
  };
  
  const validateEmail = (email) => {
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return emailRegex.test(email);
  };
  
  const validatePassword = (password) => {
    return password.length >= 8;
  };



  return(
    <FormContainer>
      <h1>Update user profile</h1>

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

        {/* Display the preview image */}
        {(image || oldImage) && (
          <img
            src={image? image : oldImage}
            alt={name}
            className="img-thumbnail"
            style={{ maxWidth: "100px" }}
          />
        )}

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
          Update
        </Button>

        {isLoading && <Loader />}
      </Form>
    </FormContainer>
  )
};

export default AdminUserEditScreen;
