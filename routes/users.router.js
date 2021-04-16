const express = require("express");
const router = express.Router();

router.route("/")
.get((req,res)=>{
    res.json({ response : "users", success : true })
})
.post((req,res)=>{
    res.json({ response : "", success : true })
})

router.route("/:id")
.get((req,res)=>{
    res.json({ response : "", success : true })
})
.post((req,res)=>{
    res.json({ response : "", success : true })
})

module.exports = router;