import React, { useState } from "react";
import { DateTime } from "luxon";
import styles from './Home.module.scss'

import Modal from "../Modal/Modal";

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const hoursOfDay = Array.from(Array(24).keys());

const Home = () => {
    const [selectedStartDateTime, setSelectedStartDateTime] = useState(null);
    const [events, setEvents] = useState([]);
    const [isOpen, setOpen] = useState(false);


    const handleCellClick = (startDateTime) => {
        setSelectedStartDateTime(startDateTime);
        setOpen(true);
    };

    const handleCloseModal = () => {
        setSelectedStartDateTime(null);
        setOpen(false);
    };

    const handleFormSubmit = () => {
        setOpen(false);
    }

    const renderCells = () => {

        let currentWeek = [];

        for (let i = 0; i < 7; i++) {
            currentWeek.push(DateTime.now().startOf("day").plus({ days: i }));
        }

        return currentWeek.map((date) => (
            <tr key={date}>
                <td>{date.toLocaleString({ month: 'short', day: 'numeric', weekday: 'short' })}</td>
                {hoursOfDay.map((hour) => (
                    <td key={date.plus({ hours: hour })}>
                        <button onClick={() => handleCellClick(date.plus({ hours: hour }))}>
                            Add
                        </button>
                    </td>
                ))}
            </tr>
        ));
    };

    return (<React.Fragment>
        {isOpen && (
            <Modal
                startDateTime={selectedStartDateTime}
                onClose={handleCloseModal}
                onConfirm={handleFormSubmit}
            />
        )}
        <h1>My activities this week</h1>
        <table className={styles.table}>
            <thead>
                <tr>
                    <th></th>
                    {hoursOfDay.map((hour) => (
                        <th key={`hour-${hour}`}>{hour}</th>
                    ))}
                </tr>
            </thead>
            <tbody>{renderCells()}</tbody>
        </table>
    </React.Fragment>);
}

export default Home;