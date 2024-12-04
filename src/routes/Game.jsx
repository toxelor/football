import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { getDocData } from "../firebase/docs"
import { collection, getDocs, query, where, setDoc, doc, addDoc } from "firebase/firestore"
import { app, auth, db } from "../firebase/firebase"
import SectorModal from "../components/modals/SectorModal"
import { Button, message, Modal, Spin } from "antd"
import { openNotification } from "../components/helpers/notification"
import { Firestore } from "firebase/firestore"
import Header from "../components/header/header"
import { serverTimestamp } from 'firebase/firestore'
import './Game.css'

const Game = () => {
    const params = useParams()

    const [modal, contextHolder] = Modal.useModal()

    const [game, setGame] = useState()
    const [stadium, setStadium] = useState()
    const [currentSector, setCurrentSector] = useState()
    const [open, setOpen] = useState()
    const [placesArray, setPlacesArray] = useState()
    const [takenPlaces, setTakenPlaces] = useState([])
    const [totalPrice, setTotalPrice] = useState(0)

    const thanksModal = () => {
        let secondsToGo = 5;
        const instance = modal.success({
            title: 'Спасибо!',
            content: `Ваш билет доступен в личном кабинете`,
        });
        const timer = setInterval(() => {
            secondsToGo -= 1;
        }, 1000);
        setTimeout(() => {
            clearInterval(timer);
            instance.destroy();
        }, secondsToGo * 1000);
    }

    useEffect(() => {
        const getGame = async () => {
            const data = await getDocData('games', params.id)
            setGame((prev) => prev = data)
            const q = query(
                collection(db, "stadiums"),
                where("name", "==", data.stadium)
            )
            let stadium
            const querySnapshot = await getDocs(q)
            querySnapshot.forEach((doc) => {
                setStadium(doc.data())
                stadium = doc.data()
            })
            if (!data.hasOwnProperty('places')) {
                setPlaces(data, params.id, stadium.sectors)
            } else {
                const tmp = {}
                for (let i in data.places) {
                    const temp = []
                    for (let j in data.places[i]) {
                        temp.push(data.places[i][j])
                    }
                    tmp[i] = temp
                }
                setPlacesArray(tmp)
            }
        }

        const setPlaces = async (game, gameId, sectors) => {
            const result = {}
            sectors.map((el) => {
                const tempRes = {}
                for (let i = 0; i < el.rows; i++) {
                    tempRes[i] = []
                    for (let j = 0; j < el.columns; j++) {
                        tempRes[i].push('free')
                    }
                }
                result[el.name] = tempRes
            })
            const tmp = {}
                for (let i in result) {
                    const temp = []
                    for (let j in result[i]) {
                        temp.push(result[i][j])
                    }
                    tmp[i] = temp
                }
                setPlacesArray(tmp)
            await setDoc(doc(db, "games", gameId), {
                ...game,
                places: result
            })
        }
        getGame()
    }, [params])

    const handlePayment = async () => {
        if (!auth?.currentUser) {
            openNotification({
                type: 'info',
                message: 'Для приобретения билета войдите в аккаунт'
            })
        } else {
            const tempPlaces = {...placesArray}
            takenPlaces.map((seat) => {
                tempPlaces[seat.sector][seat.row - 1][seat.column - 1] = 'bought'
            })
            let toDB = {}
            for (let sector in tempPlaces) {
                const tempSector = tempPlaces[sector]
                let tempObject = {}
                tempSector.map((row, index) => {
                    tempObject[index] = [...row]
                })
                toDB[sector] = tempObject
            }
            await setDoc(doc(db, "games", params.id), {
                ...game,
                places: toDB
            })
            const newTaken = takenPlaces.map((element) => (
                {
                    column: element.column,
                    row: element.row,
                    sector: element.sector,
                    prtice: game.prices[element.sector]
                }
            ))
            await addDoc(collection(db, "tickets"), {
                user: auth?.currentUser?.email,
                places: [...newTaken],
                gameInfo: {...game},
                totalPrice: totalPrice,
                created: serverTimestamp()
            })
            setTakenPlaces([])
            setTotalPrice(0)
            thanksModal()
        }

    }

    return (
        <>
            {contextHolder}
            <SectorModal 
                open={open}
                setOpen={setOpen}
                currentSector={currentSector}
                placesArray={placesArray}
                setPlacesArray={setPlacesArray}
                takenPlaces={takenPlaces}
                setTakenPlaces={setTakenPlaces}
                totalPrice={totalPrice}
                setTotalPrice={setTotalPrice}
                gameInfo={game}
            />
            <Header/>
            {
                stadium ?
                <div className="game-wrapper">
                    <p className="game-title">
                        { game.title }
                    </p>
                    <div className="field-ticket-wrapper">
                        <div style={{marginTop: '-6px'}}>
                            <div className="sector-section">
                            {
                                stadium?.sectors.map((el, index) => (
                                    index % 2 === 0 ?
                                    <div
                                        key={index}
                                        className="sector top"
                                        onClick={() => {
                                            setCurrentSector(el)
                                            setOpen(true)
                                        }}
                                        >
                                        <p>{el.name}</p>
                                        <p>{game.prices[el.name]}₽</p>
                                    </div>
                                    :
                                    null
                                ))
                            }
                            </div>
                            <div>
                                <img className="field-img" src="/field.webp"></img>
                            </div>
                            <div className="sector-section">
                            {
                                stadium?.sectors.map((el, index) => (
                                    index % 2 !== 0 ?
                                    <div 
                                        key={index}
                                        className="sector bottom"
                                        onClick={() => {
                                            setCurrentSector(el)
                                            setOpen(true)
                                        }}
                                    >
                                        <p>{el.name}</p>
                                        <p>{game.prices[el.name]}₽</p>
                                    </div>
                                    :
                                    null
                                ))
                            }
                            </div>
                        </div>
                        
                        {
                            takenPlaces.length > 0 &&
                            <div className="taken-places-wrapper">
                                <p className="taken-places-header">Выбранные вами места:</p>
                                <div className="taken-places">
                                    {
                                        takenPlaces.map((taken) => {
                                            return <div className="taken-place" key={`${taken.sector}` + `${taken.row}` + `${taken.column}`}>
                                                Сектор: {taken.sector}, ряд: {taken.row}, столбец: {taken.column}, цена: {game.prices[taken.sector]}₽
                                            </div>
                                        })
                                    }
                                </div>

                                <p>Общая стоимость: {totalPrice}</p>
                                <Button className="basic-button payment-button" onClick={handlePayment}>
                                    Оплатить
                                </Button>
                            </div>
                        }
                    </div> 
                </div>
                :
                <Spin className="ticket-content-wrapper-info" />
            }
        </>
    )
}

export default Game