import { toyService } from "../services/toy.service"
import { store } from "./store"
import { ADD_TOY, REMOVE_TOY, SET_IS_LOADING, SET_TOYS, UPDATE_TOY } from "./toy.reducer"

export async function loadToys(filterBy, sortBy) {
    try {
        store.dispatch({ type: SET_IS_LOADING, isLoading: true })
        const toys = await toyService.query(filterBy, sortBy)
        store.dispatch({ type: SET_TOYS, toys })
    } catch (error) {
        console.log('Had issues loading toys', error)
        throw error
    } finally {
        store.dispatch({ type: SET_IS_LOADING, isLoading: false })
    }
}

export async function removeToy(toyId) {
    try {
        await toyService.remove(toyId)
        store.dispatch({ type: REMOVE_TOY, toyId })
    } catch (error) {
        console.log('Had issues Removing toy', error)
        throw error
    }
}

export async function saveToy(toy) {
    try {
        const type = (toy._id) ? UPDATE_TOY : ADD_TOY
        const savedToy = await toyService.save(toy)
        store.dispatch({ type, toy: savedToy })
        return savedToy
    } catch (error) {
        console.error('Cannot save toy', error)
        throw error
    }
}