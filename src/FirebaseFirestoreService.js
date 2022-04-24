import firebase from "./FirebaseConfig"
require("firebase/compat/firestore")
const firestore = firebase.firestore()

const createDocument = (collection, document) => {
    return firestore.collection(collection).add(document);
}
const readDocument = (collection, id) => {
    return firestore.collection(collection).doc(id).get();
}
const readDocuments = async ({ collection, queries, orderByField, orderByDirection, perPage, cursorId }) => {
    let collectionRef = firestore.collection(collection);//this is an object that we can continuously append to all the different condtiongs and queries 
    //that we want
    if (queries?.length > 0) {
        //bu kod js bypass edleblr client tarafında olduğudan
        for (const query of queries) {
            console.log(query)
            collectionRef = collectionRef.where(query.field, query.condition, query.value)
        }
    }
    if (orderByField && orderByDirection) {
        collectionRef = collectionRef.orderBy(orderByField, orderByDirection)
    }
    if (perPage) {
        collectionRef = collectionRef.limit(perPage);
    }
    if (cursorId) {
        const document = await readDocument(collection, cursorId);
        collectionRef = collectionRef.startAfter(document);
    }
    return collectionRef.get();//sonda da istediğimz şekilde verimizi getiricez
}
const updateDocument = (collection, id, document) => {
    return firestore.collection(collection).doc(id).update(document);
};
const deleteDocument = (collection, id) => {
    return firestore.collection(collection).doc(id).delete();
}
const FirebaseFirestoreService = {
    createDocument,
    readDocuments,
    updateDocument,
    deleteDocument
}
export default FirebaseFirestoreService;