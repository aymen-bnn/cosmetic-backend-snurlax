
const Product = require('../models/productModel')
const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
const Category = require('../models/categoryModel')

const createProduct = async (req, res) => {
  const { name, price, images, description, quantity, value, unit, volume, brand, categories } = req.body;
  const { token } = req.headers;

  try {
    jwt.verify(token, process.env.JWT_TOKEN_KEY, async (err, data) => {
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

      for (const categoryName of categories.split(" ")) {
        let foundCategory = await Category.findOne({ name: categoryName });

        if (!foundCategory) {
          // If the category doesn't exist, create a new one
          return res.status(400).json({ error: "category doesn't exist" });
        }

        categoryIds.push(foundCategory._id);
      }

      console.log("categoryIds:", categoryIds);

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
    console.log(error);
    res.status(400).json({ error: "An error occurred" });
  }
};

const updateProduct = async (req, res) => {
  const { productId } = req.params;
  const { name, price, images, description, quantity, value, unit, volume, brand, categories } = req.body;
  const { token } = req.headers;

  try {
    jwt.verify(token, process.env.JWT_TOKEN_KEY, async (err, data) => {
      if (!name || !price || !images || !description) {
        return res.status(400).json({ error: "name, price, images, quantity are required" });
      }

      const admin = await User.findOne({ email: data.user.email });
      if (!admin.isAdmin) {
        return res.status(400).json({ error: "authorization error" });
      }

      const categoryIds = [];

      for (const categoryName of categories.split(" ")) {
        let foundCategory = await Category.findOne({ name: categoryName });

        if (!foundCategory) {
          // If the category doesn't exist, create a new one
          return res.status(400).json({ error: "category doesn't exist" });
        }

        categoryIds.push(foundCategory._id);
      }

      console.log("categoryIds:", categoryIds);

      const updatedProduct = await Product.findOneAndUpdate(
        { _id: productId, owner: admin._id },
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
          category: categoryIds
        },
        { new: true }
      );

      if (!updatedProduct) {
        return res.status(404).json({ error: "Product not found or not owned by the user" });
      }

      res.status(200).json({ message: "Product updated successfully", product: updatedProduct });
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "An error occurred" });
  }
};


const deleteProduct = async (req, res) => {
  const { productId } = req.params
  const { token } = req.headers
  try {
    jwt.verify(token, process.env.JWT_TOKEN_KEY, async (error, data) => {
      console.log(data)
      const admin = await User.findOne({ email: data.user.email })
      //check if the user is admin 
      if (!admin.isAdmin) {
        return res.status(400).json({ error: " authorisation error" })
      }

      const product = await Product.findById(productId)

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

const getProduct = async (req, res) => {
  const { productId } = req.params
  const { token } = req.headers
  try {
    jwt.verify(token, process.env.JWT_TOKEN_KEY, async (error, data) => {
      console.log(data)
      const user = await User.findOne({ email: data.user.email })


      let product

      if (user.isAdmin) {
        product = await Product.findById(productId)
      } else {
        product = await Product.findOne({ _id: productId, state: "active" });
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
    const product = await Product.find({ state: "active" })
    res.status(200).json({ product })
  } catch (error) {
    res.status(400).json({ error })
  }
}

const getAllDeleted = async (req, res) => {
  const { token } = req.headers

  try {
    jwt.verify(token, process.env.JWT_TOKEN_KEY, async (error, data) => {
      if (error) {
        return res.status(400).json({ error: 'authorisation error' });
      }
      console.log(data);
      const admin = await User.findOne({ email: data.user.email });
      // check if the user is admin
      if (!admin.isAdmin) {
        return res.status(400).json({ error: 'Authorization error' });
      }

      const product = await Product.find({ state: 'archived' });
      res.status(200).json({ product });
    });
  } catch (error) {
    res.status(400).json({ error });
  }
}

const getAllActive = async (req, res) => {
  const { token } = req.headers
  try {
    jwt.verify(token, process.env.JWT_TOKEN_KEY, async (error, data) => {
      console.log(data)
      const admin = await User.findOne({ email: data.user.email })
      //check if the user is admin 
      if (!admin.isAdmin) {
        return res.status(400).json({ error: " authorisation error" })
      }

      const product = await Product.find({})
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
      const user = await User.findOne({ email: data.user.email })
      if (!user) {
        return res.status(400).json({ error: "user is not found" })
      }
      if (!user.isAdmin) {
        return res.status(400).json({ error: "authoristaion error" })
      }
      const products = await Product.find({ category: { $in: [categoryId] } }).populate('category');
      res.json(products);
    })
  } catch (error) {
    res.status(400).json({ error })
  }
}
//search?query=example
const search = async (req, res) => {
  const { query } = req.query;

  try {
    const products = await Product.find({
      $and: [
        { state: "active" },
        {
          $or: [
            { name: { $regex: query, $options: "i" } },
            { description: { $regex: query, $options: "i" } },
            { brand: { $regex: query, $options: "i" } }
          ]
        }
      ]
    });

    res.status(200).json({ products });
  } catch (error) {
    res.status(400).json({ error });
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
  getProductByCategoryAdmins
}