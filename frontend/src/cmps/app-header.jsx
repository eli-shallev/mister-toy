import { Link, NavLink } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { login, logout, signup } from '../store/user.actions.js'
import { LoginSignup } from './login-signup.jsx'
import { store } from '../store/store'
import { SET_MOBILE_MENU } from '../store/toy.reducer'
import { DemoLogin } from './demo-login'

export function AppHeader() {
    const user = useSelector(storeState => storeState.userModule.user)
    const isMobileMenuOpen = useSelector(storeState => storeState.toyModule.isMobileMenuOpen)

    async function onLogin(credentials) {
        try {
            const user = await login(credentials)
            showSuccessMsg(`Welcome: ${user.fullname}`)
        } catch (err) {
            showErrorMsg('Cannot login')
        }
    }
    async function onSignup(credentials) {
        try {
            const user = await signup(credentials)
            showSuccessMsg(`Welcome new user: ${user.fullname}`)
        } catch (err) {
            showErrorMsg('Cannot signup')
        }
    }
    async function onLogout() {
        try {
            await logout()
            showSuccessMsg(`Bye now`)
        } catch (err) {
            showErrorMsg('Cannot logout')
        }
    }

    function openMenu() {
        store.dispatch({ type: SET_MOBILE_MENU, isMobileMenuOpen: true })
    }
    function closeMenu() {
        store.dispatch({ type: SET_MOBILE_MENU, isMobileMenuOpen: false })
    }

    return (
        <header className="app-header full">

            <h1>Toy Store</h1>

            <nav className={isMobileMenuOpen ? 'open' : ''}>
                <NavLink onClick={closeMenu} to='/'>Home</NavLink>
                <NavLink onClick={closeMenu} to='/toy'>Toys</NavLink>
                <NavLink onClick={closeMenu} to='/about'>About</NavLink>
            </nav>

            {user &&
                <span className="user-info">
                    {user.imgUrl && <img src={user.imgUrl} />}
                    {user.fullname}
                    <button onClick={onLogout}>Logout</button>
                </span>
            }
            {!user &&
                <section className="user-info">
                    <LoginSignup onLogin={onLogin} onSignup={onSignup} />
                    <DemoLogin onLogin={onLogin}/>
                </section>
            }

            <button onClick={openMenu} className='btn-menu'>≡</button>

            
        </header>
    )
}