CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY,
    user TEXT,
    content TEXT
);

CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    username TEXT,
    email TEXT,
    hashed_password TEXT
);

CREATE TABLE IF NOT EXISTS profiles (
    id INTEGER PRIMARY KEY,
    username TEXT,
    email TEXT,
    description TEXT,
    bsn TEXT
);

INSERT OR IGNORE INTO users (id, username, email, hashed_password) VALUES 
(1, 'johndoe', 'johndoe@example.com', '$argon2id$v=19$m=65536,t=3,p=4$wagCPXjifgvUFBzq4hqe3w$CYaIb8sB+wtD+Vu/P4uod1+Qof8h+1g7bbDlBID48Rc'),
(2, 'admin', 'admin@example.com', '$argon2id$v=19$m=65536,t=3,p=4$Bqa+5Pq0OBHAsgjA0sqXlA$0W//NxT+dLz/Sqa73UEHcS6aWMs+p2NbewLYxtX5Nf0');

INSERT OR IGNORE INTO posts (id, user, content) VALUES 
(1, 'janine', 'hello world'),
(2, 'bertrand', 'cool post'),
(3, 'jan', 'very nice');

INSERT OR IGNORE INTO profiles (id, username, email, description, bsn) VALUES 
(1, 'janine', 'janine@gmail.com', 'Thank for checking my profile!', NULL),
(2, 'jan', 'jan@example.com', 'Not sure what to write here...', 'FLAG:S3ns!tiveInf0');
