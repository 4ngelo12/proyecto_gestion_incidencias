import React, { useState } from 'react';
import { sendMailPassword } from '../../../core/services/auth/RecoveryService';
import { showErrorAlert, showSuccessAlert } from '../../../core/services/alerts/AlertsService';

export default function RecoveryPassword() {
  const [email, setEmail] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await sendMailPassword(email); // Función que consume tu API

      if (response.status === 200) {
        showSuccessAlert({ text: response.message });
      }
    } catch (error) {
      showErrorAlert({ title: 'Error', text: (error as Error).message });
      setError(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="px-6 py-12 mx-auto w-max md:w-5/12 bg-stone-200 absolute top-1/2 left-1/2
            rounded-md -translate-x-1/2 -translate-y-1/2">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            alt="Your Company"
            src="/public/logo.png"
            className="mx-auto h-fit w-full "
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Recuperar Contraseña
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900 text-start">
                Correo de Recuperación
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

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <div className='flex flex-col md:flex-row gap-x-3 gap-y-4'>
              <button
                type="submit"
                className={`flex w-full md:w-1/2 justify-center rounded-md bg-sky-600 px-3 py-1.5 text-sm font-semibold
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
                  'Recuperar Contraseña'
                )}
              </button>

              <button
                type="submit"
                className={`w-full md:w-1/2 justify-center rounded-md bg-red-500 px-3 py-1.5 text-sm font-semibold
                text-white shadow-sm hover:bg-red-800`}
                onClick={() => window.history.back()}
              >
                Regresar
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
} 