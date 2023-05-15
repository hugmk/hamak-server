const Product = require("../models/products.model");

var controller = {
    getOne: async (req, res, next) => {
        try {
          let product = await Product.findById(req.params.id);
          res.json(product);
        }
        catch(err) {
          console.log(err);
          next(err);
        }
    },

    searchProducts: async (req, res, next) => {
        try {
            const { q, page = 1, limit = 10 } = req.body;
            const regex = new RegExp(q, 'i');
        
            const products = await Product.find({
                $or: [
                    { name: regex },
                    { brand: regex },
                    { mainCategory: regex },
                    { barcode: regex }
                ]
            })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));
        
            const count = await Product.countDocuments({
                $or: [
                    { name: regex },
                    { brand: regex },
                    { mainCategory: regex },
                    { barcode: regex }
                ]
            });
        
            res.json({
                products,
                totalPages: Math.ceil(count / limit),
                currentPage: parseInt(page)
            });
        } catch (err) {
            console.log(err);
            next(err);
        }
    },
};

module.exports = controller;