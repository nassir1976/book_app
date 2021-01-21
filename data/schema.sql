DROP TABLE IF EXISTS shelf;
CREATE TABLE shelf(
  id SERIAL PRIMARY KEY,
  authors VARCHAR(255),
  title VARCHAR(255),
  img_url VARCHAR(255),
  isbn VARCHAR(255),
  description TEXT

 
);