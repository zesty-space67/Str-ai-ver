import { Routes, Route } from 'react-router-dom';
import { SignedIn } from '@clerk/clerk-react';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import "./App.css";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/dashboard" element={
        <SignedIn>
          <Dashboard />
        </SignedIn>  
        } 
        />
    </Routes>
  );
}
