
const User = require('../models/userModel')
const Product = require('../models/productModel')
const jwt = require('jsonwebtoken')
const addFavourite = async (req, res) => {

    const { token } = req.headers
    const { favourite } = req.params

    try {
        jwt.verify(token, process.env.JWT_TOKEN_KEY, async (err, data) => {
            const user = await User.findOne({ email: data.user.email })
            if (!user.active) {
                return res.status(400).json({ error: "user is not active" })
            }
            const updatedUser = await User.findByIdAndUpdate(
                user._id,
                { $addToSet: { favorites: favourite } },
                { new: true }
            )
            res.status(400).json({message : "favourite added" , updatedUser})
        })
    } catch (error) {
        res.status(400).json({ error })
    }

}

const deleteFavourite = async (req, res) => {
    const { token } = req.headers
    const { favourite } = req.params

    try {
        jwt.verify(token, process.env.JWT_TOKEN_KEY, async (err, data) => {
            const user = await User.findOne({ email: data.user.email })
            if (!user.active) {
                return res.status(400).json({ error: "user is not active" })
            }
            const updatedUser = await User.findByIdAndUpdate(
                user._id,
                { $pull: { favorites: favourite } },
                { new: true }
            )
            res.status(400).json({message : "favourite removed" , updatedUser})
        })
    } catch (error) {
        res.status(400).json({ error })
    }
}

const deleteFavourites = async (req, res) => {
    const { token } = req.headers
    try {
        jwt.verify(token, process.env.JWT_TOKEN_KEY, async (err, data) => {
            const user = await User.findOne({ email: data.user.email })
            if (!user.active) {
                return res.status(400).json({ error: "user is not active" })
            }
            const updatedUser = await User.findByIdAndUpdate(
                user._id,
                { favorites:[] },
                { new: true }
            )
            res.status(400).json({message : "favourite removed" , updatedUser})
        })
    } catch (error) {
        res.status(400).json({ error })
    }
    
}
const getFavourites = async (req, res) => {
    const { token } = req.headers;
  
    try {
      jwt.verify(token, process.env.JWT_TOKEN_KEY, async (err, data) => {
        const user = await User.findOne({ email: data.user.email }).populate('favorites');
  
        if (!user.active) {
          return res.status(400).json({ error: "user is not active" });
        }
  
        const allFavourites = user.favorites.map(favourite => ({
          name: favourite.name,
          price: favourite.price,
          images: favourite.images,
          description: favourite.description,
          quantity: favourite.quantity,
          volume: favourite.volume,
          brand: favourite.brand,
          category: favourite.category,
          state: favourite.state
        }));
  
        res.status(200).json({ favourites: allFavourites });
      });
    } catch (error) {
      res.status(400).json({ error });
    }
  };
module.exports = { addFavourite, deleteFavourite, deleteFavourites , getFavourites}