-- ============================================================================
-- Materialized Views for Superset Dashboards
-- Israeli Tech Ecosystem
-- ============================================================================

SET search_path TO notalone, public;

-- ============================================================================
-- VIEW 1: Company Overview Dashboard
-- Aggregated company metrics for Superset
-- ============================================================================

CREATE MATERIALIZED VIEW notalone.mv_company_overview AS
SELECT
    c.id,
    c.company_name,
    c.founded_year,
    c.shutdown_year,
    c.company_type,
    c.stage,
    c.status,
    c.sector,
    c.hq_location,
    c.total_raised_usd / 100.0 AS total_raised_usd,  -- Convert cents to dollars
    c.exit_value_usd / 100.0 AS exit_value_usd,
    c.exit_type,
    c.exit_date,
    c.technologies,
    c.tags,

    -- Founder count
    COALESCE(founder_counts.founder_count, 0) AS founder_count,

    -- Employee counts
    COALESCE(employee_counts.total_employees, 0) AS total_employees_ever,
    COALESCE(employee_counts.current_employees, 0) AS current_employees,

    -- Funding metrics
    COALESCE(funding.total_rounds, 0) AS total_funding_rounds,
    funding.last_round_date,
    funding.last_round_type,

    -- Acquisition info
    acq.acquirer_name AS acquired_by,
    acq.deal_value_usd / 100.0 AS acquisition_value_usd,

    -- Computed fields
    CASE
        WHEN c.exit_value_usd IS NOT NULL AND c.total_raised_usd > 0
        THEN (c.exit_value_usd::DECIMAL / c.total_raised_usd)
        ELSE NULL
    END AS exit_multiple,

    EXTRACT(YEAR FROM CURRENT_DATE) - c.founded_year AS company_age_years,

    c.created_at,
    c.updated_at

FROM notalone.notalone_companies c

LEFT JOIN (
    SELECT company_id, COUNT(*) AS founder_count
    FROM notalone.notalone_employment_history
    WHERE is_founder = TRUE
    GROUP BY company_id
) founder_counts ON founder_counts.company_id = c.id

LEFT JOIN (
    SELECT
        company_id,
        COUNT(*) AS total_employees,
        COUNT(*) FILTER (WHERE is_current = TRUE) AS current_employees
    FROM notalone.notalone_employment_history
    GROUP BY company_id
) employee_counts ON employee_counts.company_id = c.id

LEFT JOIN (
    SELECT
        company_id,
        COUNT(*) AS total_rounds,
        MAX(round_date) AS last_round_date,
        (ARRAY_AGG(round_type ORDER BY round_date DESC))[1] AS last_round_type
    FROM notalone.notalone_funding_rounds
    GROUP BY company_id
) funding ON funding.company_id = c.id

LEFT JOIN notalone.notalone_acquisitions acq ON acq.target_id = c.id

WITH NO DATA;

-- Create unique index for concurrent refresh
CREATE UNIQUE INDEX idx_mv_company_overview_id ON notalone.mv_company_overview(id);
CREATE INDEX idx_mv_company_status ON notalone.mv_company_overview(status);
CREATE INDEX idx_mv_company_sector ON notalone.mv_company_overview(sector);
CREATE INDEX idx_mv_company_founded ON notalone.mv_company_overview(founded_year);

-- ============================================================================
-- VIEW 2: Person Overview Dashboard
-- Aggregated person metrics for LP prospecting and network analysis
-- ============================================================================

