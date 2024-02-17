"use client"
import DartBoard from '../../../components/dartboard/DartBoard'
import GameHeader from '../../../components/GameHeader'
import PlayerScore from '../../../components/playerscore/PlayerScore'
import styles from './page.module.css'
import { useState, useEffect } from 'react'
import { useParams, useSearchParams, useRouter } from 'next/navigation'

export default function Oh1() {
    const router = useRouter()
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
                //need to add a conditional here
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
            return gameData;
            
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
                        score: newScore >= 2 || newScore === 0 ? newScore : player.innings[player.innings.length - 1].score,
                        darts: darts
                    }
                    player.innings.push(newInning);
                    if (newInning.score === 0) { gameData.winner = player.username }
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
                const playerOneActualScore = gameData.winner === game.players[0].username ? 1 : 0;
                const rankings = calculateNewRating(game.players[0], game.players[1], playerOneActualScore);

                gameData.players.forEach((player, index) => {
                    player.rank[gameData.type] = rankings[index];

                    var rankingHeaders = new Headers();
                    rankingHeaders.append("Content-Type", "application/json");

                    var rankingRaw = JSON.stringify(
                        {
                            "rank": {
                                [gameData.type]: player.rank[gameData.type]
                            }
                        });
                    console.log(rankingRaw);

                    var requestOptions = {
                    method: 'PATCH',
                    headers: rankingHeaders,
                    body: rankingRaw,
                    redirect: 'follow'
                    };

                    fetch(`/api/users?id=${player._id}`, requestOptions)
                    .then(response => response.text())
                    .then(result => console.log(result))
                    .catch(error => console.log('error', error));
                })

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

    function calculateNewRating(playerOne, playerTwo, playerOneActualScore) {
        const K = 32; // K-factor, determines the maximum rating change
        const ratingFloor = 800; // Minimum possible rating
    
        // Calculate the expected score (probability of winning) for player one
        const playerOneExpectedScore = 1 / (1 + Math.pow(10, (playerTwo.rank[game.type] - playerOne.rank[game.type]) / 400));
    
        let playerOneNewRating = playerOne.rank[game.type] + K * (playerOneActualScore - playerOneExpectedScore);
        playerOneNewRating = Math.max(playerOneNewRating, ratingFloor); // Ensure rating does not drop below the floor
    
        // Now, for player two, we can use the same formula, but we know that if player one won (actual score = 1), then player two lost (actual score = 0), and vice versa.
        const playerTwoExpectedScore = 1 - playerOneExpectedScore; // because the total probability is 1
        const playerTwoActualScore = 1 - playerOneActualScore; // if one player wins, the other loses
        let playerTwoNewRating = playerTwo.rank[game.type] + K * (playerTwoActualScore - playerTwoExpectedScore);
        playerTwoNewRating = Math.max(playerTwoNewRating, ratingFloor); // Ensure rating does not drop below the floor
    
        updateRatingDB(playerOne.username, game.type, playerOneNewRating);
        updateRatingDB(playerTwo.username, game.type, playerTwoNewRating);
    
        return [playerOneNewRating, playerTwoNewRating];
    }
    

    function updateRatingDB(username, type, rating) {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
        "username": username,
        "type": type,
        "rank": rating
        });

        var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
        };

        fetch("/api/rank", requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
    }

     return(
        <>
            <GameHeader />
            { game.winner && 
            (<div className={styles['play-again']}>
                <div>
                    <img src="/dart.svg" alt="dart" />
                    <h2>Game Over</h2>
                    <button onClick={() => { router.push('/')}}>Play Again</button>
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
                                        score={darts.length < 1 ? p.innings[p.innings.length - 1].score : p.innings[p.innings.length-1].score - darts.reduce((acc, cur) => { return acc + cur })}
                                        darts = { darts }
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
                    <p className={`${styles.odd} ${styles.bagadix}`} onClick={() => {
                        addDart(20)
                        addDart(1)
                        addDart(5)
                    }}>Bagadix</p>
                </div>}
            </div>
        </>
    )
}
