import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Tasks from './pages/Tasks';
import Home from './pages/freelancer/FreelancerHome';
import ClientHome from './pages/client/ClientHome';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/freelancer_home" element={<Home />} />
        <Route path="/client_home" element={<ClientHome />} />
      </Routes>
    </Router>
  );
}

export default App;
