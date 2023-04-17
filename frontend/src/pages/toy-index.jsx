import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ToyList } from "../cmps/toy-list";
import { loadToys, removeToy } from "../store/toy.action";
import { SET_FILTER, SET_SORT } from "../store/toy.reducer";
import { showSuccessMsg, showErrorMsg } from "../services/event-bus.service";
import { ToyFilter } from "../cmps/toy-filter";
import { Link } from "react-router-dom";


export function ToyIndex() {
    const toys = useSelector((storeState) => storeState.toyModule.toys)
    const filterBy = useSelector((storeState) => storeState.toyModule.filterBy)
    const sortBy = useSelector((storeState) => storeState.toyModule.sortBy)
    const isLoading = useSelector((storeState) => storeState.toyModule.isLoading)
    const user = useSelector((storeState) => storeState.userModule.user)

    const dispatch = useDispatch()

    useEffect(() => {
        ; (async () => {
            try {
                await loadToys(filterBy, sortBy)
            } catch (error) {
                showErrorMsg('Cannot load toys')
            }
        })()
    }, [filterBy, sortBy])

    function onSetFilter(filterBy) {
        dispatch({ type: SET_FILTER, filterBy })
    }

    function onSetSort(sortBy) {
        dispatch({ type: SET_SORT, sortBy })
    }

    async function onRemoveToy(toyId) {
        try {
            await removeToy(toyId)
            showSuccessMsg('Toy removed')
        } catch (error) {
            showErrorMsg('Cannot remove toy')
        }
    }

    return (
        <section className="toy-index">
            <ToyFilter onSetFilter={onSetFilter} onSetSort={onSetSort} toysLength={toys.length} />
            {isLoading && <img className="loader" src={require(`../assets/img/loader.gif`)} />}
            {!isLoading && <ToyList toys={toys} onRemoveToy={onRemoveToy} />}
            {user?.isAdmin && <Link className="btn-add" to='/toy/toy-edit'>Add toy</Link>}
        </section>
    )
}