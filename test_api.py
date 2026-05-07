#!/usr/bin/env python3
"""Test the API endpoints to verify full flow."""
import requests
import json

BASE_URL = "http://localhost:8000"

# Test 1: Health check
print("=" * 60)
print("TEST 1: Health Check")
print("=" * 60)
r = requests.get(f"{BASE_URL}/health")
print(f"Status: {r.status_code}")
print(f"Response: {r.json()}")

# Test 2: Extract criteria from sample text
print("\n" + "=" * 60)
print("TEST 2: Extract Criteria")
print("=" * 60)
tender_text = """
Tender for software development project.

Eligibility Criteria:
1. Turnover > 50 Lakhs - minimum annual turnover requirement
2. ISO 9001 Certification - required for quality assurance
3. 5 years of experience - in software development
4. Registration with government
"""

r = requests.post(f"{BASE_URL}/extract_criteria", json={"text": tender_text})
print(f"Status: {r.status_code}")
criteria = r.json()
print(f"Extracted Criteria:")
print(json.dumps(criteria, indent=2))

# Test 3: Extract bidder data from sample text
print("\n" + "=" * 60)
print("TEST 3: Extract Bidder Data")
print("=" * 60)
bidder_text = """
Company Profile: TechCorp Ltd

Annual Turnover: 75 Lakhs (FY 2025)
Certifications: ISO 9001:2015, ISO 27001
Years of Experience: 8 years in software development
Registration: GST registered, PAN verified

Our company has been serving clients since 2017.
"""

r = requests.post(f"{BASE_URL}/extract_bidder_data", json={"text": bidder_text})
print(f"Status: {r.status_code}")
bidder = r.json()
print(f"Extracted Bidder Data:")
print(json.dumps(bidder, indent=2))

# Test 4: Evaluate (combine criteria and bidder data)
print("\n" + "=" * 60)
print("TEST 4: Evaluate (Rule-based + Evidence)")
print("=" * 60)

# Use extracted criteria and bidder data
criteria_list = criteria.get("criteria", [])
bidder_data = bidder.get("bidder", {})

payload = {
    "criteria": criteria_list,
    "bidder": bidder_data
}

r = requests.post(f"{BASE_URL}/evaluate", json=payload)
print(f"Status: {r.status_code}")
result = r.json()
print(f"Evaluation Result:")
print(json.dumps(result, indent=2))

# Summary
print("\n" + "=" * 60)
print("SUMMARY")
print("=" * 60)
print(f"Decision: {result.get('decision')}")
print(f"Confidence: {result.get('confidence')}")
print(f"\nExplanation:")
for i, reason in enumerate(result.get('reasons', []), 1):
    print(f"  {i}. {reason}")
print(f"\nEvidence (Verifiable backing):")
for i, evidence in enumerate(result.get('evidence', []), 1):
    print(f"  {i}. {evidence}")
