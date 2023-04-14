import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { DateTime } from "luxon";


import styles from './Modal.module.scss';

const Backdrop = (props) => {
    return <div className={styles.backdrop} onClick={props.onClose} />
}

function ModalOverlay(props) {
    const [eventName, setEventName] = useState(props.type === 'add' ? "" : props.eventToChange.eventName);
    const [date, setDate] = useState(props.type === 'add' ? props.startDateTime.toISODate() : props.eventToChange.startDateTime.substring(0, 10));
    const [startTime, setStartTime] = useState(props.type === 'add' ? props.startDateTime.toISOTime().slice(0, 5) : props.eventToChange.startDateTime.substring(11, 16));
    const [endTime, setEndTime] = useState(props.type === 'add' ? props.startDateTime.plus({ minutes: 59 }).toISOTime().slice(0, 5) : props.eventToChange.endDateTime.substring(11, 16));

    if (props.type === 'change') {
        console.log(props.eventToChange);
        // setDate(event.startDateTime.toISODate());
        // setStartTime(event.startDateTime.toISOTime().slice(0, 5))
        // setEndTime(event.endDateTime.toISOTime().slice(0, 5))
    }


    const handleFormSubmit = (e) => {
        e.preventDefault();

        const startDateTime = DateTime.fromISO(`${date}T${startTime}`);
        const endDateTime = DateTime.fromISO(`${date}T${endTime}`);
        const formValues = {
            id: props.type === 'add' ? ('000000' + Math.floor(Math.random() * 1000000)).slice(-6) : props.eventId,
            eventName,
            startDateTime: startDateTime.toISO(),
            endDateTime: endDateTime.toISO(),
        };
        props.onConfirm(formValues);
    };

    return (
        <div className={styles.modal}>
            <header className={styles.header}>
                <h2>{props.type === 'add' ? 'Add an activity' : 'Change this activity'}</h2>
            </header>
            <div className={styles.content}>
                <form className={styles.form} onSubmit={handleFormSubmit}>
                    <div className={styles['input-group']}>
                        <label htmlFor="name">Event name: </label>
                        <input type="text" id="name" value={eventName}
                            onChange={(e) => setEventName(e.target.value)} required />
                    </div>
                    <div className={styles['input-group']}>
                        <label htmlFor="date">Date: </label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => { setDate(e.target.value) }}
                        />
                    </div>
                    <div className={styles['input-group']}>
                        <label htmlFor="startTime">Start time: </label>
                        <input
                            type="time"
                            min="00:00"
                            max="23:59"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                        />
                    </div>
                    <div className={styles['input-group']}>
                        <label htmlFor="endTime">End time: </label>
                        <input
                            type="time"
                            min="00:01"
                            max="23:59"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                        />
                    </div>
                    <button type="submit">Submit</button>
                </form>
            </div>
        </div>
    )
}

const Modal = (props) => {
    return (
        <React.Fragment>
            {ReactDOM.createPortal(<Backdrop onClose={props.onClose} />, document.getElementById('backdrop-root'))}
            {ReactDOM.createPortal(<ModalOverlay type={props.type} eventToChange={props.eventToChange} startDateTime={props.startDateTime} onConfirm={props.onConfirm} />, document.getElementById('overlay-root'))}
        </React.Fragment>
    );
};

export default Modal;
