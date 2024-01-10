"use client"
import { useState, useEffect } from 'react'
import styles from './page.module.css'
import logo from './assets/images/logo.svg'
import Link from 'next/link'
import PlayerSelect from './components/playerselect/PlayerSelect'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()
  const [players, setPlayers] = useState([]);

  const [userList, setUserList] = useState([])

    useEffect(() => { 
        fetch("/api/users/")
        .then( data => data.json())
        .then( data => setUserList(data.players))
    }, [])

    async function createGame() {
    let url = `/api/users?p=${players[0].username}|${players[1].username}`;
    const gamePlayers = await fetch(url)
    .then(data => data.json())
    var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      var raw = JSON.stringify({
        gamePlayers
      });
    
      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };
    
      fetch("/api/games/", requestOptions)
        .then(response => response.json())
        .then(result => router.push(`/games/${result.name}`))
        .catch(error => console.log('error', error));
    }

    

    function updatePlayerList(player) {
      if (players.length < 2) { 
        setPlayers(prev => { return ([...prev, player])})
      }
    }

    function removePlayerList(player) {
      player == 0 ? setPlayers( prev => { return [prev[1]] }) : setPlayers( prev => { return [prev[0]] })  
    }
    
    
    return (
      <main className={styles['main-content']}>
        <div className={`${styles['home-container']} content-container`}>
          <img src={logo.src} alt="Marketing Darts" />
          <div className={styles['selected-players']}>
            <div>
              {
                players.length > 0 && players[0] &&
                  <img
                  onClick={() => {removePlayerList(0)}}
                  className={styles['player-image']}
                  src={`/user-images/${players[0].username}.jpg`}
                />
              }
            </div>
            <p>vs</p>
            <div>
              {
               players[0] && players[1] &&
                <img
                  onClick={() => {removePlayerList(1)}}
                  className={styles['player-image']}
                  src={`/user-images/${players[1].username}.jpg`}
                />
              }
            </div>
          </div>
          <div className={styles['player-select-container']}>
            <h2>Select Players</h2>
            <div className={`${styles.players} ${players.length > 1 && styles['players-selected']}`}>
              {userList.length > 0 && <PlayerSelect players={updatePlayerList} users={userList} />}
            </div> 
            { players.length == 2 &&
                <div className={styles['play-game']} onClick={ () => {createGame()} }>
                  Play Game
                </div> }
          </div>
          <button onClick={() => {router.push("/rankings")}}>View Rankings</button>
        </div>
      </main>
    )
}