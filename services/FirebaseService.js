import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, set } from 'firebase/database';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.EXPO_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
if (!app) {
  console.error("Firebase app initialization failed!");
}

// Auth & Database initialization
let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
} catch (e) {
  const { getAuth } = require('firebase/auth');
  auth = getAuth(app);
}

export { auth };
export const db = getDatabase(app);

export const seedDatabase = async (properties) => {
  try {
    const propertiesObj = {};
    properties.forEach(p => {
      propertiesObj[p.id] = p;
    });
    await set(ref(db, 'properties'), propertiesObj);
    return true;
  } catch (error) {
    console.error("Seed error:", error);
    return false;
  }
};

export const getProperties = (callback) => {
  const propertiesRef = ref(db, 'properties');
  onValue(propertiesRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const propertiesList = Object.keys(data).map(key => ({
        ...data[key],
        id: key
      }));
      callback(propertiesList);
    } else {
      callback([]);
    }
  });
};

export const seedAgents = async (agents) => {
  try {
    const agentsObj = {};
    agents.forEach(a => {
      agentsObj[a.id] = a;
    });
    await set(ref(db, 'agents'), agentsObj);
    return true;
  } catch (error) {
    console.error("Seed agents error:", error);
    return false;
  }
};

export const getAgents = (callback) => {
  const agentsRef = ref(db, 'agents');
  onValue(agentsRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const agentsList = Object.keys(data).map(key => ({
        ...data[key],
        id: key
      }));
      callback(agentsList);
    } else {
      callback([]);
    }
  });
};