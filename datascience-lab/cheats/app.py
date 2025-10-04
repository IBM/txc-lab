import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
import plotly.graph_objects as go
import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
import traceback

# Import tab modules
from statistical_analysis import show_statistical_analysis
from geographical_analysis import show_geographical_analysis
from country_comparison import show_country_comparison

# Set page configuration
st.set_page_config(
    page_title="Employment, Unemployment & GDP Data Analysis",
    page_icon="📊",
    layout="wide"
)

# Load environment variables from .env file if it exists
load_dotenv()

# Load data
@st.cache_data
def load_data():
    # Check if DATABASE_URL is available in environment variables
    database_url = os.getenv("DATABASE_URL")
    data_source = "CSV"
    
    if database_url:
        try:
            # Create SQLAlchemy engine
            engine = create_engine(database_url)
            
            # Query data from PostgreSQL
            # Assuming the table name is 'employment_data'
            query = "SELECT * FROM employment_data"
            df = pd.read_sql(query, engine)
            data_source = "PostgreSQL"
            
        except Exception as e:
            st.warning(f"Error connecting to PostgreSQL database: {e}")
            # Fallback to CSV if database connection fails
            df = pd.read_csv('Employment_Unemployment_GDP_data.csv')
            data_source = "CSV (fallback due to database error)"
    else:
        # If no DATABASE_URL is found, use CSV
        df = pd.read_csv('Employment_Unemployment_GDP_data.csv')
    
    return df, data_source

# Main app
def main():
    # Title and description
    st.title("Employment, Unemployment & GDP Data Analysis")
    st.markdown("""
    This application provides interactive visualizations for analyzing employment sectors,
    unemployment rates, and GDP across different countries and years.
    """)
    
    # Load data
    df, data_source = load_data()
    
    # Display data source information
    st.info(f"Data source: {data_source}")
    
    # Create tabs
    tab1, tab2, tab3 = st.tabs(["Statistical Analysis", "Geographical Analysis", "Country Comparison"])
    
    # Display content based on selected tab
    with tab1:
        show_statistical_analysis(df)
    
    with tab2:
        show_geographical_analysis(df)
    
    with tab3:
        show_country_comparison(df)

if __name__ == "__main__":
    main()

# Made with Bob
