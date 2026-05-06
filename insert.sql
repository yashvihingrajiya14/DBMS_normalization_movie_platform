-- ═══════════════════════════════════════════════════════════════
--  CineDB — Movie Streaming Platform
--  insert.sql  |  Indian OTT Dataset
--  60+ rows across all tables
-- ═══════════════════════════════════════════════════════════════

SET DEFINE OFF;
SET FEEDBACK ON;

-- Movies
INSERT INTO Movies VALUES (1,  'Sacred Games',          'Crime Thriller',    'Hindi',   2018, 'Vikramaditya Motwane');
INSERT INTO Movies VALUES (2,  'Mirzapur',              'Crime Drama',        'Hindi',   2018, 'Karan Anshuman');
INSERT INTO Movies VALUES (3,  'Panchayat',             'Comedy Drama',       'Hindi',   2020, 'Deepak Kumar Mishra');
INSERT INTO Movies VALUES (4,  'The Family Man',        'Action Thriller',    'Hindi',   2019, 'Raj & DK');
INSERT INTO Movies VALUES (5,  'Scam 1992',             'Biography',          'Hindi',   2020, 'Hansal Mehta');
INSERT INTO Movies VALUES (6,  'Delhi Crime',           'Crime Drama',        'Hindi',   2019, 'Richie Mehta');
INSERT INTO Movies VALUES (7,  'Kota Factory',          'Drama',              'Hindi',   2019, 'Pratish Mehta');
INSERT INTO Movies VALUES (8,  'Breathe',               'Thriller',           'Hindi',   2018, 'Mayank Sharma');
INSERT INTO Movies VALUES (9,  'Four More Shots Please','Comedy',             'Hindi',   2019, 'Anu Menon');
INSERT INTO Movies VALUES (10, 'Inside Edge',           'Sports Drama',       'Hindi',   2017, 'Karan Anshuman');
INSERT INTO Movies VALUES (11, 'Tandav',                'Political Thriller', 'Hindi',   2021, 'Ali Abbas Zafar');
INSERT INTO Movies VALUES (12, 'Paatal Lok',            'Crime Thriller',     'Hindi',   2020, 'Avinash Arun');
INSERT INTO Movies VALUES (13, 'Maharani',              'Political Drama',    'Hindi',   2021, 'Karan Sharma');
INSERT INTO Movies VALUES (14, 'Aranyak',               'Mystery Thriller',   'Hindi',   2021, 'Vinay Waikul');
INSERT INTO Movies VALUES (15, 'The Disciple',          'Music Drama',        'Marathi', 2020, 'Chaitanya Tamhane');
INSERT INTO Movies VALUES (16, 'Jamtara',               'Crime Drama',        'Hindi',   2020, 'Soumendra Padhi');
INSERT INTO Movies VALUES (17, 'Rocket Boys',           'Biography',          'Hindi',   2022, 'Abhay Pannu');
INSERT INTO Movies VALUES (18, 'Aspirants',             'Drama',              'Hindi',   2021, 'Apoorv Singh Karki');
INSERT INTO Movies VALUES (19, 'Girls Hostel',          'Comedy',             'Hindi',   2018, 'Ayappa KM');
INSERT INTO Movies VALUES (20, 'College Romance',       'Romantic Comedy',    'Hindi',   2018, 'Simarpreet Singh');
INSERT INTO Movies VALUES (21, 'Suzhal',                'Crime Thriller',     'Tamil',   2022, 'Bramma G');
INSERT INTO Movies VALUES (22, 'Farzi',                 'Crime Thriller',     'Hindi',   2023, 'Raj & DK');
INSERT INTO Movies VALUES (23, 'Jubilee',               'Period Drama',       'Hindi',   2023, 'Vikramaditya Motwane');
INSERT INTO Movies VALUES (24, 'Dahaad',                'Crime Thriller',     'Hindi',   2023, 'Reema Kagti');
INSERT INTO Movies VALUES (25, 'Mirzapur S2',           'Crime Drama',        'Hindi',   2020, 'Gurmmeet Singh');
INSERT INTO Movies VALUES (26, 'The Fame Game',         'Thriller',           'Hindi',   2022, 'Bejoy Nambiar');
INSERT INTO Movies VALUES (27, 'Tripling',              'Comedy Drama',       'Hindi',   2016, 'Sameer Saxena');
INSERT INTO Movies VALUES (28, 'Permanent Roommates',   'Romantic Comedy',    'Hindi',   2014, 'Arunabh Kumar');
INSERT INTO Movies VALUES (29, 'Pitchers',              'Drama',              'Hindi',   2015, 'Amit Golani');
INSERT INTO Movies VALUES (30, 'The Forgotten Army',    'Historical',         'Hindi',   2020, 'Kabir Khan');
INSERT INTO Movies VALUES (31, 'Guilty Minds',          'Legal Drama',        'Hindi',   2022, 'Shefali Bhushan');
INSERT INTO Movies VALUES (32, 'Hiccups & Hookups',     'Romantic Comedy',    'Hindi',   2021, 'Kunal Kohli');
INSERT INTO Movies VALUES (33, 'Bloody Brothers',       'Crime Comedy',       'Hindi',   2022, 'Danish Aslam');
INSERT INTO Movies VALUES (34, 'Yeh Meri Family',       'Family Drama',       'Hindi',   2018, 'Sameer Saxena');
INSERT INTO Movies VALUES (35, 'Leila',                 'Dystopian',          'Hindi',   2019, 'Deepa Mehta');

