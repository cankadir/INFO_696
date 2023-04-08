
import pandas as pd
import matplotlib.pyplot as plt
from js import document

from pyodide.http import open_url

# GET DATA
lat,lon = 40.7333, -73.9566

url311 = f"https://data.cityofnewyork.us/resource/erm2-nwe9.json?$select=unique_key,latitude,longitude,complaint_type,descriptor,created_date,resolution_description&$where=within_circle(location,{lat},{lon},200) and date_extract_y(created_date)>2022 and agency not in ('HDP') and complaint_type not in ('Blocked Driveway')&$limit=250&$order=created_date DESC"

url_content = open_url(url311)
df = pd.read_json(url_content)

# PLOT THEM
for i,r in df.iterrows():

    element = document.createElement('div')
    element.innerHTML = f'''<div class="item">
        <div class="content">
            <p><b>{r['complaint_type']}</b></p>
            <p>{r['descriptor']}</p>
            <p>{r['created_date']}</p>
            <p>{r['resolution_description']}</p>
        </div>
    </div>'''
    document.getElementById("table").append(element)


# MAKE A CHART
# Count complaints by type
gr = df.groupby(['complaint_type']).count().reset_index()
gr = gr.sort_values(by='unique_key',ascending=True).rename(columns={'unique_key':'count'})

gr = gr[gr['count']>1]

# Plot the Chart
fig, ax = plt.subplots(figsize=(10,8))
ax.barh( gr['complaint_type'],gr['count'] )
# ax.set_yticklabels(gr['complaint_type'],rotation=0)
ax.set_title('311 Complaints')
ax.set_ylabel('')
ax.set_xlabel('Complaint Type')
plt.tight_layout()
# Publish to HTML
pyscript.write("chart",fig)

