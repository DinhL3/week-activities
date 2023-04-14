import React, { useState } from "react";
import { DateTime } from "luxon";
import styles from './Home.module.scss'

import Modal from "../Modal/Modal";

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const hoursOfDay = Array.from(Array(24).keys());

const Home = () => {
    const [selectedStartDateTime, setSelectedStartDateTime] = useState(null);
    const [isOpen, setOpen] = useState(false);
    const [events, setEvents] = useState([]);


    const handleCellClick = (startDateTime) => {
        setSelectedStartDateTime(startDateTime);
        setOpen(true);
    };

    const handleCloseModal = () => {
        setSelectedStartDateTime(null);
        setOpen(false);
    };

    const handleFormSubmit = (formValues) => {
        setEvents([...events, formValues]);
        console.log(events);
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
                {hoursOfDay.map((hour) => {
                    const startDateTime = date.plus({ hours: hour });
                    const endDateTime = date.plus({ hours: hour + 1 });

                    // Check if an event exists during the time period of this cell
                    const hasEvent = events.some((event) => {
                        const eventStart = DateTime.fromISO(event.startDateTime);
                        const eventEnd = DateTime.fromISO(event.endDateTime);
                        return eventStart < endDateTime && eventEnd > startDateTime;
                    });

                    if (hasEvent) {
                        return <td key={startDateTime}>Booked</td>; // Render empty cell
                    } else {
                        return (
                            <td key={startDateTime}>
                                <button onClick={() => handleCellClick(startDateTime)}>
                                    Add
                                </button>
                            </td>
                        );
                    }
                })}
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