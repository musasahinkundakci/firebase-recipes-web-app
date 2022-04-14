import firebase from "./FirebaseConfig";
//auth instance ı olştrumalıyız
require("firebase/compat/auth")
const auth = firebase.auth();
const registerUser = (email, password) => {
    return auth.createUserWithEmailAndPassword(email, password);//bir promise döner ve biz onu handle etcez sonra
}
const loginUser = (email, password) => {
    return auth.signInWithEmailAndPassword(email, password);
}

const logoutUser = () => {
    return auth.signOut();
}
const sendPasswordResetEmail = (email) => {
    return auth.sendPasswordResetEmail(email);
}
const loginWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    return auth.signInWithPopup(provider);
}
const subscribeToAuthChanges = (handleAuthChange) => {
    auth.onAuthStateChanged(user => {
        handleAuthChange(user);
    })
}
const FirebaseAuthService = {
    registerUser,
    loginUser,
    logoutUser,
    sendPasswordResetEmail,
    loginWithGoogle,
    subscribeToAuthChanges
}
export default FirebaseAuthService;