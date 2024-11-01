import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Para redireccionar
import { loginUser } from '../../../core/services/auth/AuthService';
import { useAuth } from '../../../core/services/auth/AuthContext';

export default function Login() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await loginUser(email, password);
      
      if (response.status === 200) {
        localStorage.setItem('token', response.token);
        login(response.token);
        navigate('/dashboard');
      }
      
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
      window.location.reload();
    }
  };

  return (
    <>
      <div className="px-6 py-12 w-full md:w-5/12 bg-stone-200 absolute top-1/2 left-1/2 
            rounded-md -translate-x-1/2 -translate-y-1/2">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            alt="Your Company"
            src="/public/logo.png"
            className="mx-auto h-fit w-full"
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Inicio de Sesión
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900 text-start">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm 
                        placeholder:text-gray-400 focus:ring-2 sm:text-sm ps-2"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                  Password
                </label>
                <div className="text-sm">
                  <Link to="/recuperar-contrasena" className="font-semibold text-indigo-600 hover:text-indigo-500">
                    Recuperar Contraseña
                  </Link>
                </div>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm 
                        placeholder:text-gray-400 sm:text-sm ps-2"
                />
              </div>
            </div>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <div>
              <button
                type="submit"
                className={`flex w-full justify-center rounded-md bg-sky-600 px-3 py-1.5 text-sm font-semibold
          text-white shadow-sm hover:bg-cyan-800 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isLoading} // Deshabilitar cuando isLoading es true
              >
                {isLoading ? (
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    ></path>
                  </svg>
                ) : (
                  'Sign in'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
} 