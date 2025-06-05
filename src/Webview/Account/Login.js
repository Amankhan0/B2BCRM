import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import Particles from 'react-particles';
import { loadSlim } from 'tsparticles-slim';

// Import existing components and utilities
import MyInput from '../../Component/MyInput';
import MyButton from '../../Component/MyButton';
import { ApiHit } from '../../utils';
import { buildVersion, login, searchRole, searchUser } from '../../Constants/Constants';
import { setAuthenticatedUser, setAuthenticatedUserWithRole, SetBuildVersion } from '../../Storage/Storage';
import { setDataAction } from '../../Store/Action/SetDataAction';
import { SET_API_JSON, SET_API_JSON_ERROR } from '../../Store/ActionName/ActionName';

function Login() {
  const dispatch = useDispatch();
  const ApiReducer = useSelector(state => state.ApiReducer);
  const [msg, setMsg] = useState();
  const [loading, setLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [errors, setErrors] = useState({});

  // Initialize particles
  const particlesInit = async (engine) => {
    await loadSlim(engine);
  };

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const validateForm = () => {
    const newErrors = {};
    
    if (!ApiReducer.apiJson?.username) {
      newErrors.username = 'Username is required';
    }
    
    if (!ApiReducer.apiJson?.password) {
      newErrors.password = 'Password is required';
    }
    
    dispatch(setDataAction(newErrors, SET_API_JSON_ERROR));
    return Object.keys(newErrors).length === 0;
  };

  const onClick = () => {
    if (!isOnline) {
      return;
    }
    
    if (validateForm()) {
      setLoading(true);
      var json = {
        username: ApiReducer.apiJson?.username,
        password: ApiReducer.apiJson?.password
      }
      
      ApiHit(json, login).then(Result => {
        if (Result?.data) {
          SetBuildVersion(buildVersion);
          setAuthenticatedUser(Result?.data);
          loadRoleData(Result);
        } else {
          setMsg({ login: 'User Not Found' });
          setLoading(false);
        }
      }).catch(error => {
        console.error('Login error:', error);
        setLoading(false);
      });
    }
  };

  function loadRoleData(res) {
    let decodedJson = jwtDecode(res?.data);
    if (decodedJson?.roleId) {
      var json = { page: 1, limit: 1, search: { _id: decodedJson?.roleId } };
      ApiHit(json, searchRole).then((Result) => {
        if (Result?.content?.[0]) {
          var userJson = {page: 1, limit: 1, search:{_id:decodedJson.userId}}
          ApiHit(userJson, searchUser).then(userRes => {
            console.log('userRes', userRes);
            if(userRes.content){
              Object.assign(res, { roleObject: Result?.content?.[0], userData: userRes?.content?.[0] });
              setAuthenticatedUserWithRole(res);
              window.location.href = '/';
            }
          }).catch(error => {
            console.error('User search error:', error);
            setLoading(false);
          });
        } else {
          setLoading(false);
        }
      }).catch(error => {
        console.error('Role search error:', error);
        setLoading(false);
      });
    }
  }

  // Particles configuration
  const particlesOptions = {
    fpsLimit: 120,
    interactivity: {
      events: {
        onClick: {
          enable: true,
          mode: "push",
        },
        onHover: {
          enable: true,
          mode: "repulse",
        },
        resize: true,
      },
      modes: {
        push: {
          quantity: 4,
        },
        repulse: {
          distance: 100,
          duration: 0.4,
        },
      },
    },
    particles: {
      color: {
        value: "#3b82f6", // blue-500
      },
      links: {
        color: "#93c5fd", // blue-300
        distance: 150,
        enable: true,
        opacity: 0.5,
        width: 1,
      },
      move: {
        direction: "none",
        enable: true,
        outModes: {
          default: "bounce",
        },
        random: false,
        speed: 2,
        straight: false,
      },
      number: {
        density: {
          enable: true,
          area: 800,
        },
        value: 80,
      },
      opacity: {
        value: 0.5,
      },
      shape: {
        type: "circle",
      },
      size: {
        value: { min: 1, max: 5 },
      },
    },
    detectRetina: true,
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Particles background */}
      <div className="absolute inset-0 z-0">
        <Particles
          id="tsparticles"
          init={particlesInit}
          options={particlesOptions}
        />
      </div>

      {/* Login card */}
      <div className="relative z-10 max-w-md w-full mx-auto space-y-8 bg-white bg-opacity-95 p-8 rounded-xl shadow-xl">
        <div>
          <div className="flex justify-center">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Welcome Back
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to access your account
          </p>
        </div>

        <div className="mt-8 space-y-6">
          {msg?.login && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Authentication Failed</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{msg.login}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="rounded-md ">
            <div className="backdrop-blur-sm bg-white bg-opacity-50 rounded-lg p-2">
              <MyInput 
                title="Username" 
                name="username" 
                placeholder="Enter your username" 
                important={true}
                error={true}
                className="focus:border-blue-500 transition-colors duration-300"
              />
            </div>
            <div className="backdrop-blur-sm bg-white bg-opacity-50 rounded-lg p-2">
              <MyInput 
                title="Password" 
                name="password" 
                placeholder="Enter your password" 
                important={true}
                error={true}
                type='password'
                className="focus:border-blue-500 transition-colors duration-300"
              />
            </div>
          </div>

          <div>
            <MyButton 
              title={loading ? 'Signing in...' : 'Sign in'} 
              onClick={onClick}
              disabled={loading || !isOnline}
              className="w-full flex justify-center py-3 px-4 border-0 text-base font-medium rounded-lg text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 shadow-lg transform transition-all duration-200 hover:-translate-y-1"
            />
          </div>

          {!isOnline && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mt-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">No Internet Connection</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>Please check your internet connection and try again.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;