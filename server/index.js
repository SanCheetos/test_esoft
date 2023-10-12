require('dotenv').config()
const express = require('express')
const sequelize = require('./db')
const cors = require('cors')
const models = require('./models/models')
const routes = require('./routes/index')
const errorHandler = require('./middleware/ErrorHandlingMiddleware')

const PORT = process.env.PORT || 5000

const app = express()
app.use(cors())
app.use(express.json())
app.use('/api', routes)

app.use(errorHandler)

const start = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
    }
    catch (err) {
        console.log(err)
    }
}
start()
