import styles from './page.module.css'
import avatar from '../../assets/images/avatar-empty.svg'

export default function PlayerScore(props) {
    return (
        <div className={styles['player-score']}>
            <img src={avatar.src} alt="Player Avatar" />
            <h2>Player Name</h2>
            <h3>{props.score}</h3>
            <p>Leg: {props.leg}</p>
            <div className={styles['darts']}>
                <p>{props.darts[0]}</p>
                <p>{props.darts[1]}</p>
                <p>{props.darts[2]}</p>
            </div>
        </div>
    )
}