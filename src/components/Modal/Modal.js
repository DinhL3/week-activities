import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { DateTime } from "luxon";


import styles from './Modal.module.scss';

const Backdrop = (props) => {
    return <div className={styles.backdrop} onClick={props.onClose} />
}

function ModalOverlay(props) {
    const [eventName, setEventName] = useState("");
    const [date, setDate] = useState(props.startDateTime.toISODate());
    const [startTime, setStartTime] = useState(props.startDateTime.toISOTime().slice(0, 5));
    const [endTime, setEndTime] = useState(props.startDateTime.plus({ hours: 1 }).toISOTime().slice(0, 5));

    const handleFormSubmit = (e) => {
        e.preventDefault();

        const startDateTime = DateTime.fromISO(`${date}T${startTime}`);
        const endDateTime = DateTime.fromISO(`${date}T${endTime}`);
        const formValues = {
            eventName,
            startDateTime: startDateTime.toISO(),
            endDateTime: endDateTime.toISO(),
        };
        props.onConfirm(formValues);
    };

    return (
        <div className={styles.modal}>
            <header className={styles.header}>
                <h2>Add an activity</h2>
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
                            max="24:00"
                            step="3600"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                        />
                    </div>
                    <div className={styles['input-group']}>
                        <label htmlFor="endTime">End time: </label>
                        <input
                            type="time"
                            min="00:00"
                            max="24:00"
                            step="3600"
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
            {ReactDOM.createPortal(<ModalOverlay startDateTime={props.startDateTime} onConfirm={props.onConfirm} />, document.getElementById('overlay-root'))}
        </React.Fragment>
    );
};

export default Modal;
