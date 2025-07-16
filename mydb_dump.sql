-- MySQL dump 10.13  Distrib 8.4.5, for Linux (x86_64)
--
-- Host: localhost    Database: mydb
-- ------------------------------------------------------
-- Server version	8.4.5

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `order_id` int DEFAULT NULL,
  `product_id` varchar(50) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `description` text,
  `image_url` text,
  `category` varchar(100) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT INTO `order_items` VALUES (1,5,'23','man tshirt','The fabric is soft and breathable, making it comfortable to wear throughout the day. Customers appreciate the quality of the material, noting that it holds up well after multiple washes without fading or losing shape. The colors are vibrant and true to the pictures shown online.','https://d-ec-product.s3.us-east-1.amazonaws.com/uploads/22.avif','Fashion',499.00,1),(2,6,'31','Apple MacBook Pro 13-inch 2022','Apple MacBook Pro 13-inch 2022 is a macOS laptop with a 13.30-inch display. It is powered by a Apple M2 processor and it comes with 8GB of RAM. The Apple MacBook Pro 13-inch 2022 packs 256GB of SSD storage . Connectivity options include Wi-Fi 802.11 a/b/g/n/ac and it comes with 2 USB ports, Thunderbolt 4 (Type C), Headphone and Mic Combo Jack ports.','https://d-ec-product.s3.us-east-1.amazonaws.com/uploads/30.png','Laptop',56000.00,2),(3,7,'27','Mens Casual Slim Fit','The color could be slightly different between on the screen and in practice. / Please note that body builds vary by person, therefore, detailed size information should be reviewed below on the product description.','https://d-ec-product.s3.us-east-1.amazonaws.com/uploads/26.jpg','Fashion',3999.00,1),(4,7,'28','Mens Cotton Jacket','The color could be slightly different between on the screen and in practice. / Please note that body builds vary by person, therefore, detailed size information should be reviewed below on the product description.','https://d-ec-product.s3.us-east-1.amazonaws.com/uploads/27.jpg','Fashion',5999.00,1),(5,7,'29','Casual Premium Slim Fit T-Shirts','Slim-fitting style, contrast raglan long sleeve, three-button henley placket, light weight & soft fabric for breathable and comfortable wearing. And Solid stitched shirts with round neck made for durability and a great fit for casual fashion wear and diehard baseball fans. The Henley style round neckline includes a three-button placket','https://d-ec-product.s3.us-east-1.amazonaws.com/uploads/28.jpg','Fashion',4999.00,1),(6,7,'34','RUSTIC CHARM','New range of formal shirts are designed keeping you in mind. With fits and styling that will make you stand apart','https://d-ec-product.s3.us-east-1.amazonaws.com/uploads/33.jpg','Fashion',6000.00,1);
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `email` varchar(255) NOT NULL,
  `order_date` date DEFAULT NULL,
  `order_time` time DEFAULT NULL,
  `order_amount` decimal(10,2) DEFAULT NULL,
  `order_status` varchar(50) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (5,1,'lxthanh235@gmail.com','2025-06-23','11:47:15',499.00,'Order Placed','2025-06-23 04:47:15'),(6,1,'lxthanh235@gmail.com','2025-06-25','01:09:21',112000.00,'Item(s) Shipped','2025-06-25 18:09:21'),(7,1,'lxthanh235@gmail.com','2025-06-25','01:27:12',20997.00,'Processing...','2025-06-25 18:27:12');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text,
  `imageURL` text,
  `category` varchar(100) DEFAULT NULL,
  `brand` varchar(100) DEFAULT NULL,
  `price` int DEFAULT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (2,'Stainless Steel','Stainless Steel Gold 2-Piece Jewelry Set (Necklace and Earrings) Anti Tarnish I Premium Gold Plating Price, product page889 M.R.P: 1,899M.R.P: 1,899 (','https://d-ec-product.s3.us-east-1.amazonaws.com/uploads/1.webp','Jewelery','Stainless',1900,'2025-06-22 17:17:14'),(3,'Shining Diva','Shining Diva Fashion\nLatest Stylish Fancy Pearl Choker Traditional Jewellery Set for Women | Temple Necklace Set | Festive Wedding Party Necklace | 22k Gold Plated | Just Like Original Gold Jewellery\n3.9 out of 5 stars 1,274','https://d-ec-product.s3.us-east-1.amazonaws.com/uploads/2.webp','Jewelery','Temple Necklace Set',1500,'2025-06-22 17:17:14'),(4,'Generic','Generic\nTraditional Kundan Earrings and Tikka Set, Silver Plated with Pink Beads, Wedding Jewellery\nPrice, product page969 M.R.P: 1,449','https://d-ec-product.s3.us-east-1.amazonaws.com/uploads/3.webp','Jewelery','Kundan Earrings',1500,'2025-06-22 17:17:14'),(5,'JD FRESH 5 Tier Wooden Wall Shleves','JD FRESH 5 Tier Wooden Wall Shleves','https://d-ec-product.s3.us-east-1.amazonaws.com/uploads/4.webp','Jewelery','zenem',329,'2025-06-22 17:17:14'),(6,'JD FRESH 5 Tier Wooden Wall','JD FRESH 5 Tier Wooden Wall Shleves for Bed Room/Stylish Corner Hanging Shelf/Wall Decoration Organizer for Living Room/Zig Zag Home Decor Floating Display Rack/Showpiece/Idols/Photo Frames(Brown) 3.8 out of 5 stars 165','https://d-ec-product.s3.us-east-1.amazonaws.com/uploads/5.webp','Furniture','JD FRESH 5 Tier Wooden Wall Shleves',900,'2025-06-22 17:17:14'),(7,'CoolLeaf Soft Plastic Wardrob','CoolLeaf Soft Plastic Wardrobe for Clothes, Kids Almirah for Clothes - 8 Doors Collapsible Wardrobe for Kids Clothes/Toys/Books, Baby Cupboard for Clothes Storage in Bedroom Nursery, Black (CW-B8) 3.4 out of 5 stars 490','https://d-ec-product.s3.us-east-1.amazonaws.com/uploads/6.webp','Furniture','CoolLeaf Soft Plastic',1500,'2025-06-22 17:17:14'),(8,'+3 Crosscut Furniture Metal Floor Lamp','+3 Crosscut Furniture Metal Floor Lamp with 3 Shelves (Farm Petal) LED Bulb Included, Multicolour 4.5 out of 5 stars','https://d-ec-product.s3.us-east-1.amazonaws.com/uploads/7.webp','Furniture','+Furniture',1800,'2025-06-22 17:17:14'),(9,'Deion Wooden Floating Set top Box','Deion Wooden Floating Set top Box Stand Wall Shelves Wall Mount Wall Shelf for Living Room WiFi Router Holder Stylish Hanging Rack Organizer|Wall Shelves 4.0 out of 5 stars 18','https://d-ec-product.s3.us-east-1.amazonaws.com/uploads/8.webp','Furniture','Deion Wooden Floating Set top Box',549,'2025-06-22 17:17:14'),(10,'One Plush 13','OnePlus 13 | Smarter with OnePlus AI (12GB RAM, 256GB Storage Arctic Dawn) 4.4 out of 5 stars','https://d-ec-product.s3.us-east-1.amazonaws.com/uploads/9.webp','Phone','One Plush',1500,'2025-06-22 17:17:14'),(11,'iPhone 16','iPhone 16 Pro Max 1 TB: 5G Mobile Phone with Camera Control, 4K 120 fps Dolby Vision and a Huge Leap in Battery Life. Works with AirPods; Black Titanium\n4.4 out of 5 stars ','https://d-ec-product.s3.us-east-1.amazonaws.com/uploads/10.webp','Phone','iPhone',172999,'2025-06-22 17:17:14'),(12,'Samsung S24 Ultra','Samsung Galaxy S25 Ultra 5G AI Smartphone (Titanium Silverblue, 12GB RAM, 1TB Storage), 200MP Camera, S Pen Included, Long Battery Life\n4.2 out of 5 stars','https://d-ec-product.s3.us-east-1.amazonaws.com/uploads/11.webp','Phone','Samsung',165999,'2025-06-22 17:17:14'),(13,'Samsung Pro','Samsung Galaxy Z Flip5 (Mint, 8GB RAM, 512GB Storage) Without Offer\n3.8 out of 5 star\n','https://d-ec-product.s3.us-east-1.amazonaws.com/uploads/12.webp','Phone','Samsung',66666,'2025-06-22 17:17:14'),(14,'Redmi 13','Redmi 13 5G, Hawaiian Blue, 8GB+128GB | India Debut SD 4 Gen 2 AE | 108MP Pro Grade Camera | 6.79in Largest Display in Segment\n4.0 out of 5 stars ','https://d-ec-product.s3.us-east-1.amazonaws.com/uploads/13.webp','Phone','Redmi',14000,'2025-06-22 17:17:14'),(15,'REDMI NOTE 14 5G','Redmi Note 14 5G (Titan Black, 6GB RAM 128GB Storage) | Global Debut MTK Dimensity 7025 Ultra | 2100 nits Segment Brightest 120Hz AMOLED | 50MP Sony LYT 600 OIS+EIS Triple Camera','https://d-ec-product.s3.us-east-1.amazonaws.com/uploads/14.webp','Phone','Redmi',17999,'2025-06-22 17:17:14'),(16,'ASUS','y. It is ideal for the entire family, helping them get more out of work, study, or play','https://d-ec-product.s3.us-east-1.amazonaws.com/uploads/15.webp','Laptop','ASUS',53990,'2025-06-22 17:17:14'),(17,'HP 15s','these processors allow you to breeze through tasks with ease. The revolutionary product is designed with a focus on ease-of-use, performance, and productivity. It is ideal for the entire family, helping them get more out of work, study, or play.','https://d-ec-product.s3.us-east-1.amazonaws.com/uploads/16.webp','Laptop','HP',42990,'2025-06-22 17:17:14'),(18,'ACER Aspire 3','Experience seamless performance and effortless multitasking with the cutting-edge AMD Ryzen Series Processors. Designed to enhance productivity, these processors allow you to breeze through tasks with ease. The revolutionary product is designed with a focus on ease-of-use, performance, and productivity. It is ideal for the entire family, helping them get more out of work, study, or play','https://d-ec-product.s3.us-east-1.amazonaws.com/uploads/17.webp','Laptop','ACER',27999,'2025-06-22 17:17:14'),(19,'Lenovo IdeaPad Slim 3','Lenovo IdeaPad Slim 3 (2023) Intel Core i5 13th Gen, 8GB RAM, 512GB SSD, Windows 11 Home, MS Office Home & Student, FHD Display, Backlit Keyboard, Fingerprint Reader, Graphite Grey, 1.65 kg, 82S9004EIN','https://d-ec-product.s3.us-east-1.amazonaws.com/uploads/18.webp','Laptop','Lenovo',25990,'2025-06-22 17:17:14'),(20,'Man Tshirt','They find the stitching neat and the attention to detail impressive. The size is perfect, with a flattering cut that suits different body types. The design is versatile and blends well with jeans, shorts, or joggers. Customers find the ','https://d-ec-product.s3.us-east-1.amazonaws.com/uploads/19.webp','Fashion','US POLO',899,'2025-06-22 17:17:14'),(21,'man Tshirt','The fabric is soft and breathable, making it comfortable to wear throughout the day. Customers appreciate the quality of the material, noting that it holds up well after multiple washes without fading or losing shape. The colors are vibrant and true to the pictures shown online.','https://d-ec-product.s3.us-east-1.amazonaws.com/uploads/20.jpg','Fashion','US POLO',999,'2025-06-22 17:17:14'),(22,'man tshirt','The fabric is soft and breathable, making it comfortable to wear throughout the day. Customers appreciate the quality of the material, noting that it holds up well after multiple washes without fading or losing shape. The colors are vibrant and true to the pictures shown online.','https://d-ec-product.s3.us-east-1.amazonaws.com/uploads/21.webp','Fashion','US POLO',0,'2025-06-22 17:17:14'),(23,'man tshirt','The fabric is soft and breathable, making it comfortable to wear throughout the day. Customers appreciate the quality of the material, noting that it holds up well after multiple washes without fading or losing shape. The colors are vibrant and true to the pictures shown online.','https://d-ec-product.s3.us-east-1.amazonaws.com/uploads/22.avif','Fashion','US POLO',499,'2025-06-22 17:17:14'),(24,'Lenovo Yoga x360','x360 14 convertible adapts to you so that you are productive at any angle. Stream your favorite series as long as you want with HP Fast Charge2. Dual Speakers with Audio by B&O give this laptop the immersive sound and entertainment experience you crave. Designed with the environment in mind, the HP Pavilion x360 is made using sustainable, post-consumer recycled, and ocean-bound plastics4. With a perfect balance of design and performance, the HP Pavilion is an ideal laptop for streaming, staying connected, and personal productivity.','https://d-ec-product.s3.us-east-1.amazonaws.com/uploads/23.jpg','Laptop','LENOVO',120000,'2025-06-22 17:17:14'),(25,'Kaboom Home Theatre','Bass Blast+Advanced EQ, Bass Blast+Deeper bass and clearer vocals are made possible with Bass Blast+. It features advanced EQ for perfect, customized sound.','https://d-ec-product.s3.us-east-1.amazonaws.com/uploads/24.jpg','Electronics','KABOOM',13000,'2025-06-22 17:17:14'),(26,'Dragon Station Chain Bracelet','Bass Blast+Advanced EQ, Bass Blast+Deeper bass and clearer vocals are made possible with Bass Blast+. It features advanced EQ for perfect, customized sound.','https://d-ec-product.s3.us-east-1.amazonaws.com/uploads/25.jpg','Jewelery','John Hardy',7000,'2025-06-22 17:17:14'),(27,'Mens Casual Slim Fit','The color could be slightly different between on the screen and in practice. / Please note that body builds vary by person, therefore, detailed size information should be reviewed below on the product description.','https://d-ec-product.s3.us-east-1.amazonaws.com/uploads/26.jpg','Fashion','NIKE',3999,'2025-06-22 17:17:14'),(28,'Mens Cotton Jacket','The color could be slightly different between on the screen and in practice. / Please note that body builds vary by person, therefore, detailed size information should be reviewed below on the product description.','https://d-ec-product.s3.us-east-1.amazonaws.com/uploads/27.jpg','Fashion','NIKE',5999,'2025-06-22 17:17:14'),(29,'Casual Premium Slim Fit T-Shirts','Slim-fitting style, contrast raglan long sleeve, three-button henley placket, light weight & soft fabric for breathable and comfortable wearing. And Solid stitched shirts with round neck made for durability and a great fit for casual fashion wear and diehard baseball fans. The Henley style round neckline includes a three-button placket','https://d-ec-product.s3.us-east-1.amazonaws.com/uploads/28.jpg','Fashion','NIKE',4999,'2025-06-22 17:17:14'),(30,'iPhone 14 pro','iPhone 14 mobile was launched on 7th September 2022. The phone comes with a 120 Hz refresh rate 6.06-inch touchscreen display offering a resolution of 1170x2532 pixels at a pixel density of 460 pixels per inch (ppi). iPhone 14 is powered by a hexa-core Apple A15 Bionic processor. The iPhone 14 supports wireless charging, as well as proprietary fast charging.\n\nAs far as the cameras are concerned, the iPhone 14 on the rear packs a 12-megapixel (f/1.5) primary camera, and a 12-megapixel (f/2.4) camera. It has a single front camera setup for selfies, featuring a 12-megapixel sensor with an f/1.9 aperture.\n\niPhone 14 is based on iOS 16 and packs 128GB, 256GB, 512GB of inbuilt storage. The iPhone 14 measures 146.70 x 71.50 x 7.80mm (height x width x thickness) and weighs 172.00 grams. It was launched in Midnight, Purple, Starlight, (PRODUCT)RED, and Blue colours. It features an IP68 rating for dust and water protection.','https://d-ec-product.s3.us-east-1.amazonaws.com/uploads/29.png','Phone','APPLE',33000,'2025-06-22 17:17:14'),(31,'Apple MacBook Pro 13-inch 2022','Apple MacBook Pro 13-inch 2022 is a macOS laptop with a 13.30-inch display. It is powered by a Apple M2 processor and it comes with 8GB of RAM. The Apple MacBook Pro 13-inch 2022 packs 256GB of SSD storage . Connectivity options include Wi-Fi 802.11 a/b/g/n/ac and it comes with 2 USB ports, Thunderbolt 4 (Type C), Headphone and Mic Combo Jack ports.','https://d-ec-product.s3.us-east-1.amazonaws.com/uploads/30.png','Laptop','APPLE',56000,'2025-06-22 17:17:14'),(32,'Poco m4 pro 4G','Poco M4 Pro mobile was launched on 28th February 2022. The phone comes with a 90 Hz refresh rate 6.43-inch touchscreen display offering a resolution of 1,080x2,400 pixels at a pixel density of 409 pixels per inch (ppi) and an aspect ratio of 20:9. Poco M4 Pro is powered by an octa-core MediaTek Helio G96 processor. It comes with 6GB, 8GB of RAM. The Poco M4 Pro runs Android 11 and is powered by a 5000mAh non-removable battery. The Poco M4 Pro supports proprietary fast charging.','https://d-ec-product.s3.us-east-1.amazonaws.com/uploads/31.png','Phone','POCO',13000,'2025-06-22 17:17:14'),(33,'Striped Climbing Raincoats','Lightweight perfet for trip or casual wear---Long sleeve with hooded,','https://d-ec-product.s3.us-east-1.amazonaws.com/uploads/32.jpg','Fashion','WINDBREAKER',4599,'2025-06-22 17:17:14'),(34,'RUSTIC CHARM','New range of formal shirts are designed keeping you in mind. With fits and styling that will make you stand apart','https://d-ec-product.s3.us-east-1.amazonaws.com/uploads/33.jpg','Fashion','NIKE',6000,'2025-06-22 17:17:14'),(35,'Awesome Cotton Shoes','New range of formal shirts are designed keeping you in mind. With fits and styling that will make you stand apart','https://d-ec-product.s3.us-east-1.amazonaws.com/uploads/34.jpg','Fashion','NIKE',8000,'2025-06-22 17:17:14'),(36,'Handmade Wooden Chair','The automobile layout consists of a front-engine design, with transaxle-type transmissions mounted at the rear of the engine and four wheel drive','https://d-ec-product.s3.us-east-1.amazonaws.com/uploads/35.jpg','Furniture','Handmade Wooden Chair',4999,'2025-06-22 17:17:14'),(37,'Foldsack No. 1 Backpack, Fits 15 Laptops','Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday','https://d-ec-product.s3.us-east-1.amazonaws.com/uploads/36.jpg','Laptop','FJALLRAVEN',4500,'2025-06-22 17:17:14'),(38,'Women Short Sleeve Moisture','100% Polyester, Machine wash, 100% cationic polyester interlock, Machine Wash & Pre Shrunk for a Great Fit, Lightweight, roomy and highly breathable with moisture wicking fabric which helps to keep moisture away, Soft Lightweight Fabric with comfortable V-neck collar and a slimmer fit, delivers a sleek, more feminine silhouette and Added Comfort','https://d-ec-product.s3.us-east-1.amazonaws.com/uploads/37.jpg','Fashion','OPNA',2799,'2025-06-22 17:17:14'),(39,'Womens T Shirt Casual Cotton Short','95%Cotton,5%Spandex, Features: Casual, Short Sleeve, Letter Print,V-Neck,Fashion Tees, The fabric is soft and has some stretch., Occasion: Casual/Office/Beach/School/Home/Street. Season: Spring,Summer,Autumn,Winter.','https://d-ec-product.s3.us-east-1.amazonaws.com/uploads/38.jpg','Fashion','DANVOUY',1999,'2025-06-22 17:17:14');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shipping_addresses`
--

DROP TABLE IF EXISTS `shipping_addresses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shipping_addresses` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `order_id` int DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `line1` varchar(255) DEFAULT NULL,
  `line2` varchar(255) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `pin_code` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shipping_addresses`
--

LOCK TABLES `shipping_addresses` WRITE;
/*!40000 ALTER TABLE `shipping_addresses` DISABLE KEYS */;
INSERT INTO `shipping_addresses` VALUES (7,5,'Thanh Lương','1657163380','108 Hà Huy Tập','231312','Đà Lạt','Vietnam','123123123'),(8,6,'Thanh Lương','1657163380','108 Hà Huy Tập','Test','Đà Lạt','Vietnam','test'),(9,7,'TESt','TESt','TESt','TESt','TESt','TESt','TESt');
/*!40000 ALTER TABLE `shipping_addresses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'lxthanh235@gmail.com','$2b$10$6xGKQi5WXFJlgYr7dipmhucLKI7j8pD0XlXe3OfFqW5BijP9UMzIC'),(2,'admin@gmail.com','$2b$10$6EYuoejF9aySbubfHUOPneYQmkJMOlw3it2u2g.im9/ZJW8G5xqru');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-25 19:34:53
