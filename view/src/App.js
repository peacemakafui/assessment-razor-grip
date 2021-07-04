import React,{ createContext} from 'react';
import { BrowserRouter as Router, Route, withRouter} from 'react-router-dom';
import axios from 'axios';


import { Container } from 'react-bootstrap';

import Header from './components/Header';
import MessageBoard from './components/MessageBoard'; //home
import Home from './components/Home'; //welcome
import Messanger from './components/Messanger';// chat
import Profile from './components/authentication/Profile';

// we make use of the react hook createContext to handle prop drilling: that is
//the situation where we are passing props between multiple components
export const userContext = createContext();

const App = () => {
  const [userAccessData, setUserAccessData] = React.useState({
    token: undefined,
    user: undefined,
  });

  //our login function whenever the user logs in we expect a token which would be used to
  //verify the user logged in
  const isLoggedIn = async () => {
    let token = localStorage.getItem('auth-token');
    if (token == null) {
      localStorage.setItem('auth-token', '');
      token = '';
    }
    const tokenResponse = await axios.post('/users/isTokenValid', null, {
      headers: { 'auth-token': token },
    });
    console.log(tokenResponse.data);
    if (tokenResponse.data) {
      const userResponse = await axios.get('/users/profile', {
        headers: { 'auth-token': token },
      });
      setUserAccessData({
        token,
        user: userResponse.data,
      });
    }
  };

  React.useEffect(() => {
    isLoggedIn();
  }, []);

  return (
    <>
    
    <userContext.Provider value={{ userAccessData, setUserAccessData }}>
      <Router>
        <Header />
          <Container>
            <Route path='/' exact component={withRouter(Home)} />
            <Route path='/message-board' component={withRouter(MessageBoard)} />
            <Route path='/message' component={withRouter(Messanger)} />
            <Route path='/profile' component={Profile} />
         </Container>
      </Router>
      </userContext.Provider>
      {/* <Home></Home> */}
      </>
  );
}

export default App;
