import React, { useEffect, useState } from "react";
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
        const newEvent = { ...formValues, id: ('000000' + Math.floor(Math.random() * 1000000)).slice(-6) };
        setEvents([...events, newEvent]);
        setOpen(false);
    }

    const renderCells = () => {
        let currentWeek = [];
        let previousBookedEventId = "";

        for (let i = 0; i < 7; i++) {
            currentWeek.push(DateTime.now().startOf("day").plus({ days: i }));
        }

        return currentWeek.map((date) => (
            <tr key={date}>
                <td className={styles.dates}>{date.toLocaleString({ month: 'short', day: 'numeric', weekday: 'short' })}</td>
                {hoursOfDay.map((hour) => {
                    const startDateTime = date.plus({ hours: hour });
                    const endDateTime = date.plus({ hours: hour + 1 });

                    // Check if an event exists during the time period of this cell
                    const eventIndex = events.findIndex((event) => {
                        const eventStart = DateTime.fromISO(event.startDateTime);
                        const eventEnd = DateTime.fromISO(event.endDateTime);
                        return eventStart < endDateTime && eventEnd > startDateTime;
                    });

                    if (eventIndex > -1) {
                        if (events[eventIndex].id === previousBookedEventId) {
                            previousBookedEventId = events[eventIndex].id;
                            return <td key={startDateTime} className={styles.booked}></td>;
                        } else {
                            previousBookedEventId = events[eventIndex].id;
                            return <td key={startDateTime} className={styles.booked}><span>{events[eventIndex].eventName}</span></td>;
                        }
                    } else {
                        return (
                            <td key={startDateTime} className={styles.free} onClick={() => handleCellClick(startDateTime)}>
                                {/* <button onClick={() => handleCellClick(startDateTime)}>
                                    Add
                                </button> */}
                            </td>
                        );
                    }
                })}
            </tr>
        ));
    };

    // useEffect(() => {
    //     console.log(events);
    // }, [events]);

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