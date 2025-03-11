
// const Cart = require('../models/Cart');
// const Product = require('../models/Product');
// const mongoose = require('mongoose');
// const User = require('../models/User');

// // Add item to cart
// const addItemToCart = async (req, res) => {
//   try {
//     console.log(req.body);
    
//     const { productId, size,color, quantity = 1} = req.body;
//     const userId = req.user._id;

//     // Validate productId and quantity
//     if (!mongoose.Types.ObjectId.isValid(productId) || quantity < 1) {
//       return res.status(400).json({ message: 'Invalid product ID or quantity' });
//     }

//     // Check if product exists
//     const product = await Product.findById(productId);
//     if (!product) {
//       return res.status(404).json({ message: 'Product not found' });
//     }

//     // Find the user to get the userName
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // Find or create cart
//     let cart = await Cart.findOneAndUpdate(
//       { userId },
//       { $set: { userName: user.name } }, // Update userName if it has changed
//       { new: true, upsert: true, setDefaultsOnInsert: true }
//     );

//     // Check if the product already exists in the cart
//     const productExists = cart.items.find(
//       (item) => item.productId.equals(productId) && item.size === size
//     );
//     if (productExists) {
//       productExists.quantity += quantity; // Increment quantity
//     } else {
//       cart.items.push({ productId: productId, size,color, quantity }); // Add new item with quantity
//     }

//     await cart.save();
//     res.status(201).json({ message: 'Item added to cart', cart });
//   } catch (error) {
//     res.status(500).json({ message: 'Error adding item to cart', error: error.message });
//   }
// };

// // Rest of the controller methods remain the same
// const getUserCart = async (req, res) => {
//   try {
//     // const {userId} = req.body
//     const userId = req.user._id;
//     console.log(userId)
//     if(!userId){
//       return res.status(404).json({ message: 'user is not found' });
//     }
//     let cart = await Cart.findOne({userId});
//     if (!cart) {
//       // Return an empty cart structure if no cart is found
//       cart = { items: []};
//     }
//     res.status(200).json(cart);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching cart', error: error.message });
//   }
// };

// const removeItemFromCart = async (req, res) => {
//   try {
//     const { productId, size } = req.body;

//     // Validate the productId
//     if (!mongoose.Types.ObjectId.isValid(productId)) {
//       return res.status(400).json({ message: 'Invalid product ID' });
//     }

//     const cart = await Cart.findOne({ userId: req.user._id });
//     if (!cart) return res.status(404).json({ message: 'Cart not found' });

//     // Filter the items by both productId and size
//     const itemIndex = cart.items.findIndex(item => item.productId.equals(productId) && item.size === size);

//     // If the item is found, remove it
//     if (itemIndex !== -1) {
//       cart.items.splice(itemIndex, 1);
//       await cart.save();

//       return res.status(200).json({ message: 'Item removed from cart', cart });
//     } else {
//       return res.status(404).json({ message: 'Item not found in cart' });
//     }

//   } catch (error) {
//     res.status(500).json({ message: 'Error removing item from cart', error: error.message });
//   }
// };

// const updateItemQuantity = async (req, res) => {
//   try {
//     const { productId, quantity } = req.body;

//     if (!mongoose.Types.ObjectId.isValid(productId) || !quantity || quantity <= 0) {
//       return res.status(400).json({ message: 'Invalid product ID or quantity' });
//     }

//     const cart = await Cart.findOne({ user: req.user._id });
//     if (!cart) return res.status(404).json({ message: 'Cart not found' });

//     const item = cart.items.find((item) => item.product.equals(productId));
//     if (item) {
//       item.quantity = quantity;
//       await cart.save();
//       res.status(200).json({ message: 'Cart updated successfully', cart });
//     } else {
//       res.status(404).json({ message: 'Item not found in cart' });
//     }
//   } catch (error) {
//     res.status(500).json({ message: 'Error updating cart', error: error.message });
//   }
// };

