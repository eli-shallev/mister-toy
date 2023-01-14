import { Link } from "react-router-dom"
import { ToyPreview } from "./toy-preview"


export function ToyList({ toys, onRemoveToy }) {

    return (
        <section className="toy-list">
            {toys.map(toy => {
                return (
                    <article key={toy._id} className="list-item">
                        <ToyPreview toy={toy} />
                        <div className="list-btns">
                            <button onClick={() => onRemoveToy(toy._id)}><i className="fa-solid fa-trash"></i></button>
                            <Link to={`/toy/${toy._id}`}><i className="fa-solid fa-circle-info"></i></Link>
                            <Link to={`/toy/toy-edit/${toy._id}`}><i className="fa-solid fa-pen-to-square"></i></Link>
                        </div>
                    </article>
                )
            })}

        </section>
    )
}