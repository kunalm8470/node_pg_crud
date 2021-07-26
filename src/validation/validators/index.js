const { StatusCodes } = require('http-status-codes');
const Ajv = require('ajv').default;
const addFormats = require('ajv-formats').default;

const ajv = new Ajv({
    allErrors: true
});
addFormats(ajv);

// Cache the schemas
const createEmployeeSchema = require('../schema/employee/create.json');
const updateEmployeeSchema = require('../schema/employee/update.json');
ajv.addSchema(createEmployeeSchema, 'employee.create');
ajv.addSchema(updateEmployeeSchema, 'employee.update');

const validateJsonSchema = (name) => {
    return async (req, res, next) => {
        try {
            const validate = ajv.getSchema(name);
            await validate(req.body);
            next();
        } catch(err) {
            if (err instanceof Ajv.ValidationError) {
                const errors = err.errors.map(({
                    instancePath, 
                    params,
                    message
                }) => ({
                    instancePath, 
                    params,
                    message 
                }));

                return res.status(StatusCodes.BAD_REQUEST).json(errors);
            }

            return next(err);
        }
    };
};

module.exports = validateJsonSchema;
