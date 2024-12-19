import { Outlet } from 'react-router-dom';

export const Test = () => {
  return (
    <div>
      <h1>This is the Test Component</h1>
  
      <Outlet />
    </div>
  );
};
