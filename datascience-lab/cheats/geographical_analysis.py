import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
import plotly.graph_objects as go

def show_geographical_analysis(df):
    st.header("Geographical Analysis")
    st.markdown("""
    This tab provides geographical visualization of employment, unemployment, and GDP data across the world.
    Select a year and data attribute to visualize on the world map.
    """)
    
    # Get unique years
    years = sorted(df['Year'].unique())
    max_year = int(max(years))
    
    # Create columns for filters
    st.subheader("Map Settings")
    col1, col2 = st.columns(2)
    
    # Year selection
    with col1:
        selected_year = st.slider(
            "Select a year:",
            min_value=int(min(years)),
            max_value=max_year,
            value=max_year,
            key="geographical_year_slider"
        )
    
    # Data attribute selection
    with col2:
        data_attributes = [
            "Employment Sector: Agriculture",
            "Employment Sector: Industry",
            "Employment Sector: Services",
            "Unemployment Rate",
            "GDP (in USD)"
        ]
        
        selected_attribute = st.selectbox(
            "Select data attribute:",
            data_attributes,
            index=4  # Default to GDP
        )
    
    # Filter data for selected year
    year_data = df[df['Year'] == selected_year]
    
    # Create a choropleth map
    st.subheader(f"{selected_attribute} by Country ({selected_year})")
    
    # Determine color scale based on attribute
    if selected_attribute == "Unemployment Rate":
        color_scale = "Reds"  # Higher unemployment is worse (red)
    elif selected_attribute == "GDP (in USD)":
        color_scale = "Blues"  # Higher GDP is better (blue)
    elif selected_attribute == "Employment Sector: Agriculture":
        color_scale = "YlGn"  # Agriculture in green
    elif selected_attribute == "Employment Sector: Industry":
        color_scale = "Oranges"  # Industry in orange
    else:  # Services
        color_scale = "Purples"  # Services in purple
    
    # Format hover data
    hover_data = {selected_attribute: True}
    
    # Create the map with appropriate formatting
    if selected_attribute == "GDP (in USD)":
        # For GDP, use log scale for better visualization
        fig = px.choropleth(
            year_data,
            locations="Country Name",
            locationmode="country names",
            color=selected_attribute,
            hover_name="Country Name",
            color_continuous_scale=color_scale,
            projection="natural earth",
            title=f"{selected_attribute} by Country ({selected_year})",
            color_continuous_midpoint=np.log10(year_data[selected_attribute].median())
        )
    else:
        # For percentage values, use regular scale
        fig = px.choropleth(
            year_data,
            locations="Country Name",
            locationmode="country names",
            color=selected_attribute,
            hover_name="Country Name",
            color_continuous_scale=color_scale,
            projection="natural earth",
            title=f"{selected_attribute} by Country ({selected_year})"
        )
    
    # No need for this block as we've already created the map above
    
    # Update layout
    fig.update_layout(
        height=700,
        margin={"r": 0, "t": 30, "l": 0, "b": 0},
        coloraxis_colorbar=dict(
            title=selected_attribute
        )
    )
    
    # Display the map
    st.plotly_chart(fig, use_container_width=True)
    
    # Add explanations based on selected attribute
    if selected_attribute == "Employment Sector: Agriculture":
        st.markdown("""
        **Understanding Agricultural Employment Distribution:**
        - **Higher percentages (darker green)** typically indicate developing economies or countries with significant agricultural sectors
        - **Lower percentages (lighter green)** often represent more industrialized or service-oriented economies
        
        When analyzing this map, consider:
        - Geographic factors that influence agricultural activity (climate, terrain, etc.)
        - Historical and cultural contexts that shape economic structures
        - The relationship between agricultural employment and economic development stages
        """)
    
    elif selected_attribute == "Employment Sector: Industry":
        st.markdown("""
        **Understanding Industrial Employment Distribution:**
        - **Higher percentages (darker orange)** often indicate manufacturing-focused economies or countries in industrialization phases
        - **Lower percentages (lighter orange)** may represent either pre-industrial economies or post-industrial service economies
        
        When analyzing this map, consider:
        - Industrial policies and historical development paths
        - Resource availability and manufacturing capabilities
        - The balance between traditional and advanced manufacturing sectors
        """)
    
    elif selected_attribute == "Employment Sector: Services":
        st.markdown("""
        **Understanding Services Employment Distribution:**
        - **Higher percentages (darker purple)** typically indicate developed economies with strong service sectors
        - **Lower percentages (lighter purple)** often represent economies more focused on agriculture or industry
        
        When analyzing this map, consider:
        - The diversity within service sectors (finance, healthcare, education, tourism, etc.)
        - The relationship between service employment and economic development
        - Digital infrastructure and its impact on service sector growth
        """)
    
    elif selected_attribute == "Unemployment Rate":
        st.markdown("""
        **Understanding Unemployment Rate Distribution:**
        - **Higher rates (darker red)** indicate economies struggling with job creation or facing economic challenges
        - **Lower rates (lighter red)** suggest stronger labor markets and economic stability
        
        When analyzing this map, consider:
        - Different methods of measuring unemployment across countries
        - Structural vs. cyclical unemployment factors
        - The relationship between unemployment and other economic indicators
        - Hidden unemployment or underemployment not captured in official statistics
        """)
    
    elif selected_attribute == "GDP (in USD)":
        st.markdown("""
        **Understanding GDP Distribution:**
        - **Higher values (darker blue)** represent larger economies in absolute terms
        - **Lower values (lighter blue)** indicate smaller economies, but not necessarily lower living standards
        
        When analyzing this map, consider:
        - Population differences that affect total GDP size
        - GDP per capita would provide a better measure of average living standards
        - Exchange rate effects on USD-denominated GDP values
        - The composition of GDP across different sectors
        """)
    
    # Add data table with top and bottom countries
    st.subheader("Top and Bottom Countries")
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.markdown(f"**Top 10 Countries by {selected_attribute}**")
        top_countries = year_data.nlargest(10, selected_attribute)[["Country Name", selected_attribute]]
        st.dataframe(top_countries, use_container_width=True)
    
    with col2:
        st.markdown(f"**Bottom 10 Countries by {selected_attribute}**")
        bottom_countries = year_data.nsmallest(10, selected_attribute)[["Country Name", selected_attribute]]
        st.dataframe(bottom_countries, use_container_width=True)

# Made with Bob
