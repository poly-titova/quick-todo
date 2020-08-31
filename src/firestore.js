import firebase from "@firebase/app";
import "@firebase/firestore";

const config = {
  apiKey: "AIzaSyD5F9dJKe7VFR-aacVIChwIohhlQ9jaGM4",
  authDomain: "",
  databaseURL: "https://console.firebase.google.com/project/quick-todo-1a013",
  projectId: "quick-todo-1a013",
  storageBucket: "",
  messagingSenderId: ""
};

const app = firebase.initializeApp(config);
const firestore = firebase.firestore(app);

export default firestore;