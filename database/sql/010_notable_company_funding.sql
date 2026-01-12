-- Funding rounds for notable companies from Collider import
-- Generated: 2026-01-12

SET search_path TO notalone;

-- =====================
-- eToro - Major fintech
-- =====================
-- Series E - March 2018 ($100M)
INSERT INTO notalone_funding_rounds (id, company_id, round_type, amount_raised_usd, round_date, lead_investor, other_investors)
SELECT
    gen_random_uuid(),
    c.id,
    'Series E'::round_type,
    100000000,
    '2018-03-21'::date,
    'China Minsheng Financial Holdings',
    '["Korea Investment Holdings", "SVB Capital"]'::jsonb
FROM notalone_companies c
WHERE c.company_name = 'eToro'
AND NOT EXISTS (
    SELECT 1 FROM notalone_funding_rounds fr
    WHERE fr.company_id = c.id AND fr.round_type = 'Series E'::round_type
);

-- Series F - March 2023 ($250M)
INSERT INTO notalone_funding_rounds (id, company_id, round_type, amount_raised_usd, round_date, lead_investor, other_investors)
SELECT
    gen_random_uuid(),
    c.id,
    'Series F'::round_type,
    250000000,
    '2023-03-21'::date,
    'Velvet Sea Ventures',
    '["ION Group", "SoftBank Vision Fund"]'::jsonb
FROM notalone_companies c
WHERE c.company_name = 'eToro'
AND NOT EXISTS (
    SELECT 1 FROM notalone_funding_rounds fr
    WHERE fr.company_id = c.id AND fr.round_type = 'Series F'::round_type
);

-- =====================
-- Solidus Labs
-- =====================
-- Series B - May 2022 ($45M)
INSERT INTO notalone_funding_rounds (id, company_id, round_type, amount_raised_usd, round_date, lead_investor, other_investors)
SELECT
    gen_random_uuid(),
    c.id,
    'Series B'::round_type,
    45000000,
    '2022-05-12'::date,
    'Liberty City Ventures',
    '["Evolution Equity Partners", "Declaration Partners", "Hanaco Ventures", "Avon Ventures"]'::jsonb
FROM notalone_companies c
WHERE c.company_name = 'Solidus Labs'
AND NOT EXISTS (
    SELECT 1 FROM notalone_funding_rounds fr
    WHERE fr.company_id = c.id AND fr.round_type = 'Series B'::round_type
);

-- =====================
-- Ingonyama - ZK Hardware
-- =====================
-- Seed - January 2024 ($21M)
INSERT INTO notalone_funding_rounds (id, company_id, round_type, amount_raised_usd, round_date, lead_investor, other_investors)
SELECT
    gen_random_uuid(),
    c.id,
    'Seed'::round_type,
    21000000,
    '2024-01-23'::date,
    'IOSG Ventures',
    '["Walden Catalyst Ventures", "Geometry", "Samsung Next", "RockawayX", "Protocol Labs", "Offchain Labs", "Starkware", "Matter Labs", "Scroll", "Polygon"]'::jsonb
FROM notalone_companies c
WHERE c.company_name = 'Ingonyama'
AND NOT EXISTS (
    SELECT 1 FROM notalone_funding_rounds fr
    WHERE fr.company_id = c.id AND fr.round_type = 'Seed'::round_type
);

-- =====================
-- Fhenix - FHE Privacy
-- =====================
-- Seed - September 2023 ($7M)
INSERT INTO notalone_funding_rounds (id, company_id, round_type, amount_raised_usd, round_date, lead_investor, other_investors)
SELECT
    gen_random_uuid(),
    c.id,
    'Seed'::round_type,
    7000000,
    '2023-09-26'::date,
    'Multicoin Capital',
    '["Collider Ventures", "Node Capital", "HackVC", "TaneLabs", "Metaplanet", "Robot Ventures"]'::jsonb
FROM notalone_companies c
WHERE c.company_name = 'Fhenix'
AND NOT EXISTS (
    SELECT 1 FROM notalone_funding_rounds fr
    WHERE fr.company_id = c.id AND fr.round_type = 'Seed'::round_type
);

