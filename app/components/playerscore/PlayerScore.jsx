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
                    <p>Score: 
                    { props.darts.length > 0 && props.score - props.darts.reduce((acc, cur) => { return acc + cur }) }
                    </p>
                    { threeOut[props.score] !== undefined && <p>Out:
                        { threeOut[props.score] && threeOut[props.score].first}, 
                        { threeOut[props.score] && threeOut[props.score].second}, 
                        { threeOut[props.score] && threeOut[props.score].third}
                    </p> }
                </div>
        </div>
    )
}