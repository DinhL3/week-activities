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

    return (
        <div className={styles.modal}>
            <header className={styles.header}>
                <h2>Add an activity</h2>
            </header>
            <div className={styles.content}>
                <form className={styles.form}>
                    <div className={styles['input-group']}>
                        <label for="name">Event name: </label>
                        <input type="text" id="name" value={eventName}
                            onChange={(e) => setEventName(e.target.value)} />
                    </div>
                    <div className={styles['input-group']}>
                        <label for="date">Date: </label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => { setDate(e.target.value) }}
                        />
                    </div>
                    <div className={styles['input-group']}>
                        <label for="startTime">Start time: </label>
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
                        <label for="endTime">End time: </label>
                        <input
                            type="time"
                            min="00:00"
                            max="24:00"
                            step="3600"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                        />
                    </div>
                </form>
            </div>
            <footer className={styles.actions}>
                <button onClick={props.onConfirm}>Submit</button>
            </footer>
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
