import { useEffect, useState } from 'react'
import { Modal } from 'antd';
import './SectorModal.css'


const SectorModal = ({ open, setOpen, currentSector, placesArray, setPlacesArray, takenPlaces, setTakenPlaces, totalPrice, setTotalPrice, gameInfo }) => {

    const [seats, setSeats] = useState()
    const name = currentSector?.name
    const columns = currentSector?.columns

    useEffect(() => {
        placesArray &&
        setSeats(placesArray[name])
    }, [open])

    const handleSeatClick = (rowIndex, columnIndex) => {
        const temp = [...seats]
        if (temp[rowIndex][columnIndex] === 'free') {
            setTotalPrice(totalPrice + gameInfo.prices[name])
            setTakenPlaces([...takenPlaces, {
                sector: name,
                row: rowIndex + 1,
                column: columnIndex + 1
            }])
            temp[rowIndex][columnIndex] = 'taken'
            const tempObj = {...placesArray}
            tempObj[name] = [...temp]
            setPlacesArray({...tempObj})
        } else {
            setTotalPrice(totalPrice - gameInfo.prices[name])
            const tempPlaces = [...takenPlaces]
            tempPlaces.splice(tempPlaces.indexOf(tempPlaces.find((el) => (el.row === rowIndex + 1 && el.column === columnIndex + 1))), 1)
            setTakenPlaces([...tempPlaces])
            temp[rowIndex][columnIndex] = 'free'
            const tempObj = {...placesArray}
            tempObj[name] = [...temp]
            setPlacesArray({...tempObj})
        }

    }

    return (
        <Modal 
            title={`Сектор: ${name}`}
            open={open}
            okText='Ок'
            onCancel={() => { setOpen(false) }}
            onOk={() => { setOpen(false) }}>
            <div style={{display: 'grid', gridTemplateColumns: `repeat(${columns}, 1fr)`}}>
                {
                    seats && seats.map((row, rowIndex) => (
                        row.map((column, columnIndex) => (
                            <div className={`seat ${column === 'bought' ? 'bought' : column === 'taken' ? 'taken' : 'free'}`} disabled={column === 'bought'} key={`${rowIndex}` + `${columnIndex}`} onClick={() => handleSeatClick(rowIndex, columnIndex)}>
                            </div>
                        ))
                    ))
                }
            </div>
            <div className='legend'>
                <div className='legend-fact'>
                    <div className='seat free'></div>
                    <p> - свободное место</p>
                </div>
                <div className='legend-fact'>
                    <div className='seat taken'></div>
                    <p> - выбранное вами место</p>
                </div>
                <div className='legend-fact'>
                    <div className='seat bought'></div>
                    <p> - уже купленное место</p>
                </div>
            </div>
        </Modal>
    )
}

export default SectorModal