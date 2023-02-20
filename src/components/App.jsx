import React from 'react';

import {
  Box,
  Typography,
  Link,
  Divider,
} from '@mui/material';

import AppToolbar from './AppToolbar';
import { RouterProvider } from '../contexts/Router';

import './App.css';

function App() {
  return (
    <Box>
      <AppToolbar />
      <Divider />
      <RouterProvider />
      <Box className="App-instructions" sx={{ textAlign: 'center', px: 2, my: 6 }}>
        <Typography variant="body2">
          This tool brought to you by
          {' '}
          <Link href="https://zkillboard.com/character/879471236/" target="_blank" rel="noreferrer">peebun</Link>
          . All EVE related materials are property of
          {' '}
          <Link href="http://www.ccpgames.com/" target="_blank" rel="noreferrer">CCP Games</Link>
          . Visit
          {' '}
          <Link href="https://wiki.eveuniversity.org/Relic_and_data_sites" target="_blank" rel="noreferrer">EVE University</Link>
          {' '}
          to learn more about relic and data sites.
        </Typography>
      </Box>
    </Box>
  );
}

export default App;