CREATE MATERIALIZED VIEW notalone.mv_person_overview AS
SELECT
    p.id,
    p.name,
    p.current_role,
    p.primary_type,
    p.secondary_types,
    p.is_8200_alumni,
    p.is_talpiot_alumni,
    p.is_technion_alumni,
    p.lp_potential,
    p.lp_segment,
    p.estimated_net_worth,
    p.location,
    p.tags,

    -- Current company info
    cc.company_name AS current_company_name,
    cc.sector AS current_company_sector,
    cc.status AS current_company_status,

    -- Career metrics
    COALESCE(career.companies_worked, 0) AS companies_worked,
    COALESCE(career.companies_founded, 0) AS companies_founded,
    COALESCE(career.total_tenure_months, 0) AS total_career_months,
    career.first_role_date,
    career.current_roles,

    -- Exit experience
    COALESCE(exits.exit_companies, 0) AS exit_companies,
    exits.max_exit_value_usd / 100.0 AS max_exit_value_usd,
    exits.total_exit_value_usd / 100.0 AS total_exit_value_usd,

    -- Investment activity
    COALESCE(investments.investment_count, 0) AS investments_made,
    investments.total_invested_usd / 100.0 AS total_invested_usd,

    -- Board positions
    COALESCE(boards.board_count, 0) AS board_positions,
    COALESCE(boards.current_boards, 0) AS current_board_positions,

    -- Network metrics
    COALESCE(connections.connection_count, 0) AS total_connections,
    COALESCE(connections.strong_connections, 0) AS strong_connections,

    -- Education
    education.highest_degree,
    education.institutions,

    -- Military
    military.served_8200,
    military.served_talpiot,
    military.military_units,

    p.created_at,
    p.updated_at

FROM notalone.notalone_people p

LEFT JOIN notalone.notalone_companies cc ON cc.id = p.current_company_id

-- Career aggregations
LEFT JOIN (
    SELECT
        person_id,
        COUNT(DISTINCT company_id) AS companies_worked,
        COUNT(*) FILTER (WHERE is_founder = TRUE) AS companies_founded,
        SUM(tenure_months) AS total_tenure_months,
        MIN(start_date) AS first_role_date,
        ARRAY_AGG(DISTINCT role_title) FILTER (WHERE is_current = TRUE) AS current_roles
    FROM notalone.notalone_employment_history
    GROUP BY person_id
) career ON career.person_id = p.id

-- Exit experience (via employment at exited companies)
LEFT JOIN (
    SELECT
        eh.person_id,
        COUNT(DISTINCT c.id) AS exit_companies,
        MAX(c.exit_value_usd) AS max_exit_value_usd,
        SUM(c.exit_value_usd) AS total_exit_value_usd
    FROM notalone.notalone_employment_history eh
    JOIN notalone.notalone_companies c ON c.id = eh.company_id
    WHERE c.exit_type IN ('IPO', 'Acquisition')
      AND c.exit_value_usd > 0
    GROUP BY eh.person_id
) exits ON exits.person_id = p.id

-- Investment activity
LEFT JOIN (
    SELECT
        investor_person_id AS person_id,
        COUNT(*) AS investment_count,
        SUM(amount_usd) AS total_invested_usd
    FROM notalone.notalone_investment_relationships
    WHERE investor_person_id IS NOT NULL
    GROUP BY investor_person_id
) investments ON investments.person_id = p.id

-- Board positions
LEFT JOIN (
    SELECT
        person_id,
        COUNT(*) AS board_count,
        COUNT(*) FILTER (WHERE is_current = TRUE) AS current_boards
    FROM notalone.notalone_board_positions
    GROUP BY person_id
) boards ON boards.person_id = p.id

-- Network connections
LEFT JOIN (
    SELECT
        person_id,
        COUNT(*) AS connection_count,
        COUNT(*) FILTER (WHERE strength = 'Strong') AS strong_connections
    FROM (
        SELECT person_1_id AS person_id, connection_strength AS strength
        FROM notalone.notalone_person_connections
        UNION ALL
        SELECT person_2_id AS person_id, connection_strength AS strength
        FROM notalone.notalone_person_connections
        WHERE person_2_id IS NOT NULL
    ) all_connections
    GROUP BY person_id
) connections ON connections.person_id = p.id

-- Education summary
LEFT JOIN (
    SELECT
        person_id,
        (ARRAY_AGG(degree_type ORDER BY
            CASE degree_type
                WHEN 'PhD' THEN 1
                WHEN 'Postdoc' THEN 2
                WHEN 'MBA' THEN 3
                WHEN 'MSc' THEN 4
                WHEN 'Master' THEN 5
                WHEN 'BSc' THEN 6
                WHEN 'Bachelor' THEN 7
                ELSE 8
            END
        ))[1] AS highest_degree,
        ARRAY_AGG(DISTINCT i.institution_name) AS institutions
    FROM notalone.notalone_education_records er
    LEFT JOIN notalone.notalone_institutions i ON i.id = er.institution_id
    GROUP BY person_id
) education ON education.person_id = p.id

