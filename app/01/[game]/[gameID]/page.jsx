"use client"
import DartBoard from '../../../components/dartboard/DartBoard'
import GameHeader from '../../../components/GameHeader'
import PlayerScore from '../../../components/playerscore/PlayerScore'
import styles from './page.module.css'
import { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'next/navigation'

export default function Oh1() {
    const params = useParams()
    const [ darts, setDarts ] = useState([])
    const [ game, setGame ] = useState({
    _id: params.gameID,
    name: params.gameID,
    type: params.game,
    players: [],
    winner: null,
    createdAt: '',
    updatedAt: '',
    __v: 0
})
    useEffect(() => {
        async function fetchData() {
            try {
                const gameData = await fetch(`/api/games?id=${params.gameID}`).then(res => res.json()).then(data => data.game);
                gameData.innings = 0,
                gameData.turn = '',
                gameData.show = ''
                gameData.players.map(player => (
                    player.innings = [ 
                        {
                            score: params.gameType,
                            darts: []
                        }
                    ]
                ))
                setGame(gameData)

            } catch (error) {
              console.error("Error fetching data:", error);
            }
          }
          fetchData();
      }, []);

    function setShow(p) {
        setGame(prev => {
            const gameData = { ...prev };
            gameData.show = p;
            return gameData;
        })
    }

    function gamePlay(p) {
        setGame(prev => {
            const gameData = { ...prev };
            gameData.innings = gameData.innings + 1;
            gameData.turn = p;
            gameData.show = p;
            gameData.players = gameData.players.map(player => ({
                ...player,
                innings: [
                    {
                        score: gameData.type,
                        darts: []
                    }
                ]
            }));
            return gameData; // Return the updated state
            
        });
    }
    function endTurn(p) {
        const turnTotal = darts.reduce((acc, cur) => { return acc + cur })
        setGame(prev => {
            const gameData = { ...prev };
            let nextPlayerUsername = null;
            let inningCount = gameData.innings

            gameData.players.forEach((player, index) => {
                gameData.innings = inningCount < player.innings.length ? player.innings.length : gameData.innings
                if (player.username === gameData.turn) {
                    // Calculate the new score
                    const newScore = player.innings[player.innings.length - 1].score - turnTotal;

                    // Update the score only if it won't go below zero
                    let newInning = {
                        score: newScore >= 0 ? newScore : player.innings[player.innings.length - 1].score,
                        darts: darts
                    }
                    if (newInning.score === 0) { gameData.winner = player.username }
                    player.innings.push(newInning);
                    gameData.innings = gameData.innings + 1
                    
                    // Determine the next player's username
                    if (index === gameData.players.length - 1) {
                        // If this is the last player, the next turn goes to the first player
                        nextPlayerUsername = gameData.players[0].username;
                    } else {
                        // Otherwise, the next turn goes to the next player in the array
                        nextPlayerUsername = gameData.players[index + 1].username;
                    }
                }
            });

            if (gameData.winner) {
                var myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/json");

                var raw = JSON.stringify({
                "winner": gameData.winner,
                "players": gameData.players,
                "innings": gameData.innings
                });

                var requestOptions = {
                method: 'PATCH',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
                };

                fetch(`/api/games?n=${gameData.name}`, requestOptions)
                .then(response => response.text())
                .then(result => console.log(result))
                .catch(error => console.log('error', error));
            }
            // Update the turn and show properties with the next player's username
            gameData.turn = nextPlayerUsername;
            gameData.show = nextPlayerUsername;

            return gameData;
            });
        setDarts([]);
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
            { game.winner && 
            (<div className={styles['play-again']}>
                <div>
                    <img src="/dart.svg" alt="dart" />
                    <h2>Game Over</h2>
                </div>
            </div>)
            }
            <div className={`content-container`}>
                { game.innings == 0 && 
                <>
                    <div className={styles.first}>Select who goes first</div> 
                    <div className={styles['player-select']}>
                        { game.players.length > 0 && game.players.map((player, index) => {
                            return <div key={index} className={styles.inactive} onClick={() => { gamePlay(player.username) }}>{player.firstName}</div>
                        }) }
                    </div>
                </>
                }
                { game.innings > 0 &&
                <>
                    <div className={styles.sticky}>
                        <div className={styles['player-select']}>
                            { game.players.length > 0 && game.players.map((player, index) => {
                                return (
                                    <div
                                        key={index}
                                        className={`${game.show === player.username ? '' : styles.inactive} `}
                                        onClick={() => { setShow(player.username) }}>
                                        { game.turn === player.username ? <img className={styles.star} src="/star.svg" alt="Active Player"/> : '' }
                                        {player.firstName}
                                    </div>
                                )
                            }) }
                        </div>
                            { 
                                game.players.map((p, i) =>
                                    <PlayerScore
                                        key={i}
                                        show={p.username == game.show ? true : false}
                                        turn={p.username == game.turn ? true : false}
                                        player={p.firstName}
                                        avatar={`/user-images/${p.username}.jpg`}
                                        score={p.innings[p.innings.length - 1].score}
                                    />)
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
                </>   
                }
                {game.innings > 0 && <div className={styles['dart-board']}>
                    <p className={styles['even']} onClick={()=> {addDart(0)}}>Miss</p>
                    <p className={styles['outer-bull']} onClick={()=> {addDart(25)}}>Outer Bull</p>
                    <p onClick={()=> {addDart(50)}}>Bull</p>
                    { [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20].map((n) => {
                            return (<DartBoard addDart={addDart} key={n} content={n} class={n % 2 ? 'odd' : 'even'} />)
                        })
                    }
                </div>}
            </div>
        </>
    )
}