-- Series A - June 2024 ($15M)
INSERT INTO notalone_funding_rounds (id, company_id, round_type, amount_raised_usd, round_date, lead_investor, other_investors)
SELECT
    gen_random_uuid(),
    c.id,
    'Series A'::round_type,
    15000000,
    '2024-06-15'::date,
    'Hack VC',
    '["GSR", "Amber Group", "NGC Ventures", "Foresight Ventures", "Gate.io", "Collider Ventures", "Primitive Ventures", "Stake Capital"]'::jsonb
FROM notalone_companies c
WHERE c.company_name = 'Fhenix'
AND NOT EXISTS (
    SELECT 1 FROM notalone_funding_rounds fr
    WHERE fr.company_id = c.id AND fr.round_type = 'Series A'::round_type
);

-- =====================
-- Venn (Ironblocks)
-- =====================
-- Seed - February 2023 ($7M)
INSERT INTO notalone_funding_rounds (id, company_id, round_type, amount_raised_usd, round_date, lead_investor, other_investors)
SELECT
    gen_random_uuid(),
    c.id,
    'Seed'::round_type,
    7000000,
    '2023-02-15'::date,
    'Collider Ventures',
    '["Disruptive AI", "Samsung Next", "ParaFi Capital", "Quantstamp"]'::jsonb
FROM notalone_companies c
WHERE c.company_name = 'Venn'
AND NOT EXISTS (
    SELECT 1 FROM notalone_funding_rounds fr
    WHERE fr.company_id = c.id AND fr.round_type = 'Seed'::round_type
);

-- =====================
-- GK8 (Acquired by Galaxy)
-- =====================
-- Series A - December 2020 ($4M)
INSERT INTO notalone_funding_rounds (id, company_id, round_type, amount_raised_usd, round_date, lead_investor, other_investors)
SELECT
    gen_random_uuid(),
    c.id,
    'Series A'::round_type,
    4000000,
    '2020-12-01'::date,
    'Insight Partners',
    '[]'::jsonb
FROM notalone_companies c
WHERE c.company_name = 'GK8'
AND NOT EXISTS (
    SELECT 1 FROM notalone_funding_rounds fr
    WHERE fr.company_id = c.id AND fr.round_type = 'Series A'::round_type
);

-- =====================
-- Chain Reaction
-- =====================
-- Series B - December 2022 ($70M)
INSERT INTO notalone_funding_rounds (id, company_id, round_type, amount_raised_usd, round_date, lead_investor, other_investors)
SELECT
    gen_random_uuid(),
    c.id,
    'Series B'::round_type,
    70000000,
    '2022-12-01'::date,
    'Morgan Creek Digital',
    '["Hanaco Ventures"]'::jsonb
FROM notalone_companies c
WHERE c.company_name = 'Chain Reaction'
AND NOT EXISTS (
    SELECT 1 FROM notalone_funding_rounds fr
    WHERE fr.company_id = c.id AND fr.round_type = 'Series B'::round_type
);

-- =====================
-- DeepDAO
-- =====================
-- Seed - August 2021 ($1.5M)
INSERT INTO notalone_funding_rounds (id, company_id, round_type, amount_raised_usd, round_date, lead_investor, other_investors)
SELECT
    gen_random_uuid(),
    c.id,
    'Seed'::round_type,
    1500000,
    '2021-08-01'::date,
    'DAO Maker',
    '["Genesis Block Ventures", "Morningstar Ventures"]'::jsonb
FROM notalone_companies c
WHERE c.company_name = 'DeepDAO'
AND NOT EXISTS (
    SELECT 1 FROM notalone_funding_rounds fr
    WHERE fr.company_id = c.id AND fr.round_type = 'Seed'::round_type
);

-- Verify insertions
SELECT
    c.company_name,
    fr.round_type,
    fr.amount_raised_usd,
    fr.lead_investor
FROM notalone_funding_rounds fr
JOIN notalone_companies c ON fr.company_id = c.id
WHERE c.company_name IN ('eToro', 'Solidus Labs', 'Ingonyama', 'Fhenix', 'Venn', 'GK8', 'Chain Reaction', 'DeepDAO')
ORDER BY c.company_name, fr.round_date;
