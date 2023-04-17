export function DemoLogin({onLogin}){


    return (
        <section className="demo-login">
            <h3>Quick login for demo</h3>
            <button onClick={()=>onLogin({username:'admin', password:'123'})}>Login as Admin</button>
            <button onClick={()=>onLogin({username:'customer', password:'1234'})}>Login as customer</button>
        </section>

    )
}