import "./r-button.css"
const RButton = (props) => {

    return(
        <div className="btn-container">
            <button className="r-btn" onClick = { (e) => {props.handle(e.target.id)}} id = {`${props.name}`} >{props.name}</button>
        </div>
    )
}

export default RButton;