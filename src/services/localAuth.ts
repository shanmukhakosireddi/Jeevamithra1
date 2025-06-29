import { UserProfile } from '../types/user';

export interface LocalUser {
  uid: string;
  email: string;
  password: string;
  profile: Omit<UserProfile, 'uid'>;
}

export interface AuthResult {
  success: boolean;
  user?: LocalUser;
  error?: string;
}

class LocalAuthService {
  private readonly USERS_KEY = 'jeevamithra_users';
  private readonly CURRENT_USER_KEY = 'jeevamithra_current_user';

  // Get all users from localStorage
  private getUsers(): LocalUser[] {
    try {
      const users = localStorage.getItem(this.USERS_KEY);
      return users ? JSON.parse(users) : [];
    } catch (error) {
      console.error('Error reading users from localStorage:', error);
      return [];
    }
  }

  // Save users to localStorage
  private saveUsers(users: LocalUser[]): void {
    try {
      localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    } catch (error) {
      console.error('Error saving users to localStorage:', error);
    }
  }

  // Generate unique user ID
  private generateUID(): string {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // Validate email format
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Register new user
  public async register(
    email: string,
    password: string,
    fullName: string,
    phone: string,
    age: number,
    gender: 'male' | 'female' | 'other'
  ): Promise<AuthResult> {
    try {
      // Validate input
      if (!email || !password || !fullName || !phone || !age || !gender) {
        return { success: false, error: 'All fields are required' };
      }

      if (!this.isValidEmail(email)) {
        return { success: false, error: 'Invalid email format' };
      }

      if (password.length < 6) {
        return { success: false, error: 'Password must be at least 6 characters' };
      }

      const users = this.getUsers();

      // Check if user already exists
      if (users.find(user => user.email === email)) {
        return { success: false, error: 'Email already in use' };
      }

      // Create new user
      const uid = this.generateUID();
      const newUser: LocalUser = {
        uid,
        email,
        password, // In production, this should be hashed
        profile: {
          fullName,
          email,
          phone,
          age,
          gender,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      };

      // Save user
      users.push(newUser);
      this.saveUsers(users);

      // Set as current user
      this.setCurrentUser(newUser);

      return { success: true, user: newUser };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Registration failed' };
    }
  }

  // Login user
  public async login(email: string, password: string): Promise<AuthResult> {
    try {
      if (!email || !password) {
        return { success: false, error: 'Email and password are required' };
      }

      const users = this.getUsers();
      const user = users.find(u => u.email === email && u.password === password);

      if (!user) {
        return { success: false, error: 'Invalid email or password' };
      }

      // Set as current user
      this.setCurrentUser(user);

      return { success: true, user };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed' };
    }
  }

  // Logout user
  public async logout(): Promise<void> {
    try {
      localStorage.removeItem(this.CURRENT_USER_KEY);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  // Get current user
  public getCurrentUser(): LocalUser | null {
    try {
      const currentUser = localStorage.getItem(this.CURRENT_USER_KEY);
      return currentUser ? JSON.parse(currentUser) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  // Set current user
  private setCurrentUser(user: LocalUser): void {
    try {
      localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Error setting current user:', error);
    }
  }

  // Update user profile
  public async updateProfile(
    uid: string,
    updates: Partial<Omit<UserProfile, 'uid' | 'email' | 'createdAt'>>
  ): Promise<AuthResult> {
    try {
      const users = this.getUsers();
      const userIndex = users.findIndex(u => u.uid === uid);

      if (userIndex === -1) {
        return { success: false, error: 'User not found' };
      }

      // Update user profile
      users[userIndex].profile = {
        ...users[userIndex].profile,
        ...updates,
        updatedAt: new Date()
      };

      // Save updated users
      this.saveUsers(users);

      // Update current user if it's the same user
      const currentUser = this.getCurrentUser();
      if (currentUser && currentUser.uid === uid) {
        this.setCurrentUser(users[userIndex]);
      }

      return { success: true, user: users[userIndex] };
    } catch (error) {
      console.error('Profile update error:', error);
      return { success: false, error: 'Profile update failed' };
    }
  }

  // Check if user is authenticated
  public isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }

  // Get user profile
  public getUserProfile(uid: string): UserProfile | null {
    const users = this.getUsers();
    const user = users.find(u => u.uid === uid);
    
    if (user) {
      return {
        uid: user.uid,
        ...user.profile
      };
    }
    
    return null;
  }

  // Clear all data (for testing/reset)
  public clearAllData(): void {
    localStorage.removeItem(this.USERS_KEY);
    localStorage.removeItem(this.CURRENT_USER_KEY);
  }
}

// Create singleton instance
export const localAuthService = new LocalAuthService();

// Export convenience functions
export const registerUser = (
  email: string,
  password: string,
  fullName: string,
  phone: string,
  age: number,
  gender: 'male' | 'female' | 'other'
) => localAuthService.register(email, password, fullName, phone, age, gender);

export const loginUser = (email: string, password: string) => 
  localAuthService.login(email, password);

export const logoutUser = () => localAuthService.logout();

export const getCurrentUser = () => localAuthService.getCurrentUser();

export const isAuthenticated = () => localAuthService.isAuthenticated();

export const updateUserProfile = (uid: string, updates: Partial<Omit<UserProfile, 'uid' | 'email' | 'createdAt'>>) =>
  localAuthService.updateProfile(uid, updates);

export const getUserProfile = (uid: string) => localAuthService.getUserProfile(uid);