# Village Survey Maps - Complete Workflow Guide

## 📋 Project Overview

This project creates **Progressive Web App (PWA) maps** for village survey fieldwork in Botswana. Each map shows:
- Village boundaries
- Building footprints from OpenStreetMap
- Sampling zones (A, B, C, D)
- GPS-tracked household sampling points
- Offline capability for field use

---

## 🏗️ Project Structure

```
village_maps/
├── HH_sampling_strategy.ipynb      # Main data generation notebook
├── convert_to_pwa.py               # Converts HTML maps to PWAs
├── setup_github_repo.py            # Alternative GitHub setup script
├── fix_coordinates.py              # Fix coordinate issues (utility)
├── switch_to_osm.py                # Switch from Mapbox to OSM (utility)
│
├── <village_name>/                 # Individual village folders
│   ├── <village>_map.html          # Interactive Folium map
│   ├── <village>_map_manifest.json # PWA manifest
│   ├── <village>_map_sw.js         # Service worker
│   ├── <village>_buildings.gpkg    # Building polygons (GeoPackage)
│   ├── <village>_center.gpkg      # Village center point
│   ├── <village>_zones.gpkg        # Zone polygons
│   ├── <village>_sampled_households.gpkg  # Sample points
│   ├── <village>_sampled_households.csv   # Sample data
│   ├── <village>_center_gps.txt    # GPS coordinates text
│   ├── <village>_stats.json        # Statistics summary
│   ├── <village>_zones.csv         # Zone allocation data
│   └── <village>_zone_*_map_*.png  # Static map images
│
└── github_repo/                    # Deployment-ready files
    ├── index.html                  # Landing page with all villages
    ├── README.md                   # Project documentation
    ├── <village>_map.html          # PWA-enhanced map (per village)
    ├── <village>_map_manifest.json # PWA manifest (per village)
    └── <village>_map_sw.js         # Service worker (per village)
```

---

## 🔄 Complete Workflow

### **Step 1: Generate Village Map Data**

**Tool:** `HH_sampling_strategy.ipynb` (Jupyter Notebook)

**What it does:**
1. Fetches building footprints from OpenStreetMap for a specified village
2. Creates village boundary using:
   - OSM administrative boundary (preferred)
   - OSM place polygon (village/town)
   - Dissolved residential landuse polygons
   - Concave hull fallback if no OSM boundary exists
3. Applies adaptive buffer to boundary for better coverage
4. Sets village center at boundary centroid
5. Creates radial wedge zones (typically 4: A, B, C, D)
6. Allocates sample sizes proportionally to building counts per zone
7. Generates interactive Folium map with:
   - OpenStreetMap and Satellite basemaps
   - Color-coded building footprints by zone
   - Zone boundaries with sample allocations
   - Village center marker

**How to use:**
```python
# In HH_sampling_strategy.ipynb, configure:
VILLAGE_NAME = "Nokaneng"      # Change village name
NUM_ZONES = 4                  # Number of sampling zones
OUTPUT_FOLDER = "village_maps"

# Then run all cells
```

**Outputs:**
- `<village>/` folder with all data files (.gpkg, .csv, .json, .html)
- Basic HTML map (not yet PWA-enabled)

---

### **Step 2: Convert Maps to PWAs**

**Tool:** `convert_to_pwa.py`

**What it does:**
1. Scans all village folders for `*_map.html` files
2. For each village:
   - Creates PWA manifest (`*_manifest.json`)
   - Creates service worker (`*_sw.js`) for offline caching
   - Injects PWA tags into HTML (`<link rel="manifest">`, etc.)
   - Removes any old Mapbox integration code
3. Copies PWA files to `github_repo/` (HTML, manifest, service worker only)
4. Creates `index.html` landing page with all villages grouped by district
5. Creates `README.md` for GitHub

**How to use:**
```bash
cd /Users/gladwellmaphane/village_maps
python3 convert_to_pwa.py
```

**Key features:**
- **Selective copying**: Only copies essential files (HTML, manifest, SW), not data files (.gpkg, .png)
- **PWA features**: Manifest for "Add to Home Screen", Service Worker for offline use
- **Automatic indexing**: Groups villages by district (Ngamiland, Bobirwa, Kgalagadi)
- **Clean output**: Removes Mapbox code, keeps default OSM tiles

**Outputs:**
- `github_repo/` folder ready for GitHub Pages deployment
- All villages converted to PWA format
- Landing page with village links

---

### **Step 3: Deploy to GitHub Pages**

**Method 1: Using Claude Code**
```bash
cd github_repo
git add .
git commit -m "Update village survey maps"
git push origin main
```

**Method 2: Using setup_github_repo.py** (alternative)
```python
python3 setup_github_repo.py --input . --output github_repo
```

**GitHub Pages Setup:**
1. Repository: `https://github.com/gmaphane/village-survey-maps`
2. Settings → Pages → Source: `main` branch, `/` (root)
3. Site: `https://gmaphane.github.io/village-survey-maps/`

---

## 🔧 Utility Scripts

### **fix_coordinates.py**
Fixes coordinate mismatches between original folders and github_repo.

```python
# Extracts correct coordinates from original village folders
# Replaces wrong coordinates in github_repo files
python3 fix_coordinates.py
```

### **switch_to_osm.py**
Replaces Mapbox tiles with free OpenStreetMap tiles.

```python
# Removes Mapbox API token requirements
# Adds OSM, Satellite (Esri), and Topographic layers
python3 switch_to_osm.py
```

---

## 📊 Data Files Explained

### **GeoPackage Files (.gpkg)**
- **`*_buildings.gpkg`**: Building polygons with zone assignments
- **`*_center.gpkg`**: Single point at village center
- **`*_zones.gpkg`**: Zone boundary polygons (A, B, C, D)
- **`*_sampled_households.gpkg`**: Sampled building points with metadata

