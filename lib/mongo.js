const {MongoClient, ObjectId} = require("mongodb")
require("dotenv").config()
const USER = process.env.DB_USER
const PASSWORD = process.env.DB_PASSWORD
const DB_HOST = process.env.DB_HOST
const DB_NAME = process.env.DB_NAME
const MONGO_URI = `mongodb+srv://${USER}:${PASSWORD}@${DB_HOST}/${DB_NAME}?retryWrites=true&w=majority`

class MongoLib{
    constructor(){
        this.client = new MongoClient(MONGO_URI, {useNewUrlParser: true}, {useUnifiedTopology: true})
        this.db_name = DB_NAME
    }
    connect(){
        if(!MongoLib.connection){
            MongoLib.connection = new Promise((resolve, reject) => {
                this.client.connect(err => {
                    if(err){
                        reject(err)
                    }
                    console.log("Connected succesfully to mongo :)")
                    resolve(this.client.db(this.db_name))
                })
            })
        }
        return MongoLib.connection 
    }

    getAll(collection, query){
        return this.connect().then(db => {
            return db.collection(collection).find(query).toArray()
        })
    }
    get(collection, id){
        return this.connect().then(db => {
            return db.collection(collection).findOne({_id: ObjectId(id)})
        })
    }
    create(collection, data){
        return this.connect().then(db => {
            return db.collection(collection).insertOne(data)
        }).then(result => result.insertedId)
    }
    update(collection, id, data){
        return this.connect().then(db => {
            return db.collection(collection).updateOne({_id: ObjectId(id)}, {$set: data}, {upsert: true})
        }).then(result => result.upsetedId || id)
    }
    delete(collection, id){
        return this.connect().then(db => {
            return db.collection(collection).deleteOne({_id: ObjectId(id)})
        }).then(() => id)
    }
}

module.exports = MongoLib
