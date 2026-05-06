# 🎬 CineDB — Movie Streaming Platform DBMS Analyzer

A full-stack **Database Management System** project that performs interactive, step-by-step **normalization analysis** (1NF → 2NF → 3NF → BCNF) on relational schemas, built around a real Indian OTT streaming dataset.

---

## 📌 Overview

CineDB lets you input any relational schema (attributes + functional dependencies) and instantly:

- Computes **attribute closures** and detects **candidate keys**
- Identifies **partial**, **transitive**, and **BCNF violations**
- Performs **schema decomposition** into 2NF, 3NF, and BCNF
- Browses a **live dataset** of 135+ rows of Indian OTT movie data
- Runs **12 analytical SQL queries** against an Oracle-compatible schema

---

## 🗂 Project Structure

```
D_assi/
├── index.html          ← Multi-page frontend (5 pages, single file)
├── style.css           ← Modern card-based UI (DM fonts, teal/orange palette)
├── script.js           ← Full DBMS engine + dataset (pure Vanilla JS)
├── app.py              ← Flask REST API backend
├── normalization.py    ← Core DBMS normalization logic (Python)
├── database.py         ← In-memory dataset for Flask API
├── requirements.txt    ← Python dependencies
├── create.sql          ← Oracle SQL*Plus schema (4 tables)
├── insert.sql          ← 135+ rows of Indian OTT data
└── queries.sql         ← 12 analytical SQL queries
```

---

## 🖥 Pages & Features

| Page | Description |
|------|-------------|
| **Analyzer** | Enter schema → compute closure, candidate keys, run normalization |
| **DB Tables** | Browse all 4 tables with 135+ rows, search & filter |
| **FD Analyzer** | Inspect each FD: closure, superkey check, violation type |
| **Normalization** | Accordion view of 1NF → 2NF → 3NF → BCNF decomposition steps |
| **Dashboard** | Summary stats, violation counts, and recommendations |

---

## Quick Start — Frontend Only (No Backend Needed)

The frontend is **fully self-contained**. All normalization logic runs entirely in the browser.

```bash
# Option 1: Open directly
open index.html

# Option 2: Local HTTP server (avoids CORS issues)
python3 -m http.server 8080
# Then visit: http://localhost:8080
```

---

## Running with Flask Backend

```bash
# 1. Install dependencies
pip install -r requirements.txt

# 2. Start Flask server
python app.py

# 3. Open in browser
# http://localhost:5000
```

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/analyze` | Full normalization analysis (closures, keys, violations, decompositions) |
| `POST` | `/api/closure` | Compute attribute closure for a given set X |
| `GET`  | `/api/tables/<name>` | Fetch table data (`movies`, `users`, `subscriptions`, `watchhistory`) |

---

## 🗄 Oracle SQL Setup

```sql
-- Run in SQL*Plus (in order):
@create.sql     -- Creates 4 tables with constraints and indexes
@insert.sql     -- Inserts 135+ rows of Indian OTT data
@queries.sql    -- Runs 12 analytical queries
```

### Database Schema

```
Movies         (MovieID PK, Title, Genre, Language, ReleaseYear, Director)
Users          (UserID PK, Name, Email UNIQUE, City, State)
Subscriptions  (SubscriptionID PK, UserID FK, Type, Price, Discount, StartDate, EndDate)
WatchHistory   (HistoryID PK, UserID FK, MovieID FK, WatchDate, Rating, Device, Duration)
```

---

## 📋 Sample Normalization Input

**Attributes:**
```
MovieID, Title, Genre, Language, ReleaseYear, UserID, UserName, SubscriptionType, WatchDate, Rating
```

**Functional Dependencies:**
```
MovieID → Title, Genre, Language, ReleaseYear
UserID → UserName, SubscriptionType
SubscriptionType → Discount
MovieID, UserID → WatchDate, Rating
```

Load this instantly using the **"Load Sample"** button in the Analyzer page.

---

## 🧠 Normalization Logic (normalization.py)

Implements the following algorithms in pure Python:

- `parse_attributes()` / `parse_fds()` — schema parsing
- `compute_closure()` — attribute closure via Armstrong's Axioms (fixed-point iteration)
- `find_candidate_keys()` — minimal superkey detection via powerset search
- `find_partial_deps()` — detects 2NF violations (partial dependencies on composite keys)
- `find_transitive_deps()` — detects 3NF violations (non-prime → non-prime FDs)
- `find_bcnf_violations()` — detects BCNF violations (LHS not a superkey)
- `decompose_2nf()` / `decompose_3nf()` / `decompose_bcnf()` — lossless decomposition

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML5, CSS3, Vanilla JavaScript (ES6+) |
| Backend | Python 3, Flask |
| Database | Oracle SQL (SQL*Plus compatible) |
| Fonts | DM Serif Display, DM Sans, DM Mono |

---

## 📦 Dependencies

```
flask>=3.0.0
```

Install with:
```bash
pip install -r requirements.txt
```

---

## 🎨 Design

- **Colors:** `#78ABA8` teal · `#EF9C66` orange · `#C8CFA0` green · `#FCDC94` yellow
- **Style:** Card-based layout, 16px rounded corners, minimal shadows
- **Fonts:** DM Serif Display (headings) · DM Sans (body) · DM Mono (data/code)

---

## 📊 Dataset

The project uses a curated **Indian OTT Streaming Dataset** with 135+ rows across 4 relational tables, featuring Bollywood and regional movies, Indian cities, and realistic subscription data (Basic / Mobile / Premium / Annual plans).

---

## 📁 SQL Highlights (queries.sql)

12 analytical queries including:

- Top 5 most-watched movies
- Average rating per movie by genre
- Users on Premium subscription plan
- Full watch history joined across all 4 tables
- Genre-wise viewing trends
- Device usage breakdown

---

## 📄 License

This project is submitted for academic purposes only.
