import React from 'react'
import GameHeader from '../components/GameHeader';
import PlayerCard from '../components/playercard/Playercard';
import styles from './page.module.css';

async function fetchRankings() {
    if (!process.env.NEXT_PUBLIC_BASE_API_URL) { return null }
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/users/ranking?t=301`, {cache: "no-store"});
    return res.json()
    }  

export default async function Rankings() {
    
    const res = await fetchRankings()
    const rankRatings = res.players.map((player, index) => {
        return (
            <PlayerCard
                key={index}
                position={index}
                firstName={player.firstName}
                username={player._id}
                rank={player.rank}
                totalGames={player.totalGames}
                winCount={player.wins}
                inningAvg={player.avgScorePerInning}
            />
            )
    })
    return (
        <>
            <GameHeader />
            <div className={styles['content-wrapper']}>
            <h1>'01 Player Rankings</h1>
                {rankRatings}
            </div>
        </>
    );
}
