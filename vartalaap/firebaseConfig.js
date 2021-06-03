import firebase from 'firebase';


var config = {
    apiKey: "AIzaSyBlv7oonopeXKglBrz0tP9ppXzZrtC-fa4",
    authDomain: "varta-laap.firebaseapp.com",
    databaseURL: "https://varta-laap-default-rtdb.firebaseio.com",
    projectId: "varta-laap",
    storageBucket: "varta-laap.appspot.com",
    messagingSenderId: "571858413012",
    appId: "1:571858413012:web:a47b9a80bb83846906e241"
  };

  export const fireApp=firebase.initializeApp(config);
  export {firebase};
  