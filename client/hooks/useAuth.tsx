import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  UserCredential
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { UserService, type UserProfile } from '@/lib/firestore';

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signup: (email: string, password: string, displayName: string) => Promise<UserCredential>;
  login: (email: string, password: string) => Promise<UserCredential>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  googleSignIn: () => Promise<UserCredential>;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const createUserProfile = async (user: User, additionalData?: any) => {
    if (!user) return;

    console.log('Creating/fetching user profile for:', user.email);
    
    try {
      // Use the UserService for profile management
      const userData = {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || '',
        photoURL: user.photoURL || undefined,
        phoneNumber: user.phoneNumber || '',
        bio: '',
        location: '',
        ...additionalData
      };
      
      console.log('Calling UserService.createOrUpdateProfile...');
      const profile = await UserService.createOrUpdateProfile(userData);
      console.log('Profile created/updated successfully:', profile);
      setUserProfile(profile);
      return profile;
      
    } catch (error) {
      console.error('Error in createUserProfile:', error);
      
      // Create a basic profile as fallback
      const basicProfile: UserProfile = {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || 'User',
        photoURL: user.photoURL || undefined,
        phoneNumber: user.phoneNumber || '',
        bio: '',
        location: '',
        joinedAt: new Date(),
        lastLoginAt: new Date(),
        reputation: 0,
        badgesEarned: [],
        totalReports: 0,
        totalComments: 0
      };
      
      console.log('Setting basic profile due to error');
      setUserProfile(basicProfile);
      return basicProfile;
    }
  };

  const signup = async (email: string, password: string, displayName: string) => {
    if (!auth) {
      throw new Error('Authentication not available in demo mode');
    }
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName });
    await createUserProfile(userCredential.user, { displayName });
    return userCredential;
  };

  const login = async (email: string, password: string) => {
    if (!auth) {
      throw new Error('Authentication not available in demo mode');
    }
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    await createUserProfile(userCredential.user);
    return userCredential;
  };

  const logout = async () => {
    setUserProfile(null);
    if (!auth) {
      return Promise.resolve();
    }
    return signOut(auth);
  };

  const resetPassword = async (email: string) => {
    if (!auth) {
      throw new Error('Password reset not available in demo mode');
    }
    return sendPasswordResetEmail(auth, email);
  };

  const googleSignIn = async () => {
    if (!auth) {
      throw new Error('Google Sign-In not available in demo mode');
    }
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    await createUserProfile(userCredential.user);
    return userCredential;
  };

  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (!currentUser) throw new Error('No user logged in');

    try {
      // Use UserService to update profile
      await UserService.updateProfile(currentUser.uid, data);
      
      // Update local state
      if (userProfile) {
        setUserProfile({ ...userProfile, ...data });
      }

      // Update Firebase Auth profile if needed
      if (data.displayName || data.photoURL) {
        await updateProfile(currentUser, {
          displayName: data.displayName || currentUser.displayName,
          photoURL: data.photoURL || currentUser.photoURL
        });
      }
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  };

  useEffect(() => {
    console.log('Setting up auth state listener...');
    
    if (!auth) {
      console.log('Auth not available - running in demo mode');
      setLoading(false);
      return;
    }
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('Auth state changed:', user ? user.email : 'No user');
      
      if (user) {
        setCurrentUser(user);
        console.log('User authenticated, creating profile...');
        
        // Set a timeout to prevent infinite loading
        const timeoutId = setTimeout(() => {
          console.log('Profile creation timeout, setting basic profile');
          const basicProfile: UserProfile = {
            uid: user.uid,
            email: user.email || '',
            displayName: user.displayName || 'User',
            photoURL: user.photoURL || undefined,
            phoneNumber: user.phoneNumber || undefined,
            bio: '',
            location: '',
            joinedAt: new Date(),
            lastLoginAt: new Date(),
            reputation: 0,
            badgesEarned: [],
            totalReports: 0,
            totalComments: 0
          };
          setUserProfile(basicProfile);
        }, 5000); // 5 second timeout
        
        try {
          await createUserProfile(user);
          clearTimeout(timeoutId);
          console.log('Profile creation completed');
        } catch (error) {
          console.error('Profile creation failed:', error);
          clearTimeout(timeoutId);
        }
      } else {
        console.log('No user, clearing state');
        setCurrentUser(null);
        setUserProfile(null);
      }
      
      console.log('Setting loading to false');
      setLoading(false);
    });

    return () => {
      console.log('Cleaning up auth listener');
      unsubscribe();
    };
  }, []);

  const value: AuthContextType = {
    currentUser,
    userProfile,
    loading,
    signup,
    login,
    logout,
    resetPassword,
    googleSignIn,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};