-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Anamakine: 127.0.0.1
-- Üretim Zamanı: 29 Ağu 2025, 21:20:43
-- Sunucu sürümü: 10.4.32-MariaDB
-- PHP Sürümü: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Veritabanı: `influencer_db`
--

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `about_content`
--

CREATE TABLE `about_content` (
  `id` int(11) NOT NULL,
  `type` enum('mission','vision') NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `icon` varchar(100) NOT NULL,
  `color` varchar(100) NOT NULL,
  `features` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`features`)),
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Tablo döküm verisi `about_content`
--

INSERT INTO `about_content` (`id`, `type`, `title`, `description`, `icon`, `color`, `features`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'mission', 'Misyonumuz', 'Markalar ve influencer\'lar arasında güvenilir, şeffaf ve etkili işbirlikleri kurarak, her iki tarafın da hedeflerine ulaşmasını sağlamak.', 'Target', 'from-primary to-secondary', '[\"Kaliteli içerik üretimi\",\"Hedef kitle analizi\",\"Performans takibi\"]', 1, '2025-08-29 18:50:19', '2025-08-29 18:50:19'),
(2, 'vision', 'Vizyonumuz', 'Türkiye\'nin en güvenilir ve yenilikçi influencer marketing platformu olarak, dijital pazarlama dünyasında öncü rol oynamak.', 'Star', 'from-secondary to-primary', '[\"Teknoloji odaklı çözümler\",\"Global genişleme\",\"Sürdürülebilir büyüme\"]', 1, '2025-08-29 18:50:19', '2025-08-29 18:50:19');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `about_stats`
--

