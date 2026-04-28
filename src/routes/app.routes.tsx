import {
  createBrowserRouter,
  RouterProvider,
  Navigate
} from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import Form from './pages/Form';
import ErrorPage from './pages/ErrorPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Navigate to="/form" replace />
      },
      {
        path: 'form',
        element: <Form />
      },
      {
        path: 'dashboard',
        element: <Navigate to="/form" replace />
      },
      {
        path: 'history',
        element: <Navigate to="/form" replace />
      },
      {
        path: 'quality',
        element: <Navigate to="/form" replace />
      },
      {
        path: 'settings',
        element: <Navigate to="/form" replace />
      }
    ]
  }
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
