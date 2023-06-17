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
            const { q, page = 1, limit = 10, sort } = req.query;

            const keywordArray = q.split(' ');
            const searchConditions = keywordArray.map(keyword => ({
              $or: [
                { name: { $regex: keyword, $options: 'i' } },
                { brand: { $regex: keyword, $options: 'i' } },
                { mainCategory: { $regex: keyword, $options: 'i' } },
                { barcode: { $regex: keyword, $options: 'i' } }
              ]
            }));

            let products;
            if(sort) {
              console.log("has sorting");
              const sortOption = sort === 'desc' ? -1 : 1;
              products = await Product.find({ $and: searchConditions })
              .sort({ calculatedScore: sortOption })
              .skip((page - 1) * limit)
              .limit(parseInt(limit));
            }
            else {
              console.log("no sorting");
              products = await Product.find({ $and: searchConditions })
              .skip((page - 1) * limit)
              .limit(parseInt(limit));
            }

            const count = await Product.countDocuments({ $and: searchConditions });
        
            res.json({
                products,
                totalPages: Math.ceil(count / limit),
                currentPage: parseInt(page),
                totalProducts: count,
                sort: sort
            });
        } catch (err) {
            console.log(err);
            next(err);
        }
    },

    getTopProducts: async (req, res, next) => {
        try {
          let products = await Product.aggregate([
            { $match: { calculatedScore: { $gt: 90 }, image: { $ne: '' } } },
            { $sample: { size: 6 } },
          ]);
          console.log(products);

          res.json(products);
        }
        catch(err) {
          console.log(err);
          next(err);
        }
    },

    getAlternatives: async (req, res, next) => {
        try {
          const category = req.params.category;
          let products = await Product.find({
            calculatedScore: { $gt: 50 },
            mainCategory: category
          })
          .sort({ calculatedScore: -1 })
          .limit(5);
          res.json(products);
        }
        catch(err) {
          console.log(err);
          next(err);
        }
    },
};

module.exports = controller;