// const clearCart = async (req, res) => {
//   try {
//     const cart = await Cart.findOneAndDelete({ user: req.user._id });
//     if (!cart) return res.status(404).json({ message: 'Cart not found' });

//     res.status(200).json({ message: 'Cart cleared successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Error clearing cart', error: error.message });
//   }
// };

// module.exports = {
//   addItemToCart,
//   getUserCart,
//   removeItemFromCart,
//   updateItemQuantity,
//   clearCart,
// };





const Cart = require("../models/Cart");
const Product = require("../models/Product");
const mongoose = require("mongoose");
const User = require("../models/User");

// const addItemToCart = async (req, res) => {
//   try {
//     const { productId,userId, quantity = 1 } = req.body; // Only productId and quantity are required now

//     // Validate productId and quantity
//     if (!mongoose.Types.ObjectId.isValid(productId) || quantity < 1) {
//       return res.status(400).json({ message: "Invalid product ID or quantity" });
//     }

//     // Check if product exists
//     const product = await Product.findById(productId);
//     if (!product) {
//       return res.status(404).json({ message: "Product not found" });
//     }

//     // Log the product to verify that it contains name and description
//     console.log('Product:', product);

//     // Ensure productName and productDescription are defined
//     if (!product.name || !product.description) {
//       return res.status(400).json({ message: "Product name and description are required" });
//     }

//     // Find the user to get the userName
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Find or create cart
//     let cart = await Cart.findOneAndUpdate(
//       { userId },
//       { $set: { userName: user.name } }, // Update userName if it has changed
//       { new: true, upsert: true, setDefaultsOnInsert: true }
//     );

//     // Check if the product already exists in the cart
//     const productExists = cart.items.find(
//       (item) => item.productId.equals(productId)
//     );

//     if (productExists) {
//       // Increment quantity if product already exists
//       if (productExists.quantity + quantity > product.availableStock) {
//         return res.status(400).json({
//           message: `Not enough stock available. Only ${product.availableStock} left.`,
//         });
//       }
//       productExists.quantity += quantity; // Increment quantity
//     } else {
//       // Add new item with quantity details
//       if (quantity > product.availableStock) {
//         return res.status(400).json({
//           message: `Not enough stock available. Only ${product.availableStock} left.`,
//         });
//       }

//       // Add new item to cart
//       cart.items.push({
//         productId,
//         productName: product.name,           // Ensure productName is correctly assigned
//         productDescription: product.description, // Ensure productDescription is correctly assigned
//         price: product.price,
//         category: product.category,
//         subcategory: product.subcategory,
//         availableStock: product.availableStock,
//         images: Array.isArray(product.images) ? product.images : [], // Ensure images is an array of strings
//         quantity,
//       });
//     }

//     // Save the cart
//     await cart.save();
//     res.status(201).json({ message: "Item added to cart", cart });
//   } catch (error) {
//     console.error(error); // Log the error for easier debugging
//     res.status(500).json({ message: "Error adding item to cart", error: error.message });
//   }
// };

// const addItemToCart = async (req,res) => {
//   try {
//     // const {productId,userId} = req.params;
//     const {productId,userId,quantity} = req.body;

//     const cart = await Cart.findOne({userId});
    
//     if(!cart){
//       // res.status(400).json({message:"Not Found"})
//       cart = new Cart({userId,items:[]})
//     }
    
//     const existingItem  = cart.items.find(item => item.productId.toString() === productId)

//     if(existingItem){
//       existingItem.quantity += quantity
//     }
//     else{
//       cart.items.push({productId,quantity})
//     }
    
//     // cart.totalPrice = cart.items.reduce((total,item) => total + (item.))
//     res.status(200).json({data:cart})
//   } catch (error) {
//     res.status(400).json({message:"Not Found"})
//   }
// }

