#!/usr/bin/env python3
"""Verify Tender Evidence Copilot system is fully functional."""

import requests
import json
import sys

API_BASE = 'http://localhost:8000'

def test_criteria_extraction():
    """Test criteria extraction with mock data fallback."""
    print('=== TEST 1: Extract Criteria (Mock Data Fallback) ===')
    resp = requests.post(f'{API_BASE}/extract_criteria', json={'text': 'Random text'})
    if resp.status_code != 200:
        print(f'❌ Failed with status {resp.status_code}')
        return False
    
    data = resp.json()
    criteria = data.get('criteria', [])
    if not criteria or len(criteria) == 0:
        print(f'❌ No criteria returned')
        return False
    
    print(f'✓ Criteria extracted: {len(criteria)} items')
    for c in criteria:
        print(f'  - {c.get("criterion")}')
    print()
    return True

def test_bidder_extraction():
    """Test bidder extraction with mock data fallback."""
    print('=== TEST 2: Extract Bidder (Mock Data Fallback) ===')
    resp = requests.post(f'{API_BASE}/extract_bidder_data', json={'text': 'Some company'})
    if resp.status_code != 200:
        print(f'❌ Failed with status {resp.status_code}')
        return False
    
    data = resp.json()
    bidder = data.get('bidder', {})
    if not bidder:
        print(f'❌ No bidder data returned')
        return False
    
    turnover = bidder.get('turnover')
    certs = bidder.get('certifications', [])
    exp = bidder.get('experience_years')
    
    print(f'✓ Bidder extracted:')
    print(f'  - Turnover: {turnover}L')
    print(f'  - Certifications: {len(certs)}')
    print(f'  - Experience: {exp} years')
    print()
    return True

def test_evaluation():
    """Test full evaluation flow."""
    print('=== TEST 3: Full Evaluation Flow ===')
    
    criteria = [
        {'criterion': 'Min Turnover 50L', 'type': 'numeric', 'threshold': 50.0, 'unit': 'L'},
        {'criterion': 'ISO 9001', 'type': 'certification', 'threshold': None, 'unit': None},
    ]
    bidder = {
        'turnover': 75.0,
        'certifications': ['ISO 9001:2015'],
        'experience_years': 8.0,
        'raw_excerpts': ['Turnover: 75L']
    }
    
    resp = requests.post(f'{API_BASE}/evaluate', json={'criteria': criteria, 'bidder': bidder})
    if resp.status_code != 200:
        print(f'❌ Failed with status {resp.status_code}')
        return False
    
    result = resp.json()
    decision = result.get('decision')
    confidence = result.get('confidence')
    reasons = result.get('reasons', [])
    evidence = result.get('evidence', [])
    
    print(f'✓ Evaluation complete:')
    print(f'  - Decision: {decision}')
    print(f'  - Confidence: {confidence}')
    print(f'  - Reasons: {len(reasons)}')
    print(f'  - Evidence: {len(evidence)}')
    if evidence:
        for e in evidence:
            print(f'    • {e}')
    print()
    return True

def main():
    """Run all tests."""
    print('╔═══════════════════════════════════════════════════════════╗')
    print('║  Tender Evidence Copilot - System Verification             ║')
    print('╚═══════════════════════════════════════════════════════════╝')
    print()
    
    try:
        # Check if backend is running
        resp = requests.get(f'{API_BASE}/health', timeout=2)
        if resp.status_code != 200:
            print('❌ Backend health check failed!')
            return False
        print('✓ Backend is running on http://localhost:8000')
        print()
    except Exception as e:
        print(f'❌ Cannot connect to backend: {e}')
        print('   Make sure backend is running: cd backend && uvicorn app.main:app --reload')
        return False
    
    # Run tests
    tests = [
        test_criteria_extraction,
        test_bidder_extraction,
        test_evaluation,
    ]
    
    results = []
    for test in tests:
        try:
            results.append(test())
        except Exception as e:
            print(f'❌ Test failed with exception: {e}')
            results.append(False)
    
    # Summary
    print('╔═══════════════════════════════════════════════════════════╗')
    if all(results):
        print('║  ✓ ALL TESTS PASSED - SYSTEM READY FOR HACKATHON!        ║')
        print('╚═══════════════════════════════════════════════════════════╝')
        return True
    else:
        print(f'║  ❌ {len([r for r in results if not r])} test(s) failed                              ║')
        print('╚═══════════════════════════════════════════════════════════╝')
        return False

if __name__ == '__main__':
    success = main()
    sys.exit(0 if success else 1)
