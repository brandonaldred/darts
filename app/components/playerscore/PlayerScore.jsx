import styles from './page.module.css'
import avatar from '../../assets/images/avatar-empty.svg'

export default function PlayerScore() {
    return (
        <div className={styles['player-score']}>
            <img src={avatar.src} alt="Player Avatar" />
            <h2>Player Name</h2>
            <h3>301</h3>
            <p>Leg:</p>
            <div className={styles['darts']}>
                <p>0</p>
                <p>0</p>
                <p>0</p>
            </div>
        </div>
    )
}