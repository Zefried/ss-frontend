import React from 'react'
import { useEffect } from 'react'
import axios from 'axios';
import { customStateMethods } from '../StateMng/Slice/AuthSlice';




export const Test = () => {
    let token = customStateMethods.selectStateKey('appState', 'token');

    useEffect(()=>{
        axios.post('api/admin/doctors/newTest',{}, { 
            headers: {
                Authorization:`Bearer ${token}`
            }
        })
        .then((res) => {
            console.log(res.data);
        })
        .catch((error) => {
            console.log(error);

        });
    },[])


  return (
    <div>Test</div>
  )
}
