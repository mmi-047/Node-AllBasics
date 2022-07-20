const path =require('path')
const cloudinary = require('cloudinary').v2
const fs =require('fs')
const uploadProductImageLocal = async(req,res)=>{
    //  check if file exists
    // check formate
    // check size
    if(!req.files){
        return res.status(400).json({msg:'No file Uploaded'})
    }
    const productImage = req.files.image

    if (!productImage.mimetype.startsWith('image')) {
        return res.status(400).json({msg:'Please Upload Image'})
    }
    const maxSize = 1024 * 1024;
    if(productImage.size >maxSize){
        return res.status(400).json({msg:'Please Upload Image smaller then 1KB'})
    }


 
const imagePath = path.join(__dirname,'../public/uploads/'+`${productImage.name}`)    

await productImage.mv(imagePath)
return res.status(200).json({image:{src:`/uploads/${productImage.name}`}})
}
const uploadProductImage = async(req,res)=>{
// console.log(req.files.image);
    const result = await cloudinary.uploader.upload(req.files.image.tempFilePath,{
        use_filename:true,folder:'file-upload'
    })
    fs.unlinkSync(req.files.image.tempFilePath)
    return res.status(200).json({image:{src:result.secure_url}})
}

module.exports = {
    uploadProductImage
}
