export const PAS_EXECUTABLE_SCHEMA = {
    product_context: {
        canonical_id: "string", // Unique ID for the specific product version
        version_label: "string",
        lob_code: "string",
        carrier_entity: "string",
        currency_iso: "string",
        jurisdiction_code: "string" // ISO-3166-2
    },
    eligibility_rules: {
        age_entry: { min: "number", max: "number", unit: "years" },
        age_expiry: { max: "number", unit: "years" },
        residency_status: ["string"],
        occupation_classes: ["string"],
        min_sum_assured: "number",
        max_sum_assured: "number | null"
    },
    benefit_configuration: [
        {
            benefit_ref: "string", // Unique slug
            label: "string",
            payout_logic: {
                precedence: "higher_of | sum_of | lower_of | first_occurence",
                components: [
                    {
                        basis: "sum_assured | paid_up_value | fund_value | premiums_paid",
                        multiplier: "number",
                        fixed_top_up: "number"
                    }
                ],
                vesting_condition: {
                    period_years: "number",
                    threshold_reached: "boolean"
                }
            },
            payout_triggers: ["death", "maturity", "disability", "critical_illness"],
            waiting_period_days: "number"
        }
    ],
    premium_rules: {
        payment_modes: ["single", "regular"],
        frequencies_allowed: ["annual", "half_yearly", "quarterly", "monthly"],
        grace_period_days: "number",
        calculation_basis: {
            table_ref: "string | null",
            fixed_rate: "number | null",
            factors: ["age", "gender", "sum_assured", "rider_selection"]
        }
    },
    policy_lifecycle: {
        surrender: {
            is_allowed: "boolean",
            min_period_months: "number",
            value_calculation: {
                guaranteed_factor: "number",
                special_factor: "number | null",
                deduction_penalty: "number"
            }
        },
        paid_up: {
            is_eligible: "boolean",
            min_premiums_paid: "number",
            value_formula: "reduced_sum_assured = (total_premiums_paid / expected_premiums) * sum_assured"
        },
        revival: {
            allowed_period_months: "number",
            interest_basis: "compound | simple",
            rate_percent: "number"
        },
        loans: {
            available: "boolean",
            max_loan_percent_of_value: "number",
            interest_rate_percent: "number"
        },
        bonuses: {
            types: ["reversionary", "terminal", "interim"],
            vesting_rules: "string"
        }
    },
    underwriting_decision_gates: [
        {
            gate_ref: "string",
            input_requirements: ["medical_exam", "financial_statement", "kyc"],
            auto_pass_limit: "number",
            referral_trigger_condition: "string"
        }
    ],
    exclusion_rules: [
        {
            exclusion_id: "string",
            scope: "full | limited",
            condition_precedent: "string", // Machine-readable logic string
            period_months: "number"
        }
    ],
    tax_and_regulatory: {
        tax_treatment_code: "string", // e.g. '80C', '10(10D)'
        statutory_levies_percent: "number",
        compliance_disclosure_ref: "string"
    },
    audit_and_integrity: {
        field_population_status: [
            {
                path: "string",
                state: "populated | not_available | null",
                confidence: "number"
            }
        ]
    }
};

export const MASTER_SCHEMA = PAS_EXECUTABLE_SCHEMA;
export const SCHEMA_STRING = JSON.stringify(PAS_EXECUTABLE_SCHEMA, null, 2);
