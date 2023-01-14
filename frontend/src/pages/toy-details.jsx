import { getAllByPlaceholderText } from "@testing-library/react"
import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { showErrorMsg } from "../services/event-bus.service"
import { toyService } from "../services/toy.service"
import { utilService } from "../services/util.service"

export function ToyDetails() {

    const [toy, setToy] = useState(null)
    const { toyId } = useParams()

    useEffect(() => {
        toyService.getById(toyId)
            .then(toy => {
                setToy(toy)
            })
            .catch(err => {
                showErrorMsg('Cannot load toy', err)
            })
    }, [])

    function getDate(timeStamp) {
        const date = new Date(timeStamp)
        const dateStr = `${utilService.padNum(date.getDate())}/${utilService.padNum(date.getMonth() + 1)}`
        const timeStr = `${utilService.padNum(date.getHours())}:${utilService.padNum(date.getMinutes())}:${utilService.padNum(date.getSeconds())}`
        return dateStr + ' at: ' + timeStr
    }

    return (
        <section className="toy-details">
            {!toy && <img className="loader" src={require(`../assets/img/loader.gif`)} />}
            {toy && <div className="toy-content">
                <h2>{toy.name} ${toy.price}</h2>
                <div className="img-container">
                    <img src={require(`../assets/img/${toy.imgUrl?toy.imgUrl: 'default-toy'}.png`)} />
                    <img className="stock-logo" src={require(`../assets/img/${toy.inStock? 'in-stock' : 'out-of-stock'}.png`)} />
                </div>
                <ul className="labels-container">
                    {toy.labels.map(label => <li key={label}> | {label} | </li>)}
                </ul>
                <div className="createdAt">
                    created: {getDate(toy.createdAt)}
                </div>
                <div className="details-btns">
                    <Link to='/toy'><i className="fa-solid fa-arrow-rotate-left"></i></Link>
                    <Link to={`/toy/toy-edit/${toy._id}`}><i className="fa-solid fa-pen-to-square"></i></Link>
                </div>
            </div>}
        </section>
    )
}