-- Military summary
LEFT JOIN (
    SELECT
        person_id,
        BOOL_OR(unit_name ILIKE '%8200%') AS served_8200,
        BOOL_OR(unit_name ILIKE '%talpiot%') AS served_talpiot,
        ARRAY_AGG(DISTINCT unit_name) AS military_units
    FROM notalone.notalone_military_service
    GROUP BY person_id
) military ON military.person_id = p.id

WITH NO DATA;

CREATE UNIQUE INDEX idx_mv_person_overview_id ON notalone.mv_person_overview(id);
CREATE INDEX idx_mv_person_lp_potential ON notalone.mv_person_overview(lp_potential);
CREATE INDEX idx_mv_person_lp_segment ON notalone.mv_person_overview(lp_segment);
CREATE INDEX idx_mv_person_8200 ON notalone.mv_person_overview(is_8200_alumni) WHERE is_8200_alumni = TRUE;
CREATE INDEX idx_mv_person_companies_founded ON notalone.mv_person_overview(companies_founded);

-- ============================================================================
-- VIEW 3: LP Prospect Pipeline
-- Complete LP prospect view for fundraising dashboard
-- ============================================================================

CREATE MATERIALIZED VIEW notalone.mv_lp_pipeline AS
SELECT
    lp.id,
    lp.person_name,
    lp.segment,
    lp.priority_tier,
    lp.status,
    lp.warmth_score,

    -- Financial capacity
    lp.estimated_capacity_usd / 100.0 AS estimated_capacity_usd,
    lp.target_commitment_usd / 100.0 AS target_commitment_usd,
    lp.actual_commitment_usd / 100.0 AS actual_commitment_usd,
    lp.check_size_min_usd / 100.0 AS check_size_min_usd,
    lp.check_size_max_usd / 100.0 AS check_size_max_usd,

    -- Source context
    lp.source_of_wealth,
    lp.recent_liquidity_event,

    -- Intro path
    lp.warm_intro_path,
    intro.name AS intro_person_name,
    intro.current_role AS intro_person_role,

    -- Alignment
    lp.investment_thesis_match,
    lp.interests_alignment,
    lp.concerns,

    -- Activity
    lp.outreach_date,
    lp.last_contact,
    lp.next_action,
    lp.next_action_date,
    lp.assigned_to,

    -- Days calculations
    CURRENT_DATE - lp.last_contact AS days_since_contact,
    lp.next_action_date - CURRENT_DATE AS days_until_next_action,

    -- Person details from People table
    p.is_8200_alumni,
    p.is_talpiot_alumni,
    p.estimated_net_worth,
    p.location AS person_location,
    p.primary_type AS person_type,

    -- Career context
    career.companies_founded,
    career.exit_companies,
    career.max_exit_value_usd / 100.0 AS max_exit_value_usd,

    lp.notes,
    lp.created_at,
    lp.updated_at

FROM notalone.notalone_lp_prospects lp

LEFT JOIN notalone.notalone_people p ON p.id = lp.person_id
LEFT JOIN notalone.notalone_people intro ON intro.id = lp.intro_person_id

LEFT JOIN (
    SELECT
        eh.person_id,
        COUNT(*) FILTER (WHERE eh.is_founder = TRUE) AS companies_founded,
        COUNT(DISTINCT c.id) FILTER (WHERE c.exit_type IN ('IPO', 'Acquisition')) AS exit_companies,
        MAX(c.exit_value_usd) AS max_exit_value_usd
    FROM notalone.notalone_employment_history eh
    LEFT JOIN notalone.notalone_companies c ON c.id = eh.company_id
    GROUP BY eh.person_id
) career ON career.person_id = lp.person_id

WITH NO DATA;

CREATE UNIQUE INDEX idx_mv_lp_pipeline_id ON notalone.mv_lp_pipeline(id);
CREATE INDEX idx_mv_lp_pipeline_status ON notalone.mv_lp_pipeline(status);
CREATE INDEX idx_mv_lp_pipeline_warmth ON notalone.mv_lp_pipeline(warmth_score);
CREATE INDEX idx_mv_lp_pipeline_next_action ON notalone.mv_lp_pipeline(next_action_date);

-- ============================================================================
-- VIEW 4: Talent Flow Analysis
-- Track movement between companies for ecosystem intelligence
-- ============================================================================

CREATE MATERIALIZED VIEW notalone.mv_talent_flow AS
SELECT
    eh.id,
    eh.person_id,
    p.name AS person_name,
    p.is_8200_alumni,
    p.is_talpiot_alumni,

    -- Source company (where they worked)
    eh.company_id AS source_company_id,
    c.company_name AS source_company,
    c.sector AS source_sector,
    c.status AS source_status,
    c.exit_type AS source_exit,

    -- Role at source
    eh.role_title,
    eh.role_type,
    eh.is_founder AS was_founder,
    eh.start_date,
    eh.end_date,
    eh.tenure_months,

    -- Destination company
    eh.next_company_id AS dest_company_id,
    nc.company_name AS dest_company,
    nc.sector AS dest_sector,
    nc.status AS dest_status,

    -- Did they found the next company?
    next_role.is_founder AS founded_next_company,
    next_role.role_type AS role_at_next,

    -- Exit reason
    eh.exit_reason,

    -- Transition timing
    eh.end_date AS transition_date,
    EXTRACT(YEAR FROM eh.end_date) AS transition_year

FROM notalone.notalone_employment_history eh

JOIN notalone.notalone_people p ON p.id = eh.person_id
JOIN notalone.notalone_companies c ON c.id = eh.company_id
LEFT JOIN notalone.notalone_companies nc ON nc.id = eh.next_company_id

-- Get role at next company
LEFT JOIN notalone.notalone_employment_history next_role
    ON next_role.person_id = eh.person_id
    AND next_role.company_id = eh.next_company_id

WHERE eh.end_date IS NOT NULL  -- Only completed tenures

WITH NO DATA;

CREATE UNIQUE INDEX idx_mv_talent_flow_id ON notalone.mv_talent_flow(id);
CREATE INDEX idx_mv_talent_flow_source ON notalone.mv_talent_flow(source_company_id);
CREATE INDEX idx_mv_talent_flow_dest ON notalone.mv_talent_flow(dest_company_id);
CREATE INDEX idx_mv_talent_flow_person ON notalone.mv_talent_flow(person_id);
CREATE INDEX idx_mv_talent_flow_year ON notalone.mv_talent_flow(transition_year);
CREATE INDEX idx_mv_talent_flow_founder ON notalone.mv_talent_flow(founded_next_company) WHERE founded_next_company = TRUE;

-- ============================================================================
-- VIEW 5: Network Graph (for Kumu-style visualization)
-- Flattened edge list for network analysis tools
-- ============================================================================

CREATE MATERIALIZED VIEW notalone.mv_network_edges AS

-- Co-founder connections (strongest)
SELECT
    'cofounder' AS edge_type,
    person_1_id AS source_id,
    person_1_name AS source_name,
    person_2_id AS target_id,
    person_2_name AS target_name,
    company_id AS context_id,
    company_name AS context_name,
    'Strong' AS strength,
    10 AS weight,
    start_date AS connection_date
FROM notalone.notalone_cofounder_relationships
WHERE person_1_id IS NOT NULL

UNION ALL

-- Person connections (explicit network)
SELECT
    connection_type::TEXT AS edge_type,
    person_1_id AS source_id,
    person_1_name AS source_name,
    person_2_id AS target_id,
    person_2_name AS target_name,
    origin_company_id AS context_id,
    NULL AS context_name,
    connection_strength::TEXT AS strength,
    CASE connection_strength
        WHEN 'Strong' THEN 8
        WHEN 'Medium' THEN 5
        WHEN 'Weak' THEN 2
        ELSE 1
    END AS weight,
    NULL AS connection_date
FROM notalone.notalone_person_connections
WHERE person_1_id IS NOT NULL

UNION ALL

-- Colleagues (from employment history)
SELECT DISTINCT
    'colleague' AS edge_type,
    eh1.person_id AS source_id,
    p1.name AS source_name,
    eh2.person_id AS target_id,
    p2.name AS target_name,
    eh1.company_id AS context_id,
    c.company_name AS context_name,
    'Medium' AS strength,
    4 AS weight,
    GREATEST(eh1.start_date, eh2.start_date) AS connection_date
