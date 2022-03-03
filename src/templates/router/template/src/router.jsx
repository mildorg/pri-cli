import { useRoutes } from 'react-router-dom';
import { LazyLoad } from '@/components';

const routes = [
  { path: '/', element: <LazyLoad component="Home" /> },
  { path: '/home', element: <LazyLoad component="Home" /> },
  { path: '/about', element: <LazyLoad component="About" /> },
];

export const Router = () => useRoutes(routes);
