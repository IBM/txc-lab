import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
import plotly.graph_objects as go
from plotly.subplots import make_subplots

def show_statistical_analysis(df):
    st.header("Statistical Analysis")
    st.markdown("""
    This tab provides statistical analysis of employment sectors, unemployment rates, and GDP data.
    Use the controls below to select a country and year range for analysis.
    """)
    
    # Get unique countries and years
    countries = sorted(df['Country Name'].unique())
    years = sorted(df['Year'].unique())
    min_year, max_year = int(min(years)), int(max(years))
    
    # Create columns for filters
    st.subheader("Data Filters")
    col1, col2 = st.columns(2)
    
    # Country selection (default to United States)
    with col1:
        selected_country = st.selectbox(
            "Select a country:",
            countries,
            index=countries.index("United States") if "United States" in countries else 0
        )
    
    # Year selection
    with col2:
        selected_year = st.slider(
            "Select a year:",
            min_value=min_year,
            max_value=max_year,
            value=max_year,
            key="statistical_year_slider"
        )
    
    # Filter data based on selection
    country_data = df[df['Country Name'] == selected_country]
    year_data = country_data[country_data['Year'] == selected_year]
    
    # Display basic statistics
    st.subheader(f"Basic Statistics for {selected_country} in {selected_year}")
    
    if not year_data.empty:
        # Create metrics row
        col1, col2, col3 = st.columns(3)
        
        with col1:
            st.metric(
                "GDP (USD)",
                f"${year_data['GDP (in USD)'].values[0]:,.0f}",
                delta=None
            )
        
        with col2:
            st.metric(
                "Unemployment Rate",
                f"{year_data['Unemployment Rate'].values[0]:.2f}%",
                delta=None
            )
        
        with col3:
            services_pct = year_data['Employment Sector: Services'].values[0]
            st.metric(
                "Services Employment",
                f"{services_pct:.2f}%",
                delta=None
            )
        
        # Employment Sectors Distribution
        st.subheader("Employment Sectors Distribution")
        
        # Create a pie chart for employment sectors
        sector_cols = ['Employment Sector: Agriculture', 'Employment Sector: Industry', 'Employment Sector: Services']
        sector_values = year_data[sector_cols].values[0]
        sector_labels = [col.replace('Employment Sector: ', '') for col in sector_cols]
        
        fig_pie = px.pie(
            values=sector_values,
            names=sector_labels,
            title=f"Employment Sectors Distribution for {selected_country} ({selected_year})",
            color_discrete_sequence=px.colors.qualitative.Set2
        )
        
        fig_pie.update_traces(textposition='inside', textinfo='percent+label')
        fig_pie.update_layout(
            legend_title="Sectors",
            legend=dict(orientation="h", yanchor="bottom", y=1.02, xanchor="right", x=1)
        )
        
        st.plotly_chart(fig_pie, use_container_width=True)
        
        st.markdown("""
        **Understanding the Employment Sectors Distribution:**
        - **Agriculture**: Includes farming, fishing, forestry, and related activities
        - **Industry**: Includes manufacturing, mining, construction, and utilities
        - **Services**: Includes retail, finance, healthcare, education, and other service-oriented activities
        
        A higher percentage in the services sector typically indicates a more developed economy, while higher agriculture percentages are often associated with developing economies.
        """)
        
        # Historical Trends
        st.subheader("Historical Trends")
        
        # Create a line chart for historical trends
        fig_trends = make_subplots(specs=[[{"secondary_y": True}]])
        
        # Add employment sectors
        for sector, color in zip(sector_cols, px.colors.qualitative.Set2):
            sector_name = sector.replace('Employment Sector: ', '')
            fig_trends.add_trace(
                go.Scatter(
                    x=country_data['Year'],
                    y=country_data[sector],
                    name=sector_name,
                    mode='lines+markers',
                    line=dict(color=color)
                ),
                secondary_y=False
            )
        
        # Add unemployment rate on secondary y-axis
        fig_trends.add_trace(
            go.Scatter(
                x=country_data['Year'],
                y=country_data['Unemployment Rate'],
                name='Unemployment Rate',
                mode='lines+markers',
                line=dict(color='red', dash='dot')
            ),
            secondary_y=True
        )
        
        # Update layout
        fig_trends.update_layout(
            title=f"Employment Sectors and Unemployment Rate Trends for {selected_country}",
            xaxis_title="Year",
            legend=dict(orientation="h", yanchor="bottom", y=1.02, xanchor="right", x=1)
        )
        
        fig_trends.update_yaxes(title_text="Employment Percentage", secondary_y=False)
        fig_trends.update_yaxes(title_text="Unemployment Rate (%)", secondary_y=True)
        
        st.plotly_chart(fig_trends, use_container_width=True)
        
        st.markdown("""
        **Interpreting Historical Trends:**
        - Look for shifts between sectors over time, which can indicate economic transitions
        - Note the relationship between unemployment rates and changes in sector distribution
        - Rapid changes may indicate economic reforms, crises, or structural changes in the economy
        
        Be careful when interpreting these trends as they may be influenced by:
        - Changes in data collection methodologies
        - Economic crises or recessions
        - Policy changes affecting employment classification
        """)
        
        # Distribution Analysis
        st.subheader("Distribution Analysis")
        
        # Create histograms for global distribution
        fig_dist = make_subplots(rows=1, cols=3, 
                                subplot_titles=("Agriculture", "Industry", "Services"))
        
        year_global_data = df[df['Year'] == selected_year]
        
        for i, sector in enumerate(sector_cols):
            sector_name = sector.replace('Employment Sector: ', '')
            fig_dist.add_trace(
                go.Histogram(
                    x=year_global_data[sector],
                    name=sector_name,
                    marker_color=px.colors.qualitative.Set2[i],
                    opacity=0.7,
                    nbinsx=30
                ),
                row=1, col=i+1
            )
            
            # Add vertical line for selected country
            fig_dist.add_shape(
                type="line",
                x0=year_data[sector].values[0],
                y0=0,
                x1=year_data[sector].values[0],
                y1=1,
                line=dict(color="red", width=2, dash="dash"),
                xref=f"x{i+1}",
                yref=f"paper",
            )
            
            # Add annotation for the country
            fig_dist.add_annotation(
                x=year_data[sector].values[0],
                y=1,
                text=f"{selected_country}",
                showarrow=False,
                xref=f"x{i+1}",
                yref="paper",
                font=dict(color="red")
            )
        
        fig_dist.update_layout(
            title=f"Global Distribution of Employment Sectors ({selected_year})",
            showlegend=False,
            height=400
        )
        
        fig_dist.update_xaxes(title_text="Percentage (%)")
        fig_dist.update_yaxes(title_text="Number of Countries")
        
        st.plotly_chart(fig_dist, use_container_width=True)
        
        st.markdown("""
        **Understanding the Distribution Analysis:**
        - These histograms show how employment sectors are distributed across all countries
        - The red dashed line indicates where the selected country falls within the global distribution
        - This helps contextualize the country's economic structure compared to the rest of the world
        
        When analyzing these distributions, consider:
        - Bimodal distributions may indicate different development stages among countries
        - The position of a country relative to global peaks can indicate its economic development status
        - Extreme values may represent specialized economies or data anomalies
        """)
        
        # GDP vs Employment Sectors
        st.subheader("GDP vs Employment Sectors")
        
        # Create scatter plots
        fig_scatter = px.scatter(
            year_global_data,
            x='Employment Sector: Services',
            y='GDP (in USD)',
            hover_name='Country Name',
            size='GDP (in USD)',
            size_max=60,
            color='Employment Sector: Agriculture',
            color_continuous_scale='RdYlGn_r',  # Reversed so red=high agriculture, green=low
            title=f"GDP vs Services Employment ({selected_year})",
            labels={
                'Employment Sector: Services': 'Services Employment (%)',
                'GDP (in USD)': 'GDP (USD)',
                'Employment Sector: Agriculture': 'Agriculture Employment (%)'
            }
        )
        
        # Highlight selected country
        selected_point = year_data.iloc[0]
        fig_scatter.add_trace(
            go.Scatter(
                x=[selected_point['Employment Sector: Services']],
                y=[selected_point['GDP (in USD)']],
                mode='markers',
                marker=dict(
                    size=20,
                    color='red',
                    symbol='star',
                    line=dict(width=2, color='black')
                ),
                name=selected_country,
                showlegend=True
            )
        )
        
        fig_scatter.update_layout(
            height=600,
            xaxis=dict(title='Services Employment (%)'),
            yaxis=dict(title='GDP (USD)', type='log')  # Log scale for better visualization
        )
        
        st.plotly_chart(fig_scatter, use_container_width=True)
        
        st.markdown("""
        **Interpreting GDP vs Employment Sectors:**
        - There is typically a positive correlation between services employment and GDP
        - Countries with higher agricultural employment (red) tend to have lower GDP
        - Countries with lower agricultural employment (green) tend to have higher GDP
        
        Important considerations:
        - Correlation does not imply causation
        - Other factors like natural resources, geopolitics, and historical context affect GDP
        - Some countries may have unique economic structures due to their specific circumstances
        - The log scale on the GDP axis helps visualize countries with vastly different economic sizes
        """)
        
    else:
        st.error(f"No data available for {selected_country} in {selected_year}")

# Made with Bob
