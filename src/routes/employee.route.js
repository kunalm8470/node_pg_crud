const { Router } = require('express');
const validate = require('../validation/validators');
const employeeController = require('../controllers/employee.controller');
const router = Router();

router.get('/', employeeController.list);
router.get('/:id', employeeController.get);
router.post('/', validate('employee.create'), employeeController.create);
router.put('/:id', validate('employee.update'), employeeController.update);
router.patch('/:id', employeeController.patch);
router.delete('/:id', employeeController.delete);

module.exports = router;
