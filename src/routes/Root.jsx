import { Link, useNavigate } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase/firebase'
import { db } from '../firebase/firebase'
import { useEffect, useState } from 'react'
import { getDocs, collection, query, where, or } from 'firebase/firestore'
import { openNotification } from '../components/helpers/notification'
import { Button, message, Select, Spin } from 'antd'
import { getDocsData } from '../firebase/docs'
import Header from '../components/header/header'
import './Root.css'
// import { first } from '/1pic.webp'
const Root = () => {

    const [gamesList, setGamesList] = useState([])
    const [teamsList, setTeamsList] = useState([])
    const [currentTeam, setCurrentTeam] = useState()
    const [stadiumsList, setStadiumsList] = useState([])
    const [currentStadium, setCurrentStadium] = useState()
    const [leaguesList, setLeaguesList] = useState([])
    const [currentLeague, setCurrentLeague] = useState()
    const [gamesLoading, setGamesLoading] = useState(false)


    const getGamesList = async () => {
        try {
            setGamesLoading(true)
            const data = await getDocsData('games')
            setGamesList(data)
            setGamesLoading(false)
        } catch (error) {
            setGamesLoading(false)
            openNotification({
                type: 'error',
                message: JSON.stringify(error)
            })
        }
    }

    const getTeamsList = async () => {
        try {
            const data = await getDocsData('teams')
            const formatedData = data.map((el) => {
                return {
                    'value': el.name,
                    'label': el.name
                }
            })
            setTeamsList(formatedData)
        } catch (error) {
            openNotification({
                type: 'error',
                message: JSON.stringify(error)
            })
        }
    }

    const getStadiumsList = async () => {
        try {
            const data = await getDocsData('stadiums')
            const formatedData = data.map((el) => {
                return {
                    'value': el.name,
                    'label': el.name
                }
            })
            setStadiumsList(formatedData)
        } catch (error) {
            openNotification({
                type: 'error',
                message: JSON.stringify(error)
            })
        }
    }

    const getLeaguesList = async () => {
        try {
            const data = await getDocsData('leagues')
            const formatedData = data.map((el) => {
                return {
                    'value': el.name,
                    'label': el.name
                }
            })
            setLeaguesList(formatedData)
        } catch (error) {
            openNotification({
                type: 'error',
                message: JSON.stringify(error)
            })
        }
    }

    useEffect(() => {
        getGamesList()
        getTeamsList()
        getStadiumsList()
        getLeaguesList()
    }, [])

    useEffect(() => {
        setGamesLoading(true)
        let q = query(collection(db, 'games'));
        if (currentLeague) {
            q = query(q, where('league', '==', currentLeague))
        }
        if (currentStadium) {
            q = query(q, where('stadium', '==', currentStadium))
        }
        if (currentTeam) {
            q = query(q, or(where('team1', '==', currentTeam), where('team2', '==', currentTeam)))
        }

        const fetchData = async () => {
            try {
                const querySnapshot = await getDocs(q);
                const result = querySnapshot?.docs?.map((doc) => ({
                    ...doc.data(), id: doc.id
                }))
                setGamesLoading(false)
                setGamesList(result);
            } catch (error) {
                setGamesLoading(false)
                openNotification({
                    type: 'error',
                    message: JSON.stringify(error)
                })
            }
        };

        fetchData()
    }, [currentLeague, currentStadium, currentTeam])

    return(
        <>
            <Header/>
            <div className='main-wrapper'>
                <div className='filters'>
                    <Select 
                        style={{width: '100%'}} 
                        placeholder="Команды"
                        options={teamsList}
                        value={currentTeam}
                        onChange={(e) => {setCurrentTeam(e)}}
                    />
                    <Select 
                        style={{width: '100%'}} 
                        placeholder="Лиги"
                        options={leaguesList}
                        value={currentLeague}
                        onChange={(e) => {setCurrentLeague(e)}}
                    />
                    <Select 
                        style={{width: '100%'}} 
                        placeholder="Стадионы"
                        options={stadiumsList}
                        value={currentStadium}
                        onChange={(e) => {setCurrentStadium(e)}}
                    />
                    <Button className='basic-button action-button' onClick={() => {
                        setCurrentLeague()
                        setCurrentStadium()
                        setCurrentTeam()
                    }}>
                        Сбросить фильтры
                    </Button>
                </div>
                <div className='games'>
                    {
                        gamesLoading ? <Spin className="game-content-wrapper-info" />
                        :
                        gamesList?.length > 0 ?
                        gamesList?.map((game, index) => (
                            <Link to={`/game/${game.id}`} style={{width: '20vw'}} key={index}>
                                <div className='gameCard' key={index}>
                                    <div className='gameCard-img-wrapper'> 
                                        <img className='gameCard-img' src={`/${game.title.length % 5 + 1}pic.webp`}/>
                                    </div>
                                    <div className='gameCard-content'>
                                        <p className='gameCard-title'>{game.title}</p>
                                        <p>Лига: {game.league}</p>
                                        <p>{game.team1} - {game.team2}</p>
                                        <p>На стадионе {game.stadium}</p>
                                        <p>{game.time.split('T')[0]} в {game.time.split('T')[1]}</p>
                                    </div>

                                </div>
                            </Link>

                        ))
                        :
                        <div className="game-content-wrapper-info">
                            <p>
                                Нет подходящих игр
                            </p>
                        </div>
                    }
                </div>
            </div>
        </>
    )
}

export default Root