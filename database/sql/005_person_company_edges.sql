-- ============================================================================
-- Person to Company Edges View
-- Creates edges between people and companies for heterogeneous graph
-- ============================================================================
-- Database: calendar_monitoring
-- Schema: notalone
-- Version: 1.0
-- Created: 2026-01-12
-- ============================================================================

SET search_path TO notalone, public;

-- ============================================================================
-- VIEW: Person-to-Company Edges
-- Employment, Investment, and Board relationships
-- ============================================================================

DROP VIEW IF EXISTS notalone.v_network_graph_company_edges CASCADE;

CREATE OR REPLACE VIEW notalone.v_network_graph_company_edges AS

WITH all_company_edges AS (

    -- 1. Employment relationships (Person → Company)
    SELECT DISTINCT
        p.name AS source,
        c.company_name AS target,
        'person' AS source_type,
        'company' AS target_type,
        CASE
            WHEN eh.is_founder THEN 'Founded'
            WHEN eh.is_current THEN 'Works At'
            ELSE 'Worked At'
        END AS category,
        CASE
            WHEN eh.is_founder THEN 9
            WHEN eh.is_current AND eh.role_type::TEXT IN ('C-Suite', 'VP', 'Founder', 'Co-founder') THEN 7
            WHEN eh.is_current THEN 5
            WHEN eh.role_type::TEXT IN ('C-Suite', 'VP', 'Founder', 'Co-founder') THEN 4
            ELSE 3
        END AS weight,
        c.company_name AS origin,
        p.name ||
        CASE
            WHEN eh.is_founder THEN ' founded '
            WHEN eh.is_current THEN ' works at '
            ELSE ' worked at '
        END || c.company_name ||
        COALESCE(' as ' || eh.role_title, '') ||
        CASE
            WHEN eh.start_date IS NOT NULL THEN
                ' (' || EXTRACT(YEAR FROM eh.start_date)::TEXT ||
                CASE WHEN eh.end_date IS NOT NULL
                     THEN '-' || EXTRACT(YEAR FROM eh.end_date)::TEXT
                     ELSE '-now' END || ')'
            ELSE ''
        END AS tooltip,
        'employment' AS edge_source
    FROM notalone.notalone_employment_history eh
    JOIN notalone.notalone_people p ON p.id = eh.person_id
    JOIN notalone.notalone_companies c ON c.id = eh.company_id
    WHERE p.name IS NOT NULL
      AND c.company_name IS NOT NULL

    UNION ALL

    -- 2. Investment relationships (Person → Company)
    SELECT DISTINCT
        p.name AS source,
        c.company_name AS target,
        'person' AS source_type,
        'company' AS target_type,
        'Invested In' AS category,
        CASE
            WHEN ir.is_lead_investor THEN 8
            WHEN ir.has_board_seat THEN 7
            ELSE 6
        END AS weight,
        c.company_name AS origin,
        p.name || ' invested in ' || c.company_name ||
        CASE
            WHEN ir.round IS NOT NULL THEN ' (' || ir.round || ')'
            ELSE ''
        END ||
        CASE
            WHEN ir.is_lead_investor THEN ' [Lead]'
            ELSE ''
        END AS tooltip,
        'investment' AS edge_source
    FROM notalone.notalone_investment_relationships ir
    JOIN notalone.notalone_people p ON p.id = ir.investor_person_id
    JOIN notalone.notalone_companies c ON c.id = ir.target_company_id
    WHERE ir.investor_person_id IS NOT NULL
      AND p.name IS NOT NULL
      AND c.company_name IS NOT NULL

    UNION ALL

    -- 3. Board positions (Person → Company)
    SELECT DISTINCT
        p.name AS source,
        c.company_name AS target,
        'person' AS source_type,
        'company' AS target_type,
        CASE
            WHEN bp.position ILIKE '%chairman%' THEN 'Board Chairman'
            WHEN bp.position ILIKE '%observer%' THEN 'Board Observer'
            ELSE 'Board Member'
        END AS category,
        CASE
            WHEN bp.position ILIKE '%chairman%' THEN 8
            WHEN bp.position ILIKE '%observer%' THEN 5
            WHEN bp.is_current THEN 7
            ELSE 6
        END AS weight,
        c.company_name AS origin,
        p.name || ' on board of ' || c.company_name ||
        CASE
            WHEN bp.position IS NOT NULL THEN ' as ' || bp.position
            ELSE ''
        END ||
        CASE
            WHEN bp.is_current THEN ' (current)'
            ELSE ''
        END AS tooltip,
        'board' AS edge_source
    FROM notalone.notalone_board_positions bp
    JOIN notalone.notalone_people p ON p.id = bp.person_id
    JOIN notalone.notalone_companies c ON c.id = bp.company_id
    WHERE p.name IS NOT NULL
      AND c.company_name IS NOT NULL
)

SELECT
    source,
    target,
    source_type,
    target_type,
    category,
    weight,
    origin,
    tooltip,
    edge_source
FROM all_company_edges
WHERE source IS NOT NULL
  AND target IS NOT NULL
ORDER BY weight DESC, source, target;

COMMENT ON VIEW notalone.v_network_graph_company_edges IS
'Person-to-company edges for heterogeneous graph visualization.
Categories:
  - Founded (9): Person founded the company
  - Works At (5-7): Current employment
  - Worked At (3-4): Past employment
  - Invested In (6-8): Investment relationship
  - Board Chairman/Member/Observer (5-8): Board position';

-- ============================================================================
-- VIEW: Combined Network Graph (All Edges)
-- Combines Person→Person and Person→Company edges
-- ============================================================================

DROP VIEW IF EXISTS notalone.v_network_graph_combined CASCADE;

CREATE OR REPLACE VIEW notalone.v_network_graph_combined AS

-- Person-to-Person edges (from existing view + colleagues)
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

-- Person-to-Company edges (company names prefixed for distinction)
SELECT
    source,
    '[Company] ' || target AS target,
    category,
    weight,
    origin,
    tooltip,
    edge_source,
    'person-company' AS graph_type
FROM notalone.v_network_graph_company_edges;

COMMENT ON VIEW notalone.v_network_graph_combined IS
'Combined network with both person-person and person-company edges.
Company nodes are prefixed with "[Company] " for visual distinction.
Use graph_type column to filter: "person-person" or "person-company".';

-- ============================================================================
-- Verification queries
-- ============================================================================
-- Person-to-company edge counts by category
-- SELECT category, COUNT(*) as edge_count, AVG(weight)::NUMERIC(3,1) as avg_weight
-- FROM notalone.v_network_graph_company_edges
-- GROUP BY category
-- ORDER BY edge_count DESC;

-- Combined totals
-- SELECT graph_type, COUNT(*) as edges
-- FROM notalone.v_network_graph_combined
-- GROUP BY graph_type;
