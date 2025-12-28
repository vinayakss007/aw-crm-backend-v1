import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './layouts/Layout';
import Dashboard from './pages/Dashboard';
import Contacts from './pages/Contacts';
import Companies from './pages/Companies';
import Opportunities from './pages/Opportunities';
import Settings from './pages/Settings';
import Analytics from './pages/Analytics';

function App() {
  return (
    <ThemeProvider>
      <RecoilRoot>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="contacts" element={<Contacts />} />
              <Route path="companies" element={<Companies />} />
              <Route path="opportunities" element={<Opportunities />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="settings" element={<Settings />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </Router>
      </RecoilRoot>
    </ThemeProvider>
  );
}

export default App;