FROM notalone.notalone_employment_history eh1
JOIN notalone.notalone_employment_history eh2
    ON eh1.company_id = eh2.company_id
    AND eh1.person_id < eh2.person_id  -- Avoid duplicates
    -- Overlapping tenure
    AND (eh1.start_date <= COALESCE(eh2.end_date, CURRENT_DATE))
    AND (COALESCE(eh1.end_date, CURRENT_DATE) >= eh2.start_date)
JOIN notalone.notalone_people p1 ON p1.id = eh1.person_id
JOIN notalone.notalone_people p2 ON p2.id = eh2.person_id
JOIN notalone.notalone_companies c ON c.id = eh1.company_id

UNION ALL

-- Investor-company relationships
SELECT
    'investor' AS edge_type,
    ir.investor_person_id AS source_id,
    p.name AS source_name,
    NULL AS target_id,
    c.company_name AS target_name,
    ir.target_company_id AS context_id,
    c.company_name AS context_name,
    'Medium' AS strength,
    6 AS weight,
    ir.investment_date AS connection_date
FROM notalone.notalone_investment_relationships ir
JOIN notalone.notalone_people p ON p.id = ir.investor_person_id
JOIN notalone.notalone_companies c ON c.id = ir.target_company_id
WHERE ir.investor_person_id IS NOT NULL

UNION ALL

-- Board connections
SELECT
    'board' AS edge_type,
    bp.person_id AS source_id,
    p.name AS source_name,
    NULL AS target_id,
    c.company_name AS target_name,
    bp.company_id AS context_id,
    c.company_name AS context_name,
    'Strong' AS strength,
    7 AS weight,
    bp.start_date AS connection_date
FROM notalone.notalone_board_positions bp
JOIN notalone.notalone_people p ON p.id = bp.person_id
JOIN notalone.notalone_companies c ON c.id = bp.company_id
WHERE bp.person_id IS NOT NULL

WITH NO DATA;

CREATE INDEX idx_mv_network_source ON notalone.mv_network_edges(source_id);
CREATE INDEX idx_mv_network_target ON notalone.mv_network_edges(target_id);
CREATE INDEX idx_mv_network_type ON notalone.mv_network_edges(edge_type);
CREATE INDEX idx_mv_network_context ON notalone.mv_network_edges(context_id);

-- ============================================================================
-- VIEW 6: Exit Analysis Dashboard
-- Track acquisitions and exit metrics
-- ============================================================================

CREATE MATERIALIZED VIEW notalone.mv_exit_analysis AS
SELECT
    a.id,
    a.acquirer_name,
    a.acquirer_type,

    -- Target company details
    a.target_id,
    c.company_name AS target_name,
    c.sector AS target_sector,
    c.founded_year,
    c.total_raised_usd / 100.0 AS total_raised_usd,

    -- Deal details
    a.acquisition_date,
    EXTRACT(YEAR FROM a.acquisition_date) AS exit_year,
    a.deal_value_usd / 100.0 AS deal_value_usd,
    a.deal_type,
    a.strategic_rationale,

    -- Return metrics
    CASE
        WHEN c.total_raised_usd > 0 THEN
            (a.deal_value_usd::DECIMAL / c.total_raised_usd)
        ELSE NULL
    END AS return_multiple,

    -- Time to exit
    a.acquisition_date - (c.founded_year || '-01-01')::DATE AS days_to_exit,
    (EXTRACT(YEAR FROM a.acquisition_date) - c.founded_year) AS years_to_exit,

    -- People involved
    a.key_people_acquired,

    -- Founder count
    founders.founder_count,
    founders.founder_names,

    -- 8200 connection
    founders.has_8200_founder

FROM notalone.notalone_acquisitions a

JOIN notalone.notalone_companies c ON c.id = a.target_id

LEFT JOIN (
    SELECT
        company_id,
        COUNT(*) AS founder_count,
        ARRAY_AGG(p.name) AS founder_names,
        BOOL_OR(p.is_8200_alumni) AS has_8200_founder
    FROM notalone.notalone_employment_history eh
    JOIN notalone.notalone_people p ON p.id = eh.person_id
    WHERE eh.is_founder = TRUE
    GROUP BY company_id
) founders ON founders.company_id = c.id

WITH NO DATA;

