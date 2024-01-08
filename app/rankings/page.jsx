import React from 'react'
import GameHeader from '../components/GameHeader';
import PlayerCard from '../components/playercard/Playercard';
import styles from './page.module.css';

export default async function Rankings() {
    const res = await fetch(`https://darts-six.vercel.app/api/users/ranking?t=301`)
    .then(res => res.json())
    .then(data => {
       return data.players.map((player, index) => {
            return (
                <PlayerCard
                    key={index}
                    position={index}
                    firstName={player.firstName}
                    username={player.username}
                    rank={player.rank[301]}
                />
                )
        })
    });

    return (
        <>
            <GameHeader />
            <div className={styles['content-wrapper']}>
            <h1>Player Rankings</h1>
                {res}
            </div>
        </>
    );
}