-- users
INSERT INTO Users VALUES (101, 'Aarav Sharma',      'aarav.sharma@gmail.com',     'Mumbai',           'Maharashtra');
INSERT INTO Users VALUES (102, 'Riya Patel',        'riya.patel@gmail.com',       'Ahmedabad',        'Gujarat');
INSERT INTO Users VALUES (103, 'Kabir Singh',       'kabir.singh@gmail.com',      'Delhi',            'Delhi');
INSERT INTO Users VALUES (104, 'Ananya Gupta',      'ananya.gupta@gmail.com',     'Bangalore',        'Karnataka');
INSERT INTO Users VALUES (105, 'Vikram Mehta',      'vikram.mehta@gmail.com',     'Surat',            'Gujarat');
INSERT INTO Users VALUES (106, 'Priya Nair',        'priya.nair@gmail.com',       'Kochi',            'Kerala');
INSERT INTO Users VALUES (107, 'Rohan Desai',       'rohan.desai@gmail.com',      'Pune',             'Maharashtra');
INSERT INTO Users VALUES (108, 'Sneha Reddy',       'sneha.reddy@gmail.com',      'Hyderabad',        'Telangana');
INSERT INTO Users VALUES (109, 'Arjun Verma',       'arjun.verma@gmail.com',      'Jaipur',           'Rajasthan');
INSERT INTO Users VALUES (110, 'Diya Iyer',         'diya.iyer@gmail.com',        'Chennai',          'Tamil Nadu');
INSERT INTO Users VALUES (111, 'Aditya Kumar',      'aditya.kumar@gmail.com',     'Kolkata',          'West Bengal');
INSERT INTO Users VALUES (112, 'Meera Joshi',       'meera.joshi@gmail.com',      'Lucknow',          'Uttar Pradesh');
INSERT INTO Users VALUES (113, 'Harsh Pandey',      'harsh.pandey@gmail.com',     'Varanasi',         'Uttar Pradesh');
INSERT INTO Users VALUES (114, 'Kavya Menon',       'kavya.menon@gmail.com',      'Thiruvananthapuram','Kerala');
INSERT INTO Users VALUES (115, 'Siddharth Rao',     'sid.rao@gmail.com',          'Bangalore',        'Karnataka');
INSERT INTO Users VALUES (116, 'Tanvi Shah',        'tanvi.shah@gmail.com',       'Ahmedabad',        'Gujarat');
INSERT INTO Users VALUES (117, 'Manav Chopra',      'manav.chopra@gmail.com',     'Delhi',            'Delhi');
INSERT INTO Users VALUES (118, 'Ishaan Tiwari',     'ishaan.tiwari@gmail.com',    'Bhopal',           'Madhya Pradesh');
INSERT INTO Users VALUES (119, 'Naina Agarwal',     'naina.agarwal@gmail.com',    'Indore',           'Madhya Pradesh');
INSERT INTO Users VALUES (120, 'Rahul Bose',        'rahul.bose@gmail.com',       'Mumbai',           'Maharashtra');
INSERT INTO Users VALUES (121, 'Sakshi Malhotra',   'sakshi.m@gmail.com',         'Chandigarh',       'Punjab');
INSERT INTO Users VALUES (122, 'Dev Kapoor',        'dev.kapoor@gmail.com',       'Delhi',            'Delhi');
INSERT INTO Users VALUES (123, 'Pooja Mishra',      'pooja.mishra@gmail.com',     'Patna',            'Bihar');
INSERT INTO Users VALUES (124, 'Kunal Mathur',      'kunal.mathur@gmail.com',     'Noida',            'Uttar Pradesh');
INSERT INTO Users VALUES (125, 'Ayesha Khan',       'ayesha.khan@gmail.com',      'Hyderabad',        'Telangana');
INSERT INTO Users VALUES (126, 'Nikhil Sinha',      'nikhil.sinha@gmail.com',     'Ranchi',           'Jharkhand');
INSERT INTO Users VALUES (127, 'Swati Bhat',        'swati.bhat@gmail.com',       'Mangalore',        'Karnataka');
INSERT INTO Users VALUES (128, 'Yash Tripathi',     'yash.tripathi@gmail.com',    'Allahabad',        'Uttar Pradesh');
INSERT INTO Users VALUES (129, 'Shreya Chatterjee', 'shreya.c@gmail.com',         'Kolkata',          'West Bengal');
INSERT INTO Users VALUES (130, 'Akash Pillai',      'akash.pillai@gmail.com',     'Trivandrum',       'Kerala');

