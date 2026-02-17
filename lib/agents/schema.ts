export const DEFINITIVE_PAS_SCHEMA = {
    "product_context": {
        "canonical_product_id": "string",
        "product_name": "string",
        "product_family": "string",
        "variant_code": "string",
        "version": {
            "version_number": "string",
            "approval_date": "YYYY-MM-DD",
            "effective_date": "YYYY-MM-DD",
            "expiry_date": "YYYY-MM-DD | null"
        },
        "carrier": {
            "legal_name": "string",
            "entity_code": "string"
        },
        "line_of_business": {
            "primary": "TERM | ENDOWMENT | ULIP | ANNUITY | HEALTH",
            "secondary": "string | null"
        },
        "jurisdiction": {
            "country_code": "ISO-3166-1",
            "state_code": "ISO-3166-2 | null",
            "regulator": "string"
        },
        "currency": {
            "iso_code": "ISO-4217",
            "rounding_rules": "string | null"
        }
    },
    "eligibility_rules": {
        "entry_age": {
            "minimum": "number",
            "maximum": "number",
            "unit": "years"
        },
        "expiry_age": {
            "maximum": "number",
            "unit": "years"
        },
        "residency_requirements": {
            "allowed_statuses": ["resident", "nri", "oci"],
            "restrictions": "string | null"
        },
        "occupation_eligibility": {
            "allowed_classes": ["string"],
            "excluded_classes": ["string"],
            "special_conditions": "string | null"
        },
        "financial_limits": {
            "minimum_sum_assured": "number",
            "maximum_sum_assured": "number",
            "income_multiplier_rules": "string | null"
        },
        "policy_term_constraints": {
            "min_years": "number",
            "max_years": "number",
            "allowed_combinations": "string | null"
        }
    },
    "benefit_configuration": [
        {
            "benefit_id": "string",
            "benefit_type": "death | maturity | survival | disability | critical_illness",
            "label": "string",
            "description": "string",
            "trigger_events": ["string"],
            "payout_logic": {
                "precedence": "higher_of | sum_of | lower_of | first_occurrence",
                "calculation_components": [
                    {
                        "basis": "sum_assured | premiums_paid | fund_value | paid_up_value",
                        "multiplier": "number",
                        "fixed_addition": "number",
                        "maximum_cap": "number",
                        "minimum_floor": "number"
                    }
                ]
            },
            "vesting_conditions": {
                "minimum_policy_duration_years": "number",
                "minimum_premiums_paid": "number",
                "other_conditions": "string | null"
            },
            "waiting_period": {
                "duration": "number",
                "unit": "days | months | years"
            },
            "dependencies": {
                "requires_benefits": ["string"],
                "invalidates_benefits": ["string"]
            }
        }
    ],
    "premium_rules": {
        "payment_structure": {
            "payment_type": "single | regular | limited",
            "premium_payment_term_years": "number"
        },
        "frequencies_allowed": ["annual", "half_yearly", "quarterly", "monthly"],
        "grace_period": {
            "duration": "number",
            "unit": "days"
        },
        "premium_calculation": {
            "method": "rate_table | fixed_rate | formula",
            "rate_table_reference": "string | null",
            "rating_factors": ["age", "gender", "sum_assured", "policy_term", "ppt", "smoker_status", "rider_selection"],
            "modal_factors": "string | null"
        },
        "taxes_and_charges": {
            "gst_percent": "number",
            "other_levies": "string | null"
        }
    },
    "policy_lifecycle_rules": {
        "lapse": {
            "conditions": "string",
            "effective_after_days": "number"
        },
        "revival": {
            "is_allowed": "boolean",
            "revival_window_months": "number",
            "interest_calculation": {
                "type": "simple | compound",
                "rate_percent": "number"
            }
        },
        "paid_up": {
            "is_allowed": "boolean",
            "minimum_premiums_paid": "number",
            "paid_up_value_formula": "string"
        },
        "surrender": {
            "is_allowed": "boolean",
            "minimum_policy_duration_months": "number",
            "value_calculation": {
                "guaranteed_value_factor": "number",
                "special_value_factor": "number",
                "deductions": "string | null"
            }
        },
        "loans": {
            "is_available": "boolean",
            "max_percentage_of_value": "number",
            "interest_rate_percent": "number"
        },
        "bonuses": {
            "bonus_types": ["reversionary", "terminal"],
            "accrual_rules": "string",
            "vesting_rules": "string"
        }
    },
    "underwriting_rules": {
        "evidence_requirements": ["kyc", "financials", "medical_tests"],
        "auto_underwriting": {
            "is_enabled": "boolean",
            "max_sum_assured": "number",
            "eligibility_conditions": "string"
        },
        "referral_rules": [
            {
                "rule_id": "string",
                "trigger_condition": "string",
                "reason": "string"
            }
        ]
    },
    "exclusion_rules": [
        {
            "exclusion_id": "string",
            "scope": "full | limited",
            "condition_precedent": "string",
            "applicable_duration_months": "number",
            "impact_on_benefits": "deny | reduce | defer"
        }
    ],
    "claims_administration": {
        "claim_event_types": ["death_claim", "maturity_claim", "disability_claim"],
        "notification_requirements": {
            "timeline_days": "number",
            "mode": ["online", "offline"]
        },
        "documentation_required": ["string"],
        "settlement_sla_days": "number"
    },
    "tax_and_regulatory": {
        "tax_benefits": ["string"],
        "statutory_disclosures": ["string"],
        "regulatory_constraints": ["string"]
    },
    "audit_and_integrity": {
        "field_population_status": [
            {
                "field_path": "string",
                "status": "populated | not_available | inferred",
                "confidence_score": "number",
                "source_reference": "string"
            }
        ],
        "overall_extraction_confidence": "number"
    }
};

export const MASTER_SCHEMA = DEFINITIVE_PAS_SCHEMA;
export const SCHEMA_STRING = JSON.stringify(DEFINITIVE_PAS_SCHEMA, null, 2);
