import { useEffect, useState } from 'react'
import { CButton, CModal, CModalBody, CModalHeader, CModalTitle, CModalFooter, CForm, CFormInput } from '@coreui/react';
import { Flex, Input, Typography, DatePicker, Modal } from 'antd';
import { openNotification } from '../helpers/notification';


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
            onCancel={() => { setOpen(false) }}
            onOk={() => { setOpen(false) }}>
            <div style={{display: 'grid', gridTemplateColumns: `repeat(${columns}, 1fr)`}}>
                        {
                            seats && seats.map((row, rowIndex) => (
                                row.map((column, columnIndex) => (
                                    <button disabled={column === 'bought'} key={`${rowIndex}` + `${columnIndex}`} onClick={() => handleSeatClick(rowIndex, columnIndex)}>
                                        {column}
                                    </button>
                                ))
                            ))
                        }
                    </div>
        </Modal>
        //         {/* <CModal
        //     alignment="center"
        //     visible={open}
        //     aria-labelledby="VerticallyCenteredExample"
        //     onClose={() => { setOpen(false) }}
        // >
        //     <CModalHeader>
        //         <CModalTitle id="VerticallyCenteredExample">Сектор: {name}</CModalTitle>
        //     </CModalHeader>
        //     <CModalBody style={{ display: 'flex', justifyContent: 'center', flexDirection : 'column' }}>
        //         <Flex vertical gap={16}>
        //             <div style={{display: 'grid', gridTemplateColumns: `repeat(${columns}, 1fr)`}}>
        //                 {
        //                     seats && seats.map((row, rowIndex) => (
        //                         row.map((column, columnIndex) => (
        //                             <button key={`${rowIndex}` + `${columnIndex}`} onClick={() => alert(`row: ${rowIndex + 1}, column: ${columnIndex + 1}`)}>
        //                                 {column}
        //                             </button>
        //                         ))
        //                     ))
        //                 }
        //             </div>
        //         </Flex>
        //     </CModalBody> */}
        //     {/* <CModalFooter>
        //         <CButton className='text-light' color="secondary" onClick={() => {
        //             setOpen(false)
        //         }}>
        //             Закрыть
        //         </CButton>
        //         <CButton className='text-light' color="primary">Сохранить</CButton>
        //     </CModalFooter> */}
        // {/* </CModal> */}
    )
}

export default SectorModal