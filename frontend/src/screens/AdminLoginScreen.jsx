import { useState,useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import FormContainer from '../components/FormContainer';
import { useDispatch, useSelector } from 'react-redux';
import { useAdminLoginMutation } from '../slices/adminApiSlice';
import { setAdminCredentials } from '../slices/adminAuthSlice';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';

const AdminLoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [adminLogin, { isLoading }] = useAdminLoginMutation();
  const { adminInfo } = useSelector((state) => state.adminAuth);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const res = await adminLogin({ email, password }).unwrap();
      dispatch(setAdminCredentials({ ...res }));
      navigate('/admin/dashboard');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  useEffect(() => {
    if (adminInfo) {
      navigate('/admin/dashboard');
    }
  }, [navigate, adminInfo]);

  return (
    <FormContainer>
      <h1>Admin Sign In</h1>

      <Form onSubmit={submitHandler}>
        <Form.Group controlId='email'>
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type='email'
            placeholder='Enter email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId='password'>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Enter password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Button disabled={isLoading} type='submit' variant='primary'>
          Sign In
        </Button>
      </Form>

      {isLoading && <Loader />}
    </FormContainer>
  );
};

export default AdminLoginScreen;
