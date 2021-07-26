const { JsonPatchError, applyPatch } = require('fast-json-patch');
const { StatusCodes } = require('http-status-codes');
const employeeService = require('../services/employee.service');
const { postgres: { errorCodes } } = require('../config');

class EmployeeController {
    constructor() {
        this.list = this.list.bind(this);
        this.get = this.get.bind(this);
        this.create = this.create.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
        this.patch = this.patch.bind(this);
    }

    async list(req, res, next) {
        try {
            let { page } = req.query;
            page = parseInt(page, 10) || 1;

            let { limit } = req.query;
            limit = parseInt(limit, 10) || 10;

            const fullUrl = [req.protocol, '://', req.get('host'), req.baseUrl, req.path].join('');
            const pageData = await employeeService.getPage(page, limit, fullUrl);

            res.set({
                'X-Pagination-Per-Page': limit,
                'X-Pagination-Current-Page': page,
                'X-Pagination-Total-Pages': pageData.pages,
                'X-Pagination-Total-Entries': pageData.total_count
            });

            return res.status(StatusCodes.OK).json(pageData);
        } catch(err) {
            return next(err);
        }
    }

    async get(req, res, next) {
        try {
            let { id: employeeId } = req.params;
            employeeId = parseInt(employeeId, 10);

            const employee = await employeeService.getHydrated(employeeId);
            if (!employee) {
                return res.status(StatusCodes.NOT_FOUND).end();
            }

            return res.status(StatusCodes.OK).json(employee);
        } catch (err) {
            return next(err);
        }
    }

    async create(req, res, next) {
        try {
            const created = await employeeService.create(req.body);

            // Set location header to newly created resource
            const resourceUrl = [req.protocol, '://', req.get('host'), req.baseUrl, req.path, created.id].join('');
            res.location(resourceUrl);

            return res.status(StatusCodes.CREATED).json(created);
        } catch (err) {
            if (err.code === errorCodes.uniqueViolation) {
                return res.status(StatusCodes.CONFLICT).json({
                    message: 'Duplicate entity'
                });
            }

            return next(err);
        }
    }

    async update(req, res, next) {
        try {
            let { id: employeeId } = req.params;
            employeeId = parseInt(employeeId, 10);

            const updated = await employeeService.update(employeeId, req.body);
            return res.status(StatusCodes.OK).json(updated);
        } catch (err) {
            return next(err);
        }
    }

    async delete(req, res, next) {
        try {
            let { id: employeeId } = req.params;
            employeeId = parseInt(employeeId, 10);

            await employeeService.delete(employeeId);
            return res.status(StatusCodes.NO_CONTENT).end();
        } catch(err) {
            return next(err);
        }
    }

    async patch(req, res, next) {
        try {
            let { id: employeeId } = req.params;
            employeeId = parseInt(employeeId, 10);

            const employee = await employeeService.getById(employeeId);
            if (!employee) {
                return res.status(StatusCodes.NOT_FOUND).end();
            }

            const { newDocument } = applyPatch(employee, req.body, true, false);
            const updated = await employeeService.update(employeeId, newDocument);
            return res.status(StatusCodes.OK).json(updated);
        } catch(err) {
            if (err instanceof JsonPatchError) {
                const errors = {
                    message: 'Malformed patch',
                    detailed: err
                };
                return res.status(StatusCodes.BAD_REQUEST).json(errors);
            }

            return next(err);
        }
    }
}

module.exports = new EmployeeController();
