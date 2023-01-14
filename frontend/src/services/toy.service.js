import { storageService } from "./async-storage.service"
import { httpService } from './http.service.js'

const STORAGE_KEY = 'toyDB'
const BASE_URL = 'toy/'
const PAGE_SIZE = 3
const labels = ["On wheels", "Box game", "Art", "Baby", "Doll", "Puzzle", "Outdoor", "Battery Powered"]

_setDemoDate()

export const toyService = {
    query,
    getById,
    save,
    remove,
    getEmptyToy,
    getDefaultFilter,
    getDefaultSort,
    getLabels,
    getLabelsOptions,
    getDashboardData,
    PAGE_SIZE
}

function query(filterBy = getDefaultFilter(), sortBy = getDefaultSort(), paging = true) {
    const filterQueryParams = `?name=${filterBy.name}&status=${filterBy.status}&labels=${JSON.stringify(filterBy.labels)}&pageIdx=${filterBy.pageIdx}&pageSize=${PAGE_SIZE}&paging=${paging}`
    const sortQueryParams = `&sortBy=${sortBy.sortBy}&desc=${sortBy.desc}`
    return httpService.get(BASE_URL + filterQueryParams + sortQueryParams)
}

function getById(toyId) {
    return httpService.get(BASE_URL + toyId)
}

function remove(toyId) {
    return httpService.delete(BASE_URL + toyId)
}

function save(toy) {
    if (toy._id) {
        return httpService.put(BASE_URL, toy)
    } else {
        toy.createdAt = Date.now()
        return httpService.post(BASE_URL, toy)
    }
}

function getEmptyToy(name = '', price = '', labels = [], imgUrl = '') {
    return { name, price, labels, inStock: true, imgUrl }
}

function getDefaultFilter(name = '', status = 'all', labels = [], pageIdx = 0) {
    return { name, status, labels, pageIdx }
}

function getDefaultSort(sortBy = 'createdAt', desc = 1) {
    return { sortBy, desc }
}

function getLabels() {
    return labels
}

function getLabelsOptions() {
    return labels.map((label, idx) => ({ name: label, id: idx + 1 }))
}

function getDashboardData() {
    const labels = getLabels()
    const labelsByAmountMap = {}
    labels.forEach(label => labelsByAmountMap[label] = 0)
    const labelsByPriceMap = { ...labelsByAmountMap }

    //console.log(labelsByAmountMap)
    return query(getDefaultFilter(), getDefaultSort(), false)
        .then(toys => {
            console.log(toys)
            toys.forEach(toy => {
                toy.labels.forEach(label => {
                    labelsByAmountMap[label]++
                    //console.log('toy: '+ toy.name)
                    //console.log(labelsByAmountMap[label])
                    labelsByPriceMap[label] += toy.price
                })
            })
            for (const label in labelsByPriceMap) {
                if (labelsByAmountMap[label] === 0) {
                    delete labelsByPriceMap[label]
                    delete labelsByAmountMap[label]
                } else {
                    labelsByPriceMap[label] /= labelsByAmountMap[label]
                }
            }
            return { labelsByAmountMap, labelsByPriceMap }
        })
}

function _createToy(name = '', price = '', labels = [], imgUrl = '') {
    const toy = getEmptyToy(name, price, labels, imgUrl)
    toy._id = storageService._makeId(5)
    toy.createdAt = Date.now()
    return toy
}

function _setDemoDate() {
    const toys = JSON.parse(localStorage.getItem(STORAGE_KEY)) || []
    if (!toys.length) {
        toys.push(_createToy('Remote Car', 119, ['On wheels', 'Battery Powered'], 'Remote-Car'))
        toys.push(_createToy('Barbie', 89, ['Doll', 'Baby'], 'Barbie'))
        toys.push(_createToy('Disney Puzzle', 79, ['Puzzle', 'Box game'], 'Disney-Puzzle'))
        toys.push(_createToy('Toy Story Lego', 159, ['Box game'], 'ToyStory-Lego'))
        localStorage.setItem(STORAGE_KEY, JSON.stringify(toys))
    }
}
