import {
  createBrowserRouter,
  RouterProvider,
  Navigate
} from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import Form from './pages/Form';
import History from './pages/History';
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
        element: <Navigate to="#" replace />
      },
      {
        path: 'history',
        element: <History />
      },
      {
        path: 'quality',
        element: <Navigate to="#" replace />
      },
      {
        path: 'settings',
        element: <Navigate to="#" replace />
      }
    ]
  }
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
