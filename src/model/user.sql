-- DATABASE --
CREATE DATABASE crud_app;

-- USER TABLE --
CREATE TABLE users
(
	id VARCHAR(36) UNIQUE PRIMARY KEY,
	first_name VARCHAR(50),
	last_name VARCHAR(50),
	is_verified BOOLEAN DEFAULT FALSE,
	role ENUM('Admin', 'User'),
	email VARCHAR(100),
	phone_number VARCHAR(15),
	password VARCHAR(50)
);