import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './bootstrap.min.css';
import App from './App';
import { Auth0Provider } from '@auth0/auth0-react';
import reportWebVitals from './reportWebVitals';

const domain = 'dev-zk8avpa2.us.auth0.com';
const clientID = 'kuTG1pdRo9fMMUY6CvgBfjAdRWQERgo2';

ReactDOM.render(
  
    <Auth0Provider domain={domain} clientId={clientID} redirectUri={window.location.origin}>
      <App />
    </Auth0Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
