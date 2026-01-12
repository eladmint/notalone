-- ============================================================================
-- Network Graph View for Superset ECharts Visualization
-- Israeli Tech Ecosystem
-- ============================================================================
-- Run this after 001_create_schema.sql and 002_materialized_views.sql
-- This creates an enhanced view specifically for ECharts Graph Chart
-- ============================================================================

SET search_path TO notalone, public;

-- ============================================================================
-- VIEW: Network Graph Edges
-- Optimized for Superset ECharts Graph Chart visualization
-- ============================================================================

-- Drop existing view if it exists (for updates)
DROP VIEW IF EXISTS notalone.v_network_graph_edges CASCADE;

CREATE VIEW notalone.v_network_graph_edges AS

WITH all_edges AS (
    -- 1. Direct person connections (explicit network relationships)
    SELECT
        pc.person_1_name AS source,
        pc.person_2_name AS target,
        pc.connection_type::TEXT AS category,
        CASE pc.connection_strength
            WHEN 'Strong' THEN 8
            WHEN 'Medium' THEN 5
            WHEN 'Weak' THEN 2
            ELSE 1
        END AS weight,
        pc.source AS origin,
        COALESCE(pc.notes, pc.connection_type::TEXT || ' connection') AS tooltip,
        'person_connection' AS edge_source
    FROM notalone.notalone_person_connections pc
    WHERE pc.person_1_name IS NOT NULL
      AND pc.person_2_name IS NOT NULL

    UNION ALL

    -- 2. Co-founder relationships (strongest bonds)
    SELECT
        cf.person_1_name AS source,
        cf.person_2_name AS target,
        'Co-Founder' AS category,
        10 AS weight,
        cf.company_name AS origin,
        'Co-founded ' || COALESCE(cf.company_name, 'company') AS tooltip,
        'cofounder' AS edge_source
    FROM notalone.notalone_cofounder_relationships cf
    WHERE cf.person_1_name IS NOT NULL
      AND cf.person_2_name IS NOT NULL

    UNION ALL

    -- 3. Military cohort connections (8200, Talpiot alumni who served together)
    SELECT DISTINCT
        p1.name AS source,
        p2.name AS target,
        'Military Cohort' AS category,
        6 AS weight,
        COALESCE(m1.unit_name, 'Military') AS origin,
        'Served together in ' || COALESCE(m1.unit_name, 'military unit') AS tooltip,
        'military' AS edge_source
    FROM notalone.notalone_military_service m1
    JOIN notalone.notalone_military_service m2
        ON m1.unit_id = m2.unit_id
        AND m1.person_id < m2.person_id  -- Avoid duplicate pairs
        AND ABS(COALESCE(m1.start_year, 2000) - COALESCE(m2.start_year, 2000)) <= 3  -- Served within 3 years
    JOIN notalone.notalone_people p1 ON p1.id = m1.person_id
    JOIN notalone.notalone_people p2 ON p2.id = m2.person_id

    UNION ALL

    -- 4. Investor-to-founder relationships
    SELECT DISTINCT
        p_investor.name AS source,
        p_founder.name AS target,
        'Investor-Founder' AS category,
        7 AS weight,
        c.company_name AS origin,
        p_investor.name || ' invested in ' || c.company_name AS tooltip,
        'investment' AS edge_source
    FROM notalone.notalone_investment_relationships ir
    JOIN notalone.notalone_people p_investor ON p_investor.id = ir.investor_person_id
    JOIN notalone.notalone_companies c ON c.id = ir.target_company_id
    JOIN notalone.notalone_employment_history eh ON eh.company_id = c.id AND eh.is_founder = true
    JOIN notalone.notalone_people p_founder ON p_founder.id = eh.person_id
    WHERE ir.investor_person_id IS NOT NULL
      AND p_investor.name != p_founder.name

    UNION ALL

    -- 5. Board colleagues (served on same board)
    SELECT DISTINCT
        p1.name AS source,
        p2.name AS target,
        'Board Colleagues' AS category,
        5 AS weight,
        c.company_name AS origin,
        'Board colleagues at ' || c.company_name AS tooltip,
        'board' AS edge_source
    FROM notalone.notalone_board_positions bp1
    JOIN notalone.notalone_board_positions bp2
        ON bp1.company_id = bp2.company_id
        AND bp1.person_id < bp2.person_id  -- Avoid duplicates
        -- Overlapping board tenure
        AND (bp1.start_date <= COALESCE(bp2.end_date, CURRENT_DATE))
        AND (COALESCE(bp1.end_date, CURRENT_DATE) >= bp2.start_date)
    JOIN notalone.notalone_people p1 ON p1.id = bp1.person_id
    JOIN notalone.notalone_people p2 ON p2.id = bp2.person_id
    JOIN notalone.notalone_companies c ON c.id = bp1.company_id

    UNION ALL

    -- 6. Colleague connections (worked at same company with overlapping tenure)
    -- Requires 006_colleague_connections.sql to be executed first
    SELECT
        source,
        target,
        category,
        weight,
        origin,
        tooltip,
        edge_source
    FROM notalone.v_colleague_connections
)

SELECT
    source,
    target,
    category,
    weight,
    origin,
    tooltip,
    edge_source
FROM all_edges
WHERE source IS NOT NULL
  AND target IS NOT NULL
  AND source != target
ORDER BY weight DESC, source, target;

