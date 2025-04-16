# limnlens/tools/merge_sensor_dbs.py
import csv
import pathlib

IMPORT_PATH = pathlib.Path("data/imports/CameraSensorSizeDatabase/sensor_database.csv")
OUTPUT_PATH = pathlib.Path("data/sensor_db.csv")

def normalize_model(s: str) -> str:
    return s.strip().lower().replace("-", " ").replace("_", " ")

def merge_sensor_db():
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

            brand = row.get("CameraMaker", "").strip()
            sensor_width = row.get("SensorWidth(mm)", "").strip()

            merged.append({
                "Brand": brand,
                "Model": model_raw,
                "SensorWidth": sensor_width,
                "SensorHeight": "",
                "ResolutionX": "",
                "ResolutionY": "",
                "CropFactor": "",
                "Notes": "imported from CameraSensorSizeDatabase"
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
    entries = merge_sensor_db()
    print(f"Merged {len(entries)} unique sensor entries.")
    write_output(entries)

if __name__ == "__main__":
    main()