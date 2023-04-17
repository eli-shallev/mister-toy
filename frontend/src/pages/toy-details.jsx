import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Link, useParams } from "react-router-dom"
import { ToyMsgs } from "../cmps/toy-msgs"
import { showErrorMsg } from "../services/event-bus.service"
import { toyService } from "../services/toy.service"
import { utilService } from "../services/util.service"

export function ToyDetails() {
    const user = useSelector((storeState) => storeState.userModule.user)
    const [toy, setToy] = useState(null)
    const [isMsgsOpen, setIsMsgOpen] = useState(false)
    const { toyId } = useParams()

    useEffect(() => {
        ; (async () => {
            try {
                const toy = await toyService.getById(toyId)
                setToy(toy)
            } catch (error) {
                showErrorMsg('Cannot load toy', error)
            }
        })()
    }, [])

    function getDate(timeStamp) {
        const date = new Date(timeStamp)
        const dateStr = `${utilService.padNum(date.getDate())}/${utilService.padNum(date.getMonth() + 1)}`
        const timeStr = `${utilService.padNum(date.getHours())}:${utilService.padNum(date.getMinutes())}:${utilService.padNum(date.getSeconds())}`
        return dateStr + ' at: ' + timeStr
    }

    return (
        <section className="toy-details">
            <button className="btn-openMsgs" onClick={()=> setIsMsgOpen(true)}>Open Msgs</button>
            {toy && <ToyMsgs isMsgsOpen={isMsgsOpen} setIsMsgOpen={setIsMsgOpen} toyId={toy._id} />}
            {!toy && <img className="loader" src={require(`../assets/img/loader.gif`)} />}
            {toy && <div className="toy-content">
                <h2>{toy.name} ${toy.price}</h2>
                <div className="img-container">
                    <img src={require(`../assets/img/${toy.imgUrl ? toy.imgUrl : 'default-toy'}.png`)} />
                    <img className="stock-logo" src={require(`../assets/img/${toy.inStock ? 'in-stock' : 'out-of-stock'}.png`)} />
                </div>
                <ul className="labels-container">
                    {toy.labels.map(label => <li key={label}> | {label} | </li>)}
                </ul>
                <div className="createdAt">
                    created: {getDate(toy.createdAt)}
                </div>
                <div className="details-btns">
                    <Link to='/toy'><i className="fa-solid fa-arrow-rotate-left"></i></Link>
                    {user?.isAdmin && <Link to={`/toy/toy-edit/${toy._id}`}><i className="fa-solid fa-pen-to-square"></i></Link>}
                </div>
            </div>}
        </section>
    )
}