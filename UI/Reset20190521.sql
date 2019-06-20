-- MySQL dump 10.13  Distrib 5.7.26, for Linux (x86_64)
--
-- Host: localhost    Database: voting_project
-- ------------------------------------------------------
-- Server version	5.7.26-0ubuntu0.18.04.1

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
  `type` int(11) NOT NULL,
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
  PRIMARY KEY (`id`,`type`),
  KEY `fk_awardDetails_1_idx` (`type`),
  CONSTRAINT `fk_awardDetails_1` FOREIGN KEY (`type`) REFERENCES `awardTypes` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=1033 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `awardDetails`
--

LOCK TABLES `awardDetails` WRITE;
/*!40000 ALTER TABLE `awardDetails` DISABLE KEYS */;
/*!40000 ALTER TABLE `awardDetails` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `awardTypes`
--

DROP TABLE IF EXISTS `awardTypes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `awardTypes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) COLLATE utf8_unicode_ci NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=66 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `awardTypes`
--

LOCK TABLES `awardTypes` WRITE;
/*!40000 ALTER TABLE `awardTypes` DISABLE KEYS */;
INSERT INTO `awardTypes` VALUES (1,'Employee of the Year',NULL,NULL),(2,'Rookie of the Year',NULL,NULL),(3,'Manager of the Year',NULL,NULL);
/*!40000 ALTER TABLE `awardTypes` ENABLE KEYS */;
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
  PRIMARY KEY (`id_award`,`id_nominee`),
  KEY `fk_awardNominees_awardDetails1_idx` (`id_award`),
  KEY `fk_awardNominees_users1_idx` (`id_nominee`,`id_team`),
  CONSTRAINT `fk_nominees_1` FOREIGN KEY (`id_nominee`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_nominees_2` FOREIGN KEY (`id_award`) REFERENCES `awardDetails` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nominees`
--

LOCK TABLES `nominees` WRITE;
/*!40000 ALTER TABLE `nominees` DISABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=100 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `teams`
--

LOCK TABLES `teams` WRITE;
/*!40000 ALTER TABLE `teams` DISABLE KEYS */;
INSERT INTO `teams` VALUES (1,'Bootcamp'),(2,'Concord'),(3,'Fox'),(4,'Denton'),(5,'Manager'),(99,'No Team');
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
  `achievement` varchar(200) CHARACTER SET utf8 DEFAULT NULL,
  `ava_url` varchar(200) CHARACTER SET utf8 DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_user_1_idx` (`id_team`),
  KEY `fk_users_1_idx` (`id_role`),
  CONSTRAINT `fk_user_1` FOREIGN KEY (`id_team`) REFERENCES `teams` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_users_1` FOREIGN KEY (`id_role`) REFERENCES `roles` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,1,NULL,1,'admin','$2b$10$wfJKbsW2ELRWPNNdRjXJvul5d6SlILIEOj7.jy30f84QYsVVx2qZm','admin','admin','admin','admin@enclave.vn',NULL,NULL,NULL,'uploads/avatars/undefined_2019-04-26T03:22:00.179Z_defaut_ava.jpg','2019-03-28 09:35:08','2019-03-28 09:35:08'),(6,3,2,0,'dinh.le','$2b$10$ymd/UXiW08zCH3D8BJWANeI5ZZkoaWA84CD5VJXbGZV2ujiZxm4hW','Dinh','Q. LE','Roger','test123@enclave.vn','+84917355190','','',NULL,'2019-03-28 09:36:35','2019-04-05 08:09:55'),(7,3,3,1,'dinh.le1','$2b$10$cpS84H8cIybJos5OHys8Eu41YFGq3S22aPRJjcETKZNzYZqb5pq9G','Dinh','Q. LE','Roger','roger@enclave.vn','+84917355190','','','uploads/avatars/dinh.le1_2019-04-09T03:32:37.100Z_img.jpg','2019-03-28 09:40:12','2019-04-05 09:20:31'),(8,3,1,1,'chuc.truong','$2b$10$rOMczNzRykqLnhWzWUodHe.VQfGswLOHsF7Op97t7EpYGj7qCTAnW','Chuc','D. TRUONG','Gray','gray@enclave.vn',NULL,NULL,NULL,NULL,'2019-04-09 02:06:28','2019-04-09 02:06:28'),(9,2,5,1,'duong.nguyen','$2b$10$cNm72rXY8i0m9RxBwgzY8e3UDgDfYDr2k4uvvhUD5PCUmGobnVNfW','Duong','T.A. NGUYEN','Sunny','sunny.test@enclave.vn',NULL,NULL,NULL,'uploads/avatars/undefined_2019-04-28T15:34:50.366Z_businessman.png','2019-04-09 10:00:51','2019-04-09 10:00:51'),(10,3,99,1,'nam.nguyen','$2b$10$mWH.GwmIHhrNTorKOlF/iuMgR8fXoW2Av1uURAESjP.Np8cjgagBO','Nam','N. NGUYEN','Nodin','nodin@enclave.vn',NULL,NULL,NULL,NULL,'2019-04-09 10:03:37','2019-04-21 08:33:22'),(11,2,3,1,'khai.le','$2b$10$/w9NnmzKf37RD6ZStMrH9O2Pcb9dPaBdQmzQefBP7xdKxbE5YfqFu','Khai','LE','Marco','marco.test@enclave.vn',NULL,NULL,NULL,NULL,'2019-04-18 02:32:41','2019-04-18 02:32:41'),(12,3,1,1,'tu.nguyen','$2b$10$5RBeWETFPuI36n9pRtcAmeX5cSAq7efY.7ydoklf3pUTn2cuDr9Di','Tu','T. NGUYEN','Callie','callie@enclave.vn',NULL,NULL,NULL,'uploads/avatars/undefined_2019-04-26T03:22:00.179Z_defaut_ava.jpg','2019-05-08 08:24:55','2019-05-08 08:24:55'),(13,3,4,1,'tuyen.nguyen','$2b$10$wg.biBqrF.jD8MQ85/mLW.osuQZvP1oWV7Fy2wNHBExNBL1NTfzjG','Tuyen','T.T. NGUYEN','Tavia','tavia@enclave.vn',NULL,NULL,NULL,'uploads/avatars/undefined_2019-05-20T07:06:00.451Z_Tavia.png','2019-05-08 08:25:44','2019-05-08 08:25:44'),(14,3,99,1,'quy.vo','$2b$10$9H4e55Ohf7S10Lwf4rlokuLRHbs0aoTEf2FdzrrSHFp3XkkROtUKu','Quy','T. Vo','Wyatt','wyatt@enclave.vn',NULL,NULL,NULL,'uploads/avatars/undefined_2019-04-26T03:22:00.179Z_defaut_ava.jpg','2019-05-08 08:26:31','2019-05-08 08:26:31'),(15,3,99,1,'an.trinh','$2b$10$vWOc7zhfTktHYlnOeTCkL.HfgSKfX/J2tjS4zoI4JBbaH10X1uvQW','An','M. TRINH','Aiden','aiden@enclave.vn',NULL,NULL,NULL,'uploads/avatars/undefined_2019-04-26T03:22:00.179Z_defaut_ava.jpg','2019-05-08 08:27:02','2019-05-08 08:27:02');
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
  `vote_status` tinyint(1) NOT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id_award`,`id_user`),
  KEY `fk_userAwardVote_users1_idx` (`id_user`),
  KEY `fk_userAwardVote_awardDetails1_idx` (`id_award`),
  CONSTRAINT `fk_userAwardVote_users1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_voters_1` FOREIGN KEY (`id_award`) REFERENCES `awardDetails` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `voters`
--

LOCK TABLES `voters` WRITE;
/*!40000 ALTER TABLE `voters` DISABLE KEYS */;
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
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id_award`,`id_nominee`),
  KEY `fk_votingBreakdowns_2_idx` (`percent`),
  KEY `fk_votingBreakdowns_3_idx` (`percent`),
  KEY `fk_votingBreakdowns_2_idx1` (`id_nominee`),
  CONSTRAINT `fk_votingBreakdowns_1` FOREIGN KEY (`id_award`) REFERENCES `awardDetails` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_votingBreakdowns_2` FOREIGN KEY (`id_nominee`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
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

-- Dump completed on 2019-05-21  8:49:55
