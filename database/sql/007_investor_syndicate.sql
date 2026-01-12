-- ============================================================================
-- Investor Syndicate Network View
-- Creates edges between VC firms and companies, and between co-investors
-- ============================================================================
-- Database: calendar_monitoring
-- Schema: notalone
-- Version: 1.0
-- Created: 2026-01-12
-- ============================================================================

SET search_path TO notalone, public;

-- ============================================================================
-- VIEW: Investor Syndicate Edges
-- VC Firm → Company edges (who invested where)
-- VC Firm ↔ VC Firm edges (co-investor relationships)
-- ============================================================================

DROP VIEW IF EXISTS notalone.v_investor_syndicate CASCADE;

CREATE OR REPLACE VIEW notalone.v_investor_syndicate AS

WITH funding_with_investors AS (
    -- Expand funding rounds with all investors
    SELECT
        fr.id AS round_id,
        c.company_name,
        fr.round_name::TEXT AS round_type,
        fr.amount_raised_usd,
        fr.round_date,
        fr.lead_investor,
        jsonb_array_elements_text(COALESCE(fr.other_investors, '[]'::jsonb)) AS other_investor
    FROM notalone.notalone_funding_rounds fr
    JOIN notalone.notalone_companies c ON c.id = fr.company_id
    WHERE fr.lead_investor IS NOT NULL
),

all_investors_per_round AS (
    -- Combine lead and other investors per round
    SELECT DISTINCT
        round_id,
        company_name,
        round_type,
        amount_raised_usd,
        round_date,
        lead_investor AS investor,
        TRUE AS is_lead
    FROM funding_with_investors
    WHERE lead_investor IS NOT NULL

    UNION ALL

    SELECT DISTINCT
        round_id,
        company_name,
        round_type,
        amount_raised_usd,
        round_date,
        other_investor AS investor,
        FALSE AS is_lead
    FROM funding_with_investors
    WHERE other_investor IS NOT NULL AND other_investor != ''
),

-- VC → Company edges
vc_company_edges AS (
    SELECT DISTINCT
        '[VC] ' || investor AS source,
        '[Company] ' || company_name AS target,
        CASE WHEN is_lead THEN 'Lead Investor' ELSE 'Co-Investor' END AS category,
        CASE
            WHEN is_lead THEN 8
            ELSE 6
        END AS weight,
        company_name || ' ' || round_type AS origin,
        investor ||
        CASE WHEN is_lead THEN ' led ' ELSE ' co-invested in ' END ||
        company_name || ' ' || round_type ||
        CASE
            WHEN amount_raised_usd > 0 THEN ' ($' || (amount_raised_usd / 1000000)::TEXT || 'M)'
            ELSE ''
        END AS tooltip,
        'funding_round' AS edge_source
    FROM all_investors_per_round
),

-- VC ↔ VC co-investor edges (syndicate partners)
vc_syndicate_edges AS (
    SELECT DISTINCT
        '[VC] ' || a1.investor AS source,
        '[VC] ' || a2.investor AS target,
        'Co-Invested' AS category,
        5 AS weight,
        a1.company_name || ' ' || a1.round_type AS origin,
        a1.investor || ' & ' || a2.investor || ' co-invested in ' ||
        a1.company_name || ' ' || a1.round_type AS tooltip,
        'syndicate' AS edge_source
    FROM all_investors_per_round a1
    JOIN all_investors_per_round a2
        ON a1.round_id = a2.round_id
        AND a1.investor < a2.investor  -- Avoid duplicates
)

-- Combine all edges
SELECT source, target, category, weight, origin, tooltip, edge_source
FROM vc_company_edges

UNION ALL

SELECT source, target, category, weight, origin, tooltip, edge_source
FROM vc_syndicate_edges

ORDER BY weight DESC, source, target;

COMMENT ON VIEW notalone.v_investor_syndicate IS
'Investor syndicate network showing:
- Lead Investor → Company (weight: 8)
- Co-Investor → Company (weight: 6)
- VC ↔ VC co-investment relationships (weight: 5)
Nodes prefixed: [VC] for venture capital firms, [Company] for portfolio companies.';

-- ============================================================================
-- VIEW: Updated Combined Network (includes investor syndicate)
-- ============================================================================

DROP VIEW IF EXISTS notalone.v_network_graph_full CASCADE;

CREATE OR REPLACE VIEW notalone.v_network_graph_full AS

-- Person-to-Person edges
SELECT
    source,
    target,
    category,
    weight,
    origin,
    tooltip,
    edge_source,
    'person-person' AS graph_type
FROM notalone.v_network_graph_edges

UNION ALL

-- Person-to-Company edges
SELECT
    source,
    '[Company] ' || target AS target,
    category,
    weight,
    origin,
    tooltip,
    edge_source,
    'person-company' AS graph_type
FROM notalone.v_network_graph_company_edges

UNION ALL

-- Investor syndicate edges (VC → Company and VC ↔ VC)
SELECT
    source,
    target,
    category,
    weight,
    origin,
    tooltip,
    edge_source,
    'investor-syndicate' AS graph_type
FROM notalone.v_investor_syndicate;

COMMENT ON VIEW notalone.v_network_graph_full IS
'Full network graph combining:
- Person-Person edges (108)
- Person-Company edges (70)
- Investor syndicate edges (VC firms and co-investment relationships)
Use graph_type to filter specific subgraphs.';

-- ============================================================================
-- Verification queries
-- ============================================================================
-- SELECT category, COUNT(*) FROM notalone.v_investor_syndicate GROUP BY category;
-- SELECT graph_type, COUNT(*) FROM notalone.v_network_graph_full GROUP BY graph_type;
