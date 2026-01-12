-- ============================================================================
-- Colleague Connection Detection
-- Finds people who worked at the same company with overlapping tenure
-- ============================================================================
-- Database: calendar_monitoring
-- Schema: notalone
-- Version: 1.0
-- Created: 2026-01-12
-- ============================================================================

SET search_path TO notalone, public;

-- ============================================================================
-- VIEW: Colleague Connections
-- Generates Person→Person edges for workplace colleagues
-- ============================================================================

DROP VIEW IF EXISTS notalone.v_colleague_connections CASCADE;

CREATE OR REPLACE VIEW notalone.v_colleague_connections AS

WITH employment_periods AS (
    -- Normalize employment periods for overlap detection
    SELECT
        eh.id,
        eh.person_id,
        p.name AS person_name,
        eh.company_id,
        c.company_name,
        eh.start_date,
        COALESCE(eh.end_date, CURRENT_DATE) AS end_date,  -- Treat NULL as current
        eh.role_title,
        eh.role_type,
        eh.is_founder,
        eh.is_current
    FROM notalone.notalone_employment_history eh
    JOIN notalone.notalone_people p ON p.id = eh.person_id
    JOIN notalone.notalone_companies c ON c.id = eh.company_id
    WHERE eh.company_id IS NOT NULL
      AND p.name IS NOT NULL
      AND c.company_name IS NOT NULL
      AND eh.start_date IS NOT NULL  -- Need dates for overlap calculation
),

colleague_pairs AS (
    -- Find overlapping employment at same company
    SELECT DISTINCT
        LEAST(e1.person_name, e2.person_name) AS person_1,
        GREATEST(e1.person_name, e2.person_name) AS person_2,
        e1.company_name,
        e1.company_id,
        CASE WHEN e1.person_name < e2.person_name THEN e1.role_title ELSE e2.role_title END AS person_1_role,
        CASE WHEN e1.person_name < e2.person_name THEN e2.role_title ELSE e1.role_title END AS person_2_role,
        CASE WHEN e1.person_name < e2.person_name THEN e1.role_type ELSE e2.role_type END AS person_1_role_type,
        CASE WHEN e1.person_name < e2.person_name THEN e2.role_type ELSE e1.role_type END AS person_2_role_type,
        CASE WHEN e1.person_name < e2.person_name THEN e1.is_founder ELSE e2.is_founder END AS person_1_is_founder,
        CASE WHEN e1.person_name < e2.person_name THEN e2.is_founder ELSE e1.is_founder END AS person_2_is_founder,

        -- Calculate overlap period
        GREATEST(e1.start_date, e2.start_date) AS overlap_start,
        LEAST(e1.end_date, e2.end_date) AS overlap_end,

        -- Calculate overlap duration in months
        GREATEST(0,
            EXTRACT(YEAR FROM AGE(
                LEAST(e1.end_date, e2.end_date),
                GREATEST(e1.start_date, e2.start_date)
            )) * 12 +
            EXTRACT(MONTH FROM AGE(
                LEAST(e1.end_date, e2.end_date),
                GREATEST(e1.start_date, e2.start_date)
            ))
        )::INTEGER AS overlap_months

    FROM employment_periods e1
    JOIN employment_periods e2
        ON e1.company_id = e2.company_id
        AND e1.person_name < e2.person_name  -- Avoid duplicate pairs and self-matches
        -- Check for temporal overlap
        AND e1.start_date <= e2.end_date
        AND e1.end_date >= e2.start_date
)

SELECT
    person_1 AS source,
    person_2 AS target,
    'Colleague' AS category,

    -- Weight based on overlap duration and roles
    CASE
        -- Both founders = very strong connection
        WHEN person_1_is_founder AND person_2_is_founder THEN 8
        -- One founder with long overlap
        WHEN (person_1_is_founder OR person_2_is_founder) AND overlap_months >= 24 THEN 7
        -- Both senior roles (C-Suite, VP) with long overlap
        WHEN person_1_role_type::TEXT IN ('C-Suite', 'VP', 'Founder', 'Co-founder')
         AND person_2_role_type::TEXT IN ('C-Suite', 'VP', 'Founder', 'Co-founder')
         AND overlap_months >= 24 THEN 6
        -- Long overlap (2+ years)
        WHEN overlap_months >= 24 THEN 5
        -- Medium overlap (1-2 years)
        WHEN overlap_months >= 12 THEN 4
        -- Short overlap (6-12 months)
        WHEN overlap_months >= 6 THEN 3
        -- Very short overlap
        ELSE 2
    END AS weight,

    company_name AS origin,

    -- Tooltip with detailed information
    person_1 || ' & ' || person_2 || ' worked together at ' || company_name ||
    CASE
        WHEN overlap_months >= 12 THEN
            ' (' || ROUND(overlap_months / 12.0, 1)::TEXT || ' yrs)'
        ELSE
            ' (' || overlap_months::TEXT || ' mo)'
    END ||
    CASE
        WHEN person_1_is_founder AND person_2_is_founder THEN ' [co-founders]'
        WHEN person_1_is_founder OR person_2_is_founder THEN ' [with founder]'
        ELSE ''
    END AS tooltip,

    'colleague' AS edge_source,

    -- Additional metadata for filtering
    overlap_months,
    EXTRACT(YEAR FROM overlap_start)::INTEGER AS overlap_start_year,
    EXTRACT(YEAR FROM overlap_end)::INTEGER AS overlap_end_year

FROM colleague_pairs
WHERE overlap_months > 0  -- Only include actual overlaps
  AND person_1 IS NOT NULL
  AND person_2 IS NOT NULL
ORDER BY weight DESC, overlap_months DESC;

COMMENT ON VIEW notalone.v_colleague_connections IS
'Colleague connections derived from overlapping employment at same company.
Weight scale:
  8 = both founders
  7 = one founder + long overlap (2+ yrs)
  6 = senior roles + long overlap
  5 = long overlap (2+ yrs)
  4 = medium overlap (1-2 yrs)
  3 = short overlap (6-12 mo)
  2 = very short overlap (<6 mo)';

-- ============================================================================
-- Verification query
-- ============================================================================
-- SELECT category, weight, COUNT(*), AVG(overlap_months)::INT as avg_months
-- FROM notalone.v_colleague_connections
-- GROUP BY category, weight
-- ORDER BY weight DESC;
