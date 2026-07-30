import React, { useContext, useState } from 'react'
import assets from '../assets/assets'
import { AuthContext } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Github, Chrome } from 'lucide-react'

const LoginPage = () => {

  const [currentState, setCurrentState] = useState("Sign Up")
  const [fullname, setFullname] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [bio, setBio] = useState("")
  const [isDataSubmitted, setIsDataSubmitted] = useState(false)

  const authContext = useContext(AuthContext)
  if (!authContext) throw new Error("AuthContext is missing");
  const { login } = authContext;

  const onSubmitHandler = async (event: any) => {
    event.preventDefault();
    if (currentState === "Sign Up" && !isDataSubmitted) {
      setIsDataSubmitted(true)
      return;
    }
    login(currentState === 'Sign Up' ? 'signup' : 'login', { fullname, email, password, bio });
  }
  const generateState = () => {
    const array = new Uint32Array(4);
    window.crypto.getRandomValues(array);
    let state = "";
    for (let i = 0; i < array.length; i++) {
      state += array[i].toString(36);
    }
    return state;
  };

  const handleGoogleLogin = () => {
    const state = generateState();
    localStorage.setItem("oauth_state", state);
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "870634691456-mockgoogleclientid.apps.googleusercontent.com";
    const redirectUri = encodeURIComponent(`${import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_SERVER_URL || "http://localhost:5000"}/api/auth/google/callback`);
    const scope = encodeURIComponent("profile email");
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&state=${state}`;
  };

  const handleGithubLogin = () => {
    const state = generateState();
    localStorage.setItem("oauth_state", state);
    const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID || "Ov23ct429b6f8490a0fc";
    const redirectUri = encodeURIComponent(`${import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_SERVER_URL || "http://localhost:5000"}/api/auth/github/callback`);
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=user:email&state=${state}`;
  };


  return (
    <div className='min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl'>
      {/* left */}
      <img src={assets.logo_big} alt="" className='w-[min(30vw,250px)]' />
      {/* right */}
      <form onSubmit={onSubmitHandler} className='border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg'>
        <h2 className='font-medium text-2xl flex justify-between items-center'>{currentState}{isDataSubmitted && (<img onClick={() => setIsDataSubmitted(false)} src={assets.arrow_icon} alt="" className='w-5 cursor-pointer' />)}
        </h2>
        {currentState === "Sign Up" && !isDataSubmitted && (
          <input onChange={(e) => setFullname(e.target.value)} value={fullname} type="text" name="" id="" className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500' placeholder='Full Name' required />
        )}

        {!isDataSubmitted && (
          <>
            <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" placeholder='Email Address' required className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500' />
            <input onChange={(e) => setPassword(e.target.value)} value={password} type="password" placeholder='Password' required className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500' />
          </>
        )}
        {currentState === "Sign Up" && isDataSubmitted && (
          <textarea onChange={(e) => setBio(e.target.value)} value={bio} rows={4} className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500' placeholder='provide a short bio ....' required></textarea>
        )}
        <button type='submit' className='py-3 bg-linear-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer'>
          {currentState === "Sign Up" ? "Create Account" : "Login Now"}
        </button>

        <div className="flex items-center gap-2 my-1">
          <div className="flex-1 h-[1px] bg-slate-800" />
          <span className="text-[10px] uppercase font-bold text-slate-500">Or continue with</span>
          <div className="flex-1 h-[1px] bg-slate-800" />
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="flex-1 flex items-center justify-center gap-2 border border-slate-700 bg-slate-900/40 hover:bg-slate-900/80 hover:text-white transition-all text-xs font-semibold py-2.5 rounded-lg cursor-pointer text-slate-300"
          >
            <Chrome className="w-4 h-4 text-rose-500" />
            Google
          </button>
          <button
            type="button"
            onClick={handleGithubLogin}
            className="flex-1 flex items-center justify-center gap-2 border border-slate-700 bg-slate-900/40 hover:bg-slate-900/80 hover:text-white transition-all text-xs font-semibold py-2.5 rounded-lg cursor-pointer text-slate-300"
          >
            <Github className="w-4 h-4 text-indigo-400" />
            GitHub
          </button>
        </div>

        <div className='flex flex-col gap-2'>
          {currentState === "Sign Up" ? (
            <p className='text-sm text-gray-500'>Already have an Account ? <span onClick={() => { setCurrentState("Login"); setIsDataSubmitted(false) }} className='font-medium text-violet-500 cursor-pointer'>Login Here</span></p>
          ) : (
            <p className='text-sm text-gray-500'>Create an Account <span onClick={() => { setCurrentState("Sign Up") }} className='font-medium text-violet-500 cursor-pointer'>Click Here</span></p>
          )}
        </div>
      </form>
    </div>
  )
}

export default LoginPage
