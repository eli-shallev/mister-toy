import { useEffect, useState } from "react"
import { toyService } from "../services/toy.service"
import { Autocomplete, TextField } from "@mui/material";

export function ToyFilter({ onSetFilter, onSetSort, toysLength }) {

    const [filterByToEdit, setFilterByToEdit] = useState(toyService.getDefaultFilter())
    const [sortByToEdit, setSortByToEdit] = useState(toyService.getDefaultSort())
    const [prevBtnStatus, setPrevBtnStatus] = useState(null)
    const [nextBtnStatus, setNextBtnStatus] = useState(null)

    useEffect(() => {
        onSetFilter(filterByToEdit)
        onSetSort(sortByToEdit)
        setPrevBtnStatus(filterByToEdit.pageIdx < 1)
            ; (async () => {
                try {
                    const toys = await toyService.query(filterByToEdit, sortByToEdit, false)
                    setNextBtnStatus((filterByToEdit.pageIdx + 1) * toyService.PAGE_SIZE >= toys.length)
                } catch (error) {
                    console.log(error.msg)
                }
            })()
    }, [filterByToEdit, sortByToEdit])

    function onHandleChange({ target }) {
        const { type, value, name: field } = target
        filterByToEdit.pageIdx = 0
        setFilterByToEdit(prevFilter => ({ ...prevFilter, [field]: value }))
    }

    function onSortChange({ target }) {
        let { name } = target
        if (name === 'desc') {
            sortByToEdit.desc = target.checked ? -1 : 1
        }
        if (name === 'sortBy') {
            sortByToEdit.sortBy = target.value
        }
        setSortByToEdit(prevSort => ({ ...prevSort }))
    }

    function onPageChange(diff) {
        if (filterByToEdit.pageIdx + diff < 0) return
        setFilterByToEdit(prevFilter => ({ ...prevFilter, pageIdx: prevFilter.pageIdx + diff }))
    }

    function onMultiChange(ev, value) {
        filterByToEdit.pageIdx = 0
        setFilterByToEdit(prevFilter => ({ ...prevFilter, labels: value }))
    }

    return (
        <section className="toy-filter">
            <form>
                <label htmlFor="name">Filter</label>
                <input type="text"
                    id="name"
                    name="name"
                    placeholder="Search toys"
                    value={filterByToEdit.name}
                    onChange={onHandleChange} />

                <select onChange={onHandleChange} name="status" id="status" defaultValue="all">
                    <option value="all">All</option>
                    <option value="inStock">In Stock</option>
                    <option value="outOfStock">Out of Stock</option>
                </select>
                <Autocomplete
                    multiple
                    id="labels"
                    name="labels"
                    options={toyService.getLabels()}
                    getOptionLabel={(option) => option}
                    defaultValue={[]}
                    filterSelectedOptions
                    disableCloseOnSelect
                    onChange={onMultiChange}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Labels"
                            placeholder="Labels"
                            name="labels"
                        />
                    )}
                />



                {/* <Multiselect
                    options={stateRef.current}
                    onSelect={onMultiChange}
                    onRemove={onMultiChange}
                    displayValue="name"
                    placeholder="Select labels"
                /> */}
            </form>
            <div className="sort">
                <label htmlFor="sortBy">Sort</label>
                <select onChange={onSortChange} name="sortBy" id="sortBy" defaultValue="createdAt">
                    <option value="createdAt">Created</option>
                    <option value="name">Name</option>
                    <option value="price">Price</option>
                </select>
                <input type="checkbox" id="desc" name="desc" value='desc' onChange={onSortChange} />
                <label htmlFor="desc"> Desc</label>
            </div>

            <div className="pages">
                <button disabled={prevBtnStatus} onClick={() => onPageChange(-1)}><i className="fa-solid fa-backward-step"></i></button>
                <span>{filterByToEdit.pageIdx + 1}</span>
                <button disabled={nextBtnStatus} onClick={() => onPageChange(1)}><i className="fa-solid fa-forward-step"></i></button>
            </div>
        </section>
    )
}