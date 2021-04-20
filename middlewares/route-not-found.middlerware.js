
const routeNotFoundHandler = (req, res) =>{
    res.status(404).json({success: false, message:"route is not found on server, please check"})
} 

module.exports = routeNotFoundHandler;