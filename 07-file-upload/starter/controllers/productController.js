const Product = require('../models/Product')


const createProduct = async(req,res)=>{
    
    console.log(req.body);
    const product = await Product.create(req.body)
    res.status(201).json({product})
}

const getAllProducts = async(req,res)=>{
    const products = await Product.find({})
    res.status(200).json({products})
}


module.exports = {
    createProduct,getAllProducts
}