### **CSV Files**
- **`*_sampled_households.csv`**: Sample points with OSM ID, zone, lat/lon, order
- **`*_zones.csv`**: Zone allocation (buildings, proportion, sample size)

### **JSON Files**
- **`*_stats.json`**: Village statistics (population, area, sample size, zones)
- **`*_manifest.json`**: PWA manifest for app installation

### **Text Files**
- **`*_center_gps.txt`**: Human-readable GPS coordinates

---

## 🎯 Typical Workflow for New Village

### **Step-by-Step Example: Adding "Nokaneng"**

1. **Generate Data (Jupyter Notebook)**
   ```python
   # In HH_sampling_strategy.ipynb
   VILLAGE_NAME = "Nokaneng"
   NUM_ZONES = 4
   # Run all cells
   ```
   **Output:** `nokaneng/` folder with all data files

2. **Convert to PWA**
   ```bash
   python3 convert_to_pwa.py
   ```
   **Output:** `github_repo/nokaneng_map.html` (PWA-enabled)

3. **Test Locally**
   ```bash
   cd github_repo
   python3 -m http.server 8000
   # Open http://localhost:8000/
   ```

4. **Deploy**
   ```bash
   git add .
   git commit -m "Add Nokaneng village map"
   git push origin main
   ```

5. **Verify**
   - Visit: `https://gmaphane.github.io/village-survey-maps/`
   - Click "Nokaneng"
   - Test GPS tracking
   - Test "Add to Home Screen" (mobile)

---

## 🗺️ Map Features

### **Interactive Elements**
- **Basemaps**: OpenStreetMap (default), Satellite (Esri), Topographic
- **Buildings**: Color-coded by zone, clickable tooltips
- **Zones**: Transparent overlays with sample allocations
- **Village Center**: Star marker at calculated centroid
- **GPS Tracking**: Real-time location with accuracy circle
- **Layer Control**: Toggle layers on/off

### **PWA Features**
- **Offline Mode**: Works without internet after first load
- **Add to Home Screen**: Installs as standalone app
- **Service Worker**: Caches map for offline use
- **Responsive**: Mobile-friendly interface

---

## 📱 Field Usage

### **Installation**
1. Open village map on mobile device
2. Tap browser menu → "Add to Home Screen"
3. App icon appears on home screen
4. Launch app (works offline)

### **GPS Tracking**
1. Tap location button (top-right)
2. Grant location permission
3. Blue marker shows current position
4. Accuracy circle updates in real-time

### **Offline Work**
- Map tiles cached on first load
- All building data available offline
- GPS works without internet
- Sample points remain visible

---

## 🔍 Troubleshooting

### **Problem: Wrong Coordinates**
```bash
# Check if data has correct Botswana coordinates
cat <village>/<village>_center_gps.txt

# If wrong, regenerate data in Jupyter notebook
# Then run convert_to_pwa.py again
```

### **Problem: Map Shows Wrong Location**
```bash
# Fix map center coordinates
python3 fix_coordinates.py

# Verify in browser
open github_repo/<village>_map.html
```

### **Problem: Blank Map (401 Errors)**
```bash
# Switch from Mapbox to OpenStreetMap
python3 switch_to_osm.py
```

### **Problem: Data Not Showing**
- **Check:** Map center vs. data coordinates must match
- **Solution:** Regenerate map in Jupyter notebook with correct coordinates

---

## 📦 Village Data Dictionary

```python
VILLAGE_DATA = {
    'Nokaneng': {
        'population': 2510,    # 2022 census
        'households': 628,     # Estimated households
        'sample': 93,          # Target sample size
        'district': 'Ngamiland'
    },
    # ... (25 total villages planned)
}
```

**Current Status:**
- **14 villages completed** (as of Nov 5, 2025)
- **3 districts**: Ngamiland, Bobirwa, Kgalagadi
- **1,200+ sampled households** total

---

## 🚀 Best Practices

### **When Generating New Data**
1. Always use the Jupyter notebook (HH_sampling_strategy.ipynb)
2. Verify coordinates are in Botswana (negative latitude, positive longitude)
3. Check boundary includes most buildings (low omission %)
4. Review sample allocation is proportional to zones

### **When Converting to PWA**
1. Run `convert_to_pwa.py` after ANY changes to source maps
2. Test locally before deploying
3. Check index.html includes new village
4. Verify manifest and service worker created

### **When Deploying**
1. Commit with descriptive messages
2. Wait 2-5 minutes for GitHub Pages rebuild
3. Clear browser cache when testing
4. Test on mobile device for PWA features

### **When Updating Existing Villages**
1. Regenerate data in Jupyter notebook (source of truth)
2. Run `convert_to_pwa.py` to update github_repo
3. Git commit and push
4. Verify changes on live site

---

## 📚 Dependencies

### **Python Packages**
```bash
pip install geopandas shapely folium requests scipy numpy pandas
```

### **Data Sources**
- **Buildings**: OpenStreetMap (via Overpass API)
- **Boundaries**: OSM administrative/residential polygons
- **Basemaps**: OpenStreetMap, Esri Satellite
- **Population Data**: 2022 Botswana Census

---

## 📞 Support & Resources

- **GitHub Repository**: https://github.com/gmaphane/village-survey-maps
- **Live Site**: https://gmaphane.github.io/village-survey-maps/
- **Jupyter Notebook**: `HH_sampling_strategy.ipynb`
- **Conversion Script**: `convert_to_pwa.py`

---

**Last Updated:** November 5, 2025
**Project:** CI-GCF 2025 Socio-Economic Baseline Survey
**Organization:** Conservation International - Global Conservation Fund
