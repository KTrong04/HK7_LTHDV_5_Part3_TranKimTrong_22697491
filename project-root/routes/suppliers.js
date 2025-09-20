const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplierController');
const { ensureAuthenticated } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   - name: Suppliers
 *     description: Supplier management
 */

/**
 * @swagger
 * /suppliers:
 *   get:
 *     summary: List suppliers
 *     tags: [Suppliers]
 */
router.get('/', supplierController.index);

// Protected CRUD for admin (login required)
router.get('/create', ensureAuthenticated, supplierController.showCreate);
router.post('/create', ensureAuthenticated, supplierController.create);

router.get('/edit/:id', ensureAuthenticated, supplierController.showEdit);
router.post('/edit/:id', ensureAuthenticated, supplierController.update);

router.post('/delete/:id', ensureAuthenticated, supplierController.delete);

module.exports = router;
