const fs = require('fs');
var toys = require('../data/toy.json')


module.exports = {
    query,
    get,
    remove,
    save
}

function query(filterBy, sortBy,PAGE_SIZE, paging) {
    let filteredToys = toys
    if (filterBy.name) {
        const regex = new RegExp(filterBy.name, 'i')
        filteredToys = filteredToys.filter(toy => regex.test(toy.name))
    }
    if (filterBy.status === 'inStock') {
        filteredToys = filteredToys.filter(toy => toy.inStock)
    }
    if (filterBy.status === 'outOfStock') {
        filteredToys = filteredToys.filter(toy => !toy.inStock)
    }
    if (filterBy.labels && filterBy.labels.length !== 0) {
        filteredToys = filteredToys.filter(toy => {
            let isLabeled = false
            filterBy.labels.forEach(label => {
                const regex = new RegExp(label, 'i')
                if (toy.labels.some(toyLabel => regex.test(toyLabel))) isLabeled = true
            })
            return isLabeled
        })
    }

    if (sortBy.sortBy === 'name') {
        filteredToys.sort((toy1, toy2) => toy1[sortBy.sortBy].localeCompare(toy2[sortBy.sortBy]) * sortBy.desc)
    } else {
        filteredToys.sort((toy1, toy2) => (toy1[sortBy.sortBy] - toy2[sortBy.sortBy]) * sortBy.desc)
    }
    if (paging) {
        const startIdx = filterBy.pageIdx * PAGE_SIZE
        filteredToys = filteredToys.slice(startIdx, startIdx + PAGE_SIZE)
    }

    return Promise.resolve(filteredToys)
}

function get(ToyId){
    const toy = toys.find(toy => toy._id === ToyId)
    if (!toy) return Promise.reject('Toy not found')
    return Promise.resolve(toy)
}

function remove(ToyId) {
    const idx = toys.findIndex(toy => toy._id === ToyId)
    if (idx === -1) return Promise.reject('No Such Toy')
    toys.splice(idx, 1)
    return _writeToysToFile()
}

function save(toy) {
    if (toy._id) {
        const toyToUpdate = toys.find(currToy => currToy._id === toy._id)
        if (!toyToUpdate) return Promise.reject('No such Toy')

        toyToUpdate.name = toy.name
        toyToUpdate.price = toy.price
        toyToUpdate.isStock = toy.inStock
        toyToUpdate.labels = toy.labels
        toyToUpdate.imgUrl = toy.imgUrl
    } else {
        toy._id = _makeId()
        toy.createdAt= Date.now()
        toys.unshift(toy)
    }
    return _writeToysToFile().then(() => toy)
}



function _makeId(length = 5) {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

function _writeToysToFile() {
    return new Promise((res, rej) => {
        const data = JSON.stringify(toys, null, 2)
        fs.writeFile('data/toy.json', data, (err) => {
            if (err) return rej(err)
            // console.log("File written successfully\n");
            res()
        });
    })
}