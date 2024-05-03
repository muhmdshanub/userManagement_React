import { Container, Card, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useSelector } from 'react-redux';

const Hero = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const BASE_IMAGE_URL =' https://res.cloudinary.com/dozy35sfn/image/upload/v1713239944/users/baseImage.webp';

  return (
    <div className='py-5'>
      {!userInfo ? (
        <Container className='d-flex justify-content-center'>
          <Card className='p-5 d-flex flex-column align-items-center hero-card bg-light w-75'>
            <h1 className='text-center mb-4'>User Management</h1>
            <p className='text-center mb-4'>
              User Management Project. where user can store data and edit accordingly.
            </p>
            <div className='d-flex'>
              <LinkContainer to='/login'>
                <Button variant='primary' className='me-3'>
                  Sign In
                </Button>
              </LinkContainer>
              <LinkContainer to='/register'>
                <Button variant='secondary'>
                  Register
                </Button>
              </LinkContainer>
            </div>
          </Card>
        </Container>
      ) : (
        <Container className='d-flex justify-content-center align-items-center'>
          <div className='text-center'>
            <img
              src={userInfo?.image?.url || BASE_IMAGE_URL} // Assuming userInfo contains image URL
              alt='Profile'
              className='rounded-circle mb-4'
              style={{ width: '250px', height: '250px', objectFit: 'cover' }}
            />
            <h2 className='mb-2'>Name : {userInfo.name}</h2>
            <h2 className='mb-4'>Email : {userInfo.email}</h2>
          </div>
        </Container>
      )}
    </div>
  );
};

export default Hero;
