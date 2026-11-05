CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    username TEXT,
    hashed_password TEXT
);

CREATE TABLE IF NOT EXISTS profiles (
    id INTEGER PRIMARY KEY,
    user_id INTEGER,
    email TEXT,
    description TEXT,
    bsn TEXT,
    CONSTRAINT fk_users FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY,
    user_id INTEGER,
    content TEXT,
    CONSTRAINT fk_users FOREIGN KEY (user_id) REFERENCES users(id)
);


CREATE VIEW IF NOT EXISTS users_posts AS
SELECT posts.id, users.username, posts.content
FROM posts
LEFT JOIN users ON posts.user_id = users.id;

CREATE VIEW IF NOT EXISTS users_profiles AS
SELECT profiles.id, users.username, profiles.email, profiles.description, profiles.bsn
FROM profiles
LEFT JOIN users ON profiles.user_id = users.id;


INSERT OR IGNORE INTO users (id, username, hashed_password) VALUES 
(1, 'johndoe', '$argon2id$v=19$m=65536,t=3,p=4$wagCPXjifgvUFBzq4hqe3w$CYaIb8sB+wtD+Vu/P4uod1+Qof8h+1g7bbDlBID48Rc'),
(2, 'janine', '$argon2id$v=19$m=65536,t=3,p=4$wagCPXjifgvUFBzq4hqe3w$CYaIb8sB+wtD+Vu/P4uod1+Qof8h+1g7bbDlBID48Rc'),
(3, 'bertrand', '$argon2id$v=19$m=65536,t=3,p=4$wagCPXjifgvUFBzq4hqe3w$CYaIb8sB+wtD+Vu/P4uod1+Qof8h+1g7bbDlBID48Rc'),
(4, 'jan', '$argon2id$v=19$m=65536,t=3,p=4$wagCPXjifgvUFBzq4hqe3w$CYaIb8sB+wtD+Vu/P4uod1+Qof8h+1g7bbDlBID48Rc'),
(5, 'admin', '$argon2id$v=19$m=65536,t=3,p=4$Bqa+5Pq0OBHAsgjA0sqXlA$0W//NxT+dLz/Sqa73UEHcS6aWMs+p2NbewLYxtX5Nf0'),
(6, 'anonymous', NULL);

INSERT OR IGNORE INTO profiles (id, user_id, email, description, bsn) VALUES 
(1, 2, 'janine@gmail.com', 'Thank for checking my profile!', NULL),
(2, 3, 'bertrand@gmail.com', 'Wonderful days :)', NULL),
(3, 4, 'jan@example.com', 'Not sure what to write here...', 'FLAG:S3ns!tiveInf0');

INSERT OR IGNORE INTO posts (id, user_id, content) VALUES 
(1, 2, 'hello world'),
(2, 3, 'cool post'),
(3, 4, 'very nice');

