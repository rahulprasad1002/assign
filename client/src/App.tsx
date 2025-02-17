import { createBrowserRouter, RouterProvider } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import RTKProvider from './redux/provider';

import RootLayout from '@/pages/root-layout';
import LandingPage from '@/pages/landing-page';
import AuthPage from '@/pages/auth-page';
import NewRequirmentPage from './pages/new-requirement-page';
import AllPendingRequirementPage from './pages/all-pending-requirement-page';
import AdminManage from './pages/admin-manage-page';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: 'auth', element: <AuthPage /> },
      { path: 'admins', element: <AdminManage /> },
      {
        path: 'requirements',
        children: [
          { path: 'pending', element: <AllPendingRequirementPage /> },
          { path: 'new', element: <NewRequirmentPage /> },
        ],
      },
    ],
  },
]);

const queryClient = new QueryClient();

export default function App() {
  return (
    <RTKProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </RTKProvider>
  );
}

// fetch('http://api-url.com/endpoint', {
//   method: 'GET',
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   credentials: 'include',  // Include cookies with the request
// })

// axios.get('http://api-url.com/endpoint', {
//   withCredentials: true,  // Include cookies with the request
// });
