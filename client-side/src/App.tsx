import React, { useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import { my_little_txt } from './test';
import dvhcvn from './assets/dvhcvn.json';
import { DVHCVN } from './repository/dvhcvn';
import RootRouter from './routes/homepageRouter';
import ThemeConfig from './theme';
import GlobalStyles from './theme/globalStyles';
import ScrollToTop from './components/ScrollToTop';
import { RecoilRoot, useRecoilValue } from 'recoil';
import FirstLaunch from './components/FirstLaunch';
import { rootDialogSelector } from './hooks/rootDialog';

function App() {
  const rootDialog = useRecoilValue(rootDialogSelector);
  return (
    <ThemeConfig>
      <ScrollToTop />
      <GlobalStyles />

      <RootRouter />
      {rootDialog}
    </ThemeConfig>
  );
}

export default App;
