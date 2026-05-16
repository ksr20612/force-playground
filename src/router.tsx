import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppShell } from '@/AppShell';
import { Home } from '@/Home';
import { SceneHost } from '@/SceneHost';
import { scenes } from '@/scenes/registry';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <Home /> },
      ...scenes.map((meta) => ({
        path: `scenes/${meta.path}`,
        element: <SceneHost meta={meta} />,
      })),
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]);
