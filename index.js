const express = require('express')
const dotenv = require('dotenv')
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const multer = require('multer')
const path = require('path')
const app = express()
dotenv.config()

const { verifyToken } = require('./middlewares/middleware')

const userRouter = require('./routes/userRoutes')
const productRouter = require('./routes/productRoutes')
const purchaseRouter = require('./routes/purchaseRoutes')
const {upload} = require ('./contollers/userControllers')
const categoryRouter = require('./routes/categoryRoutes')
const favouriteRouter = require('./routes/favouriteRoutes')
const cartRouter = require('./routes/cartRoutes')

//middleware
app.use(express.json())
app.use(bodyParser.json())
app.use(cors())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
const multerMiddleware = multer({dest : 'uploads'})
app.use(express.urlencoded({extended: true}))

//app.use(verifyToken)

//routes
app.use('/users' , userRouter)
app.use('/products' , productRouter)
app.use('/purchase' , purchaseRouter)
app.use('/category' , categoryRouter)
app.use('/favourites' , favouriteRouter)
app.use('/cart' , cartRouter)
app.post('/upload' ,multerMiddleware.array('photos', 100) , upload)

//connecting to the database and initialising the app 
const PORT = process.env.PORT || 4000
mongoose.connect(process.env.MONGO_LOCAL_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
.then(()=>{
    console.log('connected to the database')
    app.listen(PORT , () => {
        console.log(`listening on port ${PORT}`)
    })
}).catch((err)=>{console.log(err)})
