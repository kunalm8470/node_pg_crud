const db = require('../db');

class EmployeeService {
    constructor() {
        this.getPage = this.getPage.bind(this);
        this.getHydrated = this.getHydrated.bind(this);
        this.getById = this.getById.bind(this);
        this.create = this.create.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
    }

    async getPage(page, limit, fullUrl) {
        const countSql = `SELECT n_live_tup::integer AS "total_count"
        FROM pg_stat_user_tables 
        WHERE relname = 'employees';`;

        const { rows: countRowsResult } = await db.query(countSql, []);
        const total_count = countRowsResult?.[0]?.total_count || 0;
        
        let pagedResponse = {
            pages: 0,
            first_page: '',
            last_page: '',
            prev_page: '',
            next_page: '',
            page_size: limit,
            total_count,
            data: []
        };

        if (total_count === 0) {
            return pagedResponse;
        }

        const sql = `SELECT emp.id as "id", 
        emp.name as "name",
        emp.code as "code",
        emp.salary as "salary",
        emp.hire_date as "hireDate",
        d1.id as "employeeDepartmentId",
        d1.name as "employeeDepartmentName",
        mgr.id as "managerId",
        mgr.name as "managerName",
        mgr.code as "managerCode",
        d2.id as "managerDepartmentId",
        d2.name as "managerDepartmentName",
        emp.created_at as "createdAt",
        emp.updated_at as "updatedAt"
        FROM employees emp
        LEFT JOIN employees mgr
        ON mgr.id = emp.manager_id
        LEFT JOIN departments d1
        ON emp.dept_id = d1.id
        LEFT JOIN departments d2
        ON mgr.dept_id = d2.id
        ORDER BY emp.id
        OFFSET $1
        LIMIT $2;`;

        const offset = (page - 1) * limit;
        const { rows } = await db.query(sql, [offset, limit]);
        const data = rows.map((row) => {
            const item = {
                id: row.id,
                name: row.name,
                salary: row.salary,
                hireDate: row.hireDate,
                department: {
                    id: row.employeeDepartmentId,
                    name: row.employeeDepartmentName
                }
            };
    
            if (row.managerId) {
                item.reportsTo = {
                    id: row.managerId,
                    name: row.managerName,
                    code: row.managerCode,
                    department: {
                        id: row.managerDepartmentId,
                        name: row.employeeDepartmentName
                    }
                };
            } else {
                item.reportsTo = null;
            }
    
            item.createdAt = row.createdAt;
            item.updatedAt = row.updatedAt;
    
            return item;
        });

        let queryParams = new URLSearchParams();
        
        const firstPageNo = 1;
        queryParams.set('page', firstPageNo);
        queryParams.set('limit', limit);
        const firstPageUrl = [fullUrl, '?', queryParams.toString()].join('');

        const lastPageNo = parseInt(Math.ceil(total_count / limit), 10);
        queryParams.set('page', lastPageNo);
        queryParams.set('limit', limit);
        const lastPageUrl = [fullUrl, '?', queryParams.toString()].join('');

        const prevPageNo = (page > firstPageNo) ? page - 1 : firstPageNo;
        queryParams.set('page', prevPageNo);
        queryParams.set('limit', limit);
        const prevPageUrl = [fullUrl, '?', queryParams.toString()].join('');

        const nextPageNo = (page < lastPageNo) ? page + 1 : lastPageNo;
        queryParams.set('page', nextPageNo);
        queryParams.set('limit', limit);
        const nextPageUrl = [fullUrl, '?', queryParams.toString()].join('');

        pagedResponse = {
            pages: lastPageNo,
            first_page: firstPageUrl,
            last_page: lastPageUrl,
            prev_page: prevPageUrl,
            next_page: nextPageUrl,
            page_size: limit,
            total_count,
            data
        };

        return pagedResponse;
    }

    async getHydrated(id) {
        /*
            1. Left join employee with itself to get manager details
            2. Left join employee with department to get employee department details
            3. Left join employee with department to get manager department details
        */
        const sql = `SELECT emp.id as "id", 
                        emp.name as "name",
                        emp.code as "code",
                        emp.salary as "salary",
                        emp.hire_date as "hireDate",
                        d1.id as "employeeDepartmentId",
                        d1.name as "employeeDepartmentName",
                        mgr.id as "managerId",
                        mgr.name as "managerName",
						mgr.code as "managerCode",
                        d2.id as "managerDepartmentId",
                        d2.name as "managerDepartmentName",
                        emp.created_at as "createdAt",
                        emp.updated_at as "updatedAt"
                        FROM employees emp
                        LEFT JOIN employees mgr
                        ON mgr.id = emp.manager_id
                        LEFT JOIN departments d1
                        ON emp.dept_id = d1.id
                        LEFT JOIN departments d2
                        ON mgr.dept_id = d2.id
                        WHERE emp.id = $1`;

        const { rows } = await db.query(sql, [id]);
        const row = rows?.[0];

        const item = {
            id: row.id,
            name: row.name,
            salary: row.salary,
            hireDate: row.hireDate,
            department: {
                id: row.employeeDepartmentId,
                name: row.employeeDepartmentName
            }
        };

        if (row.managerId) {
            item.reportsTo = {
                id: row.managerId,
                name: row.managerName,
                code: row.managerCode,
                department: {
                    id: row.managerDepartmentId,
                    name: row.employeeDepartmentName
                }
            };
        } else {
            item.reportsTo = null;
        }

        item.createdAt = row.createdAt;
        item.updatedAt = row.updatedAt;

        return item;
    }

    async getById(id) {
        const sql = `SELECT emp.id as "id", 
        emp.name as "name",
        emp.code as "code",
        emp.salary as "salary",
        emp.hire_date as "hireDate",
        emp.dept_id as "deptId",
        emp.manager_id as "managerId",
        emp.created_at as "createdAt",
        emp.updated_at as "updatedAt"
        FROM employees emp
        WHERE emp.id = $1`;

        const { rows } = await db.query(sql, [id]);
        return rows?.[0];
    }

    async create(doc) {
        const sql = `INSERT INTO employees
                    (name, code, salary, hire_date, manager_id, dept_id, created_at) 
                    VALUES ($1, $2, $3, $4, $5, $6, current_timestamp at time zone 'utc')
                    RETURNING *;`;

        const { rows } = await db.query(sql, [doc.name, doc.code, doc.salary, doc.hireDate, doc.managerId, doc.deptId]);
        return rows?.[0];
    }

    async update(id, doc) {
        const sql = `UPDATE employees
                    SET name = $2,
                    code = $3,
                    salary = $4,
                    manager_id = $5,
                    dept_id = $6,
                    updated_at = current_timestamp at time zone 'utc'
                    WHERE id = $1
                    RETURNING *;`;

        const { rows } = await db.query(sql, [id, doc.name, doc.code, doc.salary, doc.managerId, doc.deptId]);
        return rows?.[0];
    }

    delete(id) {
        const sql = `DELETE 
                    FROM employees emp
                    WHERE emp.id = $1;`;

        return db.query(sql, [id]);
    }
}

module.exports = new EmployeeService();