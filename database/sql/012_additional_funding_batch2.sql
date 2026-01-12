-- Additional funding rounds - Batch 2
-- Generated: 2026-01-12
-- Companies: Kaspa, Dymension, SSV Network, Ownera, ChainPort, Poolz, Hexagate, Hypernative

SET search_path TO notalone;

-- =====================
-- KASPA - $8M seed (from DAGLabs)
-- =====================
INSERT INTO notalone_funding_rounds (id, company_id, round_type, amount_raised_usd, round_date, lead_investor, other_investors)
SELECT gen_random_uuid(), c.id, 'Seed'::round_type, 8000000, '2018-01-01'::date,
    'Polychain Capital', '["Accomplice", "Genesis Mining"]'::jsonb
FROM notalone_companies c WHERE c.company_name = 'Kaspa'
AND NOT EXISTS (SELECT 1 FROM notalone_funding_rounds fr WHERE fr.company_id = c.id AND fr.round_type = 'Seed'::round_type);

-- =====================
-- DYMENSION - $6.7M seed
-- =====================
INSERT INTO notalone_funding_rounds (id, company_id, round_type, amount_raised_usd, round_date, lead_investor, other_investors)
SELECT gen_random_uuid(), c.id, 'Seed'::round_type, 6700000, '2023-02-01'::date,
    'Big Brain Holdings', '["Stratos", "Matchbox DAO", "Chorus One", "Continue Capital"]'::jsonb
FROM notalone_companies c WHERE c.company_name = 'Dymension'
AND NOT EXISTS (SELECT 1 FROM notalone_funding_rounds fr WHERE fr.company_id = c.id AND fr.round_type = 'Seed'::round_type);

-- =====================
-- SSV NETWORK - $10M Series A
-- =====================
INSERT INTO notalone_funding_rounds (id, company_id, round_type, amount_raised_usd, round_date, lead_investor, other_investors)
SELECT gen_random_uuid(), c.id, 'Series A'::round_type, 10000000, '2022-02-08'::date,
    'Digital Currency Group', '["Coinbase Ventures", "HashKey", "NGC", "Everstake", "GSR", "SevenX"]'::jsonb
FROM notalone_companies c WHERE c.company_name = 'SSV Network'
AND NOT EXISTS (SELECT 1 FROM notalone_funding_rounds fr WHERE fr.company_id = c.id AND fr.round_type = 'Series A'::round_type);

-- =====================
-- OWNERA - $20M Series A (JPMorgan backed)
-- =====================
INSERT INTO notalone_funding_rounds (id, company_id, round_type, amount_raised_usd, round_date, lead_investor, other_investors)
SELECT gen_random_uuid(), c.id, 'Series A'::round_type, 20000000, '2022-09-14'::date,
    'JPMorgan', '["LRC Group", "Draper Goren Holm", "US Bank", "Accomplice", "Archax"]'::jsonb
FROM notalone_companies c WHERE c.company_name = 'Ownera'
AND NOT EXISTS (SELECT 1 FROM notalone_funding_rounds fr WHERE fr.company_id = c.id AND fr.round_type = 'Series A'::round_type);

-- =====================
-- CHAINPORT - $14M combined rounds
-- =====================
INSERT INTO notalone_funding_rounds (id, company_id, round_type, amount_raised_usd, round_date, lead_investor, other_investors)
SELECT gen_random_uuid(), c.id, 'Seed'::round_type, 14000000, '2021-09-01'::date,
    'DAO Maker', '["Shima Capital", "LD Capital", "Master Ventures", "Fundamental Labs", "Tribe Capital"]'::jsonb
FROM notalone_companies c WHERE c.company_name = 'ChainPort'
AND NOT EXISTS (SELECT 1 FROM notalone_funding_rounds fr WHERE fr.company_id = c.id AND fr.round_type = 'Seed'::round_type);

-- =====================
-- POOLZ - $2M
-- =====================
INSERT INTO notalone_funding_rounds (id, company_id, round_type, amount_raised_usd, round_date, lead_investor, other_investors)
SELECT gen_random_uuid(), c.id, 'Seed'::round_type, 2000000, '2021-01-01'::date,
    'Genesis Block Ventures', '["SevenX Ventures", "Alphabit", "GBV Capital", "Phoenix Capital", "DuckDAO"]'::jsonb
FROM notalone_companies c WHERE c.company_name = 'Poolz'
AND NOT EXISTS (SELECT 1 FROM notalone_funding_rounds fr WHERE fr.company_id = c.id AND fr.round_type = 'Seed'::round_type);

-- =====================
-- HEXAGATE - $8.6M seed (acquired by Chainalysis for $60M)
-- =====================
INSERT INTO notalone_funding_rounds (id, company_id, round_type, amount_raised_usd, round_date, lead_investor, other_investors)
SELECT gen_random_uuid(), c.id, 'Seed'::round_type, 8600000, '2022-06-01'::date,
    'Entree Capital', '["Samsung Next", "INT3", "North First Ventures", "Viola FinTech"]'::jsonb
FROM notalone_companies c WHERE c.company_name = 'Hexagate'
AND NOT EXISTS (SELECT 1 FROM notalone_funding_rounds fr WHERE fr.company_id = c.id AND fr.round_type = 'Seed'::round_type);

-- =====================
-- HYPERNATIVE - $16M Series A + $40M Series B
-- =====================
-- Series A - September 2024
INSERT INTO notalone_funding_rounds (id, company_id, round_type, amount_raised_usd, round_date, lead_investor, other_investors)
SELECT gen_random_uuid(), c.id, 'Series A'::round_type, 16000000, '2024-09-04'::date,
    'Quantstamp', '["Bloccelerate VC", "boldstart ventures", "Borderless Capital", "CMT Digital", "IBI Tech Fund"]'::jsonb
FROM notalone_companies c WHERE c.company_name = 'Hypernative'
AND NOT EXISTS (SELECT 1 FROM notalone_funding_rounds fr WHERE fr.company_id = c.id AND fr.round_type = 'Series A'::round_type);

-- Series B - June 2025
INSERT INTO notalone_funding_rounds (id, company_id, round_type, amount_raised_usd, round_date, lead_investor, other_investors)
SELECT gen_random_uuid(), c.id, 'Series B'::round_type, 40000000, '2025-06-10'::date,
    'Ten Eleven Ventures', '["Ballistic Ventures", "StepStone Group", "boldstart ventures", "IBI Tech Fund"]'::jsonb
FROM notalone_companies c WHERE c.company_name = 'Hypernative'
AND NOT EXISTS (SELECT 1 FROM notalone_funding_rounds fr WHERE fr.company_id = c.id AND fr.round_type = 'Series B'::round_type);

-- =====================
-- Verify insertions
-- =====================
SELECT
    c.company_name,
    fr.round_type,
    fr.amount_raised_usd / 1000000 as amount_millions,
    fr.lead_investor,
    fr.round_date
FROM notalone_funding_rounds fr
JOIN notalone_companies c ON fr.company_id = c.id
WHERE c.company_name IN ('Kaspa', 'Dymension', 'SSV Network', 'Ownera', 'ChainPort', 'Poolz', 'Hexagate', 'Hypernative')
ORDER BY c.company_name, fr.round_date;

-- Network stats after import
SELECT
    COUNT(*) as total_edges,
    COUNT(DISTINCT source) as unique_sources
FROM v_network_graph_full;
