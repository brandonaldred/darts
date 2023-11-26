"use client"
import styles from './page.module.css'
import { useState, useEffect } from 'react';

export default function PlayerSelect( props ) {

    return (
        <>
          { props.users.length > 0 && props.users.map(user => {
            return (
                <div key={user._id} className={styles.player}>
                    <img onClick={ ()=> {props.players(user)} } className={styles['player-image']} src={`/user-images/${user.firstName.toLowerCase()}.jpg`} alt={user.userName} />
                    <p>{user.firstName}</p>
                </div>
            )
          })} 
        </>
    )
}