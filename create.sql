-- ═══════════════════════════════════════════════════════════════
--  CineDB — Movie Streaming Platform
--  create.sql  |  Oracle SQL*Plus Compatible
--  Database Normalization Analyzer — DBMS Project
-- ═══════════════════════════════════════════════════════════════

SET FEEDBACK ON;
SET ECHO ON;
SET VERIFY OFF;

-- Drop tables if they exist (reverse FK order)
BEGIN
  EXECUTE IMMEDIATE 'DROP TABLE WatchHistory CASCADE CONSTRAINTS';
EXCEPTION WHEN OTHERS THEN NULL;
END;
/
BEGIN
  EXECUTE IMMEDIATE 'DROP TABLE Subscriptions CASCADE CONSTRAINTS';
EXCEPTION WHEN OTHERS THEN NULL;
END;
/
BEGIN
  EXECUTE IMMEDIATE 'DROP TABLE Movies CASCADE CONSTRAINTS';
EXCEPTION WHEN OTHERS THEN NULL;
END;
/
BEGIN
  EXECUTE IMMEDIATE 'DROP TABLE Users CASCADE CONSTRAINTS';
EXCEPTION WHEN OTHERS THEN NULL;
END;
/

CREATE TABLE Movies (
    MovieID     NUMBER(5)     PRIMARY KEY,
    Title       VARCHAR2(100) NOT NULL,
    Genre       VARCHAR2(50)  NOT NULL,
    Language    VARCHAR2(30)  NOT NULL,
    ReleaseYear NUMBER(4)     NOT NULL,
    Director    VARCHAR2(80)  NOT NULL,
    CONSTRAINT chk_year CHECK (ReleaseYear BETWEEN 1900 AND 2100)
);

CREATE TABLE Users (
    UserID  NUMBER(5)      PRIMARY KEY,
    Name    VARCHAR2(80)   NOT NULL,
    Email   VARCHAR2(100)  NOT NULL UNIQUE,
    City    VARCHAR2(50)   NOT NULL,
    State   VARCHAR2(50)   NOT NULL
);

CREATE TABLE Subscriptions (
    SubscriptionID  NUMBER(5)     PRIMARY KEY,
    UserID          NUMBER(5)     NOT NULL,
    Type            VARCHAR2(20)  NOT NULL,
    Price           NUMBER(6,2)   NOT NULL,
    Discount        NUMBER(3)     DEFAULT 0,
    StartDate       DATE          NOT NULL,
    EndDate         DATE          NOT NULL,
    CONSTRAINT fk_sub_user  FOREIGN KEY (UserID) REFERENCES Users(UserID),
    CONSTRAINT chk_type     CHECK (Type IN ('Basic','Mobile','Premium','Annual')),
    CONSTRAINT chk_discount CHECK (Discount BETWEEN 0 AND 100)
);

CREATE TABLE WatchHistory (
    HistoryID   NUMBER(6)    PRIMARY KEY,
    UserID      NUMBER(5)    NOT NULL,
    MovieID     NUMBER(5)    NOT NULL,
    WatchDate   DATE         NOT NULL,
    Rating      NUMBER(1)    CHECK (Rating BETWEEN 1 AND 5),
    Device      VARCHAR2(20) NOT NULL,
    Duration    NUMBER(4),
    CONSTRAINT fk_wh_user  FOREIGN KEY (UserID)  REFERENCES Users(UserID),
    CONSTRAINT fk_wh_movie FOREIGN KEY (MovieID) REFERENCES Movies(MovieID),
    CONSTRAINT chk_device  CHECK (Device IN ('Smart TV','Mobile','Laptop','Tablet','Desktop'))
);

CREATE INDEX idx_wh_user   ON WatchHistory(UserID);
CREATE INDEX idx_wh_movie  ON WatchHistory(MovieID);
CREATE INDEX idx_sub_user  ON Subscriptions(UserID);
CREATE INDEX idx_movie_genre ON Movies(Genre);

COMMIT;
