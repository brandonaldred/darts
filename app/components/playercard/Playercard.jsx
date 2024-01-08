import React from 'react';
import styles from './page.module.css'

export default function PlayerCard(props) {
    return (
        <div className={styles['player-card']}>
            <img src={`/user-images/${props.username}.jpg`} alt={props.username} />
            <div className={styles['player-content']}>
                
                <h3>{`# ${props.position + 1} ${props.firstName}`}</h3>
                <p>Rank: {props.rank}</p>
            </div>
        </div>
    )
}