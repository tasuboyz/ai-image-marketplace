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

            // First verify the account exists on Steem blockchain
            const accountExists = await this.checkSteemAccount(username);
            if (!accountExists) {
                throw new Error('Steem account not found. Please check your username.');
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
                                // Create user object from Steem account data
                                const steemProfile = await this.getSteemProfile(username);
                                
                                const user: User = {
                                    username: username,
                                    avatar: this.getUserAvatar(username),
                                    authMethod: 'keychain',
                                    steemProfile: steemProfile,
                                    createdAt: new Date().toISOString(),
                                    lastLogin: new Date().toISOString()
                                };
                                
                                // Save to memory
                                this.currentUser = user;
                                
                                // Save to storage if remember is true
                                if (remember) {
                                    localStorage.setItem('currentUser', JSON.stringify(user));
                                    localStorage.setItem('authToken', `keychain_${username}_${Date.now()}`);
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
     * Check if a Steem account exists on the blockchain
     */
    async checkSteemAccount(username: string): Promise<boolean> {
        try {
            // Use Steem API to check if account exists
            const response = await fetch('https://api.steemit.com', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    jsonrpc: '2.0',
                    method: 'database_api.find_accounts',
                    params: {
                        accounts: [username]
                    },
                    id: 1
                })
            });

            const data = await response.json();
            return data.result && data.result.accounts && data.result.accounts.length > 0;
        } catch (error) {
            console.error('Error checking Steem account:', error);
            return false;
        }
    }

    /**
     * Get Steem profile information
     */
    async getSteemProfile(username: string): Promise<any> {
        try {
            // Get account data from Steem blockchain
            const response = await fetch('https://api.steemit.com', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    jsonrpc: '2.0',
                    method: 'database_api.find_accounts',
                    params: {
                        accounts: [username]
                    },
                    id: 1
                })
            });

            const data = await response.json();
            if (data.result && data.result.accounts && data.result.accounts.length > 0) {
                const account = data.result.accounts[0];
                
                // Parse metadata for additional info
                let metadata = {};
                try {
                    if (account.posting_json_metadata) {
                        metadata = JSON.parse(account.posting_json_metadata);
                    }
                } catch (e) {
                    console.log('Could not parse metadata');
                }

                return {
                    reputation: this.calculateReputation(account.reputation),
                    postCount: account.post_count,
                    about: (metadata as any)?.profile?.about || '',
                    ...metadata
                };
            }
            
            return {};
        } catch (error) {
            console.error('Error getting Steem profile:', error);
            return {};
        }
    }

    /**
     * Calculate reputation from raw reputation value
     */
    private calculateReputation(rep: string): number {
        if (!rep) return 25;
        
        const reputation = parseInt(rep);
        if (reputation === 0) return 25;
        
        let score = Math.log10(Math.abs(reputation));
        score = Math.max(score - 9, 0);
        score *= reputation < 0 ? -1 : 1;
        score = score * 9 + 25;
        
        return Math.round(score * 100) / 100;
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
            const exists = await this.checkSteemAccount(username);
            
            if (exists) {
                const profile = await this.getSteemProfile(username);
                return { exists: true, profile };
            }
            
            return { exists: false };
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
