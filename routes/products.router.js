const express = require("express");
const controller = require("../controllers/products.controller");
const router = express.Router();

router.get("/topProducts", controller.getTopProducts);
router.get("/alternatives/:category", controller.getAlternatives);

router.get("/search", controller.searchProducts);
router.get("/:id", controller.getOne);

module.exports = router;