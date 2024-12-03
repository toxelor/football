import { openNotification } from "../components/helpers/notification"
import { getDocs, collection, getDoc, doc } from 'firebase/firestore'
import { db } from '../firebase/firebase'

export const getDocsData = async (name) => {
    const data = await getDocs(collection(db, name))
    const filteredData = data?.docs?.map((doc) => ({
        ...doc.data(), id: doc.id
    }))
    return filteredData
}

export const getDocData = async (name, id) => {
    const data = await getDoc(doc(db, name, id))
    return data.data()
}

