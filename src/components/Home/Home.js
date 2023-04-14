import React, { useState } from "react";
import { DateTime } from "luxon";
import styles from './Home.module.scss'

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const hoursOfDay = Array.from(Array(24).keys());

const Home = () => {
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [events, setEvents] = useState([]);

    const handleCellClick = (startDateTime) => {
        console.log(startDateTime);
    };

    const handleCloseModal = () => {
        setSelectedDate(null);
        setSelectedTime(null);
    };
    // const startOfWeek = DateTime.now().startOf("week");
    // console.log();
    // const nextDay = DateTime.now().startOf("week").plus({ days: 1 });
    // console.log(nextDay.toLocaleString({ weekday: 'short' }));



    const renderCells = () => {

        let currentWeek = [];

        for (let i = 0; i < 7; i++) {
            currentWeek.push(DateTime.now().startOf("week").plus({ days: i }));
        }

        return currentWeek.map((date) => (
            <tr key={date}>
                <td>{date.toLocaleString({ month: 'short', day: 'numeric', weekday: 'short' })}</td>
                {hoursOfDay.map((hour) => (
                    <td key={``}>
                        <button onClick={() => handleCellClick(date)}>
                            Add Event
                        </button>
                    </td>
                ))}
            </tr>
        ));
    };

    return (<React.Fragment>
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