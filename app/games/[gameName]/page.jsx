"use client"
import styles from './page.module.css'
import logo from '../../assets/images/logo.svg'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import { useState } from 'react'

export default function Home() {
  const router = useRouter()
  const [game, setGame] = useState('')

  const gameTypes = [
    '301',
    '501',
    'Around The World',
    '3 Dart High',
    'Cricket'
  ]

  const params = useParams()
  
  function addGameType(type) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "text/plain");

    var requestOptions = {
      method: 'PATCH',
      headers: myHeaders,
      body: JSON.stringify({
         type: type,
      }),
      redirect: 'follow'
    }
  
    fetch(`/api/games?n=${params.gameName}`, requestOptions)
      .then(response => response.text())
      .then(result => router.push(`/01/${game}/${params.gameName}`))
      .catch(error => console.log('error', error));
  }
  return (
    <main className={styles['main-content']}>
      <div className={`${styles['home-container']} content-container`}>
        <img src={logo.src} alt="Marketing Darts" />
        <div className={styles['game-select-container']}>
          <h2>Select Game Type</h2>
          <div className={styles.games}>
          {
            gameTypes.map((gameType, i) => {
              return (<div key={i} className={`${gameType == game && styles['game-type-selected']} ${styles['game-type']} ${gameType.length > 3 && styles['game-full-width']}`} onClick={(e) => { setGame(gameType)
             }}>
              {gameType}
              </div>)
            })
          }
          </div>
          { game && <div className={styles['play-game']} onClick={() => {addGameType(game)}}>Play Game</div> } 
        </div>
      </div>
    </main>
  )
}
