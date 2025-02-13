import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter} from 'react-router-dom';
import axios from 'axios';


import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/bootstrap-icons/font/bootstrap-icons.css';

import '../src/assets/css/sb-admin-2.min.css';
import '../src/assets/vendor/fontawesome-free/css/all.min.css';

// import 'bootstrap/dist/js/bootstrap.bundle.min';
// import 'jquery';
// import 'popper.js';


axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;  
axios.defaults.baseURL = 'https://zefftest.shop/';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
