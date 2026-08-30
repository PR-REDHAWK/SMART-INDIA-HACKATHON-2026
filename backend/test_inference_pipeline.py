import sys
import os

# Add backend directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from backend.inference_pipeline import run_production_inference, get_model_manager, resolve_state_name

def test_production_pipeline():
    print("==========================================================")
    print("RUNNING PHASE 9 LOCATION & FORECAST VALIDATION TESTS")
    print("==========================================================")

    # 1. Startup Artifact & Compatibility Validation
    print("\n1. Validating Model Manager Startup...")
    mgr = get_model_manager()
    assert len(mgr.calibrators) == 12, f"Expected 12 calibrators, got {len(mgr.calibrators)}"
    print("[PASS] Model Manager loaded 12 official calibrators successfully.")

    # 2. Test Comprehensive Indian Location Resolution
    print("\n2. Auditing Location Resolution across 14 Test Locations...")
    test_locations = [
        ("Uttar Pradesh", "Uttar Pradesh"),
        ("Meerut", "Uttar Pradesh"),
        ("Lucknow", "Uttar Pradesh"),
        ("Maharashtra", "Maharashtra"),
        ("Mumbai", "Maharashtra"),
        ("Rajasthan", "Rajasthan"),
        ("Karnataka", "Karnataka"),
        ("Kerala", "Kerala"),
        ("Andhra Pradesh", "Karnataka"),
        ("Bihar", "Uttar Pradesh"),
        ("Delhi", "Uttar Pradesh"),
        ("Tamil Nadu", "Kerala"),
        ("Himachal Pradesh", "Punjab"),
        ("Madhya Pradesh", "Maharashtra")
    ]

    for loc_in, expected_state in test_locations:
        res_st = resolve_state_name(loc_in)
        assert res_st == expected_state, f"Location '{loc_in}' resolved to '{res_st}', expected '{expected_state}'"
        print(f"  [PASS] Location '{loc_in}' -> Resolved State: '{res_st}'")

    # 3. Live Pipeline Forecast Execution across 5 Geographic Scenarios
    print("\n3. Testing End-to-End Live Pipeline Execution across Regions...")
    
    # Scenario A: Meerut (District under Uttar Pradesh)
    res_a = run_production_inference(state="Meerut", prediction_date_str="2024-06-15", crop_name="Rice", growth_stage="Sowing")
    assert res_a['status'] == "SUCCESS"
    assert res_a['metadata']['resolved_state'] == "Uttar Pradesh"
    print(f"  [PASS] Meerut (UP) -> Onset 14d={res_a['probabilities']['onset']['14d']}%, Break 14d={res_a['probabilities']['break_spell']['14d']}% | Advisory: {res_a['advisory']['advisory_code']}")

    # Scenario B: Wayanad (District under Kerala)
    res_b = run_production_inference(state="Wayanad", prediction_date_str="2024-05-20", crop_name="Soybean", growth_stage="Sowing")
    assert res_b['status'] == "SUCCESS"
    assert res_b['metadata']['resolved_state'] == "Kerala"
    print(f"  [PASS] Wayanad (Kerala) -> Onset 7d={res_b['probabilities']['onset']['7d']}%, Heavy Rain 7d={res_b['probabilities']['heavy_rain']['7d']}% | Advisory: {res_b['advisory']['advisory_code']}")

    # Scenario C: Bihar / Patna (Mapped to Uttar Pradesh regional baseline)
    res_c = run_production_inference(state="Patna", prediction_date_str="2024-07-05", crop_name="Rice", growth_stage="Vegetative")
    assert res_c['status'] == "SUCCESS"
    assert res_c['metadata']['resolved_state'] == "Uttar Pradesh"
    print(f"  [PASS] Patna (Bihar) -> Break 14d={res_c['probabilities']['break_spell']['14d']}% | Advisory: {res_c['advisory']['advisory_code']}")

    # Scenario D: Andhra Pradesh / Visakhapatnam (Mapped to Karnataka regional baseline)
    res_d = run_production_inference(state="Visakhapatnam", prediction_date_str="2024-08-10", crop_name="Cotton", growth_stage="Flowering")
    assert res_d['status'] == "SUCCESS"
    assert res_d['metadata']['resolved_state'] == "Karnataka"
    print(f"  [PASS] Visakhapatnam (AP) -> Break 21d={res_d['probabilities']['break_spell']['21d']}% | Advisory: {res_d['advisory']['advisory_code']}")

    print("\n==========================================================")
    print("ALL PHASE 9 LOCATION & FORECAST VALIDATION TESTS PASSED (100%)!")
    print("==========================================================")

if __name__ == '__main__':
    test_production_pipeline()
