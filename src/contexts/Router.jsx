import React from 'react';
import {
  createHashRouter,
  RouterProvider as RRProvider,
} from 'react-router-dom';

import RelicCanTable from '../components/RelicCanTable';

import RelicSiteTable from '../components/RelicSiteTable';

const router = createHashRouter([
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
