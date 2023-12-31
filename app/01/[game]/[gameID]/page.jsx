"use client"
import DartBoard from '../../../components/dartboard/DartBoard'
import GameHeader from '../../../components/GameHeader'
import PlayerScore from '../../../components/playerscore/PlayerScore'
import styles from './page.module.css'
import { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'next/navigation'

export default function Oh1() {
    const searchParams = useSearchParams()
    const gameType = useParams()
    const [start, setStart] = useState(true)
    const [score, setScore] = useState(gameType.game)
    const [darts, setDarts] = useState([])
    const [game, setGame] = useState([
        {
            player: {},
            score: gameType.game,
            darts: [],
            turn: false
        },
        {
            player: {},
            score: gameType.game,
            darts: [],
            turn: false
        }
    ])

    console.log(searchParams.get('player'))
    
    function updateGame(index, player = null, darts = null, score = null, turn = null) {
        setGame((prev) => {
            const updated = [...prev]
            updated[index] = {
               ...prev[index],
               ...(player !== null  && {player: player}),
               ...(darts !== null && {darts: [...updated[index].darts, darts]}),
               ...(score !== null && {score: score}),
               ...(turn && {turn: !prev[index].turn})
            }
            return updated
        })
    }

    useEffect(() => {
        async function fetchData() {
            try {
                const gameData = await fetch(`/api/games?id=${gameType.gameID}`).then(res => res.json());
      
                // Fetch player data for playerOne
                const usernames = [gameData.game.playerOne.username, gameData.game.playerTwo.username];

                // Fetch data for both players concurrently
                const playerData = await fetch(`/api/users/list?p1=${usernames[0]}&p2=${usernames[1]}`).then(res => res.json());

                playerData.users.map((player,index) => updateGame(index, player, null, gameType.game, false))

            } catch (error) {
              console.error("Error fetching data:", error);
            }
          }
          
          fetchData();


      }, []);

    function endTurn() {
        const turnTotal = darts.reduce((acc, cur) => { return acc + cur })
        setScore( score - turnTotal >= 0 ? score - turnTotal : score )
        setDarts([])
    }

    function playAgain() {
        setDarts([])
        setScore(gameType.game)
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

    console.log(game)

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
                { start && <div className={styles.first}>Select who goes first</div> }
                {
                game.length > 0 && 
                //need to pull out and make these components so they can be updated by selected player
                
                <div className={styles['player-select']}>
                    <div
                        className={!game[0].turn && styles.inactive}
                        onClick={() => {
                            if (start) {
                                setStart(false)
                                updateGame(0, null, null, null, true)
                                console.log(game)
                            }
                        }}
                    >
                        {game[0].player.firstName}
                    </div>
                    <div
                        className={!game[1].turn && styles.inactive}
                        onClick={() => {
                            if (start) {
                                setStart(false)
                                updateGame(1, null, null, null, true)
                                console.log(game)
                            }
                        }}
                    >
                        {game[1].player.firstName}
                    </div>
                </div>
                }
                <div className={styles.sticky}>
                    { !start &&
                        game.map((p, i) =>
                            (<PlayerScore
                                key={i}
                                turn={p.turn}
                                player={p.player.firstName}
                                avatar={`/user-images/${p.player.firstName}.jpg`}
                                score={p.score}
                            />)
                        )
                    }
                              
                    <div className={styles['darts']}>
                        <p>{darts[0]}</p>
                        <p>{darts[1]}</p>
                        <p>{darts[2]}</p>
                    </div>
                    <div className={styles.buttons}>
                        <button className={styles.undo} onClick={()=> {undoDarts()}}><img src="/undo.svg" alt="Undo" /></button>
                        {darts.length > 2 ? <button onClick={ () => {darts.length > 2 ? endTurn() : alert('please enter score') }} className={`${styles['end-turn']} ${styles.active}`}>End Turn</button> : <button onClick={()=> {addDart(0)}} className={`${styles['end-turn']} ${styles.active}`}>Miss</button>}
                    </div>
                </div>
                <div className={styles['dart-board']}>
                    <p className={styles['even']} onClick={()=> {addDart(0)}}>Miss</p>
                    <p className={styles['outer-bull']} onClick={()=> {addDart(25)}}>Outer Bull</p>
                    <p onClick={()=> {addDart(50)}}>Bull</p>
                    { [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20].map((n) => {
                            return (<DartBoard addDart={addDart} key={n} content={n} class={n % 2 ? 'odd' : 'even'} />)
                        })
                    }
                </div>
            </div>
        </>
    )
}
