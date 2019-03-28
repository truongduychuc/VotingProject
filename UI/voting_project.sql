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
  `description` varchar(500) CHARACTER SET utf8 DEFAULT NULL,
  `date_start` datetime NOT NULL,
  `date_end` datetime NOT NULL,
  `prize` varchar(45) COLLATE utf8_unicode_ci NOT NULL,
  `item` varchar(45) CHARACTER SET utf8 DEFAULT NULL,
  `logo_url` varchar(200) COLLATE utf8_unicode_ci DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `awardDetails`
--

LOCK TABLES `awardDetails` WRITE;
/*!40000 ALTER TABLE `awardDetails` DISABLE KEYS */;
INSERT INTO `awardDetails` VALUES (1,'Employee of the Year','1970-01-01 00:00:02',NULL,'2019-03-26 00:00:00','2019-03-28 00:00:00','VND 5,000,000.00','No',NULL,'2019-03-28 10:05:44','2019-03-28 10:05:44'),(2,'Employee of the Year','2019',NULL,'2019-03-26 00:00:00','2019-03-28 00:00:00','VND 5,000,000.00','No',NULL,'2019-03-28 10:09:28','2019-03-28 10:09:28'),(3,'Employee of the Year','2019',NULL,'2019-03-26 00:00:00','2019-03-28 00:00:00','VND 5,000,000.00','No',NULL,'2019-03-28 10:10:53','2019-03-28 10:10:53'),(4,'Employee of the Year','2019',NULL,'2019-03-26 00:00:00','2019-03-28 00:00:00','VND 5,000,000.00','No',NULL,'2019-03-28 10:12:10','2019-03-28 10:12:10'),(5,'Employee of the Year','2019',NULL,'2019-03-26 00:00:00','2019-03-28 00:00:00','VND 5,000,000.00','No',NULL,'2019-03-28 10:13:08','2019-03-28 10:13:08');
/*!40000 ALTER TABLE `awardDetails` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `awardNominees`
--

DROP TABLE IF EXISTS `awardNominees`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `awardNominees` (
  `id_award` int(11) NOT NULL,
  `id_team` int(11) NOT NULL,
  `id_nominee` int(11) NOT NULL,
  PRIMARY KEY (`id_award`),
  KEY `fk_awardNominees_awardDetails1_idx` (`id_award`),
  KEY `fk_awardNominees_votingBreakdowns1_idx` (`id_award`,`id_nominee`),
  KEY `fk_awardNominees_users1_idx` (`id_nominee`),
  CONSTRAINT `fk_awardNominees_awardDetails1` FOREIGN KEY (`id_award`) REFERENCES `awardDetails` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_awardNominees_users1` FOREIGN KEY (`id_nominee`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_awardNominees_votingBreakdowns1` FOREIGN KEY (`id_award`, `id_nominee`) REFERENCES `votingBreakdowns` (`id_award`, `id_nominee`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `awardNominees`
--

LOCK TABLES `awardNominees` WRITE;
/*!40000 ALTER TABLE `awardNominees` DISABLE KEYS */;
/*!40000 ALTER TABLE `awardNominees` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `finalResults`
--

DROP TABLE IF EXISTS `finalResults`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `finalResults` (
  `id_award` int(11) NOT NULL,
  `id_nominee` int(11) NOT NULL,
  PRIMARY KEY (`id_award`),
  KEY `fk_finalResults_votingBreakdowns1_idx` (`id_award`,`id_nominee`),
  CONSTRAINT `fk_finalResults_votingBreakdowns1` FOREIGN KEY (`id_award`, `id_nominee`) REFERENCES `votingBreakdowns` (`id_award`, `id_nominee`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `finalResults`
--

LOCK TABLES `finalResults` WRITE;
/*!40000 ALTER TABLE `finalResults` DISABLE KEYS */;
/*!40000 ALTER TABLE `finalResults` ENABLE KEYS */;
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
INSERT INTO `roles` VALUES (1,'admin'),(2,'manager'),(3,'developer');
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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `teams`
--

LOCK TABLES `teams` WRITE;
/*!40000 ALTER TABLE `teams` DISABLE KEYS */;
/*!40000 ALTER TABLE `teams` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `userAwardVotes`
--

DROP TABLE IF EXISTS `userAwardVotes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `userAwardVotes` (
  `id_award` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `vote_ability` tinyint(1) NOT NULL,
  `vote_status` tinyint(1) NOT NULL,
  PRIMARY KEY (`id_award`,`id_user`),
  KEY `fk_userAwardVote_users1_idx` (`id_user`),
  KEY `fk_userAwardVote_awardDetails1_idx` (`id_award`),
  CONSTRAINT `fk_userAwardVote_awardDetails1` FOREIGN KEY (`id_award`) REFERENCES `awardDetails` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_userAwardVote_users1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `userAwardVotes`
--

LOCK TABLES `userAwardVotes` WRITE;
/*!40000 ALTER TABLE `userAwardVotes` DISABLE KEYS */;
/*!40000 ALTER TABLE `userAwardVotes` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,1,NULL,1,'admin','$2b$10$wfJKbsW2ELRWPNNdRjXJvul5d6SlILIEOj7.jy30f84QYsVVx2qZm','','','','admin@enclave.vn',NULL,NULL,NULL,NULL,'2019-03-28 09:35:08','2019-03-28 09:35:08'),(6,3,NULL,0,'dinh.le','$2b$10$yRaXvOLyTjHs.uLrEvdkbenk0b5bvpuSjdwzOvSVtQ7RP3DH0a67S','Dinh','Q. LE','Roger','roger@enclave.vn',NULL,NULL,NULL,NULL,'2019-03-28 09:36:35','2019-03-28 09:36:35'),(7,3,NULL,1,'dinh.le1','$2b$10$cpS84H8cIybJos5OHys8Eu41YFGq3S22aPRJjcETKZNzYZqb5pq9G','Dinh','Q. LE','Roger','roger@enclave.vn','+84917355190','','','uploads/dinh.le1_2019-03-28T09:45:54.210Z_[Eureka] Dinh (Roger) Q. LE.png','2019-03-28 09:40:12','2019-03-28 09:40:40');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
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
  PRIMARY KEY (`id_award`,`id_nominee`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `votingBreakdowns`
--

LOCK TABLES `votingBreakdowns` WRITE;
/*!40000 ALTER TABLE `votingBreakdowns` DISABLE KEYS */;
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

-- Dump completed on 2019-03-28 17:17:40
