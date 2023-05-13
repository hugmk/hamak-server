const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema(
    {
        name: { type: String },
        barcode: { type: String },
        brand: { type: String },
        imageUrl: { type: String },
        quantity: { type: String },
        mainCategory: { type: String },
        categories: [{ type: String }],
        certifications: { type: String },
        ingredients: { type: String },
        allergens: [{ type: String }],
        traces: [{ type: String }],
        additives: [{ type: String }],
        calculatedScore: { type: Number },
        nutriscoreScore: { type: Number },
        nutriscoreGrade: { type: String },
        ecoscoreScore: { type: Number },
        ecoscoreGrade: { type: String },
        novaGroup: { type: Number },
        nutrientLevelsReference: { type: String },
        energy_kcal_100g: { type: Number },
        fat_100g: { type: Number },
        saturated_fat_100g: { type: Number },
        carbohydrates_100g: { type: Number },
        sugars_100g: { type: Number },
        fiber_100g: { type: Number },
        proteins_100g: { type: Number },
        salt_100g: { type: Number },
        sodium_100g: { type: Number },
    },
    { collection: "products" }
);

module.exports = mongoose.model("Product", productSchema);