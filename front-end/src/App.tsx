import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashbord';
import { Register } from './pages/Register';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
};

export default App;