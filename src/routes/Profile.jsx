import { signOut } from "firebase/auth"
import { useNavigate } from 'react-router-dom'
import { auth, db } from "../firebase/firebase"
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Drawer, Spin } from "antd";
import './Profile.css'
import Header from "../components/header/header";

const Profile = () => {
    const navigate = useNavigate();

    const [tickets, setTickets] = useState()
    const [open, setOpen] = useState()
    const [ticketId, setTicketId] = useState(0)
    const [ticketsLoading, setTicketsLoading] = useState(false)

    const getTicketList = async () => {
        if(auth){
            try {
                setTicketsLoading(true)
                const q = query(
                    collection(db, "tickets"),
                    where("user", "==", auth?.currentUser?.email),
                    orderBy("created", "desc")
                )
                const querySnapshot = await getDocs(q)
                const tempTickets = []
                querySnapshot.forEach((doc) => {
                    tempTickets.push(doc.data())
                })
                setTickets([...tempTickets])
                setTicketsLoading(false)
            } catch (error) {
                navigate('../')
                console.log(error)
            }
        }
    }

    useEffect(() => {
        getTicketList()
    }, [auth])
    return (
        <>
            <Header/>
            <div className="ticket-wrapper">
                {
                    tickets?.map((ticket, index) => {
                        return <div className="ticket-card" key={index} onClick={() => { setOpen(true); setTicketId(index)}}>
                            <p className="ticket-title">{ticket?.gameInfo?.title}</p> 
                            <span>{ticket?.gameInfo?.team1} - {ticket?.gameInfo?.team2}</span>
                            <span>На стадионе: {ticket?.gameInfo?.stadium}</span>
                            <span>{ticket?.gameInfo?.time?.split('T')[0]} в {ticket?.gameInfo?.time?.split('T')[1]}</span>
                            <span>Мест куплено: {ticket?.places?.length}</span>
                            <span>Стоимость: {ticket?.totalPrice}</span>
                        </div>
                    })
                }
            </div>

            {
                ticketsLoading ? <Spin className="ticket-content-wrapper-info" />
                :
                tickets?.length > 0 ?             
                <Drawer title={"Билет"} onClose={() => setOpen(false)} open={open}>
                    <div className="ticket-content-wrapper">
                        {
                            tickets[ticketId]?.places?.map((place) => (
                                <div className="ticket-content">
                                    <span>Сектор: {place?.sector}</span>
                                    <span>Ряд: {place?.row}</span>
                                    <span>Столбец: {place?.column}</span>
                                </div>
                            ))
                        }
                    </div>

                    <div className="ticket-content-price">
                        Стоимость: {tickets[ticketId]?.totalPrice}
                    </div>
                </Drawer> :
                <div className="ticket-content-wrapper-info">
                        <p>
                            Вы не купили билетов
                        </p>
                </div>

            }

        </>
    )
}

export default Profile