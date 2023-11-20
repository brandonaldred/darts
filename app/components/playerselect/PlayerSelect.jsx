"use client"
import styles from './page.module.css'
import { useState, useEffect } from 'react';

export default function PlayerSelect() {

    const [userList, setUserList] = useState([])

    useEffect(() => { 
        fetch("/api/users/list")
        .then( data => data.json())
        .then( data => setUserList(data.users))
    }, [])

    function test() {
        setUserList((prev) => {
            return prev.pop()
        })
    }

    return (
        <>
          { userList.length > 0 && userList.map(user => {
            return (
                <div key={user._id}>
                    <img onClick={()=> { test }} className={styles['player-image']} src={`/user-images/${user.firstName.toLowerCase()}.jpg`} alt={user.userName} />
                    <p>{user.firstName}</p>
                </div>
            )
          })} 
        </>
    )
}