CREATE UNIQUE INDEX idx_mv_exit_analysis_id ON notalone.mv_exit_analysis(id);
CREATE INDEX idx_mv_exit_year ON notalone.mv_exit_analysis(exit_year);
CREATE INDEX idx_mv_exit_value ON notalone.mv_exit_analysis(deal_value_usd);
CREATE INDEX idx_mv_exit_acquirer ON notalone.mv_exit_analysis(acquirer_type);

-- ============================================================================
-- VIEW 7: 8200 Alumni Network
-- Special focus on Unit 8200 alumni for ecosystem analysis
-- ============================================================================

CREATE MATERIALIZED VIEW notalone.mv_8200_network AS
SELECT
    p.id,
    p.name,
    p.current_role,
    p.primary_type,
    p.location,
    p.lp_potential,
    p.estimated_net_worth,

    -- Current company
    cc.company_name AS current_company,
    cc.sector AS current_sector,

    -- Military service details
    ms.role AS military_role,
    ms.highest_rank,
    ms.start_year AS service_start,
    ms.end_year AS service_end,

    -- Career metrics
    career.companies_founded,
    career.total_companies,
    career.sectors_worked,

    -- Exit experience
    exits.exit_count,
    exits.total_exit_value / 100.0 AS total_exit_value_usd,

    -- Network size (connections to other 8200 alumni)
    COALESCE(network.alumni_connections, 0) AS alumni_connections

FROM notalone.notalone_people p

LEFT JOIN notalone.notalone_companies cc ON cc.id = p.current_company_id

LEFT JOIN notalone.notalone_military_service ms
    ON ms.person_id = p.id
    AND ms.unit_name ILIKE '%8200%'

LEFT JOIN (
    SELECT
        person_id,
        COUNT(*) FILTER (WHERE is_founder = TRUE) AS companies_founded,
        COUNT(DISTINCT company_id) AS total_companies,
        ARRAY_AGG(DISTINCT c.sector) AS sectors_worked
    FROM notalone.notalone_employment_history eh
    JOIN notalone.notalone_companies c ON c.id = eh.company_id
    GROUP BY person_id
) career ON career.person_id = p.id

LEFT JOIN (
    SELECT
        eh.person_id,
        COUNT(DISTINCT c.id) AS exit_count,
        SUM(c.exit_value_usd) AS total_exit_value
    FROM notalone.notalone_employment_history eh
    JOIN notalone.notalone_companies c ON c.id = eh.company_id
    WHERE c.exit_type IN ('IPO', 'Acquisition')
      AND eh.is_founder = TRUE
    GROUP BY eh.person_id
) exits ON exits.person_id = p.id

LEFT JOIN (
    SELECT
        person_id,
        COUNT(*) AS alumni_connections
    FROM (
        SELECT pc.person_1_id AS person_id
        FROM notalone.notalone_person_connections pc
        JOIN notalone.notalone_people p2 ON p2.id = pc.person_2_id
        WHERE p2.is_8200_alumni = TRUE

        UNION ALL

        SELECT pc.person_2_id AS person_id
        FROM notalone.notalone_person_connections pc
        JOIN notalone.notalone_people p1 ON p1.id = pc.person_1_id
        WHERE p1.is_8200_alumni = TRUE
    ) alumni_conn
    GROUP BY person_id
) network ON network.person_id = p.id

WHERE p.is_8200_alumni = TRUE

WITH NO DATA;

CREATE UNIQUE INDEX idx_mv_8200_id ON notalone.mv_8200_network(id);
CREATE INDEX idx_mv_8200_founded ON notalone.mv_8200_network(companies_founded);
CREATE INDEX idx_mv_8200_exits ON notalone.mv_8200_network(total_exit_value_usd);

-- ============================================================================
-- VIEW 8: Funding Timeline
-- Aggregated funding rounds for trend analysis
-- ============================================================================

