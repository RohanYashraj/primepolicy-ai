export const CANONICAL_MASTER_SCHEMA = {
    schema_info: {
        version: "1.0.0",
        generated_at: "ISO8601",
        confidence_score: "number (0-1)",
        is_complete: "boolean"
    },
    product_metadata: {
        product_identity: {
            name: "string",
            carrier: "string",
            lob_code: "string", // Short code: e.g. 'CYB', 'PL', 'LIFE'
            version_id: "string",
            market_segment: "string" // e.g. 'SME', 'Mid-Market', 'Enterprise'
        },
        jurisdiction_compliance: {
            governing_laws: ["string"],
            is_admitted: "boolean | null",
            territorial_scope: ["string"], // ISO codes
            regulatory_disclosures: ["string"]
        },
        monetary_units: {
            currency: "string", // ISO 4217 code
            rounding_rules: "string"
        }
    },
    eligibility_engine: {
        age_limits: {
            min: "number | null",
            max: "number | null",
            unit: "years | days"
        },
        residency_requirements: ["string"],
        occupation_classes: ["string"],
        participation_rules: {
            min_employees: "number | null",
            min_assets: "number | null",
            mandatory_membership: "boolean"
        },
        exclusionary_conditions: ["string"]
    },
    coverage_benefits: [
        {
            benefit_id: "string", // unique slug
            label: "string",
            trigger_event: "string",
            payout_logic: {
                type: "fixed | indemnity | reimbursement",
                basis: "actual_loss | sum_assured | scale",
                limit_amount: "number | null",
                currency: "string"
            },
            deductibles_retentions: {
                standard_amount: "number | null",
                type: "flat | percentage | days",
                is_aggregate: "boolean"
            },
            waiting_period: {
                duration: "number | null",
                unit: "days | weeks | months"
            },
            sub_limits: [
                {
                    label: "string",
                    limit: "number"
                }
            ],
            dependencies: ["string"] // slugs of other benefits
        }
    ],
    premium_payment: {
        calculation_basis: {
            method: "rating_table | fixed | flat_rate",
            factors: ["string"] // e.g. 'age', 'sum_insured'
        },
        modes: ["manual", "automatic"],
        frequencies: ["monthly", "quarterly", "annual"],
        payment_grace_period: {
            duration: "number | null",
            unit: "days"
        }
    },
    exclusions_limitations: [
        {
            rule_id: "string",
            category: "standard | professional | conduct | external",
            impact: "full_exclusion | benefit_reduction",
            applicability_condition: "string | null",
            is_absolute: "boolean"
        }
    ],
    underwriting_gates: {
        evidence_requirements: ["string"], // e.g. 'medical_report', 'self_declaration'
        auto_approval_thresholds: {
            max_sum_assured: "number | null"
        },
        referral_triggers: ["string"]
    },
    claims_administration: {
        event_definitions: ["string"],
        reporting_timeline: {
            max_days_from_event: "number | null",
            notice_format: "string"
        },
        required_documentation: ["string"],
        settlement_sla: {
            days_to_pay: "number | null"
        }
    },
    audit_validation: {
        field_metadata: [
            {
                field_path: "string",
                status: "populated | null | not_available",
                source_context: "string | null" // brief pointer to PDF section
            }
        ]
    }
};

export const MASTER_SCHEMA = CANONICAL_MASTER_SCHEMA; // Alias for backward compatibility
export const SCHEMA_STRING = JSON.stringify(CANONICAL_MASTER_SCHEMA, null, 2);
