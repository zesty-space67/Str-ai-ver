import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from '@clerk/clerk-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SparklesCore } from '../components/ui/sparkles';
import { FlipWords } from '../components/ui/flip-words';
import "../App.css";

export default function LandingPage() {
  const { isSignedIn } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (isSignedIn) {
      navigate('/dashboard');
    }
  }, [isSignedIn, navigate]);

  return (
    <div className="app">
      <SparklesCore
        background="#000000"
        particleColor="#ffffff"
        speed={2}
        particleDensity={100}
        minSize={1}
        maxSize={2}
        className="absolute inset-0 z-0"
      />
      <div className="top-right">
        <SignedOut>
          <SignInButton>
            <button className="sign-in-btn">Sign In</button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>

      <div className="center-screen">
          <h1 className='main-title'>STR-AI-VER</h1>
          <hr />
          <h2 className='sub-title'>A platform to   
        <span className='flip'><FlipWords words={[" learn", " build", " explore"]} /></span></h2>
      </div>
    </div>
  );
}
