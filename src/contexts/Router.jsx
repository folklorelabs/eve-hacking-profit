import React from 'react';

import {
  createBrowserRouter,
  RouterProvider as RRProvider,
} from 'react-router-dom';
import RelicCanTable from '../components/RelicCanTable';

import RelicSiteTable from '../components/RelicSiteTable';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RelicSiteTable />,
  },
  {
    path: '/cans',
    element: <RelicCanTable />,
  },
]);

export function RouterProvider() {
  return (
    <RRProvider router={router} />
  );
}

export default RouterProvider;
