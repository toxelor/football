import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { getDocData } from "../firebase/docs"
import { collection, getDocs, query, where, setDoc, doc, addDoc } from "firebase/firestore"
import { auth, db } from "../firebase/firebase"
import SectorModal from "../components/modals/SectorModal"
import { Button, message } from "antd"
import { openNotification } from "../components/helpers/notification"

const Game = () => {
    const params = useParams()

    const [game, setGame] = useState()
    const [stadium, setStadium] = useState()
    const [currentSector, setCurrentSector] = useState()
    const [open, setOpen] = useState()
    const [placesArray, setPlacesArray] = useState()
    const [takenPlaces, setTakenPlaces] = useState([])
    const [totalPrice, setTotalPrice] = useState(0)

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
            console.log(toDB)
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
                totalPrice: totalPrice
            })
            setTakenPlaces([])
            setTotalPrice(0)
        }

    }

    return (
        <>
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
            {
                stadium ?
                <div>
                    { game.title }
                    <div style={{display: 'flex', flexWrap: 'wrap', width: '700px', height: '200px'}}>
                    {
                        stadium?.sectors.map((el, index) => (
                            index % 2 === 0 ?
                            <div
                                key={index}
                                style={{display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '250px', flex: '1', backgroundColor: el.color, color: "#fff"}}
                                onClick={() => {
                                    setCurrentSector(el)
                                    setOpen(true)
                                }}
                                >
                                {el.name}
                            </div>
                            :
                            null
                        ))
                    }
                    </div>
                    <div>
                        картинка поля
                    </div>
                    <div style={{display: 'flex', flexWrap: 'wrap', width: '700px', height: '200px'}}>
                    {
                        stadium?.sectors.map((el, index) => (
                            index % 2 !== 0 ?
                            <div 
                                key={index}
                                style={{display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '250px', flex: '1', backgroundColor: el.color, color: "#fff"}}
                                onClick={() => {
                                    setCurrentSector(el)
                                    setOpen(true)
                                }}
                            >
                                {el.name}
                            </div>
                            :
                            null
                        ))
                    }
                    </div>
                    {
                        takenPlaces.length > 0 &&
                        <div>
                            Выбранные вами места:
                            {
                                takenPlaces.map((taken) => {
                                    return <div key={`${taken.sector}` + `${taken.row}` + `${taken.column}`}>
                                        Сектор: {taken.sector}, ряд: {taken.row}, столбец: {taken.column}, цена: {game.prices[taken.sector]}₽
                                    </div>
                                })
                            }
                            Общая стоимость: {totalPrice}
                            <Button onClick={handlePayment}>
                                Оплатить
                            </Button>
                        </div>
                    }
                </div>
                :
                <p>
                    Загрузка
                </p>
            }
        </>
    )
}

export default Game