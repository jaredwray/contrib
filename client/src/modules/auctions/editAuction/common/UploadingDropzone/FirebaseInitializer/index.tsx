import { FC, useEffect } from 'react';

import firebase from '@firebase/app';
import '@firebase/storage';

import { useScript } from 'src/helpers/useScript';

const FirebaseInitializer: FC = () => {
  useScript('https://www.gstatic.com/firebasejs/8.9.1/firebase-app.js');
  useScript('https://www.gstatic.com/firebasejs/8.9.1/firebase-firestore.js');

  useEffect(() => {
    if (firebase.apps?.length) return;

    const firebaseConfig = JSON.parse(process.env.REACT_APP_FIREBASE_CONFIG || '{}');

    firebase.initializeApp(firebaseConfig);
  }, []);

  return null;
};

export default FirebaseInitializer;