const addItemToCart = async (req, res) => {
  try {
    console.log(req.body);
    
    const { productId, userId, quantity = 1} = req.body;
    // const userId = req.user._id;

    // Validate productId and quantity
    if (!mongoose.Types.ObjectId.isValid(productId) || quantity < 1) {
      return res.status(400).json({ message: 'Invalid product ID or quantity' });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Find the user to get the userName
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find or create cart
    let cart = await Cart.findOneAndUpdate(
      { userId },
      { $set: { userName: user.name } }, // Update userName if it has changed
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    // Check if the product already exists in the cart
    const productExists = cart.items.find(
      (item) => item.productId.equals(productId)
    );
    if (productExists) {
      productExists.quantity += quantity; // Increment quantity
    } else {
      cart.items.push({ productId: productId, size,color, quantity }); // Add new item with quantity
    }

    await cart.save();
    res.status(201).json({ message: 'Item added to cart', cart });
  } catch (error) {
    res.status(500).json({ message: 'Error adding item to cart', error: error.message });
  }
};
// Rest of the controller methods remain the same
const getUserCart = async (req, res) => {
  try {
    // Find the user's cart and populate the productId details in the items array
    let cart = await Cart.find()
      .populate("items.productId")
      .populate("userId")
      .select("oldPrice"); // Exclude _id, createdAt, updatedAt, and __v
    // If no cart is found, create a new one
    if (!cart) {
      cart = new Cart({
        userId,
        userName: req.user.userName, // Assuming userName is stored in req.user
        items: [], // Initialize with empty items array
      });
      await cart.save();
    }

    // Respond with the cart details
    res.status(200).json(cart);
  } catch (error) {
    // In case of any errors, send a 500 error
    console.error(error);
    res
      .status(500)
      .json({ message: "Error fetching cart", error: error.message });
  }
};

// const removeItemFromCart = async (req, res) => {
//   try {
//     const { productId, size } = req.body;

//     // Validate the productId
//     if (!mongoose.Types.ObjectId.isValid(productId)) {
//       return res.status(400).json({ message: "Invalid product ID" });
//     }

//     const cart = await Cart.findOne({ userId: req.user._id });
//     if (!cart) return res.status(404).json({ message: "Cart not found" });

//     // Filter the items by both productId and size
//     const itemIndex = cart.items.findIndex(
//       (item) => item.productId.equals(productId) && item.size === size
//     );

//     // If the item is found, remove it
//     if (itemIndex !== -1) {
//       cart.items.splice(itemIndex, 1);
//       await cart.save();

//       return res.status(200).json({ message: "Item removed from cart", cart });
//     } else {
//       return res.status(404).json({ message: "Item not found in cart" });
//     }
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Error removing item from cart", error: error.message });
//   }
// };


const removeItemFromCart = async (req, res) => {
  try {
    const { productId } = req.body;

    // Validate the productId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    // Find the user's cart
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    // Find item index based only on productId
    const itemIndex = cart.items.findIndex((item) =>
      item.productId.equals(productId)
    );

    // If the item exists, remove it
    if (itemIndex !== -1) {
      cart.items.splice(itemIndex, 1);
      await cart.save();

      return res.status(200).json({ message: "Item removed from cart", cart });
    } else {
      return res.status(404).json({ message: "Item not found in cart" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error removing item from cart", error: error.message });
  }
};

const updateItemQuantity = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (
      !mongoose.Types.ObjectId.isValid(productId) ||
      !quantity ||
      quantity <= 0
    ) {
      return res
        .status(400)
        .json({ message: "Invalid product ID or quantity" });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find((item) => item.product.equals(productId));
    if (item) {
      item.quantity = quantity;
      await cart.save();
      res.status(200).json({ message: "Cart updated successfully", cart });
    } else {
      res.status(404).json({ message: "Item not found in cart" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating cart", error: error.message });
  }
};

const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOneAndDelete({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    res.status(200).json({ message: "Cart cleared successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error clearing cart", error: error.message });
  }
};

module.exports = {
  addItemToCart,
  getUserCart,
  removeItemFromCart,
  updateItemQuantity,
  clearCart,
};
