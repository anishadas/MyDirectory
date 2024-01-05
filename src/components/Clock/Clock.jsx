import React, { useEffect, useState } from 'react'
import moment from 'moment-timezone';
import styles from './styles.module.css'

function Clock() {
    const [countries, setCountries] = useState([]);
    const [selectedTimeZone, setSelectedTimeZone] = useState('Asia/kolkata');
    const [isClockRunning, setIsClockRunning] = useState(true);
    const [currentTime, setCurrentTime] = useState('');
    const [pausedTime, setPausedTime] = useState(null);

    //fetch countries and local time
    useEffect(() => {
        const fetchCountries = async () => {
            const res = await fetch('http://worldtimeapi.org/api/timezone');
            const data = await res.json();
            setCountries(data)
        }
        fetchCountries();
        const updateLocalTime = async () => {
            let timeString = await getTimeByTimezone('Asia/kolkata');

            setCurrentTime(timeString)
        }
        updateLocalTime();
    }, [])

    //update the clock like a timer
    useEffect(() => {
        const updateTimer = () => {
            if (isClockRunning) {
                setCurrentTime((prevLocalTime) => {
                    const incrementedTime = moment(prevLocalTime, 'HH:mm:ss').add(1, 'seconds');
                    return incrementedTime.format('HH:mm:ss');
                });
            }
        }
        const intervalId = setInterval(() => {
            const time = moment(currentTime, 'HH:mm:ss');
            if (isClockRunning && pausedTime && time.isSameOrAfter(pausedTime)) {
                setIsClockRunning(false);
            }
            if (!isClockRunning) {
                setPausedTime(moment())
            }
            updateTimer()
        }, 1000);
        return () => clearInterval(intervalId)
    }, [isClockRunning])


    const getTimeByTimezone = async (timezone) => {
        const response = await fetch(`http://worldtimeapi.org/api/timezone/${timezone}`);
        const data = await response.json();
        let time = moment.utc(data.utc_datetime)
        let localTime = time.utcOffset(data.utc_offset)
        return localTime.format('hh:mm:ss');

    };

    // change in selected time zone dropdown
    const handleChangeTimeZone = async (e) => {
        setSelectedTimeZone(e.target.value)
        let timeString = await getTimeByTimezone(e.target.value);
        setCurrentTime(timeString)
    }
  
    // toggle start/pause button
    const handleToggle = () => {
        setIsClockRunning(!isClockRunning)
    }
    
    return (
        <>
            <p className={styles.label}>Country :</p>
            <select value={selectedTimeZone} onChange={handleChangeTimeZone}>
                <option>Asia/kolkata</option>
                {
                    countries.map((country, index) => (
                        <option value={country} key={index}>{country}</option>
                    ))
                }

            </select>
            <div className={styles.clock}>
                {currentTime}
            </div>
            <button className={isClockRunning ? styles.pause : styles.start} onClick={handleToggle}>
                {isClockRunning ? 'Pause' : 'Start'}
            </button>
        </>
    )
}

export default Clock