-- SUBSCRIPTIONS
INSERT INTO Subscriptions VALUES (201,101,'Premium',499,10,TO_DATE('2024-01-01','YYYY-MM-DD'),TO_DATE('2024-12-31','YYYY-MM-DD'));
INSERT INTO Subscriptions VALUES (202,102,'Basic',  149, 0,TO_DATE('2024-02-01','YYYY-MM-DD'),TO_DATE('2024-07-31','YYYY-MM-DD'));
INSERT INTO Subscriptions VALUES (203,103,'Premium',499,10,TO_DATE('2024-01-15','YYYY-MM-DD'),TO_DATE('2024-12-15','YYYY-MM-DD'));
INSERT INTO Subscriptions VALUES (204,104,'Mobile',  99, 5,TO_DATE('2024-03-01','YYYY-MM-DD'),TO_DATE('2024-08-31','YYYY-MM-DD'));
INSERT INTO Subscriptions VALUES (205,105,'Basic',  149, 0,TO_DATE('2024-04-01','YYYY-MM-DD'),TO_DATE('2024-09-30','YYYY-MM-DD'));
INSERT INTO Subscriptions VALUES (206,106,'Premium',499,10,TO_DATE('2024-01-01','YYYY-MM-DD'),TO_DATE('2024-12-31','YYYY-MM-DD'));
INSERT INTO Subscriptions VALUES (207,107,'Annual',1499,20,TO_DATE('2024-01-01','YYYY-MM-DD'),TO_DATE('2024-12-31','YYYY-MM-DD'));
INSERT INTO Subscriptions VALUES (208,108,'Basic',  149, 0,TO_DATE('2024-02-15','YYYY-MM-DD'),TO_DATE('2024-08-15','YYYY-MM-DD'));
INSERT INTO Subscriptions VALUES (209,109,'Premium',499,10,TO_DATE('2024-03-01','YYYY-MM-DD'),TO_DATE('2024-08-31','YYYY-MM-DD'));
INSERT INTO Subscriptions VALUES (210,110,'Mobile',  99, 5,TO_DATE('2024-04-01','YYYY-MM-DD'),TO_DATE('2024-09-30','YYYY-MM-DD'));
INSERT INTO Subscriptions VALUES (211,111,'Annual',1499,20,TO_DATE('2024-01-01','YYYY-MM-DD'),TO_DATE('2024-12-31','YYYY-MM-DD'));
INSERT INTO Subscriptions VALUES (212,112,'Basic',  149, 0,TO_DATE('2024-02-01','YYYY-MM-DD'),TO_DATE('2024-07-31','YYYY-MM-DD'));
INSERT INTO Subscriptions VALUES (213,113,'Premium',499,10,TO_DATE('2024-03-15','YYYY-MM-DD'),TO_DATE('2024-09-15','YYYY-MM-DD'));
INSERT INTO Subscriptions VALUES (214,114,'Mobile',  99, 5,TO_DATE('2024-01-01','YYYY-MM-DD'),TO_DATE('2024-06-30','YYYY-MM-DD'));
INSERT INTO Subscriptions VALUES (215,115,'Annual',1499,20,TO_DATE('2024-01-01','YYYY-MM-DD'),TO_DATE('2024-12-31','YYYY-MM-DD'));
INSERT INTO Subscriptions VALUES (216,116,'Basic',  149, 0,TO_DATE('2024-04-01','YYYY-MM-DD'),TO_DATE('2024-09-30','YYYY-MM-DD'));
INSERT INTO Subscriptions VALUES (217,117,'Premium',499,10,TO_DATE('2024-02-01','YYYY-MM-DD'),TO_DATE('2024-07-31','YYYY-MM-DD'));
INSERT INTO Subscriptions VALUES (218,118,'Mobile',  99, 5,TO_DATE('2024-03-01','YYYY-MM-DD'),TO_DATE('2024-08-31','YYYY-MM-DD'));
INSERT INTO Subscriptions VALUES (219,119,'Basic',  149, 0,TO_DATE('2024-01-15','YYYY-MM-DD'),TO_DATE('2024-07-15','YYYY-MM-DD'));
INSERT INTO Subscriptions VALUES (220,120,'Annual',1499,20,TO_DATE('2024-01-01','YYYY-MM-DD'),TO_DATE('2024-12-31','YYYY-MM-DD'));
INSERT INTO Subscriptions VALUES (221,121,'Premium',499,10,TO_DATE('2024-04-01','YYYY-MM-DD'),TO_DATE('2024-09-30','YYYY-MM-DD'));
INSERT INTO Subscriptions VALUES (222,122,'Basic',  149, 0,TO_DATE('2024-02-15','YYYY-MM-DD'),TO_DATE('2024-08-15','YYYY-MM-DD'));
INSERT INTO Subscriptions VALUES (223,123,'Mobile',  99, 5,TO_DATE('2024-03-01','YYYY-MM-DD'),TO_DATE('2024-08-31','YYYY-MM-DD'));
INSERT INTO Subscriptions VALUES (224,124,'Premium',499,10,TO_DATE('2024-01-01','YYYY-MM-DD'),TO_DATE('2024-06-30','YYYY-MM-DD'));
INSERT INTO Subscriptions VALUES (225,125,'Annual',1499,20,TO_DATE('2024-01-01','YYYY-MM-DD'),TO_DATE('2024-12-31','YYYY-MM-DD'));
INSERT INTO Subscriptions VALUES (226,126,'Basic',  149, 0,TO_DATE('2024-03-01','YYYY-MM-DD'),TO_DATE('2024-08-31','YYYY-MM-DD'));
INSERT INTO Subscriptions VALUES (227,127,'Mobile',  99, 5,TO_DATE('2024-04-01','YYYY-MM-DD'),TO_DATE('2024-09-30','YYYY-MM-DD'));
INSERT INTO Subscriptions VALUES (228,128,'Premium',499,10,TO_DATE('2024-02-01','YYYY-MM-DD'),TO_DATE('2024-07-31','YYYY-MM-DD'));
INSERT INTO Subscriptions VALUES (229,129,'Annual',1499,20,TO_DATE('2024-01-01','YYYY-MM-DD'),TO_DATE('2024-12-31','YYYY-MM-DD'));
INSERT INTO Subscriptions VALUES (230,130,'Basic',  149, 0,TO_DATE('2024-03-15','YYYY-MM-DD'),TO_DATE('2024-09-15','YYYY-MM-DD'));

