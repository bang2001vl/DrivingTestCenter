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
import { RecoilRoot } from 'recoil';
import FirstLaunch from './components/FirstLaunch';

function App() {
  useEffect(() => {

  }, []);
  return (
    // <div className="App">
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <p>
    //       Edit <code>src/App.tsx</code> and save to reload.
    //     </p>
    //     <a
    //       className="App-link"
    //       href="https://reactjs.org"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //       // Test print toàn bộ các tỉnh kèm số lượng các huyện
    //       onClick={async (e)=>{
    //         e.preventDefault();
    //         console.log("TRACE: Clicked test");
    //         var data = (new DVHCVN()).data;
    //         data.forEach((lv1)=>{
    //           console.log(`Name = ${lv1.name}, childCount = ${lv1.level2s.length}`);
    //         });
    //       }}
    //     >
    //       {my_little_txt.smg}
    //     </a>
    //   </header>


    // </div>

    <RecoilRoot>
      <FirstLaunch />
      
      <ThemeConfig>
        <ScrollToTop />
        <GlobalStyles />
        <RootRouter />
      </ThemeConfig>
    </RecoilRoot>
  );
}

export default App;
