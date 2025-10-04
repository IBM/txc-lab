#!/usr/bin/env python3
"""
Script to import CSV data into PostgreSQL database.
Make sure to set up your DATABASE_URL in .env file before running this script.
"""

import os
import pandas as pd
from sqlalchemy import create_engine
from dotenv import load_dotenv

def main():
    # Load environment variables from .env file
    load_dotenv()
    
    # Get database URL from environment variable
    database_url = os.getenv("DATABASE_URL")
    
    if not database_url:
        print("Error: DATABASE_URL not found in environment variables.")
        print("Please create a .env file with your PostgreSQL connection string.")
        print("Example: DATABASE_URL=postgresql://username:password@localhost:5432/database_name")
        return
    
    try:
        # Load CSV data
        print("Loading CSV data...")
        csv_path = 'Employment_Unemployment_GDP_data.csv'
        df = pd.read_csv(csv_path)
        
        # Create SQLAlchemy engine
        print(f"Connecting to database: {database_url.split('@')[1] if '@' in database_url else database_url}")
        engine = create_engine(database_url)
        
        # Import data to PostgreSQL
        print("Importing data to PostgreSQL...")
        df.to_sql('employment_data', engine, if_exists='replace', index=False)
        
        # Verify the import
        row_count = engine.execute("SELECT COUNT(*) FROM employment_data").scalar()
        print(f"Import completed successfully. {row_count} rows imported.")
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()

# Made with Bob
