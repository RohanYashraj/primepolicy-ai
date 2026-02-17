export const MASTER_SCHEMA = {
    product_summary: {
        product_name: "string",
        carrier_name: "string",
        lob_code: "string", // Short code like 'PL', 'CYB', 'DO'
        version_id: "string",
        effective_date: "YYYY-MM-DD | null",
        expiration_date: "YYYY-MM-DD | null",
        is_admitted: "boolean | null",
        currency: "string", // e.g., 'USD', 'GBP'
    },
    eligibility_rules: {
        allowed_industries: ["string"],
        excluded_industries: ["string"],
        territory_scope_codes: ["string"], // ISO codes or short names
        min_asset_value: "number | null",
        max_employees: "number | null",
        legal_jurisdiction: "string | null",
    },
    product_features: [
        {
            feature_id: "string", // slugified name
            feature_label: "string",
            value_type: "limit | retention | waiting_period | boolean",
            numeric_value: "number | null",
            unit: "USD | days | percent | boolean",
            applies_per: "claim | aggregate | event | null",
            is_optional: "boolean",
            sub_features: [
                {
                    label: "string",
                    value: "string | number | boolean"
                }
            ]
        }
    ],
    limitations_exclusions: [
        {
            category: "General | Cyber | Professional | Conduct",
            short_name: "string",
            impact_level: "High | Medium | Low",
            is_absolute: "boolean", // true if no carve-outs
        }
    ],
    compliance_admin: {
        reporting_window_days: "number | null",
        notice_contact_type: "email | portal | physical",
        notice_contact_detail: "string | null",
        governing_law_state: "string | null",
    },
    claims_procedures: [
        {
            step_name: "string",
            description: "string",
            responsible_party: "string",
            timeline: "string | null",
        }
    ]
};

export const SCHEMA_STRING = JSON.stringify(MASTER_SCHEMA, null, 2);
