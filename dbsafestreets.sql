-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 26, 2025 at 09:04 AM
-- Server version: 10.4.16-MariaDB
-- PHP Version: 7.4.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `dbsafestreets`
--

-- --------------------------------------------------------

--
-- Table structure for table `tblaccount`
--

CREATE TABLE `tblaccount` (
  `accountID` int(10) UNSIGNED NOT NULL,
  `userID` int(10) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `tblaccount`
--

INSERT INTO `tblaccount` (`accountID`, `userID`, `username`, `password`, `createdAt`) VALUES
(33, 34, 'test', '$2a$10$rLcc4u3NKhOgH76Qtn9zD.J4Im9QABcQcY8uy.D.xwT/4OjrQ2mM.', '2025-01-17 22:33:19'),
(34, 35, 'Mark', '$2a$10$NJyYahS6tUot3sLYKPC1reVCI8D95SPck1V1MdfAc6C6.GIzjelae', '2025-01-17 22:34:21'),
(35, 36, 'staff', '$2a$10$OfotPL8lS9CVCjf59KfxFOoNgGuFBfeYi7GP/jBV8PaRVfPX07uY6', '2025-01-17 22:35:15'),
(36, 37, 'James123', '$2a$10$IMqTiVGOCj7W0mAlZNeBb.bfNE.TTedITmRvVzmwnkhi34/oRyHQy', '2025-01-20 23:06:42'),
(37, 38, 'Mark123444', '$2a$10$V0i61YhWDkLTZlpwBoNnXu6ZMa.Bi3AICuddHzT574pRaxN8eCJaS', '2025-01-21 12:58:07'),
(38, 39, 'Mark123', '$2a$10$sPr/i5t.14zUz4rFQYEGoe29CkoKqoRJ0e3VYPiwa8fOhfPgedrNK', '2025-01-22 18:17:52'),
(39, 40, 'Marklouie123', '$2a$10$qE4edbr2e5puYtjuo/.OcO8f6noHTG3N6tQ1sh1Q2erYyQAjjsXkG', '2025-01-22 18:19:27'),
(40, 41, 'Mark00', '$2a$10$xaF850kRI3T1lt9rRerARuRkH4mCWBJ9BhhPxQzcsTTjkrD1pS/.q', '2025-01-22 18:23:28'),
(41, 42, 'Admin', '$2a$10$qi3nAz0GTpH0pq0rEdH/aOg/PTwZ2VsGAKMcaeccMvJT6igrDBSoe', '2025-01-24 11:15:44'),
(42, 43, 'User', '$2a$10$Xhj2.CKwPY0Y660cdlIyJ.IBtLoKAksEbl/ome6kLDI/FCTQIxOOm', '2025-01-24 11:25:55'),
(43, 44, 'userJames', '$2a$10$Z.T4QmrR8mNf1nnHjuFyeOwTeFH0qEPHDI460FEt/GJ2WKr03cdWe', '2025-01-24 11:50:45'),
(44, 45, 'userMark', '$2a$10$dMi.Ny0/NwppPljOwyTGGevHS96VaN3SqsMYhW4wFfjQYLxqLmYm2', '2025-01-24 11:53:50'),
(45, 46, 'testMark', '$2a$10$uigWIV8yexecSbhWx19VQOPj55KoijzyWpOndowntTMLbxeMQlqvy', '2025-01-24 12:00:41'),
(46, 47, 'userTest', '$2a$10$NW.7TxFrRmbrfmnNo0qulOUW/CgGYC5dJZWyGma8ssaqzFWVVm1Yy', '2025-01-24 12:07:11'),
(47, 48, 'userJose', '$2a$10$DWTlpslQQ7isscsBN714tOn6aYIyD5Ex/TYJeCO8HfwS3MOxIjXAa', '2025-01-25 06:32:56'),
(48, 49, 'userRose', '$2a$10$9DEOn5hsJMo3b.SHEeCdd.WY7ToMWJ1MZaS1BfZtp.YzPXflijAii', '2025-01-25 06:43:16'),
(49, 50, 'markUSER', '$2a$10$SuKEkNe4iSASMht/A7MKyOlYcI5LH8xcbFnk0kp1O3r/GGrNI5Grq', '2025-01-25 07:10:47'),
(50, 51, 'userMark123', '$2a$10$55uNvTZ9Eep7XE3cg63sBe5dPYHzsRMuCbdiiA1XR3deVaxNgTQQ.', '2025-01-25 07:13:01'),
(51, 52, 'userMark12', '$2a$10$GVO3BDbMVHECW2W1gw2RpecoB1HlQcfa0fAMK.BT/b5nLGXHrOd9i', '2025-01-25 07:16:44'),
(52, 53, 'marklouie', '$2a$10$JG7yrGlkHN1JJTXwEpmxI.9Typ0ZhVnJJRdSg4BhvpxUx5/048Vv2', '2025-01-25 08:08:58');

-- --------------------------------------------------------

--
-- Table structure for table `tblnotification`
--

CREATE TABLE `tblnotification` (
  `notificationID` int(11) NOT NULL,
  `accID` int(10) UNSIGNED DEFAULT NULL,
  `crimeType` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `latitude` decimal(9,6) DEFAULT NULL,
  `longitude` decimal(9,6) DEFAULT NULL,
  `street` varchar(255) DEFAULT NULL,
  `imagePath` varchar(255) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `tblnotification`
--

INSERT INTO `tblnotification` (`notificationID`, `accID`, `crimeType`, `description`, `latitude`, `longitude`, `street`, `imagePath`, `createdAt`) VALUES
(366, 33, 'flytipping', 'White hat, blue shirt, and boy', '14.463054', '121.046191', 'Lakefront Drive, , Muntinlupa', '1740209959862.png', '2025-02-22 07:39:19');

-- --------------------------------------------------------

--
-- Table structure for table `tblreport`
--

CREATE TABLE `tblreport` (
  `reportID` int(10) NOT NULL,
  `accID` int(10) UNSIGNED DEFAULT NULL,
  `crimeType` varchar(100) NOT NULL,
  `description` varchar(100) NOT NULL,
  `latitude` decimal(9,6) DEFAULT NULL,
  `longitude` decimal(9,6) DEFAULT NULL,
  `street` varchar(100) NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `status` varchar(100) DEFAULT NULL,
  `circleID` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `tblreport`
--

INSERT INTO `tblreport` (`reportID`, `accID`, `crimeType`, `description`, `latitude`, `longitude`, `street`, `createdAt`, `status`, `circleID`) VALUES
(240, 33, 'assault', 'White hat, blue shirt, and boy', '14.359884', '121.057878', '2nd Street, , San Pedro', '2025-01-20 14:21:58', 'confirmed', 2),
(241, 33, 'flytipping', 'Testing Report', '14.361489', '121.056890', '5th Street, , San Pedro', '2025-01-20 14:26:18', 'confirmed', 1),
(242, 33, 'violent', 'It is a girl white a hand bar', '14.359531', '121.058757', '4th Street, , San Pedro', '2025-01-20 14:28:10', 'confirmed', 3),
(243, 33, 'flytipping', 'Male', '14.359447', '121.058822', '4th Street, , San Pedro', '2025-01-20 14:30:55', 'confirmed', 3),
(245, 33, 'drug_offences', '3 people, 2 men and 1 women at the corner of the car', '14.359447', '121.058822', 'Lakefront Drive, , Muntinlupa', '2025-01-20 14:31:25', 'confirmed', 3),
(246, 33, 'robbery', '3 people with a mask', '14.359447', '121.058822', 'Lakefront Drive, , Muntinlupa', '2025-01-20 14:31:37', 'confirmed', 3),
(247, 33, 'theft', 'Men, Black hat, with a bag in his hands color pink', '14.359281', '121.059058', 'National Highway, , Muntinlupa', '2025-01-20 14:32:40', 'confirmed', 3),
(256, 33, 'assault', 'White Hat, Blue Shirt', '14.359923', '121.057781', 'Lakefront Drive, , Muntinlupa', '2025-01-20 14:48:31', 'confirmed', 2),
(257, 33, 'burglary', 'White hat, blue shirt, and boy', '14.360009', '121.057878', 'Lakefront Drive, , Muntinlupa', '2025-01-20 14:51:14', 'confirmed', 2),
(258, 33, 'theft', 'White hat, blue shirt, and boy', '14.359797', '121.057717', 'Lakefront Drive, , Muntinlupa', '2025-01-20 14:52:06', 'confirmed', 2),
(259, 33, 'vandalism', 'White hat, blue shirt, and boy', '14.359840', '121.057770', 'Lakefront Drive, , Muntinlupa', '2025-01-20 14:54:22', 'confirmed', 2),
(260, 33, 'burglary', 'Testing Report', '14.359829', '121.057878', 'Lakefront Drive, , Muntinlupa', '2025-01-20 15:01:01', 'confirmed', 2),
(261, 33, 'theft', 'White hat, blue shirt, and boy', '14.358574', '121.058221', 'Lakefront Drive, , Muntinlupa', '2025-01-20 15:04:53', 'confirmed', 4),
(264, 33, 'assault', 'White hat, blue shirt, and boy', '14.358366', '121.058006', 'Lakefront Drive, , Muntinlupa', '2025-01-20 15:16:33', 'confirmed', 4),
(265, 33, 'theft', 'Testing Report', '14.358699', '121.058178', 'Lakefront Drive, , Muntinlupa', '2025-01-20 15:32:11', 'confirmed', 4),
(266, 33, 'assault', 'White hat, blue shirt, and boy', '14.358366', '121.057985', 'Lakefront Drive, , Muntinlupa', '2025-01-20 15:37:31', 'confirmed', 4),
(267, 33, 'burglary', 'Testing this', '14.358117', '121.059229', 'Lakefront Drive, , Muntinlupa', '2025-01-18 15:40:33', 'confirmed', 5),
(268, 33, 'theft', 'Dummy', '14.358176', '121.059138', 'Lakefront Drive, , Muntinlupa', '2025-01-20 15:45:08', 'confirmed', 5),
(269, 33, 'assault', 'White hat, blue shirt, and boy', '14.357452', '121.058393', 'Lakefront Drive, , Muntinlupa', '2025-01-20 15:51:41', 'confirmed', 6),
(270, 33, 'theft', 'White hat, blue shirt, and boy', '14.357327', '121.058478', 'Lakefront Drive, , Muntinlupa', '2025-01-20 15:52:47', 'confirmed', 6),
(271, 33, 'vandalism', 'White hat, blue shirt, and boy', '14.357327', '121.058457', 'Lakefront Drive, , Muntinlupa', '2025-01-20 15:53:54', 'confirmed', 6),
(272, 33, 'theft', 'White hat, blue shirt, and boy', '14.357473', '121.058478', 'Lakefront Drive, , Muntinlupa', '2025-01-18 15:54:36', 'confirmed', 6),
(273, 33, 'assault', 'White hat, blue shirt, and boy', '14.357410', '121.058435', 'Lakefront Drive, , Muntinlupa', '2025-01-20 15:55:51', 'confirmed', 6),
(274, 33, 'burglary', 'White hat, blue shirt, and boy', '14.357369', '121.058435', 'Lakefront Drive, , Muntinlupa', '2025-01-20 15:58:44', 'confirmed', 6),
(276, 33, 'theft', 'White hat, blue shirt, and boy', '14.356246', '121.059315', 'Lakefront Drive, , Muntinlupa', '2025-01-18 16:01:30', 'confirmed', 7),
(277, 33, 'burglary', 'White hat, blue shirt, and boy', '14.356142', '121.059551', 'Lakefront Drive, , Muntinlupa', '2025-01-17 16:03:07', 'confirmed', 7),
(278, 33, 'assault', 'White hat, blue shirt, and boy', '14.356329', '121.059208', 'Lakefront Drive, , Muntinlupa', '2025-01-20 16:07:07', 'confirmed', 7),
(279, 33, 'burglary', 'White hat, blue shirt, and boy', '14.356246', '121.059380', 'Lakefront Drive, , Muntinlupa', '2025-01-20 16:09:11', 'confirmed', 7),
(280, 33, 'assault', 'Testing Report', '14.361505', '121.057191', 'Lakefront Drive, , Muntinlupa', '2025-01-19 16:10:09', 'confirmed', 1),
(281, 33, 'assault', 'Testing Report', '14.361381', '121.057073', 'Lakefront Drive, , Muntinlupa', '2025-01-20 18:47:54', 'confirmed', 1),
(282, 33, 'assault', 'White hat, blue shirt, and boy', '14.463045', '121.046228', 'Lakefront Drive, , Muntinlupa', '2025-01-20 19:03:53', 'confirmed', 0),
(283, 33, 'theft', 'White hat, blue shirt, and boy', '14.354677', '121.060216', 'Lakefront Drive, , Muntinlupa', '2025-01-20 22:40:49', 'confirmed', 8),
(285, 33, 'burglary', 'Testing Report', '14.463045', '121.046228', 'Lakefront Drive, , Muntinlupa', '2025-01-20 19:43:24', 'confirmed', 0),
(286, 36, 'assault', 'Testing Report', '14.462970', '121.046081', 'Lakefront Drive, , Muntinlupa', '2025-01-20 23:07:07', 'confirmed', 0),
(289, 33, 'theft', 'Dummy', '14.462999', '121.046097', 'Lakefront Drive, , Muntinlupa', '2025-01-21 09:37:38', 'confirmed', 0),
(290, 33, 'burglary', 'White hat, blue shirt, and boy', '14.462999', '121.046097', 'Lakefront Drive, , Muntinlupa', '2025-01-21 09:37:34', 'confirmed', 0),
(291, 33, 'vandalism', 'Testing Report', '14.462999', '121.046097', 'Lakefront Drive, , Muntinlupa', '2025-01-21 09:37:43', 'confirmed', 0),
(292, 33, 'assault', 'White hat, blue shirt, and boy', '14.462999', '121.046097', 'Lakefront Drive, , Muntinlupa', '2025-01-21 09:38:55', 'confirmed', 0),
(293, 33, 'assault', 'White hat, blue shirt, and boy', '14.462999', '121.046097', 'Lakefront Drive, , Muntinlupa', '2025-01-21 09:40:04', 'confirmed', 0),
(294, 33, 'burglary', 'White hat, blue shirt, and boy', '14.462999', '121.046097', 'Lakefront Drive, , Muntinlupa', '2025-01-21 09:41:33', 'confirmed', 0),
(296, 33, 'assault', 'White hat, blue shirt, and boy', '14.462999', '121.046097', 'Lakefront Drive, , Muntinlupa', '2025-01-21 09:51:00', 'confirmed', 0),
(297, 33, 'assault', 'White hat, blue shirt, and boy', '14.462999', '121.046097', 'Lakefront Drive, , Muntinlupa', '2025-01-21 09:54:28', 'confirmed', 0),
(298, 33, 'burglary', 'White hat, blue shirt, and boy', '14.462999', '121.046097', 'Lakefront Drive, , Muntinlupa', '2025-01-21 09:54:23', 'confirmed', 0),
(299, 33, 'vandalism', 'THis is testing for different places ', '14.462999', '121.046097', 'Lakefront Drive, , Muntinlupa', '2025-01-21 09:54:33', 'confirmed', 0),
(300, 33, 'theft', 'Dummy', '14.462999', '121.046097', 'Lakefront Drive, , Muntinlupa', '2025-01-21 09:54:38', 'confirmed', 0),
(301, 33, 'assault', 'Testing Report', '14.354696', '121.060200', 'Lakefront Drive, , Muntinlupa', '2025-01-21 17:20:55', 'confirmed', 8),
(302, 33, 'assault', '123213123', '14.463080', '121.046128', 'Lakefront Drive, , Muntinlupa', '2025-01-21 21:44:12', 'confirmed', 0),
(303, 33, 'assault', 'Dummy', '14.463080', '121.046128', 'Lakefront Drive, , Muntinlupa', '2025-01-21 21:46:21', 'confirmed', 0),
(304, 33, 'assault', 'White hat, blue shirt, and boy', '14.463080', '121.046128', 'Lakefront Drive, , Muntinlupa', '2025-01-21 21:48:25', 'confirmed', 0),
(305, 33, 'assault', 'White hat, blue shirt, and boy', '14.463049', '121.046106', 'Lakefront Drive, , Muntinlupa', '2025-01-21 21:50:02', 'confirmed', 0),
(306, 33, 'burglary', 'Testing Report', '14.463049', '121.046106', 'Lakefront Drive, , Muntinlupa', '2025-01-21 21:52:19', 'confirmed', 0),
(307, 33, 'assault', 'Testing Report', '14.462978', '121.046067', 'Lakefront Drive, , Muntinlupa', '2025-01-21 21:56:39', 'confirmed', 0),
(308, 33, 'theft', 'White hat, blue shirt, and boy', '14.462978', '121.046067', 'Lakefront Drive, , Muntinlupa', '2025-01-21 21:58:47', 'confirmed', 0),
(309, 33, 'assault', 'Dummy', '14.462978', '121.046067', 'Lakefront Drive, , Muntinlupa', '2025-01-21 21:59:56', 'confirmed', 0),
(310, 33, 'assault', 'THis is testing for different places ', '14.462978', '121.046067', 'Lakefront Drive, , Muntinlupa', '2025-01-21 22:09:48', 'confirmed', 0),
(311, 33, 'assault', 'Testing Report', '14.359364', '121.058779', 'Lakefront Drive, , Muntinlupa', '2025-01-21 22:48:22', 'confirmed', 3),
(312, 33, 'assault', 'White hat, blue shirt, and boy', '14.358080', '121.059079', 'Lakefront Drive, , Muntinlupa', '2025-01-21 22:51:38', 'confirmed', 5),
(313, 33, 'assault', 'White hat, blue shirt, and boy', '14.357327', '121.058414', 'Lakefront Drive, , Muntinlupa', '2025-01-21 23:04:15', 'confirmed', 6),
(314, 33, 'assault', 'White hat, blue shirt, and boy', '14.463134', '121.046055', 'Lakefront Drive, , Muntinlupa', '2025-01-21 23:05:07', 'confirmed', 0),
(315, 33, 'assault', 'Dummy', '14.463134', '121.046055', 'Lakefront Drive, , Muntinlupa', '2025-01-21 23:06:05', 'confirmed', 0),
(316, 33, 'assault', 'Dummy', '14.463134', '121.046055', 'Lakefront Drive, , Muntinlupa', '2025-01-21 23:07:51', 'confirmed', 0),
(317, 33, 'assault', 'White hat, blue shirt, and boy', '14.463134', '121.046055', 'Lakefront Drive, , Muntinlupa', '2025-01-21 23:10:26', 'confirmed', 0),
(318, 33, 'vandalism', 'White hat, blue shirt, and boy', '14.463134', '121.046055', 'Lakefront Drive, , Muntinlupa', '2025-01-21 23:11:07', 'confirmed', 0),
(319, 33, 'assault', 'White hat, blue shirt, and boy', '14.463134', '121.046055', 'Lakefront Drive, , Muntinlupa', '2025-01-21 23:13:36', 'confirmed', 0),
(320, 33, 'assault', 'White hat, blue shirt, and boy', '14.463007', '121.046102', 'Lakefront Drive, , Muntinlupa', '2025-01-21 23:14:56', 'confirmed', 0),
(321, 33, 'assault', 'White hat, blue shirt, and boy', '14.463045', '121.046130', 'Lakefront Drive, , Muntinlupa', '2025-01-21 23:18:57', 'confirmed', 0),
(323, 33, 'burglary', 'Testing Report', '14.463045', '121.046130', 'Lakefront Drive, , Muntinlupa', '2025-01-21 23:21:28', 'confirmed', 0),
(324, 33, 'vandalism', 'Testing Report', '14.463045', '121.046130', 'Lakefront Drive, , Muntinlupa', '2025-01-21 23:21:33', 'confirmed', 0),
(327, 33, 'vandalism', 'Testing Report', '14.463032', '121.046097', 'Lakefront Drive, , Muntinlupa', '2025-01-21 23:33:38', 'confirmed', 0),
(328, 33, 'assault', 'White hat, blue shirt, and boy', '14.463020', '121.046118', 'Lakefront Drive, , Muntinlupa', '2025-01-21 23:37:03', 'confirmed', 0),
(330, 33, 'assault', 'Testing Report', '14.463066', '121.046051', 'Lakefront Drive, , Muntinlupa', '2025-01-22 13:00:16', 'confirmed', 0),
(331, 33, 'theft', 'White hat, blue shirt, and boy', '14.463066', '121.046051', 'Lakefront Drive, , Muntinlupa', '2025-01-22 13:02:46', 'confirmed', 0),
(332, 33, 'vandalism', 'Testing Report', '14.463066', '121.046051', 'Lakefront Drive, , Muntinlupa', '2025-01-22 13:03:07', 'confirmed', 0),
(333, 33, 'burglary', 'Dummy', '14.463066', '121.046051', 'Lakefront Drive, , Muntinlupa', '2025-01-22 13:04:39', 'confirmed', 0),
(334, 33, 'assault', 'Testing Report', '14.463066', '121.046051', '1st Street, , San Pedro', '2025-01-22 13:08:28', 'confirmed', 1),
(335, 33, 'assault', 'White Cap, Blue Shirt', '14.361413', '121.057364', 'National Highway, , San Pedro', '2025-01-24 11:23:02', NULL, 1),
(336, 43, 'theft', 'White Shirt, Male, and has backpack', '14.361413', '121.057364', 'National Highway, , San Pedro', '2025-01-24 11:52:16', NULL, 1),
(337, 44, 'burglary', 'Male, Facial Hair, and has a backpack', '14.361413', '121.057364', 'National Highway, , San Pedro', '2025-01-24 11:55:23', NULL, 1),
(339, 46, 'vandalism', '3 people and around 10-13', '14.361413', '121.057364', 'National Highway, , San Pedro', '2025-01-24 12:08:46', NULL, 1),
(340, 33, 'flytipping', 'White hat, blue shirt, and boy', '14.463296', '121.046009', 'East Service Road, , Parañaque', '2025-01-24 21:36:15', NULL, 0),
(341, 41, 'theft', 'White shirt, Men, and wears black hat', '14.358403', '121.057996', '5th Street, , San Pedro', '2025-01-25 07:18:50', NULL, 4),
(342, 41, 'robbery', '3 men, Weaking black mask, and has a gun', '14.358403', '121.057996', '5th Street, , San Pedro', '2025-01-25 08:10:39', NULL, 4);

-- --------------------------------------------------------

--
-- Table structure for table `tblreportadded`
--

CREATE TABLE `tblreportadded` (
  `reportID` int(10) NOT NULL,
  `accID` int(10) UNSIGNED DEFAULT NULL,
  `firstname` varchar(100) NOT NULL,
  `lastname` varchar(100) NOT NULL,
  `crimeType` varchar(100) NOT NULL,
  `description` varchar(100) NOT NULL,
  `street` varchar(100) NOT NULL,
  `date` datetime NOT NULL,
  `status` varchar(100) NOT NULL,
  `circleID` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `tblreportadded`
--

INSERT INTO `tblreportadded` (`reportID`, `accID`, `firstname`, `lastname`, `crimeType`, `description`, `street`, `date`, `status`, `circleID`) VALUES
(9, 35, 'Burglary', 'Mark Louie', 'Burglary', '21312312sdasdasd', 'test', '2025-01-01 13:29:00', 'confirmed', 1),
(28, 35, 'Mark Louie', 'Narvasa', 'Burglary', 'Tall\nBoy\nHas a Crown', 'Kila Aling rosie', '2025-01-10 19:01:00', 'confirmed', 1),
(29, 35, 'Mark Louie', 'Narvasa', 'Burglary', 'Tall\nBoy\nHas a Crown', 'Kila Aling rosie', '2025-01-10 19:01:00', 'confirmed', 1),
(30, 35, 'Mark Louie', 'Narvasa', 'Burglary', 'Tall\nBoy\nHas a Crown', 'Kila Aling rosie', '2025-01-10 19:01:00', 'confirmed', 1),
(31, 35, 'Mark Louie', 'Narvasa', 'Burglary', 'Tall\nBoy\nHas a Crown', 'Kila Aling rosie', '2025-01-10 19:01:00', 'confirmed', 1),
(32, 35, 'Mark Louie', 'Narvasa', 'Burglary', 'Tall\nBoy\nHas a Crown', 'Kila Aling rosie', '2025-01-10 19:01:00', 'confirmed', 1),
(33, 35, 'James Edward', 'Patriarca', 'Assault', 'Testasdasdasdasdasd', 'Lakefront Drive, , Muntinlupa', '2025-01-16 19:06:00', 'confirmed', 2),
(34, 35, 'James Edward', 'Patriarca', 'Assault', 'Testasdasdasdasdasd', 'Lakefront Drive, , Muntinlupa', '2025-01-16 19:06:00', 'confirmed', 2),
(35, 35, 'Mark Louie ', 'Undecimo', 'Burglary', '13sadasdasdsadasdsadasd', 'Kila aling rosie', '2025-01-24 19:10:00', 'confirmed', 3),
(36, 35, 'Testing', 'adasdasd', 'Burglary', 'sadadadasdasdasdasd', 'test', '2025-01-16 19:12:00', 'confirmed', 1),
(37, 35, 'Mark Louie', 'Narvasa', 'Burglary', 'asdsadasdadadasd', 'Kila aling rosie', '2025-01-15 19:20:00', 'confirmed', 2),
(38, 35, 'Mark Louie', 'Narvasa', 'Burglary', 'asdsadasdadadasd', 'Kila aling rosie', '2025-01-15 19:20:00', 'confirmed', 2),
(39, 35, 'Mark Louie', 'Narvasa', 'Burglary', 'asdsadasdadadasd', 'Kila aling rosie', '2025-01-15 19:20:00', 'confirmed', 2),
(40, 35, 'Mark Louie ', 'Undecimo', 'Burglary', 'sadasdasdasdasd', 'Lakefront Drive, , Muntinlupa', '2025-01-10 19:22:00', 'confirmed', 1),
(41, 35, 'Mark Louie ', 'Undecimo', 'Burglary', 'sadasdasdasdasd', 'Lakefront Drive, , Muntinlupa', '2025-01-10 19:22:00', 'confirmed', 1),
(42, 35, 'Mark Louie ', 'Undecimo', 'Burglary', 'sadasdasdasdasd', 'Lakefront Drive, , Muntinlupa', '2025-01-10 19:22:00', 'confirmed', 1),
(43, 35, 'Mark Louie ', 'Undecimo', 'Burglary', 'sadasdasdasdasd', 'Lakefront Drive, , Muntinlupa', '2025-01-10 19:22:00', 'confirmed', 1),
(44, 35, 'Mark Louie ', 'Undecimo', 'Burglary', 'sadasdasdasdasd', 'Lakefront Drive, , Muntinlupa', '2025-01-10 19:22:00', 'confirmed', 1),
(45, 35, 'Mark Louie ', 'Undecimo', 'Burglary', 'sadasdasdasdasd', 'Lakefront Drive, , Muntinlupa', '2025-01-10 19:22:00', 'confirmed', 1),
(46, 35, 'Mark Louie ', 'Undecimo', 'Burglary', 'sadasdasdasdasd', 'Lakefront Drive, , Muntinlupa', '2025-01-10 19:22:00', 'confirmed', 1),
(47, 35, 'James Edward', 'Undecimo', 'Burglary', 'asdasdasdasdasd', 'Lakefront Drive, , Muntinlupa', '2025-01-24 19:34:00', 'confirmed', 1),
(48, 35, 'Mark Louie ', 'This registration', 'Burglary', 'asdasddasdasdasdasd', 'Lakefront Drive, , Muntinlupa', '2025-01-24 19:36:00', 'confirmed', 1),
(49, 35, 'sadasd', 'asdasda', 'dasdad', 'asdadasdasdas', 'dasdasdas', '2025-01-24 19:38:00', 'confirmed', 1),
(51, 41, 'WitnessName', 'WitnessLastName', 'sexual_assault', 'Tall, age around 20-25, Men, and wears a sun glass', '1st Street', '2025-01-09 07:21:00', 'solved', 2),
(52, 35, 'WitnessName', 'WitnessLastName', 'Theft', '2 Men, Age around 18-21, wears a blue and black shirt', '1st Street', '2025-01-08 08:12:00', 'confirmed', 1),
(53, 41, 'Mark', 'Narvasa', 'robbery', 'Men with a gun', '2ns Street', '2025-01-15 08:26:00', 'confirmed', 1),
(54, 41, 'test', 'test', 'robbery', '222asdsadasdasd', '1ss', '2025-01-17 08:28:00', 'confirmed', 1);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_information`
--

CREATE TABLE `tbl_information` (
  `userID` int(10) NOT NULL,
  `firstName` varchar(100) NOT NULL,
  `lastName` varchar(100) NOT NULL,
  `contact` varchar(11) NOT NULL,
  `birthday` date NOT NULL,
  `gender` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `tbl_information`
--

INSERT INTO `tbl_information` (`userID`, `firstName`, `lastName`, `contact`, `birthday`, `gender`) VALUES
(34, 'Mark Louie', 'Narvasa', '09464749419', '2025-01-17', 'Male'),
(35, 'Mark Louie', 'Narvasa', '09464749419', '2025-01-17', 'Male'),
(36, 'Mark Louie', 'Narvasa', '09464749419', '2025-01-17', 'Male'),
(37, 'James Edward', 'Patriarca', '09123456784', '2025-01-20', 'Male'),
(38, 'Testing', 'Report', '12334567891', '2025-01-21', 'Male'),
(39, 'Mark Louie', 'Narvasa', '09472184427', '2003-06-22', 'Male'),
(40, 'Mark Louie', 'Narvasa', '09472184427', '2003-06-22', 'Male'),
(41, 'Mark Louie', 'Narvasa', '09472184427', '2003-06-22', 'Male'),
(42, 'Mark Louie', 'Narvasa', '09472184427', '2003-06-22', 'Male'),
(43, 'Maricar', 'Undecimo', '09464749419', '2002-05-21', 'Female'),
(44, 'James Edward', 'Patriarca', '09475234263', '2021-04-15', 'Male'),
(45, 'Mark Louie', 'Narvasa', '09472184427', '2003-06-22', 'Male'),
(46, 'Mark Louie', 'Narvasa', '09472184427', '2003-06-22', 'Male'),
(47, 'Mark Louie', 'Narvasa', '09472184427', '2003-06-22', 'Male'),
(48, 'Jose', 'Antonio', '09472184427', '2003-06-22', 'Male'),
(49, 'Rose', 'Clara', '09482342424', '2003-06-22', 'Male'),
(50, 'Mark Louie', 'Narvasa', '09472184427', '2003-06-22', 'Male'),
(51, 'Mark Louie', 'Narvasa', '09472184427', '2003-06-22', 'Male'),
(52, 'Mark Louie', 'Narvasa', '09472184427', '2003-06-22', 'Male'),
(53, 'Mark Louie', 'Narvasa', '09472184427', '2003-06-22', 'Male');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_userrole`
--

CREATE TABLE `tbl_userrole` (
  `roleID` int(10) NOT NULL,
  `accID` int(10) UNSIGNED DEFAULT NULL,
  `role` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `tbl_userrole`
--

INSERT INTO `tbl_userrole` (`roleID`, `accID`, `role`) VALUES
(24, 33, 'User'),
(25, 34, 'Admin'),
(26, 35, 'Staff'),
(27, 36, 'User'),
(28, 37, 'User'),
(29, 38, 'User'),
(30, 39, 'User'),
(31, 40, 'User'),
(32, 41, 'Admin'),
(33, 42, 'User'),
(34, 43, 'User'),
(35, 44, 'User'),
(36, 45, 'User'),
(37, 46, 'User'),
(38, 47, 'User'),
(39, 48, 'User'),
(40, 49, 'User'),
(41, 50, 'User'),
(42, 51, 'User'),
(43, 52, 'User');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tblaccount`
--
ALTER TABLE `tblaccount`
  ADD PRIMARY KEY (`accountID`),
  ADD UNIQUE KEY `username` (`username`),
  ADD KEY `userID` (`userID`);

--
-- Indexes for table `tblnotification`
--
ALTER TABLE `tblnotification`
  ADD PRIMARY KEY (`notificationID`),
  ADD KEY `accountID` (`accID`);

--
-- Indexes for table `tblreport`
--
ALTER TABLE `tblreport`
  ADD PRIMARY KEY (`reportID`),
  ADD KEY `report` (`accID`);

--
-- Indexes for table `tblreportadded`
--
ALTER TABLE `tblreportadded`
  ADD PRIMARY KEY (`reportID`),
  ADD KEY `tblAddedReport_AccID` (`accID`);

--
-- Indexes for table `tbl_information`
--
ALTER TABLE `tbl_information`
  ADD PRIMARY KEY (`userID`);

--
-- Indexes for table `tbl_userrole`
--
ALTER TABLE `tbl_userrole`
  ADD PRIMARY KEY (`roleID`),
  ADD KEY `staffrole` (`accID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tblaccount`
--
ALTER TABLE `tblaccount`
  MODIFY `accountID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=53;

--
-- AUTO_INCREMENT for table `tblnotification`
--
ALTER TABLE `tblnotification`
  MODIFY `notificationID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=367;

--
-- AUTO_INCREMENT for table `tblreport`
--
ALTER TABLE `tblreport`
  MODIFY `reportID` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=343;

--
-- AUTO_INCREMENT for table `tblreportadded`
--
ALTER TABLE `tblreportadded`
  MODIFY `reportID` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=55;

--
-- AUTO_INCREMENT for table `tbl_information`
--
ALTER TABLE `tbl_information`
  MODIFY `userID` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=54;

--
-- AUTO_INCREMENT for table `tbl_userrole`
--
ALTER TABLE `tbl_userrole`
  MODIFY `roleID` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `tblaccount`
--
ALTER TABLE `tblaccount`
  ADD CONSTRAINT `userID` FOREIGN KEY (`userID`) REFERENCES `tbl_information` (`userID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `tblnotification`
--
ALTER TABLE `tblnotification`
  ADD CONSTRAINT `accountID` FOREIGN KEY (`accID`) REFERENCES `tblaccount` (`accountID`) ON DELETE CASCADE;

--
-- Constraints for table `tblreport`
--
ALTER TABLE `tblreport`
  ADD CONSTRAINT `report` FOREIGN KEY (`accID`) REFERENCES `tblaccount` (`accountID`) ON DELETE SET NULL ON UPDATE NO ACTION;

--
-- Constraints for table `tblreportadded`
--
ALTER TABLE `tblreportadded`
  ADD CONSTRAINT `tblAddedReport_AccID` FOREIGN KEY (`accID`) REFERENCES `tblaccount` (`accountID`) ON DELETE SET NULL ON UPDATE SET NULL;

--
-- Constraints for table `tbl_userrole`
--
ALTER TABLE `tbl_userrole`
  ADD CONSTRAINT `role` FOREIGN KEY (`accID`) REFERENCES `tblaccount` (`accountID`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
