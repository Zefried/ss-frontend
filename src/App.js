// All imports must be at the top
import { Routes, Route } from 'react-router-dom';
import { Home } from './Dashboard/Home';
import { AdminRegister } from './extraCompo/AccountRegister/AdminRegister';
import { AdminLogin } from './extraCompo/Login Components/AdminLogin';
import { GoogleAuthSignIn } from './extraCompo/Oauth2/GoogleAuthSignIn';
import { Test } from './extraCompo/Test';
import { AdminGuard } from './Guards/AdminGuard';


function App() {

  return (
    <div className="App">
      
      
      
      <Routes>

        <Route path='/admin-register' element={<AdminRegister />} />
        <Route path='/admin-login' element={<AdminLogin />} />


        {/* Admin Protected Routes starts from here */}
        <Route path='admin-dashboard' element={<AdminGuard><Home></Home></AdminGuard>}>
          <Route path='test' element={<Test></Test>}></Route>

        </Route>
        {/* Ends here */}

      </Routes>






      
    </div>
  );
}

export default App;
