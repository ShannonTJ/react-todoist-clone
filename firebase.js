import firebase from "firebase/app";
import "firebase/firestore";

const firebaseConfig = firebase.initializeApp({
  //api key data
});

export { firebaseConfig as firebase };