-- Create index hint comments
COMMENT ON VIEW notalone.v_network_graph_edges IS
'Network edges for ECharts Graph visualization.
Categories: Co-Founder (10), Colleague (2-8), Investor-Founder (7), Military Cohort (6), Board Colleagues (5), Person Connections (1-8).
Use with Superset Graph Chart: source/target columns, category for coloring, weight for edge thickness.
Updated 2026-01-12: Added colleague connections from overlapping employment.';

-- ============================================================================
-- VIEW: Network Graph Nodes
-- Node attributes for enhanced visualization
-- ============================================================================

DROP VIEW IF EXISTS notalone.v_network_graph_nodes CASCADE;

CREATE VIEW notalone.v_network_graph_nodes AS

WITH all_network_people AS (
    -- Get all people who appear in any edge
    SELECT DISTINCT person_name FROM (
        SELECT source AS person_name FROM notalone.v_network_graph_edges
        UNION
        SELECT target AS person_name FROM notalone.v_network_graph_edges
    ) names
)

SELECT
    p.name AS id,
    p.name AS label,

    -- Category for node coloring
    CASE
        WHEN p.is_8200_alumni THEN '8200 Alumni'
        WHEN p.is_talpiot_alumni THEN 'Talpiot Alumni'
        WHEN p.primary_type::TEXT = 'Investor' THEN 'Investor'
        WHEN p.primary_type::TEXT = 'Founder' THEN 'Founder'
        WHEN p.primary_type::TEXT = 'Executive' THEN 'Executive'
        ELSE 'Other'
    END AS category,

    -- Node size based on importance
    CASE p.estimated_net_worth
        WHEN '$100M+' THEN 50
        WHEN '$50-100M' THEN 40
        WHEN '$20-50M' THEN 30
        WHEN '$5-20M' THEN 25
        WHEN '$1-5M' THEN 20
        ELSE 15
    END AS symbol_size,

    -- Tooltip content
    p.name ||
    COALESCE(' - ' || p.person_current_role::TEXT, '') ||
    COALESCE(' at ' || c.company_name, '') AS tooltip,

    -- Additional attributes
    p.is_8200_alumni,
    p.is_talpiot_alumni,
    p.lp_potential::TEXT AS lp_status,
    p.location::TEXT AS location,
    p.primary_type::TEXT AS person_type,
    COALESCE(c.company_name, 'Independent') AS current_company,

    -- Connection count (degree centrality)
    COALESCE(degree.edge_count, 0) AS connection_count

FROM notalone.notalone_people p
LEFT JOIN notalone.notalone_companies c ON c.id = p.current_company_id
LEFT JOIN (
    SELECT person_name, COUNT(*) AS edge_count
    FROM (
        SELECT source AS person_name FROM notalone.v_network_graph_edges
        UNION ALL
        SELECT target AS person_name FROM notalone.v_network_graph_edges
    ) all_edges
    GROUP BY person_name
) degree ON degree.person_name = p.name
WHERE p.name IN (SELECT person_name FROM all_network_people);

COMMENT ON VIEW notalone.v_network_graph_nodes IS
'Network nodes with attributes for ECharts Graph visualization.
Use symbol_size for node sizing, category for coloring, connection_count for centrality.';

-- ============================================================================
-- VIEW: Simplified Network for Quick Loading
-- Limited edges for better performance on large graphs
-- ============================================================================

DROP VIEW IF EXISTS notalone.v_network_graph_simple CASCADE;

CREATE VIEW notalone.v_network_graph_simple AS
SELECT
    source,
    target,
    category,
    weight AS value
FROM notalone.v_network_graph_edges
WHERE weight >= 5  -- Only strong connections
LIMIT 200;

COMMENT ON VIEW notalone.v_network_graph_simple IS
'Simplified network with only strong connections (weight >= 5).
Use this for better performance with large datasets.';

-- ============================================================================
-- Grant permissions (if needed)
-- ============================================================================

-- GRANT SELECT ON notalone.v_network_graph_edges TO superset_user;
-- GRANT SELECT ON notalone.v_network_graph_nodes TO superset_user;
-- GRANT SELECT ON notalone.v_network_graph_simple TO superset_user;

-- ============================================================================
-- Usage Examples
-- ============================================================================

/*
-- Basic network query for Superset
SELECT source, target, category, weight
FROM notalone.v_network_graph_edges;

-- Network with node attributes (for advanced visualization)
SELECT
    e.source,
    e.target,
    e.category AS edge_type,
    e.weight,
    s.category AS source_category,
    s.symbol_size AS source_size,
    t.category AS target_category,
    t.symbol_size AS target_size
FROM notalone.v_network_graph_edges e
LEFT JOIN notalone.v_network_graph_nodes s ON s.id = e.source
LEFT JOIN notalone.v_network_graph_nodes t ON t.id = e.target;

-- 8200 alumni subnetwork
SELECT source, target, category, weight
FROM notalone.v_network_graph_edges
WHERE source IN (SELECT id FROM notalone.v_network_graph_nodes WHERE is_8200_alumni = true)
   OR target IN (SELECT id FROM notalone.v_network_graph_nodes WHERE is_8200_alumni = true);

-- Co-founder network only
SELECT source, target, 'Co-Founder' AS category, weight
FROM notalone.v_network_graph_edges
WHERE category = 'Co-Founder';
*/
