import React, { useEffect, useState } from "react";
import { DateTime } from "luxon";
import styles from './Home.module.scss'

import Modal from "../Modal/Modal";

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const hoursOfDay = Array.from(Array(24).keys());

const Home = () => {
    const [startDateTime, setStartDateTime] = useState(null);
    const [isModalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState("");
    const [events, setEvents] = useState([]);
    const [eventToChange, setEventToChange] = useState(null);


    const handleEmptyCellClick = (startDateTime) => {
        setStartDateTime(startDateTime);
        setModalType('add')
        setModalOpen(true);
    };

    const handleBookedCellClick = (eventId) => {
        const eventToChange = events.find((event) => event.id === eventId);
        setEventToChange(eventToChange)
        setModalType('change')
        setModalOpen(true);
    }

    const handleCloseModal = () => {
        setStartDateTime(null);
        setModalOpen(false);
    };

    const handleFormSubmit = (formValues) => {
        const newEvent = { ...formValues };
        setEvents([...events, newEvent]);
        setModalOpen(false);
    }

    const handleChangeFormSubmit = (formValues) => {
        console.log(events);
        setModalOpen(false);
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
                            return <td key={startDateTime} className={styles.booked} onClick={() => handleBookedCellClick(events[eventIndex].id)}></td>;
                        } else {
                            previousBookedEventId = events[eventIndex].id;
                            return <td key={startDateTime} className={styles.booked} onClick={() => handleBookedCellClick(events[eventIndex].id)}>
                                <span>{events[eventIndex].eventName}</span></td>;
                        }
                    } else {
                        return (
                            <td key={startDateTime} className={styles.free} onClick={() => handleEmptyCellClick(startDateTime)}>
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

    const renderModal = () => {
        if (isModalOpen && modalType === 'add') {
            return (
                <Modal
                    type="add"
                    startDateTime={startDateTime}
                    onClose={handleCloseModal}
                    onConfirm={handleFormSubmit}
                />
            )
        }
        if (isModalOpen && modalType === 'change') {
            return (
                <Modal
                    type="change"
                    eventToChange={eventToChange}
                    onClose={handleCloseModal}
                    onConfirm={handleChangeFormSubmit}
                />
            )
        }
    }

    useEffect(() => {
        console.log(events);;
    }, [events]);

    return (<React.Fragment>
        {renderModal()}
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