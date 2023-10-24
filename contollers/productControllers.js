
const Product = require('../models/productModel')
const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
const Category = require('../models/categoryModel')
const Cart = require('../models/cartModel')
const Purchase = require('../models/purchaseModel')

const createProduct = async (req, res) => {
  const { name, price, images, description, quantity, value, unit, volume, brand, categories } = req.body;
  const { token } = req.headers;

  try {
    jwt.verify(token, process.env.JWT_TOKEN_KEY, async (err, data) => {
      if (err) {
        return res.status(400).json({ error: "Invalid token" });
    }
      if (!name || !price || !images || !description) {
        return res.status(400).json({ error: "name, price, images, quantity are required" });
      }

      const admin = await User.findOne({ email: data.user.email });
      if (!admin.isAdmin) {
        return res.status(400).json({ error: "authorization error" });
      }
      //check if the prouct exists
      const existed = await Product.findOne({ name })
      if (existed) {
        return res.status(400).json({ error: "product already existed" })
      }

      const categoryIds = [];

        let foundCategory = await Category.findOne({ name: categories.trim() });

        if (!foundCategory) {
          // If the category doesn't exist, create a new one
          return res.status(400).json({ error: "category doesn't exist" });
        }

        categoryIds.push(foundCategory._id);


      const product = await Product.create({
        owner: admin._id,
        name,
        price,
        images,
        description,
        quantity: {
          value: quantity.value,
          unit: quantity.unit,
          volume: quantity.volume
        },
        brand,
        category: categoryIds
      });

      res.status(200).json({ message: "Product created successfully", product });
    });
  } catch (error) {
    res.status(400).json({error : error.message})
  }
};

