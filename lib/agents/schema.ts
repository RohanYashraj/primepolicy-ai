export const DEFINITIVE_PAS_SCHEMA = {
    "product_context": {
        "product_name": "string",
        "product_family": "TERM | ENDOWMENT | ULIP | ANNUITY | HEALTH",
        "variant_code": "string | null",
        "line_of_business": "string",
        "jurisdiction": {
            "country_code": "ISO-3166-1",
            "regulator": "string"
        },
        "currency": "ISO-4217"
    },

    "eligibility": {
        "entry_age_min": "number",
        "entry_age_max": "number",
        "maturity_age_max": "number",
        "minimum_sum_assured": "number",
        "maximum_sum_assured": "number",
        "policy_term_min_years": "number",
        "policy_term_max_years": "number"
    },

    "benefits": [
        {
            "benefit_type": "death | maturity | survival | disability | critical_illness",
            "description": "string",
            "payout_formula": "string",
            "waiting_period": "string | null"
        }
    ],

    "premium_structure": {
        "payment_type": "single | regular | limited",
        "premium_payment_term_years": "number | null",
        "frequencies_allowed": ["annual", "half_yearly", "quarterly", "monthly"],
        "grace_period_days": "number"
    },

    "policy_lifecycle": {
        "lapse_condition": "string",
        "revival_period_months": "number | null",
        "paid_up_allowed": "boolean",
        "surrender_allowed": "boolean",
        "loan_available": "boolean"
    },

    "bonuses": {
        "bonus_types": ["reversionary", "terminal"],
        "bonus_description": "string | null"
    },

    "exclusions": [
        {
            "description": "string",
            "applicable_period_months": "number | null"
        }
    ],

    "tax_and_regulatory": {
        "tax_benefits_summary": "string | null",
        "regulatory_notes": "string | null"
    }
};

export const MASTER_SCHEMA = DEFINITIVE_PAS_SCHEMA;
export const SCHEMA_STRING = JSON.stringify(DEFINITIVE_PAS_SCHEMA, null, 2);
