-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               10.4.32-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Version:             12.8.0.6908
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for spotted
CREATE DATABASE IF NOT EXISTS `spotted` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;
USE `spotted`;

-- Dumping structure for table spotted.comment
CREATE TABLE IF NOT EXISTS `comment` (
  `comment_id` int(11) NOT NULL AUTO_INCREMENT,
  `post_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `contenuto` text NOT NULL,
  `data_creazione` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`comment_id`),
  KEY `post_id` (`post_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `comment_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `post` (`post_id`) ON DELETE CASCADE,
  CONSTRAINT `comment_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table spotted.comment: ~13 rows (approximately)
INSERT INTO `comment` (`comment_id`, `post_id`, `user_id`, `contenuto`, `data_creazione`) VALUES
	(7, 4, 8, 'Forse era una mia amica 👀', '2026-01-23 16:58:56'),
	(8, 5, 9, 'L’ho vista anche io', '2026-01-23 16:58:56'),
	(9, 6, 10, 'Credo fosse uno studente di ingegneria', '2026-01-23 16:58:56'),
	(12, 4, 9, 'funziona o no?', '2026-01-28 16:51:01'),
	(13, 4, 9, 'un altro commento', '2026-01-28 16:52:41'),
	(14, 4, 9, 'un altro commento', '2026-01-28 16:58:08'),
	(15, 4, 9, 'brutto', '2026-01-28 16:59:58'),
	(16, 4, 9, 'vediamo', '2026-01-28 19:12:55'),
	(17, 4, 9, 'riptoviamo', '2026-01-28 19:13:46'),
	(18, 4, 9, 'testo generico', '2026-01-30 20:54:52'),
	(19, 4, 9, 'dai che va ora', '2026-02-01 17:32:45'),
	(20, 4, 9, 'gia funziona bene', '2026-02-01 17:33:37'),
	(21, 8, 9, 'è un bel post generato questo', '2026-02-03 22:07:32'),
	(22, 5, 9, 'bmnbnbmbm', '2026-02-04 10:42:05');

-- Dumping structure for table spotted.like_comment
CREATE TABLE IF NOT EXISTS `like_comment` (
  `comment_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `data_creazione` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`comment_id`,`user_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `like_comment_ibfk_1` FOREIGN KEY (`comment_id`) REFERENCES `comment` (`comment_id`) ON DELETE CASCADE,
  CONSTRAINT `like_comment_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table spotted.like_comment: ~6 rows (approximately)
INSERT INTO `like_comment` (`comment_id`, `user_id`, `data_creazione`) VALUES
	(7, 8, '2026-01-23 17:01:33'),
	(7, 9, '2026-01-28 16:28:03'),
	(8, 9, '2026-01-23 17:01:33'),
	(9, 10, '2026-01-23 17:01:33'),
	(14, 9, '2026-01-28 19:14:38'),
	(16, 9, '2026-01-28 19:14:36');

-- Dumping structure for table spotted.like_post
CREATE TABLE IF NOT EXISTS `like_post` (
  `post_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `data_creazione` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`post_id`,`user_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `like_post_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `post` (`post_id`) ON DELETE CASCADE,
  CONSTRAINT `like_post_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table spotted.like_post: ~4 rows (approximately)
INSERT INTO `like_post` (`post_id`, `user_id`, `data_creazione`) VALUES
	(4, 8, '2026-01-23 17:00:23'),
	(4, 11, '2026-01-27 20:47:44'),
	(5, 9, '2026-02-04 10:44:29'),
	(6, 10, '2026-01-23 17:00:23');

-- Dumping structure for table spotted.post
CREATE TABLE IF NOT EXISTS `post` (
  `post_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `titolo` varchar(100) NOT NULL,
  `testo` text NOT NULL,
  `data_creazione` datetime DEFAULT current_timestamp(),
  `blocked` tinyint(1) DEFAULT 0,
  `inspected` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`post_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `post_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table spotted.post: ~5 rows (approximately)
INSERT INTO `post` (`post_id`, `user_id`, `titolo`, `testo`, `data_creazione`, `blocked`, `inspected`) VALUES
	(4, 8, 'Spotted in biblioteca', 'Chi era la ragazza con la felpa rossa?', '2026-01-23 16:56:47', 1, 1),
	(5, 9, 'Spotted mensa', 'Cerco il tipo con gli occhiali di ieri', '2026-01-23 16:56:47', 0, 1),
	(6, 10, 'Messaggio importante', 'Questo post viola le regole', '2026-01-23 16:56:47', 1, 0),
	(7, 9, '', 'questo è un post generato', '2026-02-02 10:03:33', 0, 1),
	(8, 9, '', 'questo è un altro post generato', '2026-02-02 10:09:28', 0, 0);

-- Dumping structure for table spotted.report_comment
CREATE TABLE IF NOT EXISTS `report_comment` (
  `id_progressivo` int(11) NOT NULL AUTO_INCREMENT,
  `comment_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `commento` text DEFAULT NULL,
  `data_creazione` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id_progressivo`,`comment_id`,`user_id`),
  KEY `comment_id` (`comment_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `report_comment_ibfk_1` FOREIGN KEY (`comment_id`) REFERENCES `comment` (`comment_id`) ON DELETE CASCADE,
  CONSTRAINT `report_comment_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table spotted.report_comment: ~3 rows (approximately)
INSERT INTO `report_comment` (`id_progressivo`, `comment_id`, `user_id`, `commento`, `data_creazione`) VALUES
	(13, 7, 8, 'Commento fuori luogo', '2026-01-23 17:02:59'),
	(14, 8, 9, 'Ripetizione inutile', '2026-01-23 17:02:59'),
	(15, 9, 10, 'Tono aggressivo', '2026-01-23 17:02:59');

-- Dumping structure for table spotted.report_post
CREATE TABLE IF NOT EXISTS `report_post` (
  `id_progressivo` int(11) NOT NULL AUTO_INCREMENT,
  `post_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `commento` text DEFAULT NULL,
  `data_creazione` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id_progressivo`,`post_id`,`user_id`),
  KEY `post_id` (`post_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `report_post_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `post` (`post_id`) ON DELETE CASCADE,
  CONSTRAINT `report_post_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table spotted.report_post: ~3 rows (approximately)
INSERT INTO `report_post` (`id_progressivo`, `post_id`, `user_id`, `commento`, `data_creazione`) VALUES
	(4, 4, 8, 'Contenuto offensivo', '2026-01-23 17:01:33'),
	(5, 5, 9, 'Spam ripetuto', '2026-01-23 17:01:33'),
	(6, 6, 10, 'Non appropriato', '2026-01-23 17:01:33');

-- Dumping structure for table spotted.user
CREATE TABLE IF NOT EXISTS `user` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `password_hash` varchar(255) NOT NULL,
  `s_power_user` tinyint(1) DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table spotted.user: ~4 rows (approximately)
INSERT INTO `user` (`user_id`, `username`, `email`, `bio`, `password_hash`, `s_power_user`, `created_at`) VALUES
	(8, 'rossomalpelo', 'rossomalpelo@example.com', 'Loves literature and strong opinions.', '$argon2id$v=19$m=65536,t=4,p=1$UWdsbHRjT1BBcU1xa09oYw$VLtjSTy70B5qddS/NUcDbwDCKF97TwNwhF/cY+SlWp4', 0, '2026-01-27 14:51:01'),
	(9, 'mario', 'mario@gmail.com', 'avvolte funziona', '$argon2id$v=19$m=65536,t=4,p=1$TTl0NThEVVdCdUE3TjRFTA$5b4LJYQJGAHhO12+cO8RoS+tuUYEUhtUbFb8W0Zt9GQ', 1, '2026-01-27 14:51:01'),
	(10, 'anna', 'anna@example.com', 'Curious mind and coffee enthusiast.', '$argon2id$v=19$m=65536,t=4,p=1$ZnRhL1FXM0tNZ2ZzaHVyVQ$mpr230kpfjSGXuIleMIgdaqFpGo+F8+A6l7BEf+1Fd8', 0, '2026-01-27 14:51:01'),
	(11, 'mattia', 'mattia@gmail.com', NULL, '$argon2id$v=19$m=65536,t=4,p=1$T2hud0dWRTdWNlpMNXF1eA$Bk7HAmAVXzh7qrzH+K9TGnXQjHmIuwncWuSCBMCWLzA', 0, '2026-01-27 15:40:54');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