CREATE TABLE `about_stats` (
  `id` int(11) NOT NULL,
  `icon` varchar(100) NOT NULL,
  `value` varchar(50) NOT NULL,
  `label` varchar(100) NOT NULL,
  `color` varchar(100) NOT NULL,
  `sort_order` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Tablo döküm verisi `about_stats`
--

INSERT INTO `about_stats` (`id`, `icon`, `value`, `label`, `color`, `sort_order`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Users', '500+', 'Influencer', 'from-primary to-secondary', 1, 1, '2025-08-29 18:50:19', '2025-08-29 18:50:19'),
(2, 'TrendingUp', '1000+', 'Başarılı Kampanya', 'from-secondary to-primary', 2, 1, '2025-08-29 18:50:19', '2025-08-29 18:50:19'),
(3, 'Award', '50+', 'Marka Partneri', 'from-primary to-secondary', 3, 1, '2025-08-29 18:50:19', '2025-08-29 18:50:19'),
(4, 'Target', '2M+', 'Toplam Erişim', 'from-secondary to-primary', 4, 1, '2025-08-29 18:50:19', '2025-08-29 18:50:19');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `about_team`
--

CREATE TABLE `about_team` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL,
  `image_url` varchar(500) NOT NULL,
  `description` text NOT NULL,
  `sort_order` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Tablo döküm verisi `about_team`
--

INSERT INTO `about_team` (`id`, `name`, `role`, `image_url`, `description`, `sort_order`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Ahmet Yılmaz', 'Kurucu & CEO', '/placeholder-user.jpg', '10+ yıl dijital pazarlama deneyimi', 1, 1, '2025-08-29 18:50:19', '2025-08-29 18:50:19'),
(2, 'Ayşe Demir', 'Pazarlama Direktörü', '/placeholder-user.jpg', 'Influencer marketing uzmanı', 2, 1, '2025-08-29 18:50:19', '2025-08-29 18:50:19'),
(3, 'Mehmet Kaya', 'Teknoloji Lideri', '/placeholder-user.jpg', 'Yazılım ve analitik uzmanı', 3, 1, '2025-08-29 18:50:19', '2025-08-29 18:50:19'),
(4, 'Zeynep Özkan', 'İçerik Stratejisti', '/placeholder-user.jpg', 'Yaratıcı içerik ve kampanya uzmanı', 4, 1, '2025-08-29 18:50:19', '2025-08-29 18:50:19');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `about_values`
--

CREATE TABLE `about_values` (
  `id` int(11) NOT NULL,
  `icon` varchar(100) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `color` varchar(100) NOT NULL,
  `sort_order` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Tablo döküm verisi `about_values`
--

INSERT INTO `about_values` (`id`, `icon`, `title`, `description`, `color`, `sort_order`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Heart', 'Güvenilirlik', 'Markalar ve influencer\'lar arasında güvenilir köprü kuruyoruz.', 'from-red-500 to-pink-500', 1, 1, '2025-08-29 18:50:19', '2025-08-29 18:50:19'),
(2, 'Target', 'Hedef Odaklı', 'Her kampanya için özel stratejiler geliştiriyoruz.', 'from-blue-500 to-cyan-500', 2, 1, '2025-08-29 18:50:19', '2025-08-29 18:50:19'),
(3, 'Zap', 'Hızlı Sonuç', 'Kısa sürede etkili sonuçlar elde ediyoruz.', 'from-yellow-500 to-orange-500', 3, 1, '2025-08-29 18:50:19', '2025-08-29 18:50:19'),
(4, 'Shield', 'Kalite Garantisi', 'Her projede en yüksek kaliteyi garanti ediyoruz.', 'from-green-500 to-emerald-500', 4, 1, '2025-08-29 18:50:19', '2025-08-29 18:50:19'),
(5, 'Globe', 'Global Erişim', 'Türkiye ve dünya çapında geniş ağımızla hizmet veriyoruz.', 'from-purple-500 to-indigo-500', 5, 1, '2025-08-29 18:50:19', '2025-08-29 18:50:19'),
(6, 'Lightbulb', 'Yaratıcılık', 'Yenilikçi ve yaratıcı çözümler sunuyoruz.', 'from-pink-500 to-rose-500', 6, 1, '2025-08-29 18:50:19', '2025-08-29 18:50:19');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `admin_users`
--

CREATE TABLE `admin_users` (
  `id` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `role` enum('super_admin','admin','moderator') DEFAULT 'admin',
  `is_active` tinyint(1) DEFAULT 1,
  `last_login` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Tablo döküm verisi `admin_users`
--

INSERT INTO `admin_users` (`id`, `username`, `email`, `password_hash`, `full_name`, `role`, `is_active`, `last_login`, `created_at`, `updated_at`) VALUES
(1, 'admin', 'admin@kesifcollective.com', '$2b$12$5gSH6fgFsKPmOiRDQNLWU.3CHd/VvBAveMQGgKFdut7yoZ0ya/X5S', 'Admin Kullanıcı', 'super_admin', 1, '2025-08-29 18:50:48', '2025-08-29 18:50:19', '2025-08-29 18:50:48');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `brands`
--

CREATE TABLE `brands` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `logo_url` varchar(500) NOT NULL,
  `website_url` varchar(500) DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `sort_order` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Tablo döküm verisi `brands`
--

INSERT INTO `brands` (`id`, `name`, `logo_url`, `website_url`, `category`, `is_active`, `sort_order`, `created_at`, `updated_at`) VALUES
(1, 'Nike', 'https://logos-world.net/wp-content/uploads/2020/04/Nike-Logo.png', 'https://www.nike.com', 'spor', 1, 1, '2025-08-29 18:50:19', '2025-08-29 18:50:19'),
(2, 'Adidas', 'https://logos-world.net/wp-content/uploads/2020/04/Adidas-Logo.png', 'https://www.adidas.com', 'spor', 1, 2, '2025-08-29 18:50:19', '2025-08-29 18:50:19'),
(3, 'Coca Cola', 'https://logos-world.net/wp-content/uploads/2020/04/Coca-Cola-Logo.png', 'https://www.coca-cola.com', 'içecek', 1, 3, '2025-08-29 18:50:19', '2025-08-29 18:50:19'),
(4, 'Samsung', 'https://logos-world.net/wp-content/uploads/2020/06/Samsung-Logo.png', 'https://www.samsung.com', 'teknoloji', 1, 4, '2025-08-29 18:50:19', '2025-08-29 18:50:19'),
(5, 'Apple', 'https://logos-world.net/wp-content/uploads/2020/04/Apple-Logo.png', 'https://www.apple.com', 'teknoloji', 1, 5, '2025-08-29 18:50:19', '2025-08-29 18:50:19'),
(6, 'Google', 'https://logos-world.net/wp-content/uploads/2020/09/Google-Logo.png', 'https://www.google.com', 'teknoloji', 1, 6, '2025-08-29 18:50:19', '2025-08-29 18:50:19'),
(7, 'Microsoft', 'https://logos-world.net/wp-content/uploads/2020/09/Microsoft-Logo.png', 'https://www.microsoft.com', 'teknoloji', 1, 7, '2025-08-29 18:50:19', '2025-08-29 18:50:19'),
(8, 'Amazon', 'https://logos-world.net/wp-content/uploads/2020/04/Amazon-Logo.png', 'https://www.amazon.com', 'e-ticaret', 1, 8, '2025-08-29 18:50:19', '2025-08-29 18:50:19'),
(9, 'Netflix', 'https://logos-world.net/wp-content/uploads/2020/04/Netflix-Logo.png', 'https://www.netflix.com', 'eğlence', 1, 9, '2025-08-29 18:50:19', '2025-08-29 18:50:19'),
(10, 'Spotify', 'https://logos-world.net/wp-content/uploads/2020/06/Spotify-Logo.png', 'https://www.spotify.com', 'müzik', 1, 10, '2025-08-29 18:50:19', '2025-08-29 18:50:19'),
(11, 'Tesla', 'https://logos-world.net/wp-content/uploads/2021/03/Tesla-Logo.png', 'https://www.tesla.com', 'otomotiv', 1, 11, '2025-08-29 18:50:19', '2025-08-29 18:50:19'),
(12, 'McDonald\'s', 'https://logos-world.net/wp-content/uploads/2020/04/McDonalds-Logo.png', 'https://www.mcdonalds.com', 'restoran', 1, 12, '2025-08-29 18:50:19', '2025-08-29 18:50:19'),
(13, 'BMW', 'https://logos-world.net/wp-content/uploads/2020/04/BMW-Logo.png', 'https://www.bmw.com', 'otomotiv', 1, 13, '2025-08-29 18:50:19', '2025-08-29 18:50:19'),
(14, 'Mercedes', 'https://logos-world.net/wp-content/uploads/2020/04/Mercedes-Logo.png', 'https://www.mercedes-benz.com', 'otomotiv', 1, 14, '2025-08-29 18:50:19', '2025-08-29 18:50:19'),
(15, 'Louis Vuitton', 'https://logos-world.net/wp-content/uploads/2020/04/Louis-Vuitton-Logo.png', 'https://www.louisvuitton.com', 'moda', 1, 15, '2025-08-29 18:50:19', '2025-08-29 18:50:19'),
(16, 'Chanel', 'https://logos-world.net/wp-content/uploads/2020/04/Chanel-Logo.png', 'https://www.chanel.com', 'moda', 1, 16, '2025-08-29 18:50:19', '2025-08-29 18:50:19'),
(17, 'Gucci', 'https://logos-world.net/wp-content/uploads/2020/04/Gucci-Logo.png', 'https://www.gucci.com', 'moda', 1, 17, '2025-08-29 18:50:19', '2025-08-29 18:50:19'),
(18, 'Prada', 'https://logos-world.net/wp-content/uploads/2020/04/Prada-Logo.png', 'https://www.prada.com', 'moda', 1, 18, '2025-08-29 18:50:19', '2025-08-29 18:50:19'),
(19, 'Rolex', 'https://logos-world.net/wp-content/uploads/2020/04/Rolex-Logo.png', 'https://www.rolex.com', 'aksesuar', 1, 19, '2025-08-29 18:50:19', '2025-08-29 18:50:19'),
(20, 'Starbucks', 'https://logos-world.net/wp-content/uploads/2020/04/Starbucks-Logo.png', 'https://www.starbucks.com', 'kafe', 1, 20, '2025-08-29 18:50:19', '2025-08-29 18:50:19');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `influencers`
--

CREATE TABLE `influencers` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `category` varchar(100) NOT NULL,
  `image_url` varchar(500) NOT NULL,
  `specialties` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`specialties`)),
  `social_media` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`social_media`)),
  `is_active` tinyint(1) DEFAULT 1,
  `sort_order` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `slug` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Tablo döküm verisi `influencers`
--

INSERT INTO `influencers` (`id`, `name`, `category`, `image_url`, `specialties`, `social_media`, `is_active`, `sort_order`, `created_at`, `updated_at`, `slug`) VALUES
(1, 'Ayşe Demir', 'lifestyle', '/fashionable-turkish-woman-influencer.png', '[\"Moda\",\"Güzellik\",\"Yaşam\"]', '{\"instagram\":\"250K\",\"tiktok\":\"180K\",\"youtube\":\"95K\"}', 1, 1, '2025-08-29 18:50:19', '2025-08-29 19:20:02', 'ayse-demir'),
(2, 'Mehmet Kaya', 'tech', '/turkish-tech-influencer.png', '[\"Teknoloji\",\"Gaming\",\"İnceleme\"]', '{\"instagram\":\"120K\",\"tiktok\":\"340K\",\"youtube\":\"580K\"}', 1, 2, '2025-08-29 18:50:19', '2025-08-29 19:20:02', 'mehmet-kaya'),
(3, 'Zeynep Özkan', 'food', '/turkish-food-blogger-cooking.png', '[\"Yemek\",\"Tarif\",\"Restoran\"]', '{\"instagram\":\"420K\",\"tiktok\":\"280K\",\"youtube\":\"150K\"}', 1, 3, '2025-08-29 18:50:19', '2025-08-29 19:20:02', 'zeynep-ozkan'),
(4, 'Can Yılmaz', 'fitness', '/turkish-fitness-influencer.png', '[\"Fitness\",\"Sağlık\",\"Spor\"]', '{\"instagram\":\"180K\",\"tiktok\":\"220K\",\"youtube\":\"95K\"}', 1, 4, '2025-08-29 18:50:19', '2025-08-29 19:20:02', 'can-yilmaz'),
(5, 'Elif Şahin', 'travel', '/turkish-influencer.png', '[\"Seyahat\",\"Kültür\",\"Fotoğraf\"]', '{\"instagram\":\"350K\",\"tiktok\":\"190K\",\"youtube\":\"120K\"}', 1, 5, '2025-08-29 18:50:19', '2025-08-29 19:20:02', 'elif-sahin'),
(6, 'Burak Özdemir', 'lifestyle', '/turkish-gaming-streamer.png', '[\"Vlog\",\"Eğlence\",\"Yaşam\"]', '{\"instagram\":\"280K\",\"tiktok\":\"450K\",\"youtube\":\"320K\"}', 1, 6, '2025-08-29 18:50:19', '2025-08-29 19:20:02', 'burak-ozdemir');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `influencer_clicks`
--

CREATE TABLE `influencer_clicks` (
  `id` int(11) NOT NULL,
  `influencer_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `session_id` varchar(255) DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `source_page` varchar(255) DEFAULT NULL,
  `click_type` enum('profile_view','contact_click','social_media_click') NOT NULL,
  `social_platform` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `influencer_details`
--

CREATE TABLE `influencer_details` (
  `id` int(11) NOT NULL,
  `influencer_id` int(11) NOT NULL,
  `bio` text DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `rating` decimal(3,2) DEFAULT 0.00,
  `join_date` varchar(50) DEFAULT NULL,
  `total_reach` varchar(50) DEFAULT NULL,
  `campaigns_count` int(11) DEFAULT 0,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `portfolio` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`portfolio`)),
  `achievements` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`achievements`)),
  `recent_campaigns` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`recent_campaigns`)),
  `engagement_rate` varchar(10) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Tablo döküm verisi `influencer_details`
--

INSERT INTO `influencer_details` (`id`, `influencer_id`, `bio`, `location`, `rating`, `join_date`, `total_reach`, `campaigns_count`, `email`, `phone`, `portfolio`, `achievements`, `recent_campaigns`, `engagement_rate`, `created_at`, `updated_at`) VALUES
(1, 1, 'Moda ve güzellik alanında 5 yıllık deneyime sahip content creator. Özgün içerikleri ve samimi yaklaşımıyla takipçilerinin gönlünde taht kurmuş bir influencer.', 'İstanbul', 4.90, '2019', '1.2M', 45, 'ayse@kesifcollective.com', '+90 555 123 4567', '[\"/fashion-post-1.png\",\"/placeholder-lkzbb.png\",\"/cozy-home-reading.png\",\"/fashion-post-2.png\",\"/makeup-tutorial.png\",\"/daily-routine.png\"]', '[\"En İyi Moda İnfluencer 2023\",\"100K+ Takipçi Ödülü\",\"Brand Partnership Excellence\"]', '[{\"brand\":\"Zara\",\"type\":\"Moda Koleksiyonu\",\"date\":\"Aralık 2024\"},{\"brand\":\"L\'Oréal\",\"type\":\"Güzellik Kampanyası\",\"date\":\"Kasım 2024\"},{\"brand\":\"Nike\",\"type\":\"Spor Giyim\",\"date\":\"Ekim 2024\"}]', '8.5%', '2025-08-29 16:35:43', '2025-08-29 16:35:43'),
(2, 2, 'Teknoloji uzmanı ve gaming içerik üreticisi. En son teknolojileri ve oyunları takipçileriyle paylaşan deneyimli bir influencer.', 'Ankara', 4.80, '2020', '2.1M', 38, 'mehmet@kesifcollective.com', '+90 555 234 5678', '[\"/turkish-tech-influencer.png\",\"/placeholder-qpm4f.png\",\"/digital-marketing-dashboard.png\",\"/digital-marketing-growth.png\"]', '[\"En İyi Teknoloji İnfluencer 2023\",\"500K+ Takipçi Ödülü\",\"Gaming Excellence Award\"]', '[{\"brand\":\"Samsung\",\"type\":\"Telefon İncelemesi\",\"date\":\"Aralık 2024\"},{\"brand\":\"NVIDIA\",\"type\":\"Gaming Donanımı\",\"date\":\"Kasım 2024\"},{\"brand\":\"Steam\",\"type\":\"Oyun Lansmanı\",\"date\":\"Ekim 2024\"}]', '12.3%', '2025-08-29 16:35:43', '2025-08-29 16:35:43'),
(3, 3, 'Profesyonel şef ve yemek blogger\'ı. Lezzetli tarifler ve restoran önerileriyle takipçilerini mutlu eden bir influencer.', 'İzmir', 4.70, '2018', '1.8M', 52, 'zeynep@kesifcollective.com', '+90 555 345 6789', '[\"/turkish-food-blogger-cooking.png\",\"/placeholder-rvppa.png\",\"/placeholder-3ckx3.png\",\"/placeholder-gl4lm.png\"]', '[\"En İyi Yemek İnfluencer 2023\",\"300K+ Takipçi Ödülü\",\"Culinary Excellence\"]', '[{\"brand\":\"Domino\'s\",\"type\":\"Pizza Kampanyası\",\"date\":\"Aralık 2024\"},{\"brand\":\"Nestlé\",\"type\":\"Mutfak Ürünleri\",\"date\":\"Kasım 2024\"},{\"brand\":\"McDonald\'s\",\"type\":\"Fast Food\",\"date\":\"Ekim 2024\"}]', '9.8%', '2025-08-29 16:35:43', '2025-08-29 16:35:43'),
(4, 4, 'Kişisel antrenör ve fitness motivatörü. Sağlıklı yaşam ve spor konularında uzmanlaşmış bir influencer.', 'Bursa', 4.90, '2021', '1.5M', 41, 'can@kesifcollective.com', '+90 555 456 7890', '[\"/turkish-fitness-influencer.png\",\"/placeholder-i736o.png\",\"/placeholder-xqkcl.png\"]', '[\"En İyi Fitness İnfluencer 2023\",\"200K+ Takipçi Ödülü\",\"Health & Wellness Award\"]', '[{\"brand\":\"Nike\",\"type\":\"Spor Giyim\",\"date\":\"Aralık 2024\"},{\"brand\":\"Adidas\",\"type\":\"Fitness Ekipmanları\",\"date\":\"Kasım 2024\"},{\"brand\":\"Under Armour\",\"type\":\"Spor Ayakkabı\",\"date\":\"Ekim 2024\"}]', '11.2%', '2025-08-29 16:35:43', '2025-08-29 16:35:43'),
(5, 5, 'Dünya gezgini ve seyahat fotoğrafçısı. Farklı kültürleri ve güzel mekanları takipçileriyle paylaşan bir influencer.', 'Antalya', 4.60, '2017', '2.3M', 67, 'elif@kesifcollective.com', '+90 555 567 8901', '[\"/turkish-influencer.png\",\"/placeholder-lkzbb.png\",\"/placeholder-qpm4f.png\",\"/placeholder-rvppa.png\"]', '[\"En İyi Seyahat İnfluencer 2023\",\"400K+ Takipçi Ödülü\",\"Travel Photography Award\"]', '[{\"brand\":\"Booking.com\",\"type\":\"Otel Rezervasyonu\",\"date\":\"Aralık 2024\"},{\"brand\":\"Turkish Airlines\",\"type\":\"Uçuş Kampanyası\",\"date\":\"Kasım 2024\"},{\"brand\":\"Airbnb\",\"type\":\"Konaklama\",\"date\":\"Ekim 2024\"}]', '7.9%', '2025-08-29 16:35:43', '2025-08-29 16:35:43'),
(6, 6, 'Eğlenceli içerik üreticisi ve vlogger. Günlük yaşamı ve eğlenceli anları takipçileriyle paylaşan bir influencer.', 'İstanbul', 4.50, '2022', '1.9M', 33, 'burak@kesifcollective.com', '+90 555 678 9012', '[\"/turkish-gaming-streamer.png\",\"/placeholder-3ckx3.png\",\"/placeholder-gl4lm.png\",\"/placeholder-i736o.png\"]', '[\"En İyi Vlog İnfluencer 2023\",\"250K+ Takipçi Ödülü\",\"Entertainment Award\"]', '[{\"brand\":\"Red Bull\",\"type\":\"Enerji İçeceği\",\"date\":\"Aralık 2024\"},{\"brand\":\"Twitch\",\"type\":\"Yayın Platformu\",\"date\":\"Kasım 2024\"},{\"brand\":\"Discord\",\"type\":\"Sosyal Platform\",\"date\":\"Ekim 2024\"}]', '6.8%', '2025-08-29 16:35:43', '2025-08-29 16:35:43');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `otp_codes`
--

CREATE TABLE `otp_codes` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `otp_code` varchar(6) NOT NULL,
  `type` enum('login','password_reset') NOT NULL,
  `is_used` tinyint(1) DEFAULT 0,
  `expires_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Tablo döküm verisi `otp_codes`
--

INSERT INTO `otp_codes` (`id`, `email`, `otp_code`, `type`, `is_used`, `expires_at`, `created_at`) VALUES
(1, 'admin@kesifcollective.com', '523310', 'login', 0, '2025-08-29 19:00:44', '2025-08-29 18:50:44');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `page_views`
--

CREATE TABLE `page_views` (
  `id` int(11) NOT NULL,
  `page_path` varchar(255) NOT NULL,
  `page_title` varchar(255) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `session_id` varchar(255) DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `referrer` varchar(500) DEFAULT NULL,
  `duration_seconds` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `site_logs`
--

CREATE TABLE `site_logs` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `session_id` varchar(255) DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `action` varchar(100) NOT NULL,
  `resource_type` varchar(50) DEFAULT NULL,
  `resource_id` int(11) DEFAULT NULL,
  `details` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`details`)),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `site_meta`
--

CREATE TABLE `site_meta` (
  `id` int(11) NOT NULL,
  `page_path` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `keywords` text DEFAULT NULL,
  `og_title` varchar(255) DEFAULT NULL,
  `og_description` text DEFAULT NULL,
  `og_image` varchar(500) DEFAULT NULL,
  `twitter_title` varchar(255) DEFAULT NULL,
  `twitter_description` text DEFAULT NULL,
  `twitter_image` varchar(500) DEFAULT NULL,
  `canonical_url` varchar(500) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `slider_images`
--

CREATE TABLE `slider_images` (
  `id` int(11) NOT NULL,
  `image_url` varchar(500) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `sort_order` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Tablo döküm verisi `slider_images`
--

INSERT INTO `slider_images` (`id`, `image_url`, `title`, `description`, `sort_order`, `is_active`, `created_at`, `updated_at`) VALUES
(1, '/digital-marketing-dashboard.png', 'Dijital Pazarlama Dashboard', 'Modern dijital pazarlama araçları ve analitik dashboard', 1, 1, '2025-08-29 18:50:19', '2025-08-29 18:50:19'),
(2, '/digital-marketing-growth.png', 'Pazarlama Büyümesi', 'Dijital pazarlama stratejileri ile büyüme grafikleri', 2, 1, '2025-08-29 18:50:19', '2025-08-29 18:50:19'),
(3, '/placeholder-si4p5.png', 'Influencer Marketing', 'Sosyal medya influencer pazarlama çözümleri', 3, 1, '2025-08-29 18:50:19', '2025-08-29 18:50:19'),
(4, '/turkish-influencer.png', 'Türk Influencer', 'Türkiye\'nin önde gelen influencer\'ları', 4, 1, '2025-08-29 18:50:19', '2025-08-29 18:50:19'),
(5, '/fashion-post-1.png', 'Moda İçerikleri', 'Trend moda ve lifestyle içerikleri', 5, 1, '2025-08-29 18:50:19', '2025-08-29 18:50:19');

--
-- Dökümü yapılmış tablolar için indeksler
--

--
-- Tablo için indeksler `about_content`
--
ALTER TABLE `about_content`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_about_content_type` (`type`),
  ADD KEY `idx_about_content_active` (`is_active`);

--
-- Tablo için indeksler `about_stats`
--
ALTER TABLE `about_stats`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_about_stats_active` (`is_active`),
  ADD KEY `idx_about_stats_order` (`sort_order`);

--
-- Tablo için indeksler `about_team`
--
ALTER TABLE `about_team`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_about_team_active` (`is_active`),
  ADD KEY `idx_about_team_order` (`sort_order`);

--
-- Tablo için indeksler `about_values`
--
ALTER TABLE `about_values`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_about_values_active` (`is_active`),
  ADD KEY `idx_about_values_order` (`sort_order`);

--
-- Tablo için indeksler `admin_users`
--
ALTER TABLE `admin_users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_admin_users_email` (`email`),
  ADD KEY `idx_admin_users_username` (`username`),
  ADD KEY `idx_admin_users_active` (`is_active`);

--
-- Tablo için indeksler `brands`
--
ALTER TABLE `brands`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_brands_active` (`is_active`),
  ADD KEY `idx_brands_order` (`sort_order`),
  ADD KEY `idx_brands_category` (`category`);

--
-- Tablo için indeksler `influencers`
--
ALTER TABLE `influencers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_influencers_category` (`category`),
  ADD KEY `idx_influencers_active` (`is_active`),
  ADD KEY `idx_influencers_order` (`sort_order`);

--
-- Tablo için indeksler `influencer_clicks`
--
ALTER TABLE `influencer_clicks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_influencer_clicks_influencer` (`influencer_id`),
  ADD KEY `idx_influencer_clicks_type` (`click_type`),
  ADD KEY `idx_influencer_clicks_created` (`created_at`);

--
-- Tablo için indeksler `influencer_details`
--
ALTER TABLE `influencer_details`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_influencer_details_influencer_id` (`influencer_id`);

--
-- Tablo için indeksler `otp_codes`
--
ALTER TABLE `otp_codes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_otp_email` (`email`),
  ADD KEY `idx_otp_expires` (`expires_at`),
  ADD KEY `idx_otp_used` (`is_used`);

--
-- Tablo için indeksler `page_views`
--
ALTER TABLE `page_views`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_page_views_path` (`page_path`),
  ADD KEY `idx_page_views_user` (`user_id`),
  ADD KEY `idx_page_views_created` (`created_at`);

--
-- Tablo için indeksler `site_logs`
--
ALTER TABLE `site_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_site_logs_user` (`user_id`),
  ADD KEY `idx_site_logs_action` (`action`),
  ADD KEY `idx_site_logs_created` (`created_at`);

--
-- Tablo için indeksler `site_meta`
--
ALTER TABLE `site_meta`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `page_path` (`page_path`),
  ADD KEY `idx_site_meta_path` (`page_path`),
  ADD KEY `idx_site_meta_active` (`is_active`);

--
-- Tablo için indeksler `slider_images`
--
ALTER TABLE `slider_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_slider_active` (`is_active`),
  ADD KEY `idx_slider_order` (`sort_order`),
  ADD KEY `idx_slider_created` (`created_at`);

--
-- Dökümü yapılmış tablolar için AUTO_INCREMENT değeri
--

--
-- Tablo için AUTO_INCREMENT değeri `about_content`
--
ALTER TABLE `about_content`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Tablo için AUTO_INCREMENT değeri `about_stats`
--
ALTER TABLE `about_stats`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Tablo için AUTO_INCREMENT değeri `about_team`
--
ALTER TABLE `about_team`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Tablo için AUTO_INCREMENT değeri `about_values`
--
ALTER TABLE `about_values`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Tablo için AUTO_INCREMENT değeri `admin_users`
--
ALTER TABLE `admin_users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Tablo için AUTO_INCREMENT değeri `brands`
--
ALTER TABLE `brands`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- Tablo için AUTO_INCREMENT değeri `influencers`
--
ALTER TABLE `influencers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Tablo için AUTO_INCREMENT değeri `influencer_clicks`
--
ALTER TABLE `influencer_clicks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Tablo için AUTO_INCREMENT değeri `influencer_details`
--
ALTER TABLE `influencer_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Tablo için AUTO_INCREMENT değeri `otp_codes`
--
ALTER TABLE `otp_codes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Tablo için AUTO_INCREMENT değeri `page_views`
--
ALTER TABLE `page_views`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Tablo için AUTO_INCREMENT değeri `site_logs`
--
ALTER TABLE `site_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Tablo için AUTO_INCREMENT değeri `site_meta`
--
ALTER TABLE `site_meta`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Tablo için AUTO_INCREMENT değeri `slider_images`
--
ALTER TABLE `slider_images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Dökümü yapılmış tablolar için kısıtlamalar
--

--
-- Tablo kısıtlamaları `influencer_clicks`
--
ALTER TABLE `influencer_clicks`
  ADD CONSTRAINT `influencer_clicks_ibfk_1` FOREIGN KEY (`influencer_id`) REFERENCES `influencers` (`id`) ON DELETE CASCADE;

--
-- Tablo kısıtlamaları `influencer_details`
--
ALTER TABLE `influencer_details`
  ADD CONSTRAINT `influencer_details_ibfk_1` FOREIGN KEY (`influencer_id`) REFERENCES `influencers` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
