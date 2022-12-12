-- Creates -------------------------------------------------------

CREATE TABLE IF NOT EXISTS account (
  UserId INT NOT NULL AUTO_INCREMENT,
  Name VARCHAR(200) NOT NULL UNIQUE,
  Password TEXT NOT NULL,
  PRIMARY KEY (UserId)
);

CREATE TABLE IF NOT EXISTS profile (
  ProfileId INT NOT NULL AUTO_INCREMENT,
  UserId INT NOT NULL,
  Username TEXT NOT NULL,
  CatDollars INT NOT NULL DEFAULT 100,
  PRIMARY KEY (ProfileId),
  FOREIGN KEY (UserId) REFERENCES account (UserId)
);

CREATE TABLE IF NOT EXISTS card (
  CardId INT NOT NULL AUTO_INCREMENT,
  Name TEXT NOT NULL,
  Rarity TEXT NOT NULL,
  Value INT NOT NULL DEFAULT 0,
  Rate DOUBLE NOT NULL,
  ImageURL TEXT NOT NULL,
  PRIMARY KEY (CardId)
);

CREATE TABLE IF NOT EXISTS inventory (
  InventoryId INT NOT NULL AUTO_INCREMENT,
  ProfileId INT NOT NULL,
  CardId INT NOT NULL,
  Favourited BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (ProfileId) REFERENCES profile (ProfileId),
  FOREIGN KEY (CardId) REFERENCES card (CardId),
  PRIMARY KEY (InventoryId)
);

-- Inserts -------------------------------------------------------

INSERT IGNORE INTO account (Name, Password)
  VALUES
  ('gamerboy', 'password1'),
  ('gamergirl', 'qwertyuiop'),
  ('gamerdad', 'christiandadrock12'),
  ('angelokyrilov1', 'd3m0cr4cY2323'),
  ('ucmITofficial', 'rufusluvr90210');

INSERT IGNORE INTO profile (UserId, UserName)
  SELECT UserId, 'Account 1' as UserName
FROM account;

INSERT INTO card (Name, Rarity, Value, Rate, ImageURL)
  VALUES
    ('Angelo Kyrilov', 'Common', 10, 0.17, 'Angelo_Kyrilov/Angelo_Kyrilov.jpg'),
    ('Santosh Chandrasekhar', 'Common', 10, 0.17, 'Santosh Chandrasekhar/Santosh Chandrasekhar.jpg'),
    ('Pengfei Su', 'Common', 10, 0.17, 'Pengfei Su/Pengfei Su.jpg'),
    ('Shawn Newsam', 'Common', 10, 0.17, 'Shawn Newsam/Shawn Newsam.jpg'),
    ('Florin Rusu', 'Common', 10, 0.17, 'Florin Rusu/Florin Rusu.jpg'),
    ('Judge Kyrilov', 'Rare', 350, 0.022, 'Angelo_Kyrilov/Judge Kyrilov.jpg'),
    ('Angelo Pixelov', 'Rare', 350, 0.022, 'Angelo_Kyrilov/Angelo Pixelov.jpg'),
    ('Captain Kyrilov', 'Rare', 350, 0.022, 'Angelo_Kyrilov/Captain Kyrilov.jpg'),
    ('Definitely Not Angelo', 'Rare', 350, 0.022, 'Angelo_Kyrilov/Definitely Not Angelo.jpg'),
    ('Santosh Claus', 'Rare', 350, 0.022, 'Santosh Chandrasekhar/Santosh Clause.jpg'),
    ('Santosh The Wise', 'Rare', 350, 0.022, 'Santosh Chandrasekhar/Santosh The Wise.jpg'),
    ('Saint Tosh', 'Rare', 350, 0.022, 'Santosh Chandrasekhar/Saint Tosh.jpg'),
    ('Punished Venom Santosh', 'Rare', 20000, 0.008, 'Santosh Chandrasekhar/Punished Venom Santosh.jpg'),
    ('Pengfei Soup', 'Rare', 350, 0.022, 'Pengfei Su/Pengfei Soup.jpg'),
    ('Clownfei Su', 'Rare', 350, 0.022, 'Pengfei Su/Clownfei Su.jpg'),
    ('Neer Su Well', 'Rare', 350, 0.022, 'Pengfei Su/Neer Su Well.jpg'),
    ('Pengfei Soon', 'Rare', 350, 0.022, 'Pengfei Su/Pengfei Soon.jpg'),
    ('New Year New-Sam', 'Rare', 350, 0.022, 'Shawn Newsam/New Year New-Sam.jpg'),
    ('Newsam, Shawn Newsam', 'Rare', 350, 0.022, 'Shawn Newsam/Newsam, Shawn Newsam.jpg'),
    ('Shawn Oldsam', 'Rare', 350, 0.022, 'Shawn Newsam/Shawn Oldsam.jpg'),
    ('Shawn Rising', 'Rare', 350, 0.022, 'Shawn Newsam/Shawn Rising.jpg'),
    ('Floral Rusu', 'Rare', 350, 0.022, 'Florin Rusu/Floral Rusu.jpg'),
    ('Florin it Rusu', 'Rare', 350, 0.022, 'Florin Rusu/Florin it Rusu.jpg'),
    ('Rusu of Greed', 'Rare', 350, 0.022, 'Florin Rusu/Rusu of Greed.jpg'),
    ('The Florin Twenties', 'Rare', 350, 0.022, 'Florin Rusu/The Florin Twenties.jpg'),
    ('Angelo, The Last', 'Legendary', 20000, 0.004, 'Angelo_Kyrilov/Angelo, The Last.jpg'),
    ('JoJos Sekhar Adventure', 'Legendary', 20000, 0.008, 'Santosh Chandrasekhar/JoJos Sekhar Adventure.jpg'),
    ('Pengflame Su', 'Legendary', 20000, 0.008, 'Pengfei Su/Pengflame Sun.jpg'),
    ('Shawn-thousand B.C.', 'Legendary', 20000, 0.008, 'Shawn Newsam/Shawn-thousand B.C..jpg'),
    ('R.U.S.U 9000', 'Legendary', 20000, 0.008, 'Florin Rusu/R.U.S.U. 9000.jpg');