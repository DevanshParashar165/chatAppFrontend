import React, { useContext } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import { Toaster } from 'react-hot-toast'
import { AuthContext } from '../context/AuthContext'
import { ChatContext } from '../context/ChatContext'
import VideoCall from './components/VideoCall'
import IncomingCall from './components/IncomingCall'

const App = () => {
  const authContext = useContext(AuthContext);
  const chatContext = useContext(ChatContext);

  if (!authContext) {
    return <div className="h-screen flex items-center justify-center text-white">Initializing Auth...</div>;
  }

  const { authUser, loading } = authContext;
  const { isCalling, incomingCall } = chatContext || { isCalling: false, incomingCall: null };

  // Prevent redirect until auth check finishes
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    )
  }

  return (
    <div className="bg-[url('/bgImage.svg')] bg-cover bg-center">
      <Toaster />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/chat"
          element={
            authUser ? (
              <>
                <HomePage />

                {/* Overlay Incoming Call UI */}
                {incomingCall && <IncomingCall />}

                {/* Overlay Active Call UI */}
                {isCalling && <VideoCall />}
              </>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/chat" />}/>
        <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />}/>
      </Routes>
    </div>
  )
}

export default App
