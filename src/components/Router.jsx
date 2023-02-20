import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';

import RelicCanTable from './RelicCanTable';
import RelicSiteTable from './RelicSiteTable';

export function Router() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/">
          <Route index element={<RelicSiteTable />} />
          <Route path="cans" element={<RelicCanTable />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default Router;