CREATE MATERIALIZED VIEW notalone.mv_funding_timeline AS
SELECT
    fr.id,
    fr.company_id,
    c.company_name,
    c.sector,
    c.hq_location,

    -- Round details
    fr.round_type,
    fr.round_date,
    EXTRACT(YEAR FROM fr.round_date) AS round_year,
    EXTRACT(QUARTER FROM fr.round_date) AS round_quarter,
    fr.amount_raised_usd / 100.0 AS amount_raised_usd,
    fr.pre_money_valuation_usd / 100.0 AS pre_money_valuation_usd,

    -- Lead investor
    fr.lead_investor,

    -- Round sequence
    ROW_NUMBER() OVER (
        PARTITION BY fr.company_id
        ORDER BY fr.round_date
    ) AS round_sequence,

    -- Cumulative raised
    SUM(fr.amount_raised_usd) OVER (
        PARTITION BY fr.company_id
        ORDER BY fr.round_date
    ) / 100.0 AS cumulative_raised_usd,

    -- Time between rounds
    fr.round_date - LAG(fr.round_date) OVER (
        PARTITION BY fr.company_id
        ORDER BY fr.round_date
    ) AS days_since_last_round,

    -- Founder info
    founders.founder_names,
    founders.has_8200_founder

FROM notalone.notalone_funding_rounds fr

JOIN notalone.notalone_companies c ON c.id = fr.company_id

LEFT JOIN (
    SELECT
        company_id,
        ARRAY_AGG(p.name) AS founder_names,
        BOOL_OR(p.is_8200_alumni) AS has_8200_founder
    FROM notalone.notalone_employment_history eh
    JOIN notalone.notalone_people p ON p.id = eh.person_id
    WHERE eh.is_founder = TRUE
    GROUP BY company_id
) founders ON founders.company_id = c.id

WITH NO DATA;

CREATE UNIQUE INDEX idx_mv_funding_timeline_id ON notalone.mv_funding_timeline(id);
CREATE INDEX idx_mv_funding_year ON notalone.mv_funding_timeline(round_year);
CREATE INDEX idx_mv_funding_sector ON notalone.mv_funding_timeline(sector);
CREATE INDEX idx_mv_funding_type ON notalone.mv_funding_timeline(round_type);

-- ============================================================================
-- REFRESH FUNCTION
-- Call this periodically (e.g., daily cron) to update all materialized views
-- ============================================================================

CREATE OR REPLACE FUNCTION notalone.refresh_all_materialized_views()
RETURNS void AS $$
BEGIN
    RAISE NOTICE 'Refreshing materialized views...';

    -- Refresh in dependency order
    REFRESH MATERIALIZED VIEW CONCURRENTLY notalone.mv_company_overview;
    REFRESH MATERIALIZED VIEW CONCURRENTLY notalone.mv_person_overview;
    REFRESH MATERIALIZED VIEW CONCURRENTLY notalone.mv_lp_pipeline;
    REFRESH MATERIALIZED VIEW CONCURRENTLY notalone.mv_talent_flow;
    REFRESH MATERIALIZED VIEW CONCURRENTLY notalone.mv_exit_analysis;
    REFRESH MATERIALIZED VIEW CONCURRENTLY notalone.mv_8200_network;
    REFRESH MATERIALIZED VIEW CONCURRENTLY notalone.mv_funding_timeline;

    -- Network edges cannot be refreshed concurrently (no unique index on all rows)
    REFRESH MATERIALIZED VIEW notalone.mv_network_edges;

    RAISE NOTICE 'All materialized views refreshed successfully.';
END;
$$ LANGUAGE plpgsql;

-- Initial population (run after data migration)
-- SELECT notalone.refresh_all_materialized_views();

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON MATERIALIZED VIEW notalone.mv_company_overview IS 'Aggregated company metrics for Superset dashboards';
COMMENT ON MATERIALIZED VIEW notalone.mv_person_overview IS 'Person metrics for LP prospecting and network analysis';
COMMENT ON MATERIALIZED VIEW notalone.mv_lp_pipeline IS 'Complete LP prospect view for fundraising dashboard';
COMMENT ON MATERIALIZED VIEW notalone.mv_talent_flow IS 'Track movement between companies for ecosystem intelligence';
COMMENT ON MATERIALIZED VIEW notalone.mv_network_edges IS 'Flattened edge list for network visualization (Kumu-style)';
COMMENT ON MATERIALIZED VIEW notalone.mv_exit_analysis IS 'Track acquisitions and exit metrics';
COMMENT ON MATERIALIZED VIEW notalone.mv_8200_network IS 'Unit 8200 alumni network for ecosystem analysis';
COMMENT ON MATERIALIZED VIEW notalone.mv_funding_timeline IS 'Aggregated funding rounds for trend analysis';
