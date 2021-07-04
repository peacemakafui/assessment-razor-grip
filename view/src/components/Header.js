import React, { useContext } from 'react';
import { userContext } from '../App';
import { LinkContainer } from 'react-router-bootstrap';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { useAuth0 } from '@auth0/auth0-react';

function Header() {
    const { userAccessData, setUserAccessData } = useContext(userContext);
    const { user, isAuthenticated } = useAuth0();
    const { logout } = useAuth0();

    return (
        <>
          {/* we need to check if the user is authenticated or not before granting access
          so if the user is not authenticated the second condition would run else the first*/}
            {isAuthenticated ? (
                <Navbar
                    bg='navbar-dark bg-success'
                    expand='lg'
                    className='navbar navbar-expand-lg navbar-dark bg-success'
                >
                    <Container>
                        <LinkContainer to='/'>
                           <Navbar.Brand style={{ color: 'grey' }}>Live Messanger</Navbar.Brand>
                        </LinkContainer>
                        <Navbar.Toggle aria-controls='basic-navbar-nav' />
                        <Navbar.Collapse id='basic-navbar-nav'>
                           <Nav className='ml-auto'>
                              <LinkContainer to='/message'>
                                <Nav.Link>Send Message</Nav.Link>
                              </LinkContainer>
                              <LinkContainer to='/profile'>
                                 <Nav.Link>Profile ({user.name})</Nav.Link>
                              </LinkContainer>
                            </Nav>
                            <Button className='btn btn-danger' onClick={()=>logout()}>
                                Log Out
                            </Button>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
            ) :
                (
                    <Navbar
                        bg='navbar-dark bg-success'
                        expand='lg'
                        className='navbar navbar-expand-lg navbar-dark bg-success'
                    >
                        <Container>
                            <LinkContainer to='/'>
                                <Navbar.Brand style={{ color: 'grey'}}>Live Messanger</Navbar.Brand>
                            </LinkContainer>
                            <Navbar.Toggle aria-controls='basic-navbar-nav' />
                            <Navbar.Collapse id='basic-navbar-nav'>
                                <Nav className='ml-auto'></Nav>
                            </Navbar.Collapse>
                        </Container>
                    </Navbar>
                )
            }
        </>
    )
}

export default Header;
