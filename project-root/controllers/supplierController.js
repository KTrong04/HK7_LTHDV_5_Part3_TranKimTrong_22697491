const Supplier = require('../models/Supplier');

module.exports = {
  /**
   * @swagger
   * /suppliers:
   *   get:
   *     summary: Lấy danh sách nhà cung cấp
   *     tags: [Suppliers]
   *     responses:
   *       200:
   *         description: Trang danh sách nhà cung cấp
   */
  index: async (req, res) => {
    try {
      const suppliers = await Supplier.find().sort({ name: 1 });
      res.render('suppliers/index', { suppliers });
    } catch (err) {
      console.error(err);
      req.flash('error', 'Lỗi khi lấy danh sách nhà cung cấp.');
      res.redirect('/');
    }
  },

  /**
   * @swagger
   * /suppliers/create:
   *   get:
   *     summary: Hiển thị form tạo nhà cung cấp
   *     tags: [Suppliers]
   *     responses:
   *       200:
   *         description: Trang tạo nhà cung cấp
   */
  showCreate: (req, res) => {
    res.render('suppliers/form', { supplier: null });
  },

  /**
   * @swagger
   * /suppliers/create:
   *   post:
   *     summary: Tạo nhà cung cấp mới
   *     tags: [Suppliers]
   *     requestBody:
   *       required: true
   *       content:
   *         application/x-www-form-urlencoded:
   *           schema:
   *             type: object
   *             required: [name, address, phone]
   *             properties:
   *               name:
   *                 type: string
   *               address:
   *                 type: string
   *               phone:
   *                 type: string
   *     responses:
   *       302:
   *         description: Chuyển hướng về danh sách nhà cung cấp sau khi tạo thành công
   */
  create: async (req, res) => {
    try {
      const { name, address, phone } = req.body;
      const s = new Supplier({ name, address, phone });
      await s.save();
      req.flash('success', 'Tạo nhà cung cấp thành công.');
      res.redirect('/suppliers');
    } catch (err) {
      console.error(err);
      req.flash('error', 'Lỗi khi tạo nhà cung cấp.');
      res.redirect('/suppliers');
    }
  },

  /**
   * @swagger
   * /suppliers/{id}/edit:
   *   get:
   *     summary: Hiển thị form chỉnh sửa nhà cung cấp
   *     tags: [Suppliers]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: ID nhà cung cấp
   *     responses:
   *       200:
   *         description: Trang chỉnh sửa nhà cung cấp
   */
  showEdit: async (req, res) => {
    try {
      const supplier = await Supplier.findById(req.params.id);
      if (!supplier) {
        req.flash('error', 'Nhà cung cấp không tồn tại.');
        return res.redirect('/suppliers');
      }
      res.render('suppliers/form', { supplier });
    } catch (err) {
      console.error(err);
      req.flash('error', 'Lỗi khi truy xuất nhà cung cấp.');
      res.redirect('/suppliers');
    }
  },

  /**
   * @swagger
   * /suppliers/{id}/edit:
   *   post:
   *     summary: Cập nhật nhà cung cấp theo ID
   *     tags: [Suppliers]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: ID nhà cung cấp
   *     requestBody:
   *       required: true
   *       content:
   *         application/x-www-form-urlencoded:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *               address:
   *                 type: string
   *               phone:
   *                 type: string
   *     responses:
   *       302:
   *         description: Chuyển hướng về danh sách nhà cung cấp sau khi cập nhật
   */
  update: async (req, res) => {
    try {
      const { name, address, phone } = req.body;
      await Supplier.findByIdAndUpdate(req.params.id, { name, address, phone });
      req.flash('success', 'Cập nhật nhà cung cấp thành công.');
      res.redirect('/suppliers');
    } catch (err) {
      console.error(err);
      req.flash('error', 'Lỗi khi cập nhật nhà cung cấp.');
      res.redirect('/suppliers');
    }
  },

  /**
   * @swagger
   * /suppliers/{id}/delete:
   *   post:
   *     summary: Xóa nhà cung cấp theo ID
   *     tags: [Suppliers]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: ID nhà cung cấp cần xóa
   *     responses:
   *       302:
   *         description: Chuyển hướng về danh sách nhà cung cấp sau khi xóa
   */
  delete: async (req, res) => {
    try {
      await Supplier.findByIdAndDelete(req.params.id);
      req.flash('success', 'Xóa nhà cung cấp thành công.');
      res.redirect('/suppliers');
    } catch (err) {
      console.error(err);
      req.flash('error', 'Lỗi khi xóa nhà cung cấp.');
      res.redirect('/suppliers');
    }
  }
};
