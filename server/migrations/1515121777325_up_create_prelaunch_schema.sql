create schema prelaunch;

create table prelaunch.registration (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(60),
  last_name VARCHAR(60),
  email VARCHAR(120) UNIQUE,
  avatar_url VARCHAR(1024), 
  postal_code    VARCHAR(10),
  facebook_id    VARCHAR(60),
  facebook_name  VARCHAR(120),
  facebook_email VARCHAR(120),
  facebook_avatar VARCHAR(1024)
);