-- MySQL dump 10.13  Distrib 5.7.25, for Linux (x86_64)
--
-- Host: localhost    Database: voting_project
-- ------------------------------------------------------
-- Server version	5.7.25-0ubuntu0.18.04.2

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `awardDetails`
--

DROP TABLE IF EXISTS `awardDetails`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `awardDetails` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) CHARACTER SET utf8 NOT NULL,
  `year` varchar(45) COLLATE utf8_unicode_ci NOT NULL,
  `status` tinyint(1) NOT NULL,
  `description` varchar(500) CHARACTER SET utf8 DEFAULT NULL,
  `date_start` datetime NOT NULL,
  `date_end` datetime NOT NULL,
  `prize` varchar(45) COLLATE utf8_unicode_ci NOT NULL,
  `item` varchar(45) CHARACTER SET utf8 DEFAULT NULL,
  `logo_url` varchar(200) COLLATE utf8_unicode_ci DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=100 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `awardDetails`
--

LOCK TABLES `awardDetails` WRITE;
/*!40000 ALTER TABLE `awardDetails` DISABLE KEYS */;
INSERT INTO `awardDetails` VALUES (6,'Employee of the Year','2018',1,NULL,'2019-03-26 00:00:00','2019-03-28 00:00:00','VND 5,000,000.00','No','uploads/logos/2019-04-09T10:07:42.514Z_download.jpeg','2019-04-01 04:39:59','2019-04-01 04:39:59'),(7,'Employee of the Year','2018',0,NULL,'2019-03-26 00:00:00','2019-03-28 00:00:00','VND 5,000,000.00','No',NULL,'2019-04-01 06:13:42','2019-04-01 06:13:42'),(8,'Employee of the Year','2018',0,NULL,'2019-03-26 00:00:00','2019-03-28 00:00:00','VND 5,000,000.00','No',NULL,'2019-04-01 10:15:34','2019-04-01 10:15:34'),(9,'Employee of the Year','2018',0,NULL,'2019-03-26 00:00:00','2019-03-28 00:00:00','VND 5,000,000.00','No',NULL,'2019-04-01 10:17:59','2019-04-01 10:17:59'),(10,'Employee of the Year','2019',0,NULL,'2019-03-26 00:00:00','2019-03-28 00:00:00','VND 5,000,000.00','No',NULL,'2019-04-04 02:04:20','2019-04-04 02:04:20'),(11,'Employee of the Year','2019',0,NULL,'2019-03-26 00:00:00','2019-03-28 00:00:00','VND 5,000,000.00','No',NULL,'2019-04-04 02:53:07','2019-04-04 02:53:07'),(12,'Employee of the Year','2019',0,NULL,'2019-03-26 00:00:00','2019-03-28 00:00:00','VND 5,000,000.00','No',NULL,'2019-04-04 03:26:32','2019-04-04 03:26:32'),(13,'Employee of the Year','2019',0,NULL,'2019-03-26 00:00:00','2019-03-28 00:00:00','VND 5,000,000.00','No',NULL,'2019-04-04 03:27:48','2019-04-04 03:27:48'),(14,'Employee of the Year','2019',0,NULL,'2019-03-26 00:00:00','2019-03-28 00:00:00','VND 5,000,000.00','No',NULL,'2019-04-04 03:28:47','2019-04-04 03:28:47'),(15,'Employee of the Year','2016',0,NULL,'2019-03-26 00:00:00','2019-03-28 00:00:00','VND 5,000,000.00','No',NULL,'2019-04-04 03:31:15','2019-04-04 03:31:15'),(16,'Employee of the Year','2015',0,NULL,'2019-03-26 00:00:00','2019-03-28 00:00:00','VND 5,000,000.00','No',NULL,'2019-04-04 03:32:41','2019-04-04 03:32:41'),(17,'Employee of the Year','2014',0,NULL,'2019-03-26 00:00:00','2019-03-28 00:00:00','VND 5,000,000.00','No',NULL,'2019-04-04 04:00:01','2019-04-04 04:00:01'),(18,'Employee of the Year','2013',0,NULL,'2019-03-26 00:00:00','2019-03-28 00:00:00','VND 5,000,000.00','No',NULL,'2019-04-04 04:08:03','2019-04-04 04:08:03'),(19,'Employee of the Year','2012',0,NULL,'2019-03-26 00:00:00','2019-03-28 00:00:00','VND 5,000,000.00','No',NULL,'2019-04-04 04:11:40','2019-04-04 04:11:40'),(20,'Employee of the Year','2011',0,NULL,'2019-03-26 00:00:00','2019-03-28 00:00:00','VND 5,000,000.00','No',NULL,'2019-04-04 04:13:48','2019-04-04 04:13:48'),(21,'Employee of the Year','2010',0,NULL,'2019-03-26 00:00:00','2019-03-28 00:00:00','VND 5,000,000.00','No',NULL,'2019-04-04 04:24:43','2019-04-04 04:24:43'),(22,'Employee of the Year','2009',0,NULL,'2019-03-26 00:00:00','2019-03-28 00:00:00','VND 5,000,000.00','No',NULL,'2019-04-04 04:25:11','2019-04-04 04:25:11'),(23,'Employee of the Year','2008',0,NULL,'2019-03-26 00:00:00','2019-03-28 00:00:00','VND 5,000,000.00','No',NULL,'2019-04-04 04:27:25','2019-04-04 04:27:25'),(24,'Employee of the Year','2007',0,NULL,'2019-03-26 00:00:00','2019-03-28 00:00:00','VND 5,000,000.00','No',NULL,'2019-04-04 04:28:08','2019-04-04 04:28:08'),(25,'Employee of the Year','2006',0,NULL,'2019-03-26 00:00:00','2019-03-28 00:00:00','VND 5,000,000.00','No',NULL,'2019-04-04 04:34:12','2019-04-04 04:34:12'),(26,'Employee of the Year','2005',0,NULL,'2019-03-26 00:00:00','2019-03-28 00:00:00','VND 5,000,000.00','No',NULL,'2019-04-04 06:23:02','2019-04-04 06:23:02'),(27,'Employee of the Year','2019',0,NULL,'2019-03-26 00:00:00','2019-03-28 00:00:00','VND 5,000,000.00','No',NULL,'2019-04-04 06:28:13','2019-04-04 06:28:13'),(28,'Employee of the Year','2019',0,NULL,'2019-03-26 00:00:00','2019-03-28 00:00:00','VND 5,000,000.00','No',NULL,'2019-04-04 06:28:40','2019-04-04 06:28:40'),(29,'Employee of the Year','2019',0,NULL,'2019-03-26 00:00:00','2019-03-28 00:00:00','VND 5,000,000.00','No',NULL,'2019-04-04 06:30:54','2019-04-04 06:30:54'),(30,'Employee of the Year','2019',0,NULL,'2019-03-26 00:00:00','2019-03-28 00:00:00','VND 5,000,000.00','No',NULL,'2019-04-04 06:31:13','2019-04-04 06:31:13'),(31,'Employee of the Year','2019',0,NULL,'2019-03-26 00:00:00','2019-03-28 00:00:00','VND 5,000,000.00','No',NULL,'2019-04-04 06:31:48','2019-04-04 06:31:48'),(32,'Employee of the Year','2019',0,NULL,'2019-03-26 00:00:00','2019-03-28 00:00:00','VND 5,000,000.00','No',NULL,'2019-04-04 06:35:17','2019-04-04 06:35:17'),(33,'Employee of the Year','2019',0,NULL,'2019-03-26 00:00:00','2019-03-28 00:00:00','VND 5,000,000.00','No',NULL,'2019-04-04 06:36:33','2019-04-04 06:36:33'),(34,'Employee of the Year','2019',0,NULL,'2019-03-26 00:00:00','2019-03-28 00:00:00','VND 5,000,000.00','No',NULL,'2019-04-04 06:37:04','2019-04-04 06:37:04'),(35,'Employee of the Year','2019',0,NULL,'2019-03-26 00:00:00','2019-03-28 00:00:00','VND 5,000,000.00','No',NULL,'2019-04-04 06:38:03','2019-04-04 06:38:03'),(36,'Employee of the Year','2019',0,NULL,'2019-03-26 00:00:00','2019-03-28 00:00:00','VND 5,000,000.00','No',NULL,'2019-04-04 06:41:41','2019-04-04 06:41:41'),(37,'Employee of the Year','2019',0,NULL,'2019-03-26 00:00:00','2019-03-28 00:00:00','VND 5,000,000.00','No',NULL,'2019-04-04 06:54:21','2019-04-04 06:54:21'),(38,'Employee of the Year','2019',0,NULL,'2019-03-26 00:00:00','2019-03-28 00:00:00','VND 5,000,000.00','No',NULL,'2019-04-04 06:55:06','2019-04-04 06:55:06'),(39,'Employee of the Year','2019',0,NULL,'2019-03-26 00:00:00','2019-03-28 00:00:00','VND 5,000,000.00','No',NULL,'2019-04-04 06:58:26','2019-04-04 06:58:26'),(40,'Employee of the Year','2019',0,NULL,'2019-03-26 00:00:00','2019-03-28 00:00:00','VND 5,000,000.00','No',NULL,'2019-04-04 06:59:14','2019-04-04 06:59:14'),(41,'Employee of the Year','2019',0,NULL,'2019-03-26 00:00:00','2019-03-28 00:00:00','VND 5,000,000.00','No',NULL,'2019-04-04 07:01:40','2019-04-04 07:01:40'),(42,'Employee of the Year','2019',0,NULL,'2019-03-26 00:00:00','2019-03-28 00:00:00','VND 5,000,000.00','No',NULL,'2019-04-04 07:03:08','2019-04-04 07:03:08'),(43,'Employee of the Year','2019',0,NULL,'2019-03-26 00:00:00','2019-03-28 00:00:00','VND 5,000,000.00','No',NULL,'2019-04-04 07:03:21','2019-04-04 07:03:21'),(44,'Employee of the Year','2019',0,NULL,'2019-03-26 00:00:00','2019-03-28 00:00:00','VND 5,000,000.00','No',NULL,'2019-04-04 07:04:03','2019-04-04 07:04:03'),(45,'Employee of the Year','2019',0,NULL,'2019-03-26 00:00:00','2019-03-28 00:00:00','VND 5,000,000.00','No',NULL,'2019-04-04 07:04:34','2019-04-04 07:04:34'),(46,'Employee of the Year','2019',0,NULL,'2019-03-26 00:00:00','2019-03-28 00:00:00','VND 5,000,000.00','No',NULL,'2019-04-04 07:06:29','2019-04-04 07:06:29'),(47,'Employee of the Year','2019',0,NULL,'2019-03-26 00:00:00','2019-03-28 00:00:00','VND 5,000,000.00','No',NULL,'2019-04-04 07:07:05','2019-04-04 07:07:05'),(48,'Employee of the Year','2019',0,NULL,'2019-03-26 00:00:00','2019-03-28 00:00:00','VND 5,000,000.00','No',NULL,'2019-04-04 07:07:09','2019-04-04 07:07:09'),(49,'Employee of the Year','2019',0,NULL,'2019-03-26 00:00:00','2019-03-28 00:00:00','VND 5,000,000.00','No',NULL,'2019-04-04 07:07:47','2019-04-04 07:07:47'),(50,'Employee of the Year','2019',0,NULL,'2019-03-26 00:00:00','2019-03-28 00:00:00','VND 5,000,000.00','No',NULL,'2019-04-04 07:09:14','2019-04-04 07:09:14'),(51,'Employee of the Year','2019',0,NULL,'2019-03-26 00:00:00','2019-03-28 00:00:00','VND 5,000,000.00','No',NULL,'2019-04-04 07:10:05','2019-04-04 07:10:05'),(52,'Employee of the Year','2019',0,NULL,'2019-03-26 00:00:00','2019-03-28 00:00:00','VND 5,000,000.00','No',NULL,'2019-04-04 07:10:40','2019-04-04 07:10:40'),(53,'Employee of the Year','2019',0,NULL,'2019-03-26 00:00:00','2019-03-28 00:00:00','VND 5,000,000.00','No',NULL,'2019-04-04 07:11:13','2019-04-04 07:11:13'),(54,'Employee of the Year','2019',0,NULL,'2019-03-26 00:00:00','2019-03-28 00:00:00','VND 5,000,000.00','No',NULL,'2019-04-04 07:11:28','2019-04-04 07:11:28'),(55,'Employee of the Year','2019',0,NULL,'2019-03-26 00:00:00','2019-03-28 00:00:00','VND 5,000,000.00','No',NULL,'2019-04-04 07:13:52','2019-04-04 07:13:52'),(56,'Employee of the Year','2019',0,NULL,'2019-03-26 00:00:00','2019-03-28 00:00:00','VND 5,000,000.00','No',NULL,'2019-04-04 07:14:18','2019-04-04 07:14:18'),(57,'Employee of the Year','2019',0,NULL,'2019-03-26 00:00:00','2019-03-28 00:00:00','VND 5,000,000.00','No',NULL,'2019-04-04 07:15:02','2019-04-04 07:15:02'),(58,'Employee of the Year','2019',0,NULL,'2019-03-26 00:00:00','2019-03-28 00:00:00','VND 5,000,000.00','No',NULL,'2019-04-04 07:15:43','2019-04-04 07:15:43'),(59,'Employee of the Year','2019',0,NULL,'2019-03-26 00:00:00','2019-03-28 00:00:00','VND 5,000,000.00','No',NULL,'2019-04-04 07:15:59','2019-04-04 07:15:59'),(60,'Employee of the Year','2019',0,NULL,'2019-03-26 00:00:00','2019-03-28 00:00:00','VND 5,000,000.00','No',NULL,'2019-04-04 07:17:08','2019-04-04 07:17:08'),(61,'Employee of the Year','2019',0,NULL,'2019-03-26 00:00:00','2019-03-28 00:00:00','VND 5,000,000.00','No',NULL,'2019-04-04 07:20:23','2019-04-04 07:20:23'),(62,'Employee of the Year','2019',0,NULL,'2019-03-26 00:00:00','2019-03-28 00:00:00','VND 5,000,000.00','No',NULL,'2019-04-04 07:22:51','2019-04-04 07:22:51'),(63,'Employee of the Year','2019',0,NULL,'2019-03-26 00:00:00','2019-03-28 00:00:00','VND 5,000,000.00','No',NULL,'2019-04-04 07:27:37','2019-04-04 07:27:37'),(64,'Employee of the Year','2019',0,NULL,'2019-03-26 00:00:00','2019-03-28 00:00:00','VND 5,000,000.00','No',NULL,'2019-04-04 07:28:00','2019-04-04 07:28:00'),(65,'Employee of the Year','2019',0,NULL,'2019-03-26 00:00:00','2019-03-28 00:00:00','VND 5,000,000.00','No',NULL,'2019-04-04 07:30:12','2019-04-04 07:30:12'),(66,'Employee of the Year','2019',0,NULL,'2019-03-26 00:00:00','2019-03-28 00:00:00','VND 5,000,000.00','No',NULL,'2019-04-04 07:31:20','2019-04-04 07:31:20'),(67,'Employee of the Year','2019',0,NULL,'2019-03-26 00:00:00','2019-03-28 00:00:00','VND 5,000,000.00','No',NULL,'2019-04-04 07:33:42','2019-04-04 07:33:42'),(68,'Employee of the Year','2019',0,NULL,'2019-03-26 00:00:00','2019-03-28 00:00:00','VND 5,000,000.00','No',NULL,'2019-04-04 07:33:55','2019-04-04 07:33:55'),(69,'Employee of the Year','2019',0,NULL,'2019-03-26 00:00:00','2019-03-28 00:00:00','VND 5,000,000.00','No',NULL,'2019-04-04 07:34:31','2019-04-04 07:34:31'),(70,'Employee of the Year','2019',0,NULL,'2019-03-26 00:00:00','2019-03-28 00:00:00','VND 5,000,000.00','No',NULL,'2019-04-04 07:34:46','2019-04-04 07:34:46'),(71,'Employee of the Year','2019',0,NULL,'2019-03-26 00:00:00','2019-03-28 00:00:00','VND 5,000,000.00','No',NULL,'2019-04-04 07:35:45','2019-04-04 07:35:45'),(72,'Employee of the Year','2019',0,NULL,'2019-03-26 00:00:00','2019-03-28 00:00:00','VND 5,000,000.00','No',NULL,'2019-04-04 07:37:52','2019-04-04 07:37:52'),(73,'Employee of the Year','2019',0,NULL,'2019-03-26 00:00:00','2019-03-28 00:00:00','VND 5,000,000.00','No',NULL,'2019-04-04 07:38:09','2019-04-04 07:38:09'),(74,'Employee of the Year','2019',0,NULL,'2019-04-05 00:33:42','2019-04-28 00:00:00','VND 5,000,000.00','No',NULL,'2019-04-04 08:53:27','2019-04-04 08:53:27'),(75,'Employee of the Year','2019',0,NULL,'2019-04-05 00:33:42','2019-04-28 00:00:00','VND 5,000,000.00','No',NULL,'2019-04-04 08:54:33','2019-04-04 08:54:33'),(76,'Employee of the Year','2019',0,NULL,'2019-04-05 00:33:42','2019-04-28 00:00:00','VND 5,000,000.00','No',NULL,'2019-04-04 08:55:29','2019-04-04 08:55:29'),(77,'Employee of the Year','2019',0,NULL,'2019-04-05 00:33:42','2019-04-28 00:00:00','VND 5,000,000.00','No',NULL,'2019-04-04 09:29:19','2019-04-04 09:29:19'),(78,'Employee of the Year','2019',0,NULL,'2019-04-05 00:33:42','2019-04-28 00:00:00','VND 5,000,000.00','No',NULL,'2019-04-04 09:29:59','2019-04-04 09:29:59'),(79,'Employee of the Year','2019',0,NULL,'2019-04-05 00:33:42','2019-04-28 00:00:00','VND 5,000,000.00','No',NULL,'2019-04-04 09:35:59','2019-04-04 09:35:59'),(80,'Employee of the Year','2019',0,NULL,'2019-04-05 00:33:42','2019-04-28 00:00:00','VND 5,000,000.00','No',NULL,'2019-04-04 09:36:22','2019-04-04 09:36:22'),(81,'Employee of the Year','2019',0,NULL,'2019-04-05 00:33:42','2019-04-28 00:00:00','VND 5,000,000.00','No',NULL,'2019-04-04 09:37:39','2019-04-04 09:37:39'),(82,'Employee of the Year','2019',0,NULL,'2019-04-05 00:33:42','2019-04-28 00:00:00','VND 5,000,000.00','No',NULL,'2019-04-04 09:38:50','2019-04-04 09:38:50'),(83,'Employee of the Year','2019',0,NULL,'2019-04-05 00:33:42','2019-04-28 00:00:00','VND 5,000,000.00','No',NULL,'2019-04-04 09:42:31','2019-04-04 09:42:31'),(84,'Employee of the Year','2019',0,NULL,'2019-04-05 00:33:42','2019-04-28 00:00:00','VND 5,000,000.00','No',NULL,'2019-04-04 09:54:18','2019-04-04 09:54:18'),(85,'Employee of the Year','2019',0,NULL,'2019-04-05 00:33:42','2019-04-28 00:00:00','VND 5,000,000.00','No',NULL,'2019-04-04 09:56:22','2019-04-04 09:56:22'),(86,'Employee of the Year','2019',0,NULL,'2019-04-05 00:33:42','2019-04-28 00:00:00','VND 5,000,000.00','No',NULL,'2019-04-04 10:08:42','2019-04-04 10:08:42'),(87,'Employee of the Year','2019',0,NULL,'2019-04-05 00:33:42','2019-04-28 00:00:00','VND 5,000,000.00','No',NULL,'2019-04-04 10:09:40','2019-04-04 10:09:40'),(88,'Employee of the Year','2019',1,NULL,'2019-04-05 00:33:42','2019-04-28 00:00:00','VND 5,000,000.00','No',NULL,'2019-04-10 07:46:46','2019-04-10 07:46:46'),(89,'Employee of the Year','2019',1,NULL,'2019-04-05 00:33:42','2019-04-28 00:00:00','VND 5,000,000.00','No',NULL,'2019-04-10 07:59:36','2019-04-10 07:59:36'),(90,'Employee of the Year','2019',1,NULL,'2019-04-05 00:33:42','2019-04-28 00:00:00','VND 5,000,000.00','No',NULL,'2019-04-10 08:00:40','2019-04-10 08:00:40'),(91,'Employee of the Year','2019',1,NULL,'2019-04-05 00:33:42','2019-04-28 00:00:00','VND 5,000,000.00','No',NULL,'2019-04-10 08:01:12','2019-04-10 08:01:12'),(92,'Employee of the Year','2019',1,NULL,'2019-04-05 00:33:42','2019-04-28 00:00:00','VND 5,000,000.00','No',NULL,'2019-04-10 08:01:48','2019-04-10 08:01:48'),(93,'Employee of the Year','2019',1,NULL,'2019-04-05 00:33:42','2019-04-28 00:00:00','VND 5,000,000.00','No',NULL,'2019-04-10 08:06:32','2019-04-10 08:06:32'),(94,'Employee of the Year','2019',1,NULL,'2019-04-05 00:33:42','2019-04-28 00:00:00','VND 5,000,000.00','No',NULL,'2019-04-10 08:07:32','2019-04-10 08:07:32'),(95,'Employee of the Year','2019',1,NULL,'2019-04-05 00:33:42','2019-04-28 00:00:00','VND 5,000,000.00','No',NULL,'2019-04-10 08:08:30','2019-04-10 08:08:30'),(96,'Employee of the Year','2019',1,NULL,'2019-04-05 00:33:42','2019-04-28 00:00:00','VND 5,000,000.00','No',NULL,'2019-04-10 08:11:01','2019-04-10 08:11:01'),(97,'Employee of the Year','2019',1,NULL,'2019-04-05 00:33:42','2019-04-28 00:00:00','VND 5,000,000.00','No',NULL,'2019-04-10 08:17:35','2019-04-10 08:17:35'),(98,'Employee of the Year','2019',1,NULL,'2019-04-05 00:33:42','2019-04-28 00:00:00','VND 5,000,000.00','No',NULL,'2019-04-10 08:21:10','2019-04-10 08:21:10'),(99,'Employee of the Year','2019',1,NULL,'2019-04-05 00:33:42','2019-04-28 00:00:00','VND 5,000,000.00','No',NULL,'2019-04-10 08:23:11','2019-04-10 08:23:11');
/*!40000 ALTER TABLE `awardDetails` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `finalResults`
--

DROP TABLE IF EXISTS `finalResults`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `finalResults` (
  `id_award` int(11) NOT NULL,
  `id_winner` int(11) NOT NULL,
  `percent` float NOT NULL,
  PRIMARY KEY (`id_award`),
  KEY `fk_finalResults_votingBreakdowns1_idx` (`id_award`,`id_winner`,`percent`),
  KEY `fk_finalResults_3_idx` (`id_winner`),
  KEY `fk_finalResults_2_idx` (`id_award`,`percent`),
  CONSTRAINT `fk_finalResults_1` FOREIGN KEY (`id_award`) REFERENCES `awardDetails` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_finalResults_2` FOREIGN KEY (`id_award`) REFERENCES `votingBreakdowns` (`id_award`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_finalResults_3` FOREIGN KEY (`id_winner`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `finalResults`
--

LOCK TABLES `finalResults` WRITE;
/*!40000 ALTER TABLE `finalResults` DISABLE KEYS */;
INSERT INTO `finalResults` VALUES (30,6,30);
/*!40000 ALTER TABLE `finalResults` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nominees`
--

DROP TABLE IF EXISTS `nominees`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `nominees` (
  `id_award` int(11) NOT NULL,
  `id_team` int(11) NOT NULL,
  `id_nominee` int(11) NOT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id_award`,`id_team`),
  KEY `fk_awardNominees_awardDetails1_idx` (`id_award`),
  KEY `fk_awardNominees_users1_idx` (`id_nominee`,`id_team`),
  CONSTRAINT `fk_awardNominees_awardDetails1` FOREIGN KEY (`id_award`) REFERENCES `awardDetails` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_nominees_1` FOREIGN KEY (`id_nominee`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nominees`
--

LOCK TABLES `nominees` WRITE;
/*!40000 ALTER TABLE `nominees` DISABLE KEYS */;
INSERT INTO `nominees` VALUES (30,2,6,NULL),(31,2,6,NULL),(86,2,6,NULL),(87,2,6,NULL),(88,2,6,NULL),(89,2,6,NULL),(90,2,6,NULL),(91,2,6,NULL),(92,2,6,NULL),(93,2,6,NULL),(94,2,6,NULL),(95,2,6,NULL),(96,2,6,NULL),(97,3,7,'2019-04-10 08:17:35'),(98,1,8,'2019-04-10 08:21:10'),(98,2,6,'2019-04-10 08:21:10'),(98,3,7,'2019-04-10 08:21:10'),(99,1,8,'2019-04-10 08:23:11'),(99,2,6,'2019-04-10 08:23:11'),(99,3,7,'2019-04-10 08:23:11');
/*!40000 ALTER TABLE `nominees` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `roles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) CHARACTER SET utf8 NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'admin'),(2,'Manager'),(3,'Developer');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `teams`
--

DROP TABLE IF EXISTS `teams`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `teams` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) CHARACTER SET utf8 NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `teams`
--

LOCK TABLES `teams` WRITE;
/*!40000 ALTER TABLE `teams` DISABLE KEYS */;
INSERT INTO `teams` VALUES (1,'Bootcamp'),(2,'Concord'),(3,'Fox'),(4,'Denton'),(5,'Manager');
/*!40000 ALTER TABLE `teams` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_role` int(11) NOT NULL,
  `id_team` int(11) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL,
  `username` varchar(45) CHARACTER SET utf8 NOT NULL,
  `password` varchar(60) CHARACTER SET utf8 NOT NULL,
  `first_name` varchar(45) CHARACTER SET utf8 NOT NULL,
  `last_name` varchar(45) CHARACTER SET utf8 NOT NULL,
  `english_name` varchar(45) CHARACTER SET utf8 DEFAULT NULL,
  `email` varchar(45) CHARACTER SET utf8 NOT NULL,
  `phone` varchar(15) CHARACTER SET utf8 DEFAULT NULL,
  `address` varchar(60) CHARACTER SET utf8 DEFAULT NULL,
  `other` varchar(45) CHARACTER SET utf8 DEFAULT NULL,
  `ava_url` varchar(200) CHARACTER SET utf8 DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_user_1_idx` (`id_team`),
  KEY `fk_users_1_idx` (`id_role`),
  CONSTRAINT `fk_user_1` FOREIGN KEY (`id_team`) REFERENCES `teams` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_users_1` FOREIGN KEY (`id_role`) REFERENCES `roles` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,1,NULL,1,'admin','$2b$10$wfJKbsW2ELRWPNNdRjXJvul5d6SlILIEOj7.jy30f84QYsVVx2qZm','admin','admin','admin','admin@enclave.vn',NULL,NULL,NULL,'uploads/admin_2019-04-05T02:20:55.426Z_[Eureka] Dinh (Roger) Q. LE.png','2019-03-28 09:35:08','2019-03-28 09:35:08'),(6,3,2,0,'dinh.le','$2b$10$ymd/UXiW08zCH3D8BJWANeI5ZZkoaWA84CD5VJXbGZV2ujiZxm4hW','Dinh','Q. LE','Roger','roger@enclave.vn','+84917355190','','',NULL,'2019-03-28 09:36:35','2019-04-05 08:09:55'),(7,3,3,1,'dinh.le1','$2b$10$cpS84H8cIybJos5OHys8Eu41YFGq3S22aPRJjcETKZNzYZqb5pq9G','Dinh','Q. LE','Roger','roger@enclave.vn','+84917355190','','','uploads/avatars/dinh.le1_2019-04-09T03:32:37.100Z_img.jpg','2019-03-28 09:40:12','2019-04-05 09:20:31'),(8,3,1,1,'chuc.truong','$2b$10$rOMczNzRykqLnhWzWUodHe.VQfGswLOHsF7Op97t7EpYGj7qCTAnW','Chuc','D. TRUONG','Gray','gray@enclave.vn',NULL,NULL,NULL,NULL,'2019-04-09 02:06:28','2019-04-09 02:06:28'),(9,2,5,1,'duong.nguyen','$2b$10$cNm72rXY8i0m9RxBwgzY8e3UDgDfYDr2k4uvvhUD5PCUmGobnVNfW','Duong','T.A. NGUYEN','Sunny','sunny@enclave.vn',NULL,NULL,NULL,NULL,'2019-04-09 10:00:51','2019-04-09 10:00:51'),(10,3,4,1,'nam.nguyen','$2b$10$mWH.GwmIHhrNTorKOlF/iuMgR8fXoW2Av1uURAESjP.Np8cjgagBO','Nam','N. NGUYEN','Nodin','nodin@enclave.vn',NULL,NULL,NULL,NULL,'2019-04-09 10:03:37','2019-04-09 10:03:37');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `voters`
--

DROP TABLE IF EXISTS `voters`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `voters` (
  `id_award` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `vote_ability` tinyint(1) NOT NULL,
  `vote_status` tinyint(1) NOT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id_award`,`id_user`),
  KEY `fk_userAwardVote_users1_idx` (`id_user`),
  KEY `fk_userAwardVote_awardDetails1_idx` (`id_award`),
  CONSTRAINT `fk_userAwardVote_awardDetails1` FOREIGN KEY (`id_award`) REFERENCES `awardDetails` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_userAwardVote_users1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `voters`
--

LOCK TABLES `voters` WRITE;
/*!40000 ALTER TABLE `voters` DISABLE KEYS */;
INSERT INTO `voters` VALUES (6,1,1,1,NULL),(8,6,1,1,'2019-04-01 10:15:34'),(8,7,1,1,'2019-04-01 10:15:34'),(9,6,1,1,'2019-04-01 10:17:59'),(9,7,1,1,'2019-04-01 10:17:59'),(10,6,1,1,'2019-04-04 02:04:20'),(10,7,1,1,'2019-04-04 02:04:20'),(11,6,1,1,'2019-04-04 02:53:07'),(11,7,1,1,'2019-04-04 02:53:07'),(12,6,1,1,'2019-04-04 03:26:32'),(12,7,1,1,'2019-04-04 03:26:32'),(13,6,1,1,'2019-04-04 03:27:48'),(13,7,1,1,'2019-04-04 03:27:48'),(14,6,1,1,'2019-04-04 03:28:47'),(14,7,1,1,'2019-04-04 03:28:47'),(15,6,1,1,'2019-04-04 03:31:15'),(15,7,1,1,'2019-04-04 03:31:15'),(16,6,1,1,'2019-04-04 03:32:41'),(16,7,1,1,'2019-04-04 03:32:41'),(17,6,1,1,'2019-04-04 04:00:01'),(17,7,1,1,'2019-04-04 04:00:01'),(18,6,1,1,'2019-04-04 04:08:03'),(18,7,1,1,'2019-04-04 04:08:03'),(19,6,1,1,'2019-04-04 04:11:40'),(19,7,1,1,'2019-04-04 04:11:40'),(20,6,1,1,'2019-04-04 04:13:48'),(20,7,1,1,'2019-04-04 04:13:48'),(21,6,1,1,'2019-04-04 04:24:43'),(21,7,1,1,'2019-04-04 04:24:43'),(22,6,1,1,'2019-04-04 04:25:11'),(22,7,1,1,'2019-04-04 04:25:11'),(23,6,1,1,'2019-04-04 04:27:25'),(23,7,1,1,'2019-04-04 04:27:25'),(24,6,1,1,'2019-04-04 04:28:08'),(24,7,1,1,'2019-04-04 04:28:08'),(25,6,1,1,'2019-04-04 04:34:12'),(25,7,1,1,'2019-04-04 04:34:12'),(26,6,1,1,'2019-04-04 06:23:02'),(26,7,1,1,'2019-04-04 06:23:02'),(28,6,1,1,'2019-04-04 06:28:40'),(28,7,1,1,'2019-04-04 06:28:40'),(29,6,1,1,'2019-04-04 06:30:54'),(29,7,1,1,'2019-04-04 06:30:54'),(31,6,1,1,'2019-04-04 06:31:48'),(32,6,1,1,'2019-04-04 06:35:17'),(33,6,1,1,'2019-04-04 06:36:33'),(33,7,1,1,'2019-04-04 06:36:33'),(34,6,1,1,'2019-04-04 06:37:04'),(34,7,1,1,'2019-04-04 06:37:04'),(35,6,1,1,'2019-04-04 06:38:03'),(35,7,1,1,'2019-04-04 06:38:03'),(36,6,1,1,'2019-04-04 06:41:41'),(36,7,1,1,'2019-04-04 06:41:41'),(38,6,1,1,'2019-04-04 06:55:06'),(38,7,1,1,'2019-04-04 06:55:06'),(39,6,1,1,'2019-04-04 06:58:26'),(39,7,1,1,'2019-04-04 06:58:26'),(40,6,1,1,'2019-04-04 06:59:14'),(40,7,1,1,'2019-04-04 06:59:14'),(41,6,1,1,'2019-04-04 07:01:40'),(41,7,1,1,'2019-04-04 07:01:40'),(42,6,1,1,'2019-04-04 07:03:08'),(42,7,1,1,'2019-04-04 07:03:08'),(43,6,1,1,'2019-04-04 07:03:21'),(43,7,1,1,'2019-04-04 07:03:21'),(44,6,1,1,'2019-04-04 07:04:03'),(44,7,1,1,'2019-04-04 07:04:03'),(45,6,1,1,'2019-04-04 07:04:34'),(46,6,1,1,'2019-04-04 07:06:29'),(47,7,1,1,'2019-04-04 07:07:05'),(48,7,1,1,'2019-04-04 07:07:09'),(49,6,1,1,'2019-04-04 07:07:47'),(49,7,1,1,'2019-04-04 07:07:47'),(50,6,1,1,'2019-04-04 07:09:14'),(50,7,1,1,'2019-04-04 07:09:14'),(52,6,1,1,'2019-04-04 07:10:40'),(52,7,1,1,'2019-04-04 07:10:40'),(53,6,1,1,'2019-04-04 07:11:13'),(53,7,1,1,'2019-04-04 07:11:13'),(54,6,1,1,'2019-04-04 07:11:28'),(54,7,1,1,'2019-04-04 07:11:28'),(56,6,1,1,'2019-04-04 07:14:18'),(56,7,1,1,'2019-04-04 07:14:18'),(57,6,1,1,'2019-04-04 07:15:02'),(58,6,1,1,'2019-04-04 07:15:43'),(59,6,1,1,'2019-04-04 07:15:59'),(60,6,1,1,'2019-04-04 07:17:08'),(61,6,1,1,'2019-04-04 07:20:23'),(62,6,1,1,'2019-04-04 07:22:51'),(63,6,1,1,'2019-04-04 07:27:37'),(63,7,1,1,'2019-04-04 07:27:37'),(64,6,1,1,'2019-04-04 07:28:00'),(65,6,1,1,'2019-04-04 07:30:12'),(65,7,1,1,'2019-04-04 07:30:12'),(66,6,1,1,'2019-04-04 07:31:20'),(66,7,1,1,'2019-04-04 07:31:20'),(67,6,1,1,'2019-04-04 07:33:42'),(67,7,1,1,'2019-04-04 07:33:42'),(68,6,1,1,'2019-04-04 07:33:55'),(68,7,1,1,'2019-04-04 07:33:55'),(69,7,1,1,'2019-04-04 07:34:31'),(70,6,1,1,'2019-04-04 07:34:46'),(70,7,1,1,'2019-04-04 07:34:46'),(71,6,1,1,'2019-04-04 07:35:45'),(71,7,1,1,'2019-04-04 07:35:45'),(73,6,1,1,'2019-04-04 07:38:09'),(73,7,1,1,'2019-04-04 07:38:09'),(76,6,1,1,'2019-04-04 08:55:29'),(76,7,1,1,'2019-04-04 08:55:29'),(77,6,1,1,'2019-04-04 09:29:19'),(77,7,1,1,'2019-04-04 09:29:19'),(78,6,1,1,'2019-04-04 09:29:59'),(78,7,1,1,'2019-04-04 09:29:59'),(79,6,1,1,'2019-04-04 09:35:59'),(79,7,1,1,'2019-04-04 09:35:59'),(80,6,1,1,'2019-04-04 09:36:22'),(80,7,1,1,'2019-04-04 09:36:22'),(81,6,1,1,'2019-04-04 09:37:39'),(81,7,1,1,'2019-04-04 09:37:39'),(82,6,1,1,'2019-04-04 09:38:50'),(82,7,1,1,'2019-04-04 09:38:50'),(83,6,1,1,'2019-04-04 09:42:31'),(83,7,1,1,'2019-04-04 09:42:31'),(84,6,1,1,'2019-04-04 09:54:18'),(84,7,1,1,'2019-04-04 09:54:18'),(85,6,1,1,'2019-04-04 09:56:22'),(85,7,1,1,'2019-04-04 09:56:22'),(86,6,1,1,'2019-04-04 10:08:42'),(86,7,1,1,'2019-04-04 10:08:42'),(87,6,1,1,'2019-04-04 10:09:40'),(87,7,1,1,'2019-04-04 10:09:40'),(88,6,1,1,'2019-04-10 07:46:46'),(88,7,1,1,'2019-04-10 07:46:46'),(88,8,1,1,'2019-04-10 07:46:46'),(88,10,1,1,'2019-04-10 07:46:46'),(89,6,1,1,'2019-04-10 07:59:36'),(89,7,1,1,'2019-04-10 07:59:36'),(89,8,1,1,'2019-04-10 07:59:36'),(89,9,1,1,'2019-04-10 07:59:36'),(89,10,1,1,'2019-04-10 07:59:36'),(91,9,1,1,'2019-04-10 08:01:12'),(93,9,1,1,'2019-04-10 08:06:32'),(94,9,1,1,'2019-04-10 08:07:32'),(95,9,1,1,'2019-04-10 08:08:30'),(96,9,1,1,'2019-04-10 08:11:01'),(97,9,1,1,'2019-04-10 08:17:35'),(98,9,1,1,'2019-04-10 08:21:10'),(99,9,1,1,'2019-04-10 08:23:11');
/*!40000 ALTER TABLE `voters` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `votingBreakdowns`
--

DROP TABLE IF EXISTS `votingBreakdowns`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `votingBreakdowns` (
  `id_award` int(11) NOT NULL,
  `rank` int(11) NOT NULL,
  `id_nominee` int(11) NOT NULL,
  `first_votes` int(11) NOT NULL,
  `second_votes` int(11) NOT NULL,
  `third_votes` int(11) NOT NULL,
  `percent` float NOT NULL,
  `total_points` int(11) NOT NULL,
  PRIMARY KEY (`id_award`,`id_nominee`),
  KEY `fk_votingBreakdowns_2_idx` (`percent`),
  KEY `fk_votingBreakdowns_3_idx` (`percent`),
  KEY `fk_votingBreakdowns_2_idx1` (`id_nominee`),
  CONSTRAINT `fk_votingBreakdowns_1` FOREIGN KEY (`id_award`) REFERENCES `nominees` (`id_award`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_votingBreakdowns_2` FOREIGN KEY (`id_nominee`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `votingBreakdowns`
--

LOCK TABLES `votingBreakdowns` WRITE;
/*!40000 ALTER TABLE `votingBreakdowns` DISABLE KEYS */;
INSERT INTO `votingBreakdowns` VALUES (30,1,6,6,6,6,30,72),(30,2,8,5,5,5,20.2,45),(30,3,10,4,4,4,15.8,36);
/*!40000 ALTER TABLE `votingBreakdowns` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-04-15 16:52:05
