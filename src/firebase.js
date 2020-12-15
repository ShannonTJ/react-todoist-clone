import firebase from "firebase/app";
import "firebase/firestore";

const firebaseConfig = firebase.initializeApp({
  //api data
  apiKey: "AIzaSyAGxY5go6TXNihPUkU_iier8vyzjEHyXuQ",
  authDomain: "react-todoist-clone-7e07b.firebaseapp.com",
  databaseURL: "https://react-todoist-clone-7e07b-default-rtdb.firebaseio.com",
  projectId: "react-todoist-clone-7e07b",
  storageBucket: "react-todoist-clone-7e07b.appspot.com",
  messagingSenderId: "1030451947260",
  appId: "1:1030451947260:web:a4f0704c963d9b89e21979",
});

export { firebaseConfig as firebase };
