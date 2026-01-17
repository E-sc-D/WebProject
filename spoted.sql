CREATE DATABASE IF NOT EXISTS SPOTTED;
USE SPOTTED;

CREATE TABLE admin (
    admin_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL
);

CREATE TABLE post (
    post_id INT AUTO_INCREMENT PRIMARY KEY,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    admin_id INT,
    FOREIGN KEY (admin_id) REFERENCES admin(admin_id)
        ON DELETE SET NULL
);

CREATE TABLE comment (
    comment_id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES post(post_id)
        ON DELETE CASCADE
);

CREATE TABLE post_like (
    like_id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT NOT NULL,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES post(post_id)
        ON DELETE CASCADE
);

CREATE TABLE report (
    report_id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT NOT NULL,
    reason VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES post(post_id)
        ON DELETE CASCADE
);
-- Admin
INSERT INTO admin (username, password_hash) VALUES
('admin', '$2y$10$abcdefghijklmnopqrstuv'),
('moderatore', '$2y$10$1234567890abcdefghijkl');

-- Post
INSERT INTO post (content, status, admin_id) VALUES
('Ho visto un gatto enorme oggi!', 'approved', 1),
('Qualcuno sa chi ha lasciato un messaggio sul muro?', 'approved', 2),
('Ciao a tutti, sono nuovo qui!', 'pending', NULL),
('Post divertente sulla mensa universitaria', 'approved', 1);

-- Comment
INSERT INTO comment (post_id, content) VALUES
(1, 'Che bello! Dove lo hai visto?'),
(1, 'Wow, enorme davvero!'),
(2, 'Non lo so, qualcuno ha informazioni?'),
(4, 'Haha, troppo vero!');

-- Like
INSERT INTO post_like (post_id, ip_address) VALUES
(1, '192.168.1.2'),
(1, '192.168.1.3'),
(2, '192.168.1.4'),
(4, '192.168.1.5'),
(4, '192.168.1.6');

-- Report
INSERT INTO report (post_id, reason) VALUES
(3, 'Messaggio sospetto'),
(2, 'Spam apparente');

