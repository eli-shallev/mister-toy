import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { ToyPreview } from "./toy-preview"


export function ToyList({ toys, onRemoveToy }) {
    const user = useSelector((storeState) => storeState.userModule.user)
    return (
        <section className="toy-list">
            {toys.map(toy => {
                return (
                    <article key={toy._id} className="list-item">
                        <ToyPreview toy={toy} />
                        <div className="list-btns">
                            {user?.isAdmin && <button onClick={() => onRemoveToy(toy._id)}><i className="fa-solid fa-trash"></i></button>}
                            <Link to={`/toy/${toy._id}`}><i className="fa-solid fa-circle-info"></i></Link>
                            {user?.isAdmin && <Link to={`/toy/toy-edit/${toy._id}`}><i className="fa-solid fa-pen-to-square"></i></Link>}
                        </div>
                    </article>
                )
            })}
        </section>
    )
}