# limnlens/tools/merge_sensor_detailed.py
import csv
import pathlib

IMPORT_PATH = pathlib.Path("data/imports/CameraSensorSizeDatabase/sensor_database_detailed.csv")
OUTPUT_PATH = pathlib.Path("data/sensor_db.csv")

def normalize_model(s: str) -> str:
    return s.strip().lower().replace("-", " ").replace("_", " ")

def merge_sensor_detailed():
    seen = set()
    merged = []

    with IMPORT_PATH.open() as f:
        reader = csv.DictReader(f)
        print("Detected columns:", reader.fieldnames)

        for row in reader:
            model_raw = row.get("CameraModel")
            if not model_raw:
                continue
            model_raw = model_raw.strip()
            model_norm = normalize_model(model_raw)
            if model_norm in seen:
                continue
            seen.add(model_norm)

            merged.append({
                "Brand": row.get("CameraMaker", "").strip(),
                "Model": model_raw,
                "SensorWidth": row.get("SensorWidth(mm)", "").strip(),
                "SensorHeight": row.get("SensorHeight(mm)", "").strip(),
                "ResolutionX": row.get("SensorWidth(pixels)", "").strip(),
                "ResolutionY": row.get("SensorHeight(pixels)", "").strip(),
                "CropFactor": "",  # Optional: calculate later
                "Notes": row.get("SensorDescription", "").strip() + " | imported from sensor_database_detailed"
            })

    return merged

def write_output(data):
    with OUTPUT_PATH.open("w", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=[
            "Brand", "Model", "SensorWidth", "SensorHeight",
            "ResolutionX", "ResolutionY", "CropFactor", "Notes"
        ])
        writer.writeheader()
        writer.writerows(data)

def main():
    entries = merge_sensor_detailed()
    print(f"Merged {len(entries)} unique sensor entries.")
    write_output(entries)

if __name__ == "__main__":
    main()