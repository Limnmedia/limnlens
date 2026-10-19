LIMNMEDIA LENSMap

Stop-Motion and Cinematic Miniature Calibration Tool
[WIP Draft v1.0]

⸻

🚀 About

LENSMap is an open-source calibration system designed to map and document the optical behavior of camera+lens systems for stop-motion, miniature VFX, and precision cinematography workflows.

Built by Christopher Weinberg, member of the VES, ASIFA, and NATAS,
LENSMap introduces an educational, modular, and production-ready method to record:
	•	True pixel density across the image plane
	•	Effective focal length shifts across focus range (breathing)
	•	Real-world scaling for Three Point System (TPS) multipass shooting
	•	Entrance pupil offsets for nodal camera matching
	•	Baseline measurements for accurate CG-practical integration

LENSMap profiles are structured to be human-readable (YAML, JSON) and future-proofed for cinematic optical modeling.

⸻

📚 Key Features

✅ Load calibration images and parse EXIF metadata
✅ Pick and verify points for precise baseline measurement
✅ Calculate pixel density (px/mm) and effective focal length (EFL)
✅ Track entrance pupil offsets
✅ Export standardized LENSMap profiles (v1.0 schema)
✅ Modular design (Canvas handler, Picker, Verifier, EXIF parser)
✅ Built with future extensions for:
	•	Full breathing curves
	•	Distortion models
	•	Diopter compensation
	•	Bellows extension mapping

⸻

📈 Why LENSMap?
	•	Stop-motion cinematography has historically lacked industry-standard optical profiles.
	•	Miniature VFX demands precise real-world scaling, nodal accuracy, and multipass registration.
	•	LENSMap bridges the gap between handcrafted cinematography and production-grade VFX calibration.

No more “one-take wonder” limits —
LENSMap empowers you to treat stop-motion cinematography as a precision VFX platform.

⸻

🔧 Project Structure

limnlens/
├── src/
│   ├── modules/       # State, canvas handling, picking, verifying
│   ├── ui/            # Styles, logos, UI helpers
│   └── index.html     # Main frontend interface
├── data/
│   ├── imports/       # External sensor databases
│   ├── processed/     # Curated camera/lens metadata
│   └── lens_profiles/ # Exported LENSMap calibration profiles
├── img/
│   └── production/    # Calibration charts, real-world test images
├── docs/              # Project specifications, draft standards
├── tests/             # Unit tests and assets
├── tools/             # Future CLI/API tools
├── README.md          # (this file)
└── LICENSE



⸻

🛠️ Quick Start (Developer Setup)

git clone https://github.com/youruser/limnlens.git
cd limnlens
npm install   # (for dev tooling, optional)
open src/index.html   # Or use a simple Python server to run locally



⸻

📖 Using LENSMap
	1.	Research: Confirm camera sensor size from database.
	2.	Capture: Photograph a calibration target with manual settings.
	3.	Load: Import the image into LENSMap.
	4.	Pick: Place two points across a known physical baseline.
	5.	Verify: Center and confirm picked points.
	6.	Calculate: Pixel density, effective focal length.
	7.	Export: Save a .json or .yaml LENSMap Profile.

⸻

🌟 Vision Roadmap

Phase	Goal
Phase 1	Core calibration workflow for prime lenses (static focal length)
Phase 1.5	Calibration Target ID tracking, Lens breathing maps
Phase 2	Full optical models (Zoom curves, Diopters, Bellows, Distortion)
Phase 2+	Open standard API for VFX tools and stop-motion pipelines



⸻

🤝 Contributing

Want to help extend LENSMap?
	•	Fix bugs, expand database imports
	•	Create calibration chart templates
	•	Help define Phase 2 optical models
	•	Improve mobile/touch UX

Pull Requests welcome! ✨

⸻

📝 License

This project is licensed under the MIT License.
Open forever. For stop-motion artists, cinematographers, and VFX creators.

⸻

📢 Acknowledgements
	•	Academy Software Foundation (ASWF) for inspiring open-source cinematic tool standards
	•	VES, ASIFA, and NATAS for shaping professional craft traditions
	•	Community builders in stop-motion and VFX who keep the art evolving

⸻

✨

If you can measure it, you can control it.

LENSMap: Bring stop-motion into the future — one calibrated frame at a time.

⸻

📋 Notes
	•	Versioned Profile Spec: LENSMap Profile v1.0 Specification (draft)
	•	Database Datasets: CameraSensorSizeDatabase, RawTherapee EXIF exports, Academy Standard Sensor Lists

⸻

📦 Ready to use in your studio?

👉 Let’s map the future.

⸻

📋 End of README Draft v1.0

⸻
