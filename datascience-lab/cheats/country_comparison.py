import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
import plotly.graph_objects as go
from plotly.subplots import make_subplots

def show_country_comparison(df):
    st.header("Country Comparison")
    st.markdown("""
    This tab allows you to compare economic indicators between two countries over time.
    Select two countries and explore their employment sectors, unemployment rates, and GDP.
    """)
    
    # Get unique countries and years
    countries = sorted(df['Country Name'].unique())
    years = sorted(df['Year'].unique())
    min_year, max_year = int(min(years)), int(max(years))
    
    # Create columns for country selection
    st.subheader("Select Countries to Compare")
    col1, col2 = st.columns(2)
    
    # Country selection
    with col1:
        country1 = st.selectbox(
            "Select first country:",
            countries,
            index=countries.index("United States") if "United States" in countries else 0,
            key="country1"
        )
    
    with col2:
        # Default second country to China (or first country that's not the same as country1)
        default_country2 = "China" if "China" in countries and "China" != country1 else next((c for c in countries if c != country1), countries[0])
        country2 = st.selectbox(
            "Select second country:",
            countries,
            index=countries.index(default_country2) if default_country2 in countries else 0,
            key="country2"
        )
    
    # Filter data for selected countries
    country1_data = df[df['Country Name'] == country1]
    country2_data = df[df['Country Name'] == country2]
    
    # Check if we have data for both countries
    if country1_data.empty or country2_data.empty:
        st.error(f"No data available for one or both selected countries.")
        return
    
    # Display basic comparison metrics
    st.subheader("Key Metrics Comparison")
    
    # Get latest year data for both countries
    latest_year1 = country1_data['Year'].max()
    latest_year2 = country2_data['Year'].max()
    latest_data1 = country1_data[country1_data['Year'] == latest_year1].iloc[0]
    latest_data2 = country2_data[country2_data['Year'] == latest_year2].iloc[0]
    
    # Create metrics comparison
    col1, col2, col3 = st.columns(3)
    
    with col1:
        st.metric(
            "GDP (USD)",
            f"${latest_data1['GDP (in USD)']:,.0f}",
            f"{(latest_data1['GDP (in USD)'] - latest_data2['GDP (in USD)']) / latest_data2['GDP (in USD)'] * 100:.1f}%",
            delta_color="normal"
        )
        st.caption(f"{country1} vs {country2}")
    
    with col2:
        st.metric(
            "Unemployment Rate",
            f"{latest_data1['Unemployment Rate']:.2f}%",
            f"{latest_data1['Unemployment Rate'] - latest_data2['Unemployment Rate']:.2f}%",
            delta_color="inverse"  # Lower is better for unemployment
        )
        st.caption(f"{country1} vs {country2}")
    
    with col3:
        st.metric(
            "Services Employment",
            f"{latest_data1['Employment Sector: Services']:.2f}%",
            f"{latest_data1['Employment Sector: Services'] - latest_data2['Employment Sector: Services']:.2f}%",
            delta_color="normal"
        )
        st.caption(f"{country1} vs {country2}")
    
    # Employment Sectors Comparison
    st.subheader("Employment Sectors Comparison")
    
    # Create a grouped bar chart for employment sectors
    sector_cols = ['Employment Sector: Agriculture', 'Employment Sector: Industry', 'Employment Sector: Services']
    sector_labels = [col.replace('Employment Sector: ', '') for col in sector_cols]
    
    # Prepare data for the chart
    latest_sectors1 = latest_data1[sector_cols].values
    latest_sectors2 = latest_data2[sector_cols].values
    
    fig_sectors = go.Figure()
    
    # Add bars for each country
    fig_sectors.add_trace(go.Bar(
        x=sector_labels,
        y=latest_sectors1,
        name=country1,
        marker_color='royalblue'
    ))
    
    fig_sectors.add_trace(go.Bar(
        x=sector_labels,
        y=latest_sectors2,
        name=country2,
        marker_color='firebrick'
    ))
    
    # Update layout
    fig_sectors.update_layout(
        title=f"Employment Sectors: {country1} vs {country2} ({max(latest_year1, latest_year2)})",
        xaxis_title="Sector",
        yaxis_title="Employment (%)",
        barmode='group',
        height=500
    )
    
    st.plotly_chart(fig_sectors, use_container_width=True)
    
    st.markdown("""
    **Understanding Employment Sector Differences:**
    - Compare the balance between agriculture, industry, and services to understand economic structure differences
    - Higher services percentages typically indicate more developed economies
    - Higher agriculture percentages often indicate developing economies
    - Industrial sector differences may reflect different stages of industrialization or deindustrialization
    """)
    
    # Historical Trends Comparison
    st.subheader("Historical Trends Comparison")
    
    # Create tabs for different metrics
    trend_tabs = st.tabs(["GDP", "Unemployment", "Employment Sectors"])
    
    # GDP Trends
    with trend_tabs[0]:
        fig_gdp = px.line(
            pd.concat([
                country1_data[['Year', 'GDP (in USD)', 'Country Name']],
                country2_data[['Year', 'GDP (in USD)', 'Country Name']]
            ]),
            x='Year',
            y='GDP (in USD)',
            color='Country Name',
            title=f"GDP Trends: {country1} vs {country2}",
            labels={'GDP (in USD)': 'GDP (USD)', 'Year': 'Year', 'Country Name': 'Country'}
        )
        
        fig_gdp.update_layout(height=500)
        fig_gdp.update_yaxes(type="log")  # Log scale for better comparison
        
        st.plotly_chart(fig_gdp, use_container_width=True)
        
        st.markdown("""
        **Interpreting GDP Trends:**
        - Note that the Y-axis uses a logarithmic scale to better compare countries with different GDP sizes
        - Look for convergence or divergence patterns between the two economies
        - Consider external factors like global recessions, policy changes, or major events
        - GDP alone doesn't reflect living standards; population size is a major factor
        """)
    
    # Unemployment Trends
    with trend_tabs[1]:
        fig_unemp = px.line(
            pd.concat([
                country1_data[['Year', 'Unemployment Rate', 'Country Name']],
                country2_data[['Year', 'Unemployment Rate', 'Country Name']]
            ]),
            x='Year',
            y='Unemployment Rate',
            color='Country Name',
            title=f"Unemployment Rate Trends: {country1} vs {country2}",
            labels={'Unemployment Rate': 'Unemployment Rate (%)', 'Year': 'Year', 'Country Name': 'Country'}
        )
        
        fig_unemp.update_layout(height=500)
        
        st.plotly_chart(fig_unemp, use_container_width=True)
        
        st.markdown("""
        **Interpreting Unemployment Trends:**
        - Different countries may use different methodologies to calculate unemployment rates
        - Look for structural patterns vs. cyclical patterns in unemployment
        - Consider how labor market policies differ between countries
        - High unemployment doesn't always indicate poor economic performance (e.g., during economic transitions)
        """)
    
    # Employment Sectors Trends
    with trend_tabs[2]:
        # Create a figure with subplots for each sector
        fig_sectors_trend = make_subplots(
            rows=3, cols=1,
            subplot_titles=("Agriculture", "Industry", "Services"),
            shared_xaxes=True,
            vertical_spacing=0.1
        )
        
        # Add traces for each sector and country
        for i, sector in enumerate(sector_cols):
            # Country 1
            fig_sectors_trend.add_trace(
                go.Scatter(
                    x=country1_data['Year'],
                    y=country1_data[sector],
                    name=f"{country1} - {sector_labels[i]}",
                    line=dict(color='royalblue' if i == 2 else ('darkblue' if i == 1 else 'lightblue'))
                ),
                row=i+1, col=1
            )
            
            # Country 2
            fig_sectors_trend.add_trace(
                go.Scatter(
                    x=country2_data['Year'],
                    y=country2_data[sector],
                    name=f"{country2} - {sector_labels[i]}",
                    line=dict(color='firebrick' if i == 2 else ('darkred' if i == 1 else 'lightcoral'))
                ),
                row=i+1, col=1
            )
        
        # Update layout
        fig_sectors_trend.update_layout(
            height=700,
            title=f"Employment Sectors Trends: {country1} vs {country2}",
            legend=dict(orientation="h", yanchor="bottom", y=1.02, xanchor="right", x=1)
        )
        
        # Update y-axis titles
        fig_sectors_trend.update_yaxes(title_text="Agriculture (%)", row=1, col=1)
        fig_sectors_trend.update_yaxes(title_text="Industry (%)", row=2, col=1)
        fig_sectors_trend.update_yaxes(title_text="Services (%)", row=3, col=1)
        
        # Update x-axis title for the bottom plot only
        fig_sectors_trend.update_xaxes(title_text="Year", row=3, col=1)
        
        st.plotly_chart(fig_sectors_trend, use_container_width=True)
        
        st.markdown("""
        **Interpreting Employment Sector Trends:**
        - Look for structural shifts in both economies (e.g., declining agriculture, rising services)
        - Compare the pace of transition between sectors
        - Consider how policy decisions have influenced sector development
        - Note that similar trends may occur at different times in different countries' development
        """)
    
    # Radar Chart Comparison
    st.subheader("Economic Profile Comparison")
    
    # Prepare data for radar chart
    categories = ['Agriculture', 'Industry', 'Services', 'Unemployment Rate']
    
    # Scale GDP to 0-100 range for better visualization
    max_gdp = max(latest_data1['GDP (in USD)'], latest_data2['GDP (in USD)'])
    gdp_scaled1 = latest_data1['GDP (in USD)'] / max_gdp * 100
    gdp_scaled2 = latest_data2['GDP (in USD)'] / max_gdp * 100
    
    # Add GDP to categories and values
    categories.append('GDP (scaled)')
    
    values1 = [
        latest_data1['Employment Sector: Agriculture'],
        latest_data1['Employment Sector: Industry'],
        latest_data1['Employment Sector: Services'],
        latest_data1['Unemployment Rate'],
        gdp_scaled1
    ]
    
    values2 = [
        latest_data2['Employment Sector: Agriculture'],
        latest_data2['Employment Sector: Industry'],
        latest_data2['Employment Sector: Services'],
        latest_data2['Unemployment Rate'],
        gdp_scaled2
    ]
    
    # Create radar chart
    fig_radar = go.Figure()
    
    fig_radar.add_trace(go.Scatterpolar(
        r=values1,
        theta=categories,
        fill='toself',
        name=country1,
        line_color='royalblue'
    ))
    
    fig_radar.add_trace(go.Scatterpolar(
        r=values2,
        theta=categories,
        fill='toself',
        name=country2,
        line_color='firebrick'
    ))
    
    fig_radar.update_layout(
        polar=dict(
            radialaxis=dict(
                visible=True,
                range=[0, max(max(values1), max(values2)) * 1.1]
            )
        ),
        title=f"Economic Profile: {country1} vs {country2}",
        height=600
    )
    
    st.plotly_chart(fig_radar, use_container_width=True)
    
    st.markdown("""
    **Understanding the Economic Profile Comparison:**
    - This radar chart provides a holistic view of economic structure differences
    - Note that GDP is scaled relative to the higher value between the two countries
    - A larger area doesn't necessarily indicate a better economy, just different characteristics
    - Consider how the shape of each profile reflects different development strategies and outcomes
    
    When comparing countries, remember that:
    - Different economic structures may be optimal for different countries based on resources and development stage
    - Historical context, geography, and policy choices shape these differences
    - Both developed and developing economies face their own unique challenges
    """)

# Made with Bob
