import { useAuth0 } from '@auth0/auth0-react';
import React from 'react';
import MessageBoard from './MessageBoard';
import './../App.css';
import { Container } from 'react-bootstrap';
import { Button } from 'react-bootstrap';

const Home = () => {
    const { loginWithRedirect } = useAuth0();
    const { user, isAuthenticated } = useAuth0();
    return (
        <>
            {isAuthenticated ? (<MessageBoard />) : (<Container>
                <div className="App">

                    <h1>Hello Welcome To Our World</h1>
                    <br />
                    <h4>
                        Just sign up and log in and you are good to go.
                    </h4>
                    <br />
                    <Button className='btn btn-success btn-large'
                        onClick={() => loginWithRedirect()}
                    >
                        Register or Login
                    </Button>
                </div>
                

            </Container>
            )
            }
            
        </>
    );
}

export default Home;

