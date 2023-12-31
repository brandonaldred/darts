import styles from './page.module.css'
import avatar from '../../assets/images/avatar-empty.svg'

export default function PlayerScore(props) {
    return (
        props.turn &&
        <div className={styles['player-score']}>
            <img src={props.avatar} alt="Player Avatar" />
            <h2>{props.player}</h2>
            <h3>{props.score}</h3>
        </div>
    )
}