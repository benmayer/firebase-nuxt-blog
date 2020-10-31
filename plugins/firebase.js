import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/analytics'
import 'firebase/storage'

export default ({ env, store }, inject) => {
  const firebaseConfig = {
    apiKey: env.FIREBASE_CONFIG_API_KEY,
    authDomain: env.FIREBASE_CONFIG_AUTH_DOMAIN,
    databaseURL: env.FIREBASE_CONFIG_DATABASE_URL,
    projectId: env.FIREBASE_CONFIG_PROJECT_ID,
    storageBucket: env.FIREBASE_CONFIG_STORAGE_BUCKET,
    messagingSenderId: env.FIREBASE_CONFIG_MESSAGING_SENDER_ID,
    appId: env.FIREBASE_CONFIG_APP_ID,
    measurementId: env.FIREBASE_CONFIG_MEASUREMENT_ID
  }

  if (!firebase.apps.length) {
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig)
  }

  if (process.client) {
    firebase.analytics()
    firebase.auth().onAuthStateChanged((user) => {
      store.dispatch('setAuth', user)
    })
  }

  inject('firebase', firebase)
}
