# Node.js reference application using node-postgres and PostgresSQL

Sample barebone application using [`Express.js`](https://expressjs.com/), [`node-postgres`](https://node-postgres.com/), [`dotenv`](https://github.com/motdotla/dotenv#readme), [`ajv`](https://ajv.js.org/), [`ajv-format`](https://github.com/ajv-validator/ajv-formats#readme), [`fast-json-patch`](https://github.com/Starcounter-Jack/JSON-Patch) and using PostgresSQL as persistence.

<hr>

This application deals with 2 entities employees and their associated departments.

**Sample structure of departments table** -

<table>
    <thead>
        <tr>
            <th>id</th>
            <th>name</th>
            <th>created_at</th>
            <th>update_at</th>
        </tr>
    </thead>
    <tbody>
    <tr>
        <td>1</td>
        <td>Human Resources</td>
        <td>2021-07-26 18:33:32.48293</td>
        <td>null</td>
    </tr>
    </tbody>
</table>

**Sample structure of employees table** -

<table>
    <thead>
        <tr>
            <th>id</th>
            <th>name</th>
            <th>code</th>
            <th>salary</th>
            <th>hire_date</th>
            <th>manager_id</th>
            <th>dept_id</th>
            <th>created_at</th>
            <th>update_at</th>
        </tr>
    </thead>
    <tbody>
    <tr>
        <td>10</td>
        <td>Marsha Heers</td>
        <td>EM0010</td>
        <td>61192.38</td>
        <td>2011-03-31</td>
        <td>3</td>
        <td>3</td>
        <td>2021-07-26 18:33:45.171566</td>
        <td>null</td>
    </tr>
    </tbody>
</table>

<hr>

<br>

Restful endpoints allow for -

1. Paging `/api/employees?page=1&limit=10`
2. Get single by id `/api/employees/10`
3. Creating `/api/employees`
4. Updating `/api/employees/7`
4. Deleting `/api/employees/7`
5. Patching `/api/employees/7`

<hr>


- To run - `npm install`
- To start the server - `npm start`
- Seed script [`here`](./src/db/seed.sql) to get up and running quickly.
- Postman [`collection`](https://www.getpostman.com/collections/5597e5aaf7d855d241ea) and [`environment variables`](./Local.postman_environment.json) here.