import styles from './page.module.css'

export default function DartBoard(props) {
   
    return(
        <>
            <p className={styles[props.class]} data-amount={props.content} onClick={()=>{props.addDart(props.content)}}>{props.content}</p>
            <p data-amount={props.content * 2} onClick={()=>{props.addDart(props.content * 2)}}>D</p>
            <p data-amount={props.content * 3} onClick={()=>{props.addDart(props.content * 3)}}>T</p>
        </>
    )
}
