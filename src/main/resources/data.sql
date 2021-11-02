insert into users (email, password, username) values ('bob@gmail.com', 'bob123', 'bob');
insert into users (email, password, username) values ('george@gmail.com', 'george123', 'george');

insert into rooms (name, height, width) values ('dining room', 10, 4);
insert into rooms (name, height, width) values ('kitchen', 10, 4);
insert into rooms (name, height, width) values ('powder room', 10, 4);
insert into rooms (name, height, width) values ('ball room', 10, 4);

insert into users_rooms (user_id, rooms_id) values (1, 1);
insert into users_rooms (user_id, rooms_id) values (1, 2);
insert into users_rooms (user_id, rooms_id) values (1, 3);
insert into users_rooms (user_id, rooms_id) values (2, 4);

