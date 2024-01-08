import styles from './page.module.css'
import avatar from '../../assets/images/avatar-empty.svg'

export default function PlayerScore(props) {
    return (
        props.show &&
        <div className={styles['player-score']}>
            <img src={props.avatar} alt={props.player} />
            <h2>{props.player}</h2>
            <h3>{props.score}</h3>
        </div>
    )
}