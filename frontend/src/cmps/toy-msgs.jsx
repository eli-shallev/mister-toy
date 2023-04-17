import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { showErrorMsg } from "../services/event-bus.service"
import { toyService } from "../services/toy.service"


export function ToyMsgs({ toyId, setIsMsgOpen, isMsgsOpen }) {
    const user = useSelector((storeState) => storeState.userModule.user)
    const [msgToEdit, setMsgToEdit] = useState({ txt: '' })
    const [currToy, setCurrToy] = useState(null)

    useEffect(() => {
        ; (async () => {
            try {
                const toy = await toyService.getById(toyId)
                setCurrToy(toy)
            } catch (error) {
                showErrorMsg('Cannot load toys msgs')
            }
        })()
    }, [])

    function onHandleChange({ target }) {
        setMsgToEdit(prevMsg => ({ ...prevMsg, txt: target.value }))
    }

    async function onAddMsg(ev) {
        ev.preventDefault()
        try {
            const savedMsg = await toyService.addMsg(toyId, msgToEdit)
            currToy.msgs = currToy.msgs ? currToy.msgs : []
            currToy.msgs.push(savedMsg)
            setCurrToy(prevToy => ({ ...prevToy }))
            setMsgToEdit({ txt: '' })
        } catch (error) {
            showErrorMsg('Cannot add Msg')
        }
    }

    async function onRemoveMsg(msgId) {
        try {
            const removedId = await toyService.removeMsg(toyId, msgId)
            setCurrToy(prevToy => ({ ...prevToy, msgs: prevToy.msgs.filter(msg => msg.id !== removedId) }))
        } catch (error) {
            showErrorMsg('Cannot remove Msg')
        }

    }

    return (
        <div>
            {currToy && <section className={`toy-msgs ${isMsgsOpen? 'open':''}`} >
                <button className="btn-closeMsgs" onClick={()=> setIsMsgOpen(false)}><i className="fa-regular fa-circle-xmark"></i></button>
                {(!currToy?.msgs || !currToy?.msgs?.length) && <h3>No msgs to show</h3>}
                {currToy.msgs?.length > 0 && <ul className="msgs-list">
                    {currToy.msgs.map(msg => {
                        return <li className='msg-item' key={msg.id}>
                            <span><span className="msg-by">{msg.by.fullname}</span>:
                                <span className="msg-txt">{msg.txt}</span></span>
                            {(user?.isAdmin || user?._id === msg.by._id) && <button onClick={() => onRemoveMsg(msg.id)}><i className="fa-solid fa-trash"></i></button>}
                        </li>
                    })}
                </ul>}
                {user && <form onSubmit={onAddMsg}>
                    <input type="text"
                        name="txt"
                        value={msgToEdit?.txt}
                        onChange={onHandleChange}
                        placeholder='Enter Msg...' />
                    <button><i className="fa-solid fa-plus"></i></button>
                </form>}
            </section>}
        </div>
    )
}