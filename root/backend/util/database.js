const mongodb = require('mongodb')
const colors = require('colors')
const MongoClient = mongodb.MongoClient

const mongoConnect = (callback) => {
    MongoClient
        .connect('mongodb+srv://mfachengdu:iamsingaporean@cluster0.rbiadah.mongodb.net/?retryWrites=true&w=majority')
        .then(client => {
            console.log("MongoDB connection successful".green)
            callback(client)
        })
        .catch(err => {
            console.log(err)
            console.log("failed to conenct MongoDB".red)
        })
}

module.exports = mongoConnect