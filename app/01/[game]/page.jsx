"use client"
import DartBoard from '../../components/dartboard/DartBoard'
import GameHeader from '../../components/GameHeader'
import PlayerScore from '../../components/playerscore/PlayerScore'
import styles from './page.module.css'
import { useState } from 'react'
import { useParams } from 'next/navigation'

export default function Oh1() {
    const game = useParams()
    const [score, setScore] = useState(game.game)
    const [playerOneScore, setPlayerOneScore] = useState(game.game)
    const [playerTwoScore, setPlayerTwoScore] = useState(game.game)
    const [turn, setTurn] = useState('brandon')
    const [darts, setDarts] = useState([])
    const [leg, setLeg] = useState(0)
    
    const content = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]
    
    function endTurn() {
        const turnTotal = darts.reduce((acc, cur) => { return acc + cur })
        setScore( score - turnTotal >= 0 ? score - turnTotal : score )
        setDarts([])
    }

    function playAgain() {
        setDarts([])
        setScore(game.game)
     }

    function undoDarts() {
        setDarts(prev => {
            const newArr = [];
            for (let i = 0; i < prev.length; i++) {
                i !== prev.length - 1 && newArr.push(prev[i])
            }
            return newArr
        });
    }

    function addDart(n) {
        if(darts.length < 3) {
            setDarts(prev => [...prev, n])
        }
    }

    return(
        <>
            <GameHeader />
            {score == 0 && 
            (<div className={styles['play-again']}>
                <div>
                    <img src="/dart.svg" alt="dart" />
                    <h2>Game Over</h2>
                    <button onClick={() => { playAgain() }}>Play Again?</button>
                </div>
            </div>)
            }
            <div className={`content-container`}>
                <div className={styles['player-select']}>
                    <div>Player 1</div>
                    <div className={styles.inactive}>Player 2</div>
                </div>
                <div className={styles.sticky}>
                    <PlayerScore player="Player Name" score={score} darts={darts} leg={leg} />
                    <div className={styles.buttons}>
                        <button className={styles.undo} onClick={()=> {undoDarts()}}><img src="/undo.svg" alt="Undo" /></button>
                        <button onClick={endTurn} className={`${styles['end-turn']} ${darts.length > 2 ? styles.active :  styles.disabled }`}>End Turn</button>
                    </div>
                </div>
                <div className={styles['dart-board']}>
                    <p className={styles['even']} onClick={()=> {addDart(0)}}>Miss</p>
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
