const Product = require('../models/Product');
const Supplier = require('../models/Supplier');

module.exports = {
  /**
   * @swagger
   * /products:
   *   get:
   *     summary: Lấy danh sách sản phẩm (có thể lọc theo nhà cung cấp hoặc tên)
   *     tags: [Products]
   *     parameters:
   *       - in: query
   *         name: supplier
   *         schema:
   *           type: string
   *         description: ID nhà cung cấp để lọc sản phẩm
   *       - in: query
   *         name: q
   *         schema:
   *           type: string
   *         description: Từ khóa tìm kiếm theo tên sản phẩm
   *     responses:
   *       200:
   *         description: Trang danh sách sản phẩm
   */
  index: async (req, res) => {
    try {
      const { supplier: supplierFilter, q } = req.query;

      const filter = {};
      if (supplierFilter) filter.supplier = supplierFilter;
      if (q) filter.name = new RegExp(q, 'i');

      const products = await Product.find(filter).populate('supplier').sort({ createdAt: -1 });
      const suppliers = await Supplier.find().sort({ name: 1 });
      res.render('products/index', { products, suppliers, q, supplierFilter });
    } catch (err) {
      console.error(err);
      req.flash('error', 'Lỗi khi lấy danh sách sản phẩm.');
      res.redirect('/');
    }
  },

  /**
   * @swagger
   * /products/create:
   *   get:
   *     summary: Hiển thị form tạo sản phẩm
   *     tags: [Products]
   *     responses:
   *       200:
   *         description: Trang tạo sản phẩm
   */
  showCreate: async (req, res) => {
    const suppliers = await Supplier.find().sort({ name: 1 });
    res.render('products/form', { product: null, suppliers });
  },

  /**
   * @swagger
   * /products/create:
   *   post:
   *     summary: Tạo sản phẩm mới
   *     tags: [Products]
   *     requestBody:
   *       required: true
   *       content:
   *         application/x-www-form-urlencoded:
   *           schema:
   *             type: object
   *             required: [name, price, quantity, supplier]
   *             properties:
   *               name:
   *                 type: string
   *               price:
   *                 type: number
   *               quantity:
   *                 type: integer
   *               supplier:
   *                 type: string
   *     responses:
   *       302:
   *         description: Chuyển hướng về danh sách sản phẩm sau khi tạo thành công
   */
  create: async (req, res) => {
    try {
      const { name, price, quantity, supplier } = req.body;
      const p = new Product({
        name,
        price: parseFloat(price) || 0,
        quantity: parseInt(quantity) || 0,
        supplier
      });
      await p.save();
      req.flash('success', 'Tạo sản phẩm thành công.');
      res.redirect('/products');
    } catch (err) {
      console.error(err);
      req.flash('error', 'Lỗi khi tạo sản phẩm.');
      res.redirect('/products');
    }
  },

  /**
   * @swagger
   * /products/{id}/edit:
   *   get:
   *     summary: Hiển thị form chỉnh sửa sản phẩm
   *     tags: [Products]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: ID sản phẩm
   *     responses:
   *       200:
   *         description: Trang chỉnh sửa sản phẩm
   */
  showEdit: async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      const suppliers = await Supplier.find().sort({ name: 1 });
      if (!product) {
        req.flash('error', 'Sản phẩm không tồn tại.');
        return res.redirect('/products');
      }
      res.render('products/form', { product, suppliers });
    } catch (err) {
      console.error(err);
      req.flash('error', 'Lỗi khi truy xuất sản phẩm.');
      res.redirect('/products');
    }
  },

  /**
   * @swagger
   * /products/{id}/edit:
   *   post:
   *     summary: Cập nhật sản phẩm theo ID
   *     tags: [Products]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: ID sản phẩm
   *     requestBody:
   *       required: true
   *       content:
   *         application/x-www-form-urlencoded:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *               price:
   *                 type: number
   *               quantity:
   *                 type: integer
   *               supplier:
   *                 type: string
   *     responses:
   *       302:
   *         description: Chuyển hướng về danh sách sản phẩm sau khi cập nhật thành công
   */
  update: async (req, res) => {
    try {
      const { name, price, quantity, supplier } = req.body;
      await Product.findByIdAndUpdate(req.params.id, {
        name,
        price: parseFloat(price) || 0,
        quantity: parseInt(quantity) || 0,
        supplier
      });
      req.flash('success', 'Cập nhật sản phẩm thành công.');
      res.redirect('/products');
    } catch (err) {
      console.error(err);
      req.flash('error', 'Lỗi khi cập nhật sản phẩm.');
      res.redirect('/products');
    }
  },

  /**
   * @swagger
   * /products/{id}/delete:
   *   post:
   *     summary: Xóa sản phẩm theo ID
   *     tags: [Products]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: ID sản phẩm cần xóa
   *     responses:
   *       302:
   *         description: Chuyển hướng về danh sách sản phẩm sau khi xóa
   */
  delete: async (req, res) => {
    try {
      await Product.findByIdAndDelete(req.params.id);
      req.flash('success', 'Xóa sản phẩm thành công.');
      res.redirect('/products');
    } catch (err) {
      console.error(err);
      req.flash('error', 'Lỗi khi xóa sản phẩm.');
      res.redirect('/products');
    }
  }
};