--  WATCH HISTORY
INSERT INTO WatchHistory VALUES (1001,101,1, TO_DATE('2024-01-05','YYYY-MM-DD'),5,'Smart TV',45);
INSERT INTO WatchHistory VALUES (1002,101,2, TO_DATE('2024-01-10','YYYY-MM-DD'),4,'Mobile',  60);
INSERT INTO WatchHistory VALUES (1003,102,3, TO_DATE('2024-02-03','YYYY-MM-DD'),5,'Laptop',  50);
INSERT INTO WatchHistory VALUES (1004,102,5, TO_DATE('2024-02-15','YYYY-MM-DD'),5,'Smart TV',55);
INSERT INTO WatchHistory VALUES (1005,103,1, TO_DATE('2024-01-20','YYYY-MM-DD'),4,'Mobile',  45);
INSERT INTO WatchHistory VALUES (1006,103,4, TO_DATE('2024-01-25','YYYY-MM-DD'),5,'Smart TV',60);
INSERT INTO WatchHistory VALUES (1007,104,6, TO_DATE('2024-03-02','YYYY-MM-DD'),4,'Tablet',  50);
INSERT INTO WatchHistory VALUES (1008,104,7, TO_DATE('2024-03-10','YYYY-MM-DD'),5,'Laptop',  45);
INSERT INTO WatchHistory VALUES (1009,105,2, TO_DATE('2024-04-01','YYYY-MM-DD'),3,'Mobile',  60);
INSERT INTO WatchHistory VALUES (1010,105,8, TO_DATE('2024-04-05','YYYY-MM-DD'),4,'Smart TV',40);
INSERT INTO WatchHistory VALUES (1011,106,3, TO_DATE('2024-01-12','YYYY-MM-DD'),5,'Smart TV',50);
INSERT INTO WatchHistory VALUES (1012,106,9, TO_DATE('2024-01-18','YYYY-MM-DD'),4,'Mobile',  55);
INSERT INTO WatchHistory VALUES (1013,107,4, TO_DATE('2024-02-20','YYYY-MM-DD'),5,'Laptop',  60);
INSERT INTO WatchHistory VALUES (1014,107,10,TO_DATE('2024-02-28','YYYY-MM-DD'),4,'Smart TV',50);
INSERT INTO WatchHistory VALUES (1015,108,5, TO_DATE('2024-03-05','YYYY-MM-DD'),5,'Mobile',  55);
INSERT INTO WatchHistory VALUES (1016,108,11,TO_DATE('2024-03-12','YYYY-MM-DD'),3,'Tablet',  45);
INSERT INTO WatchHistory VALUES (1017,109,6, TO_DATE('2024-03-20','YYYY-MM-DD'),4,'Smart TV',50);
INSERT INTO WatchHistory VALUES (1018,109,12,TO_DATE('2024-03-25','YYYY-MM-DD'),5,'Laptop',  60);
INSERT INTO WatchHistory VALUES (1019,110,7, TO_DATE('2024-04-02','YYYY-MM-DD'),5,'Mobile',  45);
INSERT INTO WatchHistory VALUES (1020,110,13,TO_DATE('2024-04-08','YYYY-MM-DD'),4,'Smart TV',55);
INSERT INTO WatchHistory VALUES (1021,111,1, TO_DATE('2024-01-30','YYYY-MM-DD'),5,'Smart TV',45);
INSERT INTO WatchHistory VALUES (1022,111,14,TO_DATE('2024-02-05','YYYY-MM-DD'),4,'Laptop',  50);
INSERT INTO WatchHistory VALUES (1023,112,2, TO_DATE('2024-02-10','YYYY-MM-DD'),3,'Mobile',  60);
INSERT INTO WatchHistory VALUES (1024,112,15,TO_DATE('2024-02-18','YYYY-MM-DD'),4,'Tablet',  55);
INSERT INTO WatchHistory VALUES (1025,113,3, TO_DATE('2024-03-01','YYYY-MM-DD'),5,'Smart TV',50);
INSERT INTO WatchHistory VALUES (1026,113,16,TO_DATE('2024-03-08','YYYY-MM-DD'),4,'Mobile',  45);
INSERT INTO WatchHistory VALUES (1027,114,4, TO_DATE('2024-03-15','YYYY-MM-DD'),5,'Laptop',  60);
INSERT INTO WatchHistory VALUES (1028,114,17,TO_DATE('2024-03-22','YYYY-MM-DD'),4,'Smart TV',55);
INSERT INTO WatchHistory VALUES (1029,115,5, TO_DATE('2024-04-05','YYYY-MM-DD'),5,'Mobile',  50);
INSERT INTO WatchHistory VALUES (1030,115,18,TO_DATE('2024-04-10','YYYY-MM-DD'),5,'Smart TV',45);
INSERT INTO WatchHistory VALUES (1031,116,6, TO_DATE('2024-01-08','YYYY-MM-DD'),4,'Tablet',  50);
INSERT INTO WatchHistory VALUES (1032,116,19,TO_DATE('2024-01-15','YYYY-MM-DD'),3,'Mobile',  40);
INSERT INTO WatchHistory VALUES (1033,117,7, TO_DATE('2024-02-01','YYYY-MM-DD'),5,'Smart TV',45);
INSERT INTO WatchHistory VALUES (1034,117,20,TO_DATE('2024-02-08','YYYY-MM-DD'),4,'Laptop',  55);
INSERT INTO WatchHistory VALUES (1035,118,8, TO_DATE('2024-02-25','YYYY-MM-DD'),4,'Mobile',  50);
INSERT INTO WatchHistory VALUES (1036,118,21,TO_DATE('2024-03-04','YYYY-MM-DD'),5,'Smart TV',60);
INSERT INTO WatchHistory VALUES (1037,119,9, TO_DATE('2024-03-12','YYYY-MM-DD'),3,'Tablet',  45);
INSERT INTO WatchHistory VALUES (1038,119,22,TO_DATE('2024-03-18','YYYY-MM-DD'),5,'Mobile',  55);
INSERT INTO WatchHistory VALUES (1039,120,10,TO_DATE('2024-04-01','YYYY-MM-DD'),4,'Smart TV',50);
INSERT INTO WatchHistory VALUES (1040,120,23,TO_DATE('2024-04-06','YYYY-MM-DD'),5,'Laptop',  60);

COMMIT;
