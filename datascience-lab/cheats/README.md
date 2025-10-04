# Employment, Unemployment & GDP Data Analysis

This Streamlit application provides interactive visualizations for analyzing employment sectors, unemployment rates, and GDP across different countries and years.

## Features

- Statistical analysis of employment sectors, unemployment rates, and GDP
- Geographical visualization of data across countries
- Country comparison tools
- Support for both CSV and PostgreSQL data sources

## Installation

1. Clone this repository
2. Install the required packages:

```bash
pip install -r requirements.txt
```

## Data Sources

The application can use data from either:
- A local CSV file (default)
- A PostgreSQL database (if configured)

### Using CSV Data (Default)

By default, the application will use the included CSV file `Employment_Unemployment_GDP_data.csv`.

### Using PostgreSQL Database

To use a PostgreSQL database:

1. Create a `.env` file in the project root directory with your database connection string:
   ```
   DATABASE_URL=postgresql://username:password@host:port/database_name
   ```
   (You can copy and modify the `.env.example` file)

2. Set up the database table using one of these methods:

   **Option 1**: Use the provided SQL script:
   ```bash
   psql -U your_username -d your_database -f setup_database.sql
   ```

   **Option 2**: Use the provided Python import script:
   ```bash
   python import_data_to_postgres.py
   ```

## Running the Application

Start the Streamlit application:

```bash
streamlit run app.py
```

The application will display whether it's using CSV or PostgreSQL as the data source.

## Troubleshooting

If you encounter database connection issues, the application will automatically fall back to using the CSV file.