const updateProduct = async (req, res) => {
  const { productId } = req.params;
  const { name, price, images, description, state, value, unit, volume, brand, categories } = req.body;
  const { token } = req.headers;

  try {
    jwt.verify(token, process.env.JWT_TOKEN_KEY, async (err, data) => {
      if (err) {
        return res.status(400).json({ error: "Invalid token" });
    }
      if (!name || !price || !images || !description) {
        return res.status(400).json({ error: "name, price, images, quantity are required" });
      }

      const admin = await User.findOne({ email: data.user.email });
      if (!admin.isAdmin) {
        return res.status(400).json({ error: "authorization error" });
      }

      const categoryIds = [];

        let foundCategory = await Category.findOne({ name: categories.trim() });

        if (!foundCategory) {
          // If the category doesn't exist, create a new one
          return res.status(400).json({ error: "category doesn't exist" });
        }

        categoryIds.push(foundCategory._id);
        
      const updatedProduct = await Product.findOneAndUpdate(
        { _id: productId},
        {
          name,
          price,
          images,
          description,
          quantity: {
            value,
            unit,
            volume
          },
          brand,
          category: categoryIds,
          state
        },
        { new: true }
      );

      if (!updatedProduct) {
        return res.status(404).json({ error: "Product not found or not owned by the user" });
      }

      res.status(200).json({ message: "Product updated successfully", product: updatedProduct });
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/*
const deleteProduct = async (req, res) => {
  const { productId } = req.params
  const { token } = req.headers
  try {
    jwt.verify(token, process.env.JWT_TOKEN_KEY, async (err, data) => {
      if (err) {
        return res.status(400).json({ error: "Invalid token" });
    }
      const admin = await User.findOne({ email: data.user.email })
      check if the user is admin 
      if (!admin.isAdmin) {
        return res.status(400).json({ error: " authorisation error" })
      }

      const product = await Product.findById(productId).populate('category');

      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      const deletedProduct = await Product.updateOne({ _id: productId }, { state: "archived" })
      res.status(200).json({ message: "product archived successfully", deletedProduct })
    })
  } catch (error) {
    res.status(400).json({ error })
  }
}
*/
const deleteProduct = async (req, res) => {
  const { productId } = req.params
  const { token } = req.headers
  try {
    jwt.verify(token, process.env.JWT_TOKEN_KEY, async (err, data) => {
      if (err) {
        return res.status(400).json({ error: "Invalid token" });
    }
      const admin = await User.findOne({ email: data.user.email })
      //check if the user is admin 
      if (!admin.isAdmin) {
        return res.status(400).json({ error: " authorisation error" })
      }

      const product = await Product.findById(productId).populate('category');

      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      //const deletedProduct = await Product.deleteMany({ _id: productId })
      await Purchase.updateMany(
        { 'items.product': productId },
        { $pull: { items: { product: productId } } }
      );

      await User.updateMany(
        { favorites: productId },
        { $pull: { favorites: productId } }
      );

      await Cart.updateMany(
        { 'items.product': productId },
        { $pull: { items: { product: productId } } }
      );
      await Product.deleteMany({ _id: productId })
      res.status(200).json({ message: "product deleted successfully" })
    })
  } catch (error) {
    res.status(400).json({ error })
  }
}
const getProduct = async (req, res) => {
  const { productId } = req.params
  const { token } = req.headers
  try {
    jwt.verify(token, process.env.JWT_TOKEN_KEY, async (err, data) => {
      if (err) {
        return res.status(400).json({ error: "Invalid token" });
    }

      const user = await User.findOne({ email: data.user.email })
      let product

      if (user.isAdmin) {
        product = await Product.findById(productId).populate('category');
      } else {
        product = await Product.findOne({ _id: productId, state: "active" }).populate('category');
      }

      if (!product) {
        return res.status(404).json({ error: "Product not found" })
      }
      
      res.status(200).json({ product });
    })
  } catch (error) {
    res.status(400).json({ error })
  }
}

const getProducts = async (req, res) => {


  try {
    const product = await Product.find({ state: "active" }).populate('category');
    res.status(200).json({ product })
  } catch (error) {
    res.status(400).json({ error })
  }
}
const getProductsAdmin = async (req, res) => {

  const {token} = req.headers
  try {
    jwt.verify(token, process.env.JWT_TOKEN_KEY, async (err, data) => {
      if (err) {
        return res.status(400).json({ error: "Invalid token" });
    }
      const admin = await User.findOne({ email: data.user.email })
      //check if the user is admin 
      if (!admin.isAdmin) {
        return res.status(400).json({ error: " authorisation error" })
      }

    const product = await Product.find({}).populate('category');
    res.status(200).json({ product })
    })
  } catch (error) {
    res.status(400).json({ error })
  }
}

const getAllDeleted = async (req, res) => {
  const { token } = req.headers

  try {
    jwt.verify(token, process.env.JWT_TOKEN_KEY, async (err, data) => {
      if (err) {
        return res.status(400).json({ error: "Invalid token" });
    }
      
      const admin = await User.findOne({ email: data.user.email });
      // check if the user is admin
      if (!admin.isAdmin) {
        return res.status(400).json({ error: 'Authorization error' });
      }

      const product = await Product.find({ state: 'archived' }).populate('category');
      res.status(200).json({ product });
    });
  } catch (error) {
    res.status(400).json({ error });
  }
}

const getAllActive = async (req, res) => {
  const { token } = req.headers
  try {
    jwt.verify(token, process.env.JWT_TOKEN_KEY, async (err, data) => {
      if (err) {
        return res.status(400).json({ error: "Invalid token" });
    }
     
      const admin = await User.findOne({ email: data.user.email })
      //check if the user is admin 
      if (!admin.isAdmin) {
        return res.status(400).json({ error: " authorisation error" })
      }

      const product = await Product.find({}).populate('category');
      res.status(200).json({ product })
    })
  } catch (error) {
    res.status(400).json({ error })
  }
}

const getProductByCategoryUsers = async (req, res) => {

  const { categoryId } = req.params
  const { token } = req.headers

  try {
    jwt.verify(token, process.env.JWT_TOKEN_KEY, async (err, data) => {
      if (err) {
        return res.status(400).json({ error: "Invalid token" });
    }
      const user = await User.findOne({ email: data.user.email })
      if (!user) {
        return res.status(400).json({ error: "user is not found" })
      }
      if (!user.active) {
        return res.status(400).json({ error: "authoristaion error" })
      }
      const products = await Product.find({ category: { $in: [categoryId] }, state: "active"})
      .populate('category')
      .exec();
      res.status(200).json({products})
    })
  } catch (error) {
    res.status(400).json({ error })
  }
}

const getProductByCategoryAdmins = async (req, res) => {

  const { categoryId } = req.params
  const { token } = req.headers

  try {
    jwt.verify(token, process.env.JWT_TOKEN_KEY, async (err, data) => {
      if (err) {
        return res.status(400).json({ error: "Invalid token" });
    }
      const user = await User.findOne({ email: data.user.email })
      if (!user) {
        return res.status(400).json({ error: "user is not found" })
      }
      if (!user.isAdmin) {
        return res.status(400).json({ error: "authoristaion error" })
      }
      const products = await Product.find({ category: { $in: [categoryId] }})
      .populate('category')
      .exec();
      res.status(200).json({products})
    })
  } catch (error) {
    res.status(400).json({ error })
  }
}
//search?query=example
const search = async (req, res) => {
  const { query } = req.query;
  const {token} = req.headers
  
  try {

    jwt.verify(token, process.env.JWT_TOKEN_KEY, async (err, data) => {
      if (err) {
        return res.status(400).json({ error: "Invalid token" });
      }

      const user = await User.findOne({ email: data.user.email });

      if (!user) {
        return res.status(400).json({ error: "User not found" });
      }

      let products;

      if (user.isAdmin) {
        
        products = await Product.find({
          $or: [
            { name: { $regex: query, $options: "i" } },
            { description: { $regex: query, $options: "i" } },
            { brand: { $regex: query, $options: "i" } },
          ],
        }).populate("category");
      } else {
        
        products = await Product.find({
          $and: [
            { state: "active" },
            {
              $or: [
                { name: { $regex: query, $options: "i" } },
                { description: { $regex: query, $options: "i" } },
                { brand: { $regex: query, $options: "i" } },
              ],
            },
          ],
        }).populate("category")
      }

      res.status(200).json({ products })
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
  getProducts,
  getProduct,
  getAllDeleted,
  getAllActive,
  search,
  getProductByCategoryUsers,
  getProductByCategoryAdmins,
  getProductsAdmin
}