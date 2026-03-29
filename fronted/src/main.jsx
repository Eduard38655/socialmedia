import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { GroupDataProvider } from "../src/Context/GroupDetailsContext.jsx";
import { ThemeProvider } from "../src/Context/ThemeContext.jsx";
import { UserDataProvider } from "../src/Context/UserDataContext.jsx";
import { UserSidebarProvider } from "../src/Context/UserSidebarContext.jsx";

import App from './App.jsx';
import "./i18n";


createRoot(document.getElementById('root')).render(
  < HashRouter>
    <ThemeProvider >
      <UserDataProvider>
        < GroupDataProvider >
          <UserSidebarProvider>
            <App />
          </UserSidebarProvider>
        </ GroupDataProvider >
      </UserDataProvider>
    </ThemeProvider >
  </HashRouter>

)
