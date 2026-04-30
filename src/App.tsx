import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import StatuePage from './pages/StatuePage';
import GamePage from './pages/GamePage';
import ExperiencePage from './pages/ExperiencePage';

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/statue" element={<StatuePage />} />
          <Route path="/game" element={<GamePage />} />
          <Route path="/experience" element={<ExperiencePage />} />
        </Routes>
      </Layout>
    </Router>
  );
}
