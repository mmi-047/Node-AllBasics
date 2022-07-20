const autorize = (req,res,next)=>{
    const{user}=req.query
    if (user==='mehul') {
      req.user={name:'mehul',id:1}
      next()  
    }
    else{
        res.status(401).send('unauthorized')
    }
    console.log('authorize');
    next()
}
module.exports= autorize