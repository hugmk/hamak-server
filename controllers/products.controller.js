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

    getBIAnalysis: async (req, res, next) => {
        try {
          const category = req.params.category;
          console.log(category);
          let bestProducts = await Product.find({
            calculatedScore: { $gt: 0 },
            mainCategory: category
          })
          .sort({ calculatedScore: -1 })
          .limit(5);

          let worstProducts = await Product.find({
            calculatedScore: { $gt: 0 },
            mainCategory: category
          })
          .sort({ calculatedScore: 1 })
          .limit(5);

          const averagesPipeline = [
            {
              $match: {
                calculatedScore: { $ne: null },
                mainCategory: category
              }
            },
            {
              $group: {
                _id: null,
                averageScore: { $avg: "$calculatedScore" },
                averageProteins: { $avg: "$proteins_100g" },
                averageSalt: { $avg: "$salt_100g" },
                averageSodium: { $avg: "$sodium_100g" },
                averageSugars: { $avg: "$sugars_100g" },
                averageFiber: { $avg: "$fiber_100g" },
                averageFat: { $avg: "$fat_100g" },
                averageSaturatedFat: { $avg: "$saturated_fat_100g" },
                averageCarbohydrates: { $avg: "$carbohydrates_100g" },
                averageEcoscore: { $avg: "$ecoscoreScore" },
                averageEnergyKcal: { $avg: "$energy_kcal_100g" }
              }
            }
          ];
          const averageScoreResult = await Product.aggregate(averagesPipeline);

          let result = {
            "bestProducts": bestProducts,
            "worstProducts": worstProducts,
            "averages": {
              averageScore: averageScoreResult.length > 0 ? averageScoreResult[0].averageScore : 0,
              averageEcoscore: averageScoreResult.length > 0 ? averageScoreResult[0].averageEcoscore : 0,
              averageEnergyKcal: averageScoreResult.length > 0 ? averageScoreResult[0].averageEnergyKcal : 0,
              averageFat: averageScoreResult.length > 0 ? averageScoreResult[0].averageFat : 0,
              averageSaturatedFat: averageScoreResult.length > 0 ? averageScoreResult[0].averageSaturatedFat : 0,
              averageCarbohydrates: averageScoreResult.length > 0 ? averageScoreResult[0].averageCarbohydrates : 0,
              averageSugars: averageScoreResult.length > 0 ? averageScoreResult[0].averageSugars : 0,
              averageProteins: averageScoreResult.length > 0 ? averageScoreResult[0].averageProteins : 0,
              averageFiber: averageScoreResult.length > 0 ? averageScoreResult[0].averageFiber : 0,
              averageSalt: averageScoreResult.length > 0 ? averageScoreResult[0].averageSalt : 0,
              averageSodium: averageScoreResult.length > 0 ? averageScoreResult[0].averageSodium : 0,
            }
          }

          res.json(result);
        }
        catch(err) {
          console.log(err);
          next(err);
        }
    },
};

module.exports = controller;