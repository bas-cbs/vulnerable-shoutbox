CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY,
    user TEXT,
    content TEXT
);


INSERT OR IGNORE INTO posts (id, user, content) VALUES 
(1, 'janine', 'hello world'),
(2, 'bertrand', 'cool post'),
(3, 'jan', 'very nice');
