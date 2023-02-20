import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';

import CanTable from './CanTable';
import SiteTable from './SiteTable';

export function Router() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/">
          <Route index element={<SiteTable />} />
          <Route path="cans" element={<CanTable />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default Router;
