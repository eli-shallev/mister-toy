const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const utilService = require('../../services/util.service')
const ObjectId = require('mongodb').ObjectId

async function query(filterBy, sortBy, PAGE_SIZE, paging) {
    const status = filterBy.status === 'all' ? 'all' : (filterBy.status === 'inStock')
    try {
        const criteria = {
            name: { $regex: filterBy.name, $options: 'i' },

        }
        if (status != 'all') criteria.inStock = { $eq: status }
        if (filterBy.labels.length) criteria.labels = { $in: filterBy.labels }

        const collection = await dbService.getCollection('toy')
        var toys = await collection.find(criteria).toArray()

        if (sortBy.sortBy === 'name') {
            toys.sort((toy1, toy2) => toy1[sortBy.sortBy].localeCompare(toy2[sortBy.sortBy]) * sortBy.desc)
        } else {
            toys.sort((toy1, toy2) => (toy1[sortBy.sortBy] - toy2[sortBy.sortBy]) * sortBy.desc)
        }
        if (paging) {
            const startIdx = filterBy.pageIdx * PAGE_SIZE
            toys = toys.slice(startIdx, startIdx + PAGE_SIZE)
        }

        return toys
    } catch (err) {
        logger.error('cannot find toy', err)
        throw err
    }
}

async function getById(toyId) {
    try {
        const collection = await dbService.getCollection('toy')
        const toy = collection.findOne({ _id: ObjectId(toyId) })
        return toy
    } catch (err) {
        logger.error(`while finding toy ${toyId}`, err)
        throw err
    }
}

async function remove(toyId) {
    try {
        const collection = await dbService.getCollection('toy')
        await collection.deleteOne({ _id: ObjectId(toyId) })
        return toyId
    } catch (err) {
        logger.error(`cannot remove toy ${toyId}`, err)
        throw err
    }
}

async function add(toy) {
    try {
        const collection = await dbService.getCollection('toy')
        await collection.insertOne(toy)
        return toy
    } catch (err) {
        logger.error('cannot insert toy', err)
        throw err
    }
}

async function update(toy) {
    try {
        const toyToSave = {
            name: toy.name,
            price: toy.price,
            inStock: toy.inStock,
            labels: toy.labels,
            imgUrl: toy.imgUrl,
            msgs: toy.msgs
        }
        const collection = await dbService.getCollection('toy')
        await collection.updateOne({ _id: ObjectId(toy._id) }, { $set: toyToSave })
        return toy
    } catch (err) {
        logger.error(`cannot update toy ${toy._Id}`, err)
        throw err
    }
}

async function addToyMsg(toyId, msg) {
    try {
        msg.id = utilService.makeId()
        const collection = await dbService.getCollection('toy')
        await collection.updateOne({ _id: ObjectId(toyId) }, { $push: { msgs: msg } })
        return msg
    } catch (err) {
        logger.error(`cannot add toy msg ${toyId}`, err)
        throw err
    }
}

async function removeToyMsg(toyId, msgId) {
    try {
        const collection = await dbService.getCollection('toy')
        await collection.updateOne({ _id: ObjectId(toyId) }, { $pull: { msgs: { id: msgId } } })
        return msgId
    } catch (err) {
        logger.error(`cannot add toy msg ${toyId}`, err)
        throw err
    }
}

module.exports = {
    remove,
    query,
    getById,
    add,
    update,
    addToyMsg,
    removeToyMsg
}
