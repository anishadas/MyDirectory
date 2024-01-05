import React, { useEffect, useState } from 'react'
import styles from './styles.module.css'
import { useNavigate } from 'react-router';
const Directory = () => {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    //fetch all users
    useEffect(() => {
        const fetchUsers = async () => {
            const res = await fetch('https://jsonplaceholder.typicode.com/users')
            const data = await res.json();
            setUsers(data)
        }
        fetchUsers();
    }, [])

    //clicks on each post
    const handlePost = (id,posts) => {
        navigate(`/profile/${id}?posts=${posts}`)
    }

    
    return (
        <div className={styles.directory}>
            <p className={styles.title}>Directory</p>
            <div className={styles.postsContainer}>
                {
                    users?.map((user, index) => (
                        <div className={styles.post} key={index} onClick={() => handlePost(user.id, Math.round((user.name.length) / 3))}>
                            <p className={styles.user}>
                                <span>Name: </span>
                                <span>{user.name}</span>
                            </p>
                            <p className={styles.postCount}>
                                <span>Posts:</span>
                                <span>{Math.round((user.name.length) / 3)}</span>
                            </p>
                        </div>
                    ))
                }

            </div>
        </div>
    )
}

export default Directory
