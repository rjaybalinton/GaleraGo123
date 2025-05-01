-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: May 01, 2025 at 03:47 PM
-- Server version: 8.3.0
-- PHP Version: 8.2.18

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `puerto galera`
--

-- --------------------------------------------------------

--
-- Table structure for table `tourists`
--

DROP TABLE IF EXISTS `tourists`;
CREATE TABLE IF NOT EXISTS `tourists` (
  `tourist_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `email` varchar(50) NOT NULL,
  `phone` varchar(15) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `age` int NOT NULL,
  `gender` enum('Male','Female','Other') NOT NULL,
  `nationality` varchar(50) NOT NULL,
  `residence` varchar(255) DEFAULT NULL,
  `companions_12` int DEFAULT '0',
  `companions_below_12` int DEFAULT '0',
  `arrival_date` date NOT NULL,
  `departure_date` date NOT NULL,
  `picture` varchar(255) DEFAULT 'default.jpg',
  `accommodation` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`tourist_id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `tourists`
--

INSERT INTO `tourists` (`tourist_id`, `user_id`, `email`, `phone`, `first_name`, `last_name`, `age`, `gender`, `nationality`, `residence`, `companions_12`, `companions_below_12`, `arrival_date`, `departure_date`, `picture`, `accommodation`, `created_at`) VALUES
(1, 9, 'jhayllena1234@gmail.com', '06613', 'rjay', 'balinton', 23, 'Male', 'Filipino', 'tabinay', 3, 3, '2025-04-19', '2025-04-20', '1744885503409.jpg', 'Amami Beach Resort', '2025-04-17 10:25:03'),
(2, 9, 'janinedalisay0315@gmail.com', '06461642466', 'janine', 'dalisay', 23, 'Female', 'Filipino', 'Barcenaga', 0, 0, '2025-05-01', '2025-05-01', '1745984661035.png', 'Amami Beach Resort', '2025-04-30 03:44:21'),
(3, 9, 'vincemadrid24@gmail.com', '063135256', 'vince ', 'madird', 22, 'Male', 'Filipino', 'ksndjsb', 0, 0, '2025-05-03', '2025-05-05', '1746113717314.jpg', 'Amami Beach Resort', '2025-05-01 15:35:17');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `contact_number` varchar(15) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `date_of_birth` date NOT NULL,
  `gender` enum('Male','Female','Other') NOT NULL,
  `nationality` varchar(50) NOT NULL,
  `address` text NOT NULL,
  `profile_picture` varchar(255) DEFAULT 'default.jpg',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `reset_code` varchar(6) DEFAULT NULL,
  `is_temp_password` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `username`, `first_name`, `last_name`, `contact_number`, `email`, `password`, `date_of_birth`, `gender`, `nationality`, `address`, `profile_picture`, `created_at`, `reset_code`, `is_temp_password`) VALUES
(2, 'jhay', 'jhay', 'llena', '0641635', 'jhay123@gmail.com', '$2b$10$aKKoca0FMocdzoS0X1EkmuocvWHg73q8clN7GF4mQ5w', '2001-06-06', 'Male', 'Filipino', 'sdsds', 'Picture2.jpg', '2025-02-23 16:09:03', NULL, 0),
(7, 'janine', 'janine', 'dalisay', '15465', 'janine@gmail.com', '$2b$10$KkQLUeWIBYSQcrCdqH5Zq.PnBnB7zAIGvBVtiF7Bht2apHkfqt3dq', '6666-06-06', 'Female', 'sdfs', 'sfsd', 'Screenshot 2024-12-11 121454.png', '2025-02-25 20:48:19', NULL, 0),
(8, 'jhayllena', 'jhay', 'llena', '15465', 'rjaybalinton833@gmail.com', '$2b$10$Oj8OSGFqjykmXiiMp6ds0u3vconnKg/igP30k9.ah1TINVqNfTcKO', '6666-06-06', 'Male', 'sdfs', 'sfsd', 'Screenshot 2024-12-11 121454.png', '2025-02-25 20:49:23', NULL, 0),
(9, 'rjay', 'rj', 'balinton', '09385771857', 'jhayllena1234@gmail.com', '$2b$10$q/ALbHonxvVAt1oTWNbyzeYIvuyzxX7XLVRB.gZLKcRB43bZApAIS', '2001-06-26', 'Male', 'filipino', 'Small tabinay', 'LINE.png', '2025-03-04 12:03:23', NULL, 0);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `tourists`
--
ALTER TABLE `tourists`
  ADD CONSTRAINT `fk_tourist_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
