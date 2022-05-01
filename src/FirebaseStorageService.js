import firebase from "./FirebaseConfig";
require("firebase/compat/storage")
const storageRef = firebase.storage().ref();

const uploadFile = (file, fullFilePath, progressCallBack) => {
    const uploadTask = storageRef.child(fullFilePath).put(file);
    uploadTask.on(
        "state_changed",
        (snapshot) => {
            const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            progressCallBack(progress);
        },
        (error) => {
            throw error;
        }
    )
    return uploadTask.then(async () => {
        const downloadUrl = await uploadTask.snapshot.ref.getDownloadURL();
        return downloadUrl;
    })
};
const deleteFile = (fileDownloadUrl) => {
    const decodedUrl = decodeURIComponent(fileDownloadUrl);
    const startIndex = decodedUrl.indexOf("/o/") + 3;
    const endIndex = decodedUrl.indexOf("?");
    const filePath = decodedUrl.substring(startIndex, endIndex);
    return storageRef.child(filePath).delete();
}
const FirebaseStorageService = {
    deleteFile,
    uploadFile
}
export default FirebaseStorageService;