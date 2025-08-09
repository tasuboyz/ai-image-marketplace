import type { User } from '../types/User';

// Extend Window interface for Steem Keychain
declare global {
  interface Window {
    steem_keychain?: {
      requestSignBuffer: (
        username: string,
        message: string,
        key: string,
        callback: (response: KeychainResponse) => void
      ) => void;
      requestBroadcast: (
        username: string,
        operations: any[],
        key: string,
        callback: (response: KeychainResponse) => void
      ) => void;
      requestCustomJson: (
        username: string,
        id: string,
        key: string,
        json: string,
        display_name: string,
        callback: (response: KeychainResponse) => void
      ) => void;
    };
  }
}

interface KeychainResponse {
  success: boolean;
  error?: string;
  result?: string;
}

interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

interface VerifyAccountResponse {
  exists: boolean;
  profile?: any;
}

/**
 * Service for handling Steem Keychain authentication
 */
class SteemAuthService {
    private currentUser: User | null = null;

    constructor() {
        this.currentUser = this.loadUserFromStorage();
    }

    /**
     * Loads user data from localStorage if available
     */
    loadUserFromStorage(): User | null {
        try {
            const storedUser = localStorage.getItem('currentUser');
            return storedUser ? JSON.parse(storedUser) : null;
        } catch (error) {
            console.error('Error loading user from storage:', error);
            return null;
        }
    }

    /**
     * Get the currently logged in user
     */
    getCurrentUser(): User | null {
        if (!this.currentUser) {
            this.currentUser = this.loadUserFromStorage();
        }
        return this.currentUser;
    }

    /**
     * Check if SteemKeychain extension is installed
     */
    isKeychainInstalled(): boolean {
        return typeof window !== 'undefined' && window.steem_keychain !== undefined;
    }

    /**
     * Authenticate a user using SteemKeychain
     * @param username - Steem username
     * @param remember - Whether to remember the user for future sessions
     */
    async loginWithKeychain(username: string, remember = true): Promise<User> {
        try {
            if (!this.isKeychainInstalled()) {
                throw new Error('Steem Keychain extension is not installed');
            }

            // Request a simple signing operation to verify the user has the key in Keychain
            return new Promise<User>((resolve, reject) => {
                const message = `Login to AI Image Marketplace: ${new Date().toISOString()}`;
                
                window.steem_keychain!.requestSignBuffer(
                    username,
                    message,
                    'Posting',
                    async (response: KeychainResponse) => {
                        if (response.success) {
                            try {
                                // Send signature to backend for verification
                                const authResult = await this.verifyWithBackend(
                                    username, 
                                    message, 
                                    response.result!,
                                    'keychain'
                                );
                                
                                const user = authResult.user;
                                
                                // Save to memory
                                this.currentUser = user;
                                
                                // Save to storage if remember is true
                                if (remember) {
                                    localStorage.setItem('currentUser', JSON.stringify(user));
                                    localStorage.setItem('authToken', authResult.token);
                                }
                                
                                resolve(user);
                            } catch (error) {
                                reject(error);
                            }
                        } else {
                            reject(new Error(response.error || 'Authentication failed'));
                        }
                    }
                );
            });
        } catch (error) {
            console.error('Keychain login failed:', error);
            throw new Error(error instanceof Error ? error.message : 'Authentication failed');
        }
    }

    /**
     * Verify signature with backend
     */
    async verifyWithBackend(
        username: string, 
        message: string, 
        signature: string, 
        authMethod: string
    ): Promise<AuthResponse> {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/steem`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    message,
                    signature,
                    authMethod
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Authentication failed');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Backend verification failed:', error);
            throw error;
        }
    }

    /**
     * Verify if a Steem account exists
     */
    async verifyAccount(username: string): Promise<VerifyAccountResponse> {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/verify/${username}`);
            
            if (!response.ok) {
                if (response.status === 404) {
                    return { exists: false };
                }
                throw new Error('Failed to verify account');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Account verification failed:', error);
            throw error;
        }
    }

    /**
     * Log out the current user
     */
    logout(): boolean {
        try {
            // Clear auth state
            this.currentUser = null;
            localStorage.removeItem('currentUser');
            localStorage.removeItem('authToken');
            
            return true;
        } catch (error) {
            console.error('Error during logout:', error);
            return false;
        }
    }

    /**
     * Check if the user is authenticated
     */
    isAuthenticated(): boolean {
        const user = this.getCurrentUser();
        const token = localStorage.getItem('authToken');
        return !!(user && token);
    }

    /**
     * Get the stored authentication token
     */
    getToken(): string | null {
        return localStorage.getItem('authToken');
    }

    /**
     * Get user avatar URL
     */
    getUserAvatar(username: string): string {
        return `https://steemitimages.com/u/${username}/avatar`;
    }

    /**
     * Request posting operation through Keychain
     */
    async requestPosting(username: string, operation: any): Promise<KeychainResponse> {
        if (!this.isKeychainInstalled()) {
            throw new Error('Steem Keychain extension is not installed');
        }

        return new Promise((resolve, reject) => {
            window.steem_keychain!.requestBroadcast(
                username,
                [operation],
                'Posting',
                (response: KeychainResponse) => {
                    if (response.success) {
                        resolve(response);
                    } else {
                        reject(new Error(response.error || 'Operation failed'));
                    }
                }
            );
        });
    }

    /**
     * Request custom JSON operation through Keychain
     */
    async requestCustomJson(username: string, id: string, json: object): Promise<KeychainResponse> {
        if (!this.isKeychainInstalled()) {
            throw new Error('Steem Keychain extension is not installed');
        }

        return new Promise((resolve, reject) => {
            window.steem_keychain!.requestCustomJson(
                username,
                id,
                'Posting',
                JSON.stringify(json),
                'AI Image Marketplace',
                (response: KeychainResponse) => {
                    if (response.success) {
                        resolve(response);
                    } else {
                        reject(new Error(response.error || 'Operation failed'));
                    }
                }
            );
        });
    }
}

// Export singleton instance
const steemAuthService = new SteemAuthService();
export default steemAuthService;
