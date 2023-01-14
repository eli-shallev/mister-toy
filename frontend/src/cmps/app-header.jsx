import { NavLink } from "react-router-dom";

export function AppHeader(){

    return (
        <header className="app-header full">

            <h1>Toy Store</h1>

            <nav>
                <NavLink to='/'>Home</NavLink>
                <NavLink to='/toy'>Toys</NavLink>
                <NavLink to='/about'>About</NavLink>
            </nav>
            
        </header>
    )
}