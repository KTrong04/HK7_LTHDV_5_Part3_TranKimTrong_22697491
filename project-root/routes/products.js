const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { ensureAuthenticated } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   - name: Products
 *     description: Product management
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: List products
 *     tags: [Products]
 */
router.get('/', productController.index);

// Protected CRUD
router.get('/create', ensureAuthenticated, productController.showCreate);
router.post('/create', ensureAuthenticated, productController.create);

router.get('/edit/:id', ensureAuthenticated, productController.showEdit);
router.post('/edit/:id', ensureAuthenticated, productController.update);

router.post('/delete/:id', ensureAuthenticated, productController.delete);

module.exports = router;
