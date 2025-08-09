import { useState } from 'react';
import steemAuthService from '../../services/steemAuth.service';

interface SteemLoginProps {
  onSuccess?: (user: any) => void;
  onError?: (error: string) => void;
}

export default function SteemLogin({ onSuccess, onError }: SteemLoginProps) {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [isKeychainInstalled] = useState(
    steemAuthService.isKeychainInstalled()
  );

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim()) {
      onError?.('Please enter your Steem username');
      return;
    }

    if (!isKeychainInstalled) {
      onError?.('Steem Keychain extension is required. Please install it first.');
      return;
    }

    setLoading(true);

    try {
      // Proceed with Keychain authentication (it will check account existence internally)
      const user = await steemAuthService.loginWithKeychain(username);
      
      onSuccess?.(user);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleInstallKeychain = () => {
    window.open('https://chrome.google.com/webstore/detail/steem-keychain/lkcjlnjfpbikmcmbachjpdbijejflpcm', '_blank');
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Login with Steem
        </h2>
        <p className="text-gray-600">
          Use your Steem account to access the marketplace
        </p>
      </div>

      {!isKeychainInstalled ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-center mb-3">
            <svg className="w-5 h-5 text-yellow-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <h3 className="text-yellow-800 font-medium">Steem Keychain Required</h3>
          </div>
          <p className="text-yellow-700 text-sm mb-3">
            You need to install the Steem Keychain browser extension to login.
          </p>
          <button
            onClick={handleInstallKeychain}
            className="btn-primary text-sm"
          >
            Install Keychain
          </button>
        </div>
      ) : (
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Steem Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input-field"
              placeholder="Enter your Steem username"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading || !username.trim()}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2Z"></path>
                </svg>
                Connecting to Keychain...
              </div>
            ) : (
              'Login with Keychain'
            )}
          </button>
        </form>
      )}

      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="text-center">
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            How it works
          </h3>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• Enter your Steem username</li>
            <li>• Keychain will ask you to sign a message</li>
            <li>• No passwords or private keys needed</li>
            <li>• Secure authentication via blockchain</li>
          </ul>
        </div>
      </div>

      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">
          Don't have a Steem account?{' '}
          <a 
            href="https://signup.steemit.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary-600 hover:text-primary-700"
          >
            Create one here
          </a>
        </p>
      </div>
    </div>
  );
}
