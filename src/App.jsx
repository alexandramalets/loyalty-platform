import { Navigate, Route, Routes } from 'react-router-dom';
import { useApp } from './context/AppContext';
import AppLayout from './components/layout/AppLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Levels from './pages/Levels';
import LevelDetails from './pages/LevelDetails';
import Participants from './pages/Participants';
import ParticipantDetails from './pages/ParticipantDetails';
import Promotions from './pages/Promotions';
import PromotionForm from './pages/PromotionForm';
import Bonuses from './pages/Bonuses';
import Analytics from './pages/Analytics';
import Profile from './pages/Profile';
import Settings from './pages/Settings';

function Protected() {
  const { auth } = useApp();
  if (!auth) return <Navigate to="/login" replace />;
  return <AppLayout />;
}

function Guest() {
  const { auth } = useApp();
  if (auth) return <Navigate to="/dashboard" replace />;
  return <Login />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Guest />} />
      <Route element={<Protected />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/levels" element={<Levels />} />
        <Route path="/levels/:id" element={<LevelDetails />} />
        <Route path="/participants" element={<Participants />} />
        <Route path="/participants/:id" element={<ParticipantDetails />} />
        <Route path="/promotions" element={<Promotions />} />
        <Route path="/promotions/new" element={<PromotionForm />} />
        <Route path="/promotions/:id" element={<PromotionForm />} />
        <Route path="/bonuses" element={<Bonuses />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
