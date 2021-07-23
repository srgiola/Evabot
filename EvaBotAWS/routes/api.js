const express = require('express');
const router = express.Router();

router.get("/", (req, res) =>{
    res.json({ok:true, msg: "Esto funciona"});
});

module.exports = router;
