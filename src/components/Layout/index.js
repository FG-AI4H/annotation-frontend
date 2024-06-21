import { Outlet } from 'react-router-dom';
import AppNavBar from '../AppNavbar';

export default function Layout() {
  return (
    <div>
      <AppNavBar />
      <Outlet />
    </div>
  );
}
