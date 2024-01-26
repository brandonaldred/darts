import styles from './page.module.css'
import threeOut from './outs.js'
import avatar from '../../assets/images/avatar-empty.svg'

export default function PlayerScore(props) {
    console.log(threeOut[props.score]);
    return (
        props.show &&
        <div className={styles['player-score']}>
            <img src={props.avatar} alt={props.player} />
            <h2>{props.player}</h2>
            <h3>{props.score}</h3>
                <div className={ styles['updated-score']}>
                    { threeOut[props.score] !== undefined && 
                    <p>Out: {Object.values(threeOut[props.score]).map((value, index) => (
                        <span key={index}>{value}{index < Object.values(threeOut[props.score]).length - 1 ? ', ' : ''}</span>
                    ))}</p>
}

                </div>
        </div>
    )
}