import { Link, useNavigate } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase/firebase'
import { db } from '../firebase/firebase'
import { useEffect, useState } from 'react'
import { getDocs, collection, query, where } from 'firebase/firestore'
import { openNotification } from '../components/helpers/notification'
import { message, Select } from 'antd'
import { getDocsData } from '../firebase/docs'
const Root = () => {
    const navigate = useNavigate();
    const logOut = async () => {
        await signOut(auth)
        navigate('/')
    }

    const [gamesList, setGamesList] = useState([])
    const [teamsList, setTeamsList] = useState([])
    const [currentTeam, setCurrentTeam] = useState()
    const [stadiumsList, setStadiumsList] = useState([])
    const [currentStadium, setCurrentStadium] = useState()
    const [leaguesList, setLeaguesList] = useState([])
    const [currentLeague, setCurrentLeague] = useState()


    const getGamesList = async () => {
        try {
            const data = await getDocsData('games')
            setGamesList(data)
        } catch (error) {
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
                    'value': el.id,
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
                    'value': el.id,
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
                    'value': el.id,
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
        console.log(currentLeague, currentStadium, currentTeam)
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
            const querySnapshot = await getDocs(q);
            const result = querySnapshot?.docs?.map((doc) => ({
                ...doc.data(), id: doc.id
            }))
            setGamesList(result);
        };

        fetchData()
    }, [currentLeague, currentStadium, currentTeam])

    return(
        <>
            <div className='header'>
                {
                    auth?.currentUser ? 
                    <>
                        <span>
                            <Link to={'profile'}>{auth?.currentUser?.displayName ? auth?.currentUser?.displayName : auth?.currentUser?.email.split('@')[0]}</Link>
                        </span>
                        <button onClick={logOut}>
                            Выйти
                        </button>
                    </>
                    :
                    <>
                        <Link to='login'>Войти</Link>
                        <br/>
                        <Link to='register'>Зарегистрироваться</Link>
                    </>
                }
            </div>
            <div className='main-wrapper'>
                <div className='filters' style={{display: 'flex'}}>
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
                </div>
                <div className='games'>
                    {
                        gamesList?.map((game, index) => (
                            <Link to={`/game/${game.id}`}>
                                <div className='gameCard' key={index}>
                                    {game.title} <br />
                                    Лига {game.league} <br />
                                    {game.team1} X {game.team2} <br /> 
                                    На стадионе {game.stadium} <br />
                                    {game.time.split('T')[0]} в {game.time.split('T')[1]} <br />
                                </div>
                            </Link>

                        ))
                    }
                </div>
            </div>
        </>
    )
}

export default Root