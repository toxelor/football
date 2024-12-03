import { signOut } from "firebase/auth"
import { useNavigate } from 'react-router-dom'
import { auth, db } from "../firebase/firebase"
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Drawer } from "antd";

const Profile = () => {
    const navigate = useNavigate();
    const logOut = async () => {
        await signOut(auth)
        navigate('../')
    }

    const [tickets, setTickets] = useState()
    const [open, setOpen] = useState()
    const [ticketId, setTicketId] = useState(0)

    const getTicketList = async () => {
        if(auth){
            try {
                const q = query(
                    collection(db, "tickets"),
                    where("user", "==", auth?.currentUser?.email)
                )
                const querySnapshot = await getDocs(q)
                const tempTickets = []
                querySnapshot.forEach((doc) => {
                    tempTickets.push(doc.data())
                })
                setTickets([...tempTickets])
            } catch (error) {
                navigate('../')
                
                // openNotification({
                //     type: 'error',
                //     message: JSON.stringify(error)
                // })
            }
        }
    }

    useEffect(() => {
        getTicketList()
    }, [auth])
    return (
        <>
            {
                auth?.currentUser ?
                <div>
                    <span>
                        {auth?.currentUser?.displayName ? auth?.currentUser?.displayName : auth?.currentUser?.email.split('@')[0]}
                    </span>
                    <button onClick={logOut}>
                        Выйти
                    </button>
                </div>
                :
                null
            }
            {
                tickets?.map((ticket, index) => {
                    return <div key={index} onClick={() => { setOpen(true); setTicketId(index)}}>
                        {ticket.gameInfo.title}, {ticket.gameInfo.team1} X {ticket.gameInfo.team2}, на стадионе: {ticket.gameInfo.stadium}, в {ticket.gameInfo.time} мест куплено: {ticket.places.length}
                    </div>
                })
            }
            {
                tickets ?             
                <Drawer title={"Билет"} onClose={() => setOpen(false)} open={open}>
                    {
                        tickets[ticketId].places.map((place) => (
                            <div>
                                Сектор: {place.sector}, ряд: {place.row}, столбец: {place.column}
                            </div>
                        ))
                    }
                    <div>
                        Стоимость: {tickets[ticketId].totalPrice}
                    </div>
                </Drawer> :
                null
            }

        </>
    )
}

export default Profile