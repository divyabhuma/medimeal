import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import GeminiRecommend from './pages/GeminiRecommend';
import Navbar from './components/Navbar';
import About from './pages/About';
import ProfileWizard from './pages/ProfileWizard';
import UserProfile from './pages/UserProfile';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/recommend" element={<GeminiRecommend />} />
        <Route path="/about" element={<About />} />
        <Route path="/profile-wizard" element={<ProfileWizard />} />
        <Route path="/profile" element={<UserProfile />} />
      </Routes>
    </>
  );
}

export default App;