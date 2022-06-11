import React, { useEffect } from 'react';
import './App.css';
import RootRouter from './routes/homepageRouter';
import ThemeConfig from './theme';
import GlobalStyles from './theme/globalStyles';
import ScrollToTop from './components/ScrollToTop';
import { RecoilRoot, useRecoilValue } from 'recoil';
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
