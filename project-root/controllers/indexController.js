const Supplier = require('../models/Supplier');
const Product = require('../models/Product');

module.exports = {
  home: async (req, res) => {
    try {
      const suppliers = await Supplier.find().sort({ name: 1 });
      // Show latest products
      const products = await Product.find().populate('supplier').sort({ createdAt: -1 }).limit(10);
      res.render('index', { suppliers, products });
    } catch (err) {
      console.error(err);
      res.render('index', { suppliers: [], products: [] });
    }
  }
};
