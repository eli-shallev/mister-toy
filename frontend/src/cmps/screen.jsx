import { useSelector } from "react-redux"
import { store } from "../store/store"
import { SET_MOBILE_MENU } from "../store/toy.reducer"

export function Screen() {
    const isMobileMenuOpen = useSelector(storeState => storeState.toyModule.isMobileMenuOpen)

    function closeMenu() {
        store.dispatch({ type: SET_MOBILE_MENU, isMobileMenuOpen: false })
    }

    return (
        <div onClick={closeMenu} className={isMobileMenuOpen? 'screen open':'screen'}>
        </div>
    )
}