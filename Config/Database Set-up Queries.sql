create database fumorrow;
use fumorrow;
create table category_managers(name varchar(255) not null, username varchar(255), email varchar(255) not null, password_digest varchar(255) not null, privilages INTEGER(15) not null, is_approved integer(2) not null, primary key(username));
create table celebrities (pid integer(100) auto_increment, first_name varchar(50) not null, middle_name varchar(50), last_name varchar(50), profession varchar(200) not null, dob date not null, description varchar(3000), gender char not null, image_link varchar(255), is_approved integer(2) not null, primary key (pid), unique key `uid` (first_name, middle_name, last_name, profession, gender, dob));
create table partners (partner_id integer(100) auto_increment, name varchar(100) not null, type varchar(50) not null, primary key (partner_id), is_approved integer(2) not null, unique key `upartner` (name, type));
create table partner_industry (partner_id integer(100), industry varchar(50), relationship varchar(50), redirect_url varchar(255), logo_url varchar(255), contact_number integer(15), address varchar(300), foreign key(partner_id) references partners(partner_id));