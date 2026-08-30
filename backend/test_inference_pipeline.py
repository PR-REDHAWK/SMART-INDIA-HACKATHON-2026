import sys
import os
import json

# Add backend directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from backend.inference_pipeline import run_production_inference, get_model_manager

def test_production_pipeline():
    print("==========================================================")
    print("RUNNING PRODUCTION INFERENCE PIPELINE UNIT TEST SUITE")
    print("==========================================================")

    # 1. Startup Artifact & Compatibility Validation
    print("\n1. Validating Model Manager Startup...")
    mgr = get_model_manager()
    assert len(mgr.calibrators) == 12, f"Expected 12 calibrators, got {len(mgr.calibrators)}"
    print("[PASS] Model Manager loaded 12 official calibrators successfully.")

    # 2. Historical Test Case 1: Uttar Pradesh (Meerut) - 2024-06-15
    print("\n2. Executing Test Case 1: Uttar Pradesh (2024-06-15, Rice, Sowing)...")
    res1 = run_production_inference(
        state="Uttar Pradesh",
        prediction_date_str="2024-06-15",
        crop_name="Rice",
        growth_stage="Sowing",
        soil_moisture_pct=22.0
    )
    assert res1['status'] == "SUCCESS"
    assert "probabilities" in res1
    assert "advisory" in res1
    print(f"[PASS] Probabilities: Onset 14d={res1['probabilities']['onset']['14d']}%, Break 14d={res1['probabilities']['break_spell']['14d']}%")
    print(f"       Advisory Code: {res1['advisory']['advisory_code']} | Title: {res1['advisory']['title'].encode('ascii', 'replace').decode('ascii')}")

    # 3. Historical Test Case 2: Maharashtra - 2024-07-20
    print("\n3. Executing Test Case 2: Maharashtra (2024-07-20, Cotton, Vegetative)...")
    res2 = run_production_inference(
        state="Maharashtra",
        prediction_date_str="2024-07-20",
        crop_name="Cotton",
        growth_stage="Vegetative",
        soil_moisture_pct=72.0
    )
    assert res2['status'] == "SUCCESS"
    print(f"[PASS] Probabilities: Break 14d={res2['probabilities']['break_spell']['14d']}%, Heavy Rain 7d={res2['probabilities']['heavy_rain']['7d']}%")
    print(f"       Advisory Code: {res2['advisory']['advisory_code']} | Title: {res2['advisory']['title'].encode('ascii', 'replace').decode('ascii')}")

    # 4. Historical Test Case 3: Rajasthan - 2024-08-10
    print("\n4. Executing Test Case 3: Rajasthan (2024-08-10, Maize, Flowering)...")
    res3 = run_production_inference(
        state="Rajasthan",
        prediction_date_str="2024-08-10",
        crop_name="Maize",
        growth_stage="Flowering"
    )
    assert res3['status'] == "SUCCESS"
    print(f"[PASS] Probabilities: Onset 30d={res3['probabilities']['onset']['30d']}%, Break 21d={res3['probabilities']['break_spell']['21d']}%")
    print(f"       Advisory Code: {res3['advisory']['advisory_code']} | Title: {res3['advisory']['title'].encode('ascii', 'replace').decode('ascii')}")

    # 5. Historical Test Case 4: Kerala - 2025-05-20
    print("\n5. Executing Test Case 4: Kerala (2025-05-20, Soybean, Sowing)...")
    res4 = run_production_inference(
        state="Kerala",
        prediction_date_str="2025-05-20",
        crop_name="Soybean",
        growth_stage="Sowing"
    )
    assert res4['status'] == "SUCCESS"
    print(f"[PASS] Probabilities: Onset 7d={res4['probabilities']['onset']['7d']}%, Onset 14d={res4['probabilities']['onset']['14d']}%")
    print(f"       Advisory Code: {res4['advisory']['advisory_code']} | Title: {res4['advisory']['title'].encode('ascii', 'replace').decode('ascii')}")

    print("\n==========================================================")
    print("ALL PRODUCTION INFERENCE PIPELINE UNIT TESTS PASSED (100%)!")
    print("==========================================================")

if __name__ == '__main__':
    test_production_pipeline()
