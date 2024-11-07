import { openNotification } from "../components/helpers/notification"
import { getDocs, collection } from 'firebase/firestore'
import { db } from '../firebase/firebase'

export const getDocData = async (name) => {
    const data = await getDocs(collection(db, name))
    const filteredData = data?.docs?.map((doc) => ({
        ...doc.data(), id: doc.id
    }))
    return filteredData
}

