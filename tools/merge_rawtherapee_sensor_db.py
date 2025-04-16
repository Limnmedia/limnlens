# limnlens/tools/merge_rawtherapee_sensor_db.py
import csv
import json
import pathlib
import re

IMPORT_PATH = pathlib.Path("data/imports/RawTherapee/rtengine/camconst.json")
OUTPUT_PATH = pathlib.Path("data/sensor_db.csv")

def normalize_model(s: str) -> str:
    return s.strip().lower().replace("-", " ").replace("_", " ")

def read_existing_models():
    seen = set()
    if OUTPUT_PATH.exists():
        with OUTPUT_PATH.open() as f:
            reader = csv.DictReader(f)
            for row in reader:
                seen.add(normalize_model(row["Model"]))
    return seen

def extract_camera_constants():
    with IMPORT_PATH.open("r", encoding="utf-8") as f:
        content = f.read()

    # Extract only the actual JSON array from the file
    start_index = content.find('"camera_constants"')
    if start_index == -1:
        raise ValueError("Could not find 'camera_constants' in camconst.json")

    json_snippet = content[start_index:]
    json_snippet = '{' + json_snippet

    # Remove any JS-style comments
    json_snippet = re.sub(r'//.*', '', json_snippet)

    # Attempt to parse cleaned JSON
    try:
        parsed = json.loads(json_snippet)
    except json.JSONDecodeError as e:
        raise ValueError(f"Failed to parse camera_constants JSON: {e}")

    return parsed.get("camera_constants", [])

def merge_rawtherapee_constants():
    seen_models = read_existing_models()
    merged = []

    entries = extract_camera_constants()

    for entry in entries:
        names = entry.get("make_model")
        if not names:
            continue
        if isinstance(names, str):
            names = [names]

        for model in names:
            model_norm = normalize_model(model)
            if model_norm in seen_models:
                continue
            seen_models.add(model_norm)

            merged.append({
                "Brand": "",
                "Model": model,
                "SensorWidth": "",
                "SensorHeight": "",
                "ResolutionX": "",
                "ResolutionY": "",
                "CropFactor": "",
                "Notes": "imported from RawTherapee camera_constants"
            })

    return merged

def append_output(data):
    with OUTPUT_PATH.open("a", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=[
            "Brand", "Model", "SensorWidth", "SensorHeight",
            "ResolutionX", "ResolutionY", "CropFactor", "Notes"
        ])
        writer.writeheader()
        writer.writerows(data)

def main():
    entries = merge_rawtherapee_constants()
    print(f"Appended {len(entries)} new sensor entries from RawTherapee camera_constants.")
    append_output(entries)

if __name__ == "__main__":
    main()