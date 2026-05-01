import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  onAuthStateChanged 
} from 'firebase/auth';
import { db, auth } from './FirebaseService';
import { ref, set, get, onValue } from 'firebase/database';

export const registerUser = async (email, password, fullName) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Kullanıcı bilgilerini database'e kaydet (Rol: User)
    await set(ref(db, `users/${user.uid}`), {
      fullName,
      email,
      role: 'user', // Varsayılan rol
      createdAt: new Date().toISOString()
    });
    
    return { user, error: null };
  } catch (error) {
    return { user: null, error: error.message };
  }
};

export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Kullanıcı rolünü kontrol et
    const userSnapshot = await get(ref(db, `users/${user.uid}`));
    const userData = userSnapshot.val();
    
    return { user, userData, error: null };
  } catch (error) {
    return { user: null, error: error.message };
  }
};

export const logoutUser = () => signOut(auth);

export const subscribeToAuthChanges = (callback) => {
  let unsubscribeData = null;
  
  const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
    if (unsubscribeData) {
      unsubscribeData();
      unsubscribeData = null;
    }

    if (user) {
      const userRef = ref(db, `users/${user.uid}`);
      unsubscribeData = onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        callback(user, data);
      }, (error) => {
        console.error("User data subscription error:", error);
      });
    } else {
      callback(null, null);
    }
  });

  return () => {
    unsubscribeAuth();
    if (unsubscribeData) unsubscribeData();
  };
};

 export const toggleFavorite = async (userId, propertyId, currentFavorites = []) => {
  try {
    let newFavorites = [...currentFavorites];
    if (newFavorites.includes(propertyId)) {
      newFavorites = newFavorites.filter(id => id !== propertyId);
    } else {
      newFavorites.push(propertyId);
    }
    await set(ref(db, `users/${userId}/favorites`), newFavorites);
    return { favorites: newFavorites, error: null };
  } catch (error) {
    return { favorites: null, error: error.message };
  }
};