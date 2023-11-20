"use client"
import { useState } from 'react'
import styles from './page.module.css'
import logo from './assets/images/logo.svg'
import Link from 'next/link'
import PlayerSelect from './components/playerselect/PlayerSelect'

export default function Home() {
  const [players, setPlayers] = useState([]);

    return (
      <main className={styles['main-content']}>
        <div className={`${styles['home-container']} content-container`}>
          <img src={logo.src} alt="Marketing Darts" />
          <div className={styles['selected-players']}>
            <img className={styles['player-image']} src="/user-images/brandon.jpg" />
            <p>vs</p>
            <img className={styles['player-image']} src="/user-images/brandon.jpg" />
          </div>
          <div className={styles['player-select-container']}>
            <h2>Select Players</h2>
            <div className={styles.players}>
              <PlayerSelect players={setPlayers} />
            </div>
            <Link className={styles['play-game']} href="/games">Play Game</Link>
          </div>
        </div>
      </main>
    )
}