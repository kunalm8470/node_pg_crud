DROP DATABASE IF EXISTS fake_org;
CREATE DATABASE fake_org;

\connect fake_org;

DROP TABLE IF EXISTS departments;
DROP TABLE IF EXISTS employees;

CREATE TABLE departments (
  id serial primary key not null,
  name character varying(500) not null,
  created_at timestamp without time zone not null,
  updated_at timestamp without time zone
);

INSERT INTO departments(name, created_at) VALUES('Human Resources', current_timestamp at time zone 'utc');
INSERT INTO departments(name, created_at) VALUES('Finance', current_timestamp at time zone 'utc');
INSERT INTO departments(name, created_at) VALUES('Engineering', current_timestamp at time zone 'utc');

CREATE TABLE employees (
  id serial primary key,
  name character varying(500) not null,
  code character varying(6) not null,
  salary decimal(10, 2) not null,
  hire_date date not null,
  manager_id int,
  dept_id int,
  created_at timestamp without time zone not null,
  updated_at timestamp without time zone,
  constraint fk_mgrId FOREIGN KEY (manager_id) REFERENCES employees (id),
  constraint fk_deptid FOREIGN KEY(dept_id) REFERENCES departments(id)
);

CREATE UNIQUE INDEX idx_emp_code ON employees(code);

INSERT INTO employees (name, code, salary, hire_date, manager_id, dept_id, created_at) VALUES ('Burk Tyrwhitt', 'EM0001', '81879.39', '2009-04-17', NULL, 3, current_timestamp at time zone 'utc');
INSERT INTO employees (name, code, salary, hire_date, manager_id, dept_id, created_at) VALUES ('Walden McGonigle', 'EM0002', '64616.22', '2002-05-12', 1, 2, current_timestamp at time zone 'utc');
INSERT INTO employees (name, code, salary, hire_date, manager_id, dept_id, created_at) VALUES ('Trish Vasyanin', 'EM0003', '01338.90', '2011-04-21', 1, 3, current_timestamp at time zone 'utc');
INSERT INTO employees (name, code, salary, hire_date, manager_id, dept_id, created_at) VALUES ('Sindee Gates', 'EM0004', '75202.66', '2011-07-02', 2, 2, current_timestamp at time zone 'utc');
INSERT INTO employees (name, code, salary, hire_date, manager_id, dept_id, created_at) VALUES ('Claudio Margaritelli', 'EM0005', '21239.97', '2014-06-02', 2, 3, current_timestamp at time zone 'utc');
INSERT INTO employees (name, code, salary, hire_date, manager_id, dept_id, created_at) VALUES ('Flss Pattingson', 'EM0006', '45276.57', '2001-02-26', 3, 3, current_timestamp at time zone 'utc');
INSERT INTO employees (name, code,  salary, hire_date, manager_id, dept_id, created_at) VALUES ('Christa McDaid', 'EM0007', '56914.24', '2011-07-11', 3, 2, current_timestamp at time zone 'utc');
INSERT INTO employees (name, code, salary, hire_date, manager_id, dept_id, created_at) VALUES ('Dacia Bettlestone', 'EM0008', '81155.20', '2010-02-26', 3, 3, current_timestamp at time zone 'utc');
INSERT INTO employees (name, code, salary, hire_date, manager_id, dept_id, created_at) VALUES ('Augie Northfield', 'EM0009', '72201.42', '2015-10-23', 3, 3, current_timestamp at time zone 'utc');
INSERT INTO employees (name, code, salary, hire_date, manager_id, dept_id, created_at) VALUES ('Marsha Heers', 'EM0010', '61192.38', '2011-03-31', 3, 3, current_timestamp at time zone 'utc');