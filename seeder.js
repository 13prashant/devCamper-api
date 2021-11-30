const fs = require('fs')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const colors = require('colors');

// Load env config
dotenv.config({ path: './config/config.env' })

// Load Bootcamp model
const Bootcamp = require('./models/Bootcamp')

// Connect to db
mongoose.connect(process.env.MONGO_URI)

// Read json files
const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8'))

// Import bootcamps into db
const importData = async () => {
    try {
        await Bootcamp.create(bootcamps)
        console.log('bootcamps imported!'.green.inverse)
        process.exit()
    } catch (error) {
        console.error(error)
    }
}

// Delete bootcamps from db
const deleteData = async () => {
    try {
        await Bootcamp.deleteMany()
        console.log('bootcamps destroyed!'.red.inverse)
        process.exit()
    } catch (error) {
        console.error(error)
    }
}

if (process.argv[2] === '-i') {
    importData()
} else if (process.argv[2] === '-d') {
    deleteData()
}


