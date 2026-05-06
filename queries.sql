-- ═══════════════════════════════════════════════════════════════
--  CineDB — Movie Streaming Platform
--  queries.sql  |  Analytical SQL Queries
--  Oracle SQL*Plus Compatible
-- ═══════════════════════════════════════════════════════════════

SET FEEDBACK ON;
SET PAGESIZE 50;
SET LINESIZE 120;
COLUMN Title FORMAT A30;
COLUMN Name FORMAT A20;
COLUMN City FORMAT A15;
COLUMN Genre FORMAT A20;

-- Q1: Top 5 most-watched movies
SELECT m.Title, COUNT(w.HistoryID) AS WatchCount
FROM WatchHistory w
JOIN Movies m ON w.MovieID = m.MovieID
GROUP BY m.Title
ORDER BY WatchCount DESC
FETCH FIRST 5 ROWS ONLY;

-- Q2: Average rating per movie
SELECT m.Title, m.Genre, ROUND(AVG(w.Rating), 2) AS AvgRating
FROM WatchHistory w
JOIN Movies m ON w.MovieID = m.MovieID
GROUP BY m.Title, m.Genre
ORDER BY AvgRating DESC;

-- Q3: Users subscribed to Premium plan
SELECT u.UserID, u.Name, u.City, s.Type, s.Price
FROM Users u
JOIN Subscriptions s ON u.UserID = s.UserID
WHERE s.Type = 'Premium'
ORDER BY u.Name;

-- Q4: Watch history with user and movie details
SELECT
    u.Name        AS UserName,
    m.Title       AS MovieTitle,
    m.Genre,
    w.WatchDate,
    w.Rating,
    w.Device,
    s.Type        AS SubscriptionType
FROM WatchHistory w
JOIN Users u        ON w.UserID  = u.UserID
JOIN Movies m       ON w.MovieID = m.MovieID
JOIN Subscriptions s ON u.UserID = s.UserID
ORDER BY w.WatchDate DESC;

-- Q5: Revenue by subscription type
SELECT
    Type,
    COUNT(*)           AS Subscribers,
    SUM(Price)         AS TotalRevenue,
    AVG(Discount)      AS AvgDiscount,
    MAX(Price)         AS MaxPrice
FROM Subscriptions
GROUP BY Type
ORDER BY TotalRevenue DESC;

-- Q6: Most active users (by watch count)
SELECT
    u.Name,
    u.City,
    COUNT(w.HistoryID)  AS MoviesWatched,
    AVG(w.Rating)       AS AvgRating
FROM Users u
JOIN WatchHistory w ON u.UserID = w.UserID
GROUP BY u.Name, u.City
ORDER BY MoviesWatched DESC
FETCH FIRST 10 ROWS ONLY;

-- Q7: Genre distribution
SELECT Genre, COUNT(*) AS MovieCount
FROM Movies
GROUP BY Genre
ORDER BY MovieCount DESC;

-- Q8: Movies watched by device type
SELECT Device, COUNT(*) AS WatchCount, ROUND(AVG(Rating),2) AS AvgRating
FROM WatchHistory
GROUP BY Device
ORDER BY WatchCount DESC;

-- Q9: Users from Gujarat with Premium/Annual subs
SELECT u.Name, u.City, s.Type, s.Price
FROM Users u
JOIN Subscriptions s ON u.UserID = s.UserID
WHERE u.State = 'Gujarat'
  AND s.Type IN ('Premium','Annual')
ORDER BY u.City;

-- Q10: BCNF violation analysis (transitive: Type → Price) Demonstrates why SubscriptionType should be a separate table
SELECT DISTINCT Type, Price, Discount
FROM Subscriptions
ORDER BY Type;

-- Q11: FD Verification — UserID → SubscriptionType
--      (Check if each user has exactly one active subscription type)
SELECT UserID, COUNT(DISTINCT Type) AS DistinctTypes
FROM Subscriptions
GROUP BY UserID
HAVING COUNT(DISTINCT Type) > 1;
-- Returns rows if violation exists (UserID does NOT functionally determine Type alone)

-- Q12: Monthly watch trend
SELECT
    TO_CHAR(WatchDate, 'YYYY-MM') AS Month,
    COUNT(*) AS WatchCount,
    ROUND(AVG(Rating), 2) AS AvgRating
FROM WatchHistory
GROUP BY TO_CHAR(WatchDate, 'YYYY-MM')
ORDER BY Month;
