CREATE TABLE companies (
    handle TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    num_employees INT,
    description TEXT,
    logo_url TEXT
);

CREATE TABLE jobs (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    salary float NOT NULL,
    equity float NOT NULL,
    company_handle TEXT REFERENCES companies ON DELETE CASCADE,
    date_posted timestamp with time zone NOT NULL
    CONSTRAINT jobs_equity_check CHECK ((equity < 1))
);

CREATE TABLE users (
    username TEXT PRIMARY KEY,
    password TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    photo_url TEXT,
    is_admin BOOLEAN DEFAULT 'false' NOT NULL
);
