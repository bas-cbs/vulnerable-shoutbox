CREATE TABLE IF NOT EXISTS profiles (
    id INTEGER PRIMARY KEY,
    username TEXT,
    description TEXT
);

INSERT OR IGNORE INTO profiles (id, username, description) VALUES 
(1, 'janine', 'Thank for checking my profile!'),
(2, 'bertrand', 'Wonderful days :)'),
(3, 'jan', 'Not sure what to write here...');

