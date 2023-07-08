

const favouriteRouter = require('express').Router()
const {addFavourite , deleteFavourite ,  getFavourites, deleteFavourites} = require('../contollers/favouriteControllers')

favouriteRouter.put('/add/:favourite' , addFavourite)
favouriteRouter.put('/delete/:favourite' , deleteFavourite)
favouriteRouter.put('/delete' , deleteFavourites)
favouriteRouter.get('/get' , getFavourites)
module.exports = favouriteRouter