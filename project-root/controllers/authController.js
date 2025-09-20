const User = require('../models/User');

module.exports = {
  /**
   * @swagger
   * /auth/register:
   *   get:
   *     summary: Hiển thị form đăng ký
   *     tags: [Auth]
   *     responses:
   *       200:
   *         description: Trang đăng ký người dùng
   */
  showRegister: (req, res) => {
    res.render('register');
  },

  /**
   * @swagger
   * /auth/register:
   *   post:
   *     summary: Đăng ký tài khoản mới
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/x-www-form-urlencoded:
   *           schema:
   *             type: object
   *             required: [username, password, email]
   *             properties:
   *               username:
   *                 type: string
   *               password:
   *                 type: string
   *               email:
   *                 type: string
   *               phone:
   *                 type: string
   *     responses:
   *       302:
   *         description: Chuyển hướng về trang login sau khi đăng ký thành công
   */
  register: async (req, res) => {
    try {
      const { username, password, email, phone } = req.body;
      if (!username || !password || !email) {
        req.flash('error', 'Vui lòng điền đầy đủ thông tin bắt buộc.');
        return res.redirect('/register');
      }
      const existing = await User.findOne({ $or: [{ username }, { email }] });
      if (existing) {
        req.flash('error', 'Tên đăng nhập hoặc email đã tồn tại.');
        return res.redirect('/register');
      }
      const user = new User({ username, email, phone });
      await user.setPassword(password);
      await user.save();
      req.flash('success', 'Đăng ký thành công. Vui lòng đăng nhập.');
      res.redirect('/login');
    } catch (err) {
      console.error(err);
      req.flash('error', 'Lỗi máy chủ khi đăng ký.');
      res.redirect('/register');
    }
  },

  /**
   * @swagger
   * /auth/login:
   *   get:
   *     summary: Hiển thị form đăng nhập
   *     tags: [Auth]
   *     responses:
   *       200:
   *         description: Trang đăng nhập
   */
  showLogin: (req, res) => {
    res.render('login');
  },

  /**
   * @swagger
   * /auth/login:
   *   post:
   *     summary: Đăng nhập tài khoản
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/x-www-form-urlencoded:
   *           schema:
   *             type: object
   *             required: [username, password]
   *             properties:
   *               username:
   *                 type: string
   *               password:
   *                 type: string
   *     responses:
   *       302:
   *         description: Chuyển hướng về trang chủ khi đăng nhập thành công
   */
  login: async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });
      if (!user) {
        req.flash('error', 'Tên đăng nhập không tồn tại.');
        return res.redirect('/login');
      }
      const valid = await user.validatePassword(password);
      if (!valid) {
        req.flash('error', 'Mật khẩu không đúng.');
        return res.redirect('/login');
      }
      // set session
      req.session.user = {
        id: user._id,
        username: user.username,
        email: user.email
      };
      req.flash('success', 'Đăng nhập thành công.');
      res.redirect('/');
    } catch (err) {
      console.error(err);
      req.flash('error', 'Lỗi máy chủ khi đăng nhập.');
      res.redirect('/login');
    }
  },

  /**
   * @swagger
   * /auth/logout:
   *   get:
   *     summary: Đăng xuất người dùng
   *     tags: [Auth]
   *     responses:
   *       302:
   *         description: Chuyển hướng về trang chủ sau khi logout
   */
  logout: (req, res) => {
    req.session.destroy(err => {
      res.clearCookie('connect.sid');
      res.redirect('/');
    });
  },

  /**
   * @swagger
   * /auth/forgot:
   *   get:
   *     summary: Hiển thị form quên mật khẩu
   *     tags: [Auth]
   *     responses:
   *       200:
   *         description: Trang quên mật khẩu
   */
  showForgot: (req, res) => {
    res.render('forgot');
  },

  /**
   * @swagger
   * /auth/forgot:
   *   post:
   *     summary: Đặt lại mật khẩu mới cho tài khoản
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/x-www-form-urlencoded:
   *           schema:
   *             type: object
   *             required: [email, newPassword]
   *             properties:
   *               email:
   *                 type: string
   *               newPassword:
   *                 type: string
   *     responses:
   *       302:
   *         description: Chuyển hướng về trang login sau khi đặt lại mật khẩu
   */
  resetPassword: async (req, res) => {
    try {
      const { email, newPassword } = req.body;
      if (!email || !newPassword) {
        req.flash('error', 'Vui lòng điền email và mật khẩu mới.');
        return res.redirect('/forgot');
      }
      const user = await User.findOne({ email });
      if (!user) {
        req.flash('error', 'Email không tồn tại.');
        return res.redirect('/forgot');
      }
      await user.setPassword(newPassword);
      await user.save();
      req.flash('success', 'Đặt lại mật khẩu thành công. Vui lòng đăng nhập.');
      res.redirect('/login');
    } catch (err) {
      console.error(err);
      req.flash('error', 'Lỗi khi đặt lại mật khẩu.');
      res.redirect('/forgot');
    }
  }
};
