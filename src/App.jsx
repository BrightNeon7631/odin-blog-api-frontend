import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import AllPosts from './pages/AllPosts';
import Post from './pages/Post';
import Layout from './components/Layout';
import AdminRoute from './components/AdminRoute';
import PostAdminEdit from './pages/PostAdminEdit';
import DashboardLayout from './components/DashboardLayout';
import DashboardAccount from './pages/DashboardAccount';
import DashboardUserComments from './pages/DashboardUserComments';
import PostAdminCreate from './pages/PostAdminCreate';
import DashboardUsers from './pages/DashboardUsers';
import LoginRoute from './components/LoginRoute';
import NotFound from './pages/NotFound';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<Layout />}>
      <Route index element={<Home />} />
      <Route path='posts' element={<AllPosts />} />
      <Route
        path='posts/create'
        element={
          <AdminRoute>
            <PostAdminCreate />
          </AdminRoute>
        }
      />
      <Route path='posts/:id' element={<Post />} />
      <Route
        path='posts/:id/edit'
        element={
          <AdminRoute>
            <PostAdminEdit />
          </AdminRoute>
        }
      />
      <Route
        path='login'
        element={
          <LoginRoute>
            <Login />
          </LoginRoute>
        }
      />
      <Route
        path='dashboard'
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardAccount />} />
        <Route path='comments' element={<DashboardUserComments />} />
        <Route
          path='users'
          element={
            <AdminRoute>
              <DashboardUsers />
            </AdminRoute>
          }
        />
      </Route>
      <Route path='*' element={<NotFound />} />
    </Route>,
  ),
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
