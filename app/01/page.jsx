"use client"
import DartBoard from '../components/dartboard/DartBoard'
import GameHeader from '../components/GameHeader'
import PlayerScore from '../components/playerscore/PlayerScore'
import styles from './page.module.css'
import { useState } from 'react'

export default function Oh1() {
    const [score, setScore] = useState(301)
    const [darts, setDarts] = useState([])
    const [leg, setLeg] = useState(0)
    
    const content = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]
    
    function endTurn() {
        const turnTotal = darts.reduce((acc, cur) => { return acc + cur })
        setScore( score - turnTotal >= 0 ? score - turnTotal : score )
        setLeg(leg + 1);
    }

    function addDart(n) {
       setDarts(prev => [...prev, n])
    }

    return(
        <>
            <GameHeader />
            <div className={`content-container`}>
                <PlayerScore score={score} darts={darts} leg={leg}/>
                <button onClick={endTurn} className={`${styles['end-turn']} ${darts.length > 2 ? styles.active :  styles.disabled }`}>End Turn</button>
                <div className={styles['dart-board']}>
                    <p className={styles['outer-bull']} onClick={()=> {addDart(25)}}>Outer Bull</p>
                    <p onClick={()=> {addDart(50)}}>Bull</p>
                    { content.map((n) => {
                            return (<DartBoard addDart={addDart} key={n} content={n} class={n % 2 ? 'odd' : 'even'} />)
                        })
                    }
                </div>
            </div>
        </>
    )
}
