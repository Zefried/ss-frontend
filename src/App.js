import {Routes, Route} from 'react-router-dom';
import { Test } from './components/test';
import { Child } from './components/Child';
import { Home } from './components/Home';

function App() {
  return (


    <div className="App">
        <Routes>
          <Route path="/test" element={<Test/>}>
            <Route path='xyg' element={<Child/>} />
          </Route>

          <Route path='/home' element={<Home/>} />

        </Routes>





    </div>
  );
}

export default App;
