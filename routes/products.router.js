const express = require("express");
const controller = require("../controllers/products.controller");
const router = express.Router();

router.get("/:id", controller.getOne);
router.post("/search", controller.searchProducts);

module.exports = router;