import styles from './page.module.css'
import logo from './assets/images/logo.svg'
import Link from 'next/link'
import PlayerSelect from './components/playerselect/PlayerSelect'

export default function Home() {

    return (
      <main className={styles['main-content']}>
        <div className={`${styles['home-container']} content-container`}>
          <img src={logo.src} alt="Marketing Darts" />
          <div className={styles['player-select-container']}>
            <h2>Select Players</h2>
            <div className={styles.players}>
              <PlayerSelect />
            </div>
            <Link className={styles['play-game']} href="#">Play Game</Link>
          </div>
        </div>
      </main>
    )
}