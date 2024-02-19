import React from 'react';
import styles from './page.module.css'

export default function PlayerCard(props) {
    return (
        <div className={styles['player-card']}>
            <img src={`/user-images/${props.username}.jpg`} alt={props.username} />
            <div className={styles['player-content']}>
                
                <h3>{`# ${props.position + 1} ${props.firstName}`}</h3>
                <p>Rank: {props.rank}</p>
                <div className={styles['card-stats']}>
                    <p>G: {props.totalGames}</p>
                    <p>W: {props.winCount}</p>
                    <p>Win %: {(100 * (props.winCount / props.totalGames)).toFixed(2)}</p>
                    <p>I: {props.inningAvg}</p>
                </div>
            </div>
        </div>
    )
}