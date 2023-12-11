import styles from './page.module.css'
import logo from '../assets/images/logo.svg'
import Link from 'next/link'

export default function Home() {

  return (
    <main className={styles['main-content']}>
      <div className={`${styles['home-container']} content-container`}>
        <img src={logo.src} alt="Marketing Darts" />
        <div className={styles['game-select-container']}>
          <h2>Select Game Type</h2>
          <div className={styles.games}>
            <Link className={styles['game-type']} href="/01/301">301</Link>
            <Link className={styles['game-type']} href="/01/501">501</Link>
            <Link className={`${styles['game-type']} ${styles['game-full-width']}`} href="#">Around The World</Link>
            <Link className={`${styles['game-type']} ${styles['game-full-width']}`} href="#">3 Dart High</Link>
            <Link className={`${styles['game-type']} ${styles['game-full-width']}`} href="#">Cricket</Link>
          </div>
          <Link className={styles['play-game']}>Play Game</Link>
        </div>
      </div>
    </main>
  )
}
