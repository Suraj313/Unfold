import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import AppWorkspace from './pages/AppWorkspace';
import DesignSystem from './pages/DesignSystem';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route 
          path="/app" 
          element={
            <ProtectedRoute>
              <AppWorkspace />
            </ProtectedRoute>
          } 
        />
        <Route path="/design-system" element={<DesignSystem />} />
      </Routes>
    </Router>
  );
}

export default App;
