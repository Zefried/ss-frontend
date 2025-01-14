import React from 'react'
import { useEffect } from 'react'
import axios from 'axios';


export const GoogleAuthSignIn = () => {


  useEffect(() => {
    const fetchData = async () => {
      try {
        await axios.get('http://localhost:8000/sanctum/csrf-cookie'); // CSRF Token Request
        const res = await axios.get('http://localhost:8000/api/test'); // API Request
        console.log(res.data);
      } catch (error) {
        console.error(error);  // Log Errors
      }
    };
  
    fetchData();  // Call the async function
  }, []);
  

  function redirectToGoogle() {
    const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID; // Secure storage
    const redirectUri = encodeURIComponent('http://localhost:8000/api/auth/google/callback'); // Ensure it's URL-encoded
    const scope = encodeURIComponent('profile email');
    const responseType = 'code';

  
    const googleOAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}&access_type=offline&prompt=consent`;
    window.location.href = googleOAuthUrl;


  }


  return (
    <div>

      <button className='btn btn-outline-primary' onClick={redirectToGoogle}>Google SignIn</button>

    </div>
  )
}

