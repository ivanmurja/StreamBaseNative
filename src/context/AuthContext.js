import React, { createContext, useState, useEffect, useContext } from "react";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  updateEmail,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth, db } from "../firebase/config";
import {
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
  deleteField,
} from "firebase/firestore";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mediaStates, setMediaStates] = useState({});

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (user) {
      const mediaStatesDocRef = doc(db, "users", user.uid);
      const unsubscribeStates = onSnapshot(mediaStatesDocRef, (docSnap) => {
        setMediaStates(
          docSnap.exists() ? docSnap.data().mediaStates || {} : {}
        );
      });
      return () => unsubscribeStates();
    } else {
      setMediaStates({});
    }
  }, [user]);

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signup = async (displayName, email, password) => {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    await updateProfile(user, { displayName });
    const userDocRef = doc(db, "users", user.uid);
    await setDoc(
      userDocRef,
      {
        profile: {
          displayName: displayName,
          bio: "",
        },
        tenantId: `tenant_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date(),
      },
      { merge: true }
    );
    return userCredential;
  };

  const logout = () => {
    return signOut(auth);
  };

  const updateUserProfile = async (displayName) => {
    if (!user) return;
    await updateProfile(user, { displayName });
    const userDocRef = doc(db, "users", user.uid);
    await updateDoc(userDocRef, { "profile.displayName": displayName });
    setUser((currentUser) => ({ ...currentUser, displayName }));
  };

  const updateUserEmail = async (newEmail) => {
    if (!user) return;
    await updateEmail(user, newEmail);
    setUser((currentUser) => ({ ...currentUser, email: newEmail }));
  };

  const sendPasswordReset = () => {
    if (!user) return;
    return sendPasswordResetEmail(auth, user.email);
  };

  const updateMediaState = async (media, newStates) => {
    if (!user) return;
    const mediaId = `${media.mediaType}_${media.id}`;
    const docRef = doc(db, "users", user.uid);
    const currentMediaInfo = mediaStates[mediaId] || {};
    const updatedMediaInfo = { ...currentMediaInfo, ...media, ...newStates };
    const newMediaStates = { ...mediaStates, [mediaId]: updatedMediaInfo };
    await setDoc(docRef, { mediaStates: newMediaStates }, { merge: true });
  };

  const removeFavorite = async (mediaType, mediaId) => {
    if (!user) return;
    const mediaKey = `${mediaType}_${mediaId}`;
    const docRef = doc(db, "users", user.uid);
    await updateDoc(docRef, {
      [`mediaStates.${mediaKey}`]: deleteField(),
    });
  };

  const getMediaStatus = (mediaType, id) => {
    const mediaId = `${mediaType}_${id}`;
    return mediaStates[mediaId] || {};
  };

  const getFavorites = () =>
    Object.values(mediaStates).filter((item) => item.favorited);

  const value = {
    user,
    loading,
    signup,
    login,
    logout,
    updateUserProfile,
    updateUserEmail,
    sendPasswordReset,
    updateMediaState,
    removeFavorite,
    getMediaStatus,
    getFavorites,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
