-- SQL script to create the employment_data table in PostgreSQL

-- Drop table if it exists
DROP TABLE IF EXISTS employment_data;

-- Create table with the same structure as the CSV file
CREATE TABLE employment_data (
    "Country Name" VARCHAR(255),
    "Year" INTEGER,
    "Employment Sector: Agriculture" FLOAT,
    "Employment Sector: Industry" FLOAT,
    "Employment Sector: Services" FLOAT,
    "Unemployment Rate" FLOAT,
    "GDP (in USD)" FLOAT
);

-- Note: After creating the table, you can import data from the CSV file using:
-- COPY employment_data FROM '/path/to/Employment_Unemployment_GDP_data.csv' DELIMITER ',' CSV HEADER;
-- Or using the psql command:
-- \copy employment_data FROM '/path/to/Employment_Unemployment_GDP_data.csv' DELIMITER ',' CSV HEADER;

-- Made with Bob
