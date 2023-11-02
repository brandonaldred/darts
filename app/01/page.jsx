"use client"
import DartBoard from '../components/dartboard/DartBoard'
import GameHeader from '../components/GameHeader'
import PlayerScore from '../components/playerscore/PlayerScore'
import styles from './page.module.css'
import { useState } from 'react'

export default function Oh1() {
    const [score, setScore] = useState(301)
    const [darts, setDarts] = useState([10,50,30])
    const [leg, setLeg] = useState(0)
    
    const content = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]
    
    function endTurn() {
        const turnTotal = darts.reduce((acc, cur) => { return acc + cur })
        setScore( score - turnTotal )
        setLeg(leg + 1);
    }

    return(
        <>
            <GameHeader />
            <div className={`content-container`}>
                <PlayerScore score={score} darts={darts} leg={leg}/>
                <button onClick={endTurn} className={`${styles['end-turn']} ${darts.length > 2 ? styles.active :  styles.disabled }`}>End Turn</button>
                <div className={styles['dart-board']}>
                    <p className={styles['outer-bull']}>Outer Bull</p>
                    <p>Bull</p>
                    { content.map((n) => {
                            return (<DartBoard key={n} content={n} class={n % 2 ? 'odd' : 'even'} />)
                        })
                    }
                </div>
            </div>
        </>
    )
}