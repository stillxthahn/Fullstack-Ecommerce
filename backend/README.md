docker run --name mysql-container -e MYSQL_ROOT_PASSWORD=123456 -e MYSQL_DATABASE=mydb -p 3306:3306 -d mysql:8

ALB -> ASG -> API Gateway -> Lambda -> S3
		   -> ElastiCache -> RDS 
CloudWatch
mysql -u root -p123456

BACKUP docker exec mysql-container mysqldump -u root -p123456 mydb > ./mydb_dump.sql
docker exec -it mysql-container bash
**TABLE SCHEMA**
USER
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL
);


PRODUCTS
CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  imageURL TEXT,
  category VARCHAR(100),
  brand VARCHAR(100),
  price INT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

ORDERS
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  email VARCHAR(255) NOT NULL,
  order_date DATE,
  order_time TIME,
  order_amount DECIMAL(10, 2),
  order_status VARCHAR(50),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

ORDER_ITEMS
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INT REFERENCES orders(id),
  product_id VARCHAR(50),
  name VARCHAR(255),
  description TEXT,
  image_url TEXT,
  category VARCHAR(100),
  price DECIMAL(10, 2),
  quantity INT
);

shipping_addresses
CREATE TABLE shipping_addresses (
  id SERIAL PRIMARY KEY,
  order_id INT REFERENCES orders(id),
  name VARCHAR(255),
  phone VARCHAR(20),
  line1 VARCHAR(255),
  line2 VARCHAR(255),
  city VARCHAR(100),
  country VARCHAR(100),
  pin_code VARCHAR(20)
);