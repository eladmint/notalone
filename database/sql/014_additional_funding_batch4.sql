-- Additional funding rounds - Batch 4
-- Generated: 2026-01-12
-- Companies: DAOStack, Colu, Beam, Chromia, Bit2C

SET search_path TO notalone;

-- =====================
-- DAOSTACK - $30M ICO (Israeli DAO governance platform)
-- =====================
-- Seed - December 2017 (amount undisclosed, recording as $1M estimate)
INSERT INTO notalone_funding_rounds (id, company_id, round_type, amount_raised_usd, round_date, lead_investor, other_investors)
SELECT gen_random_uuid(), c.id, 'Seed'::round_type, 1000000, '2017-12-01'::date,
    'NFX Guild', '["iAngels", "Gnosis", "Infinite Capital", "Ofer Rotem"]'::jsonb
FROM notalone_companies c WHERE c.company_name = 'DAOStack'
AND NOT EXISTS (SELECT 1 FROM notalone_funding_rounds fr WHERE fr.company_id = c.id AND fr.round_type = 'Seed'::round_type);

-- ICO - May 2018 ($30M)
INSERT INTO notalone_funding_rounds (id, company_id, round_type, amount_raised_usd, round_date, lead_investor, other_investors)
SELECT gen_random_uuid(), c.id, 'ICO'::round_type, 30000000, '2018-05-01'::date,
    NULL, '[]'::jsonb
FROM notalone_companies c WHERE c.company_name = 'DAOStack'
AND NOT EXISTS (SELECT 1 FROM notalone_funding_rounds fr WHERE fr.company_id = c.id AND fr.round_type = 'ICO'::round_type);

-- =====================
-- COLU - $26.6M total (blockchain for local communities)
-- =====================
-- Seed - 2015 ($2.5M)
INSERT INTO notalone_funding_rounds (id, company_id, round_type, amount_raised_usd, round_date, lead_investor, other_investors)
SELECT gen_random_uuid(), c.id, 'Seed'::round_type, 2500000, '2015-01-01'::date,
    NULL, '[]'::jsonb
FROM notalone_companies c WHERE c.company_name = 'Colu'
AND NOT EXISTS (SELECT 1 FROM notalone_funding_rounds fr WHERE fr.company_id = c.id AND fr.round_type = 'Seed'::round_type);

-- Series A - June 2016 ($9.6M)
INSERT INTO notalone_funding_rounds (id, company_id, round_type, amount_raised_usd, round_date, lead_investor, other_investors)
SELECT gen_random_uuid(), c.id, 'Series A'::round_type, 9600000, '2016-06-01'::date,
    'Aleph', '["Spark Capital", "Digital Currency Group", "Tom Glocer"]'::jsonb
FROM notalone_companies c WHERE c.company_name = 'Colu'
AND NOT EXISTS (SELECT 1 FROM notalone_funding_rounds fr WHERE fr.company_id = c.id AND fr.round_type = 'Series A'::round_type);

-- Series B - December 2017 ($14.5M)
INSERT INTO notalone_funding_rounds (id, company_id, round_type, amount_raised_usd, round_date, lead_investor, other_investors)
SELECT gen_random_uuid(), c.id, 'Series B'::round_type, 14500000, '2017-12-18'::date,
    'IDB Development Corporation', '[]'::jsonb
FROM notalone_companies c WHERE c.company_name = 'Colu'
AND NOT EXISTS (SELECT 1 FROM notalone_funding_rounds fr WHERE fr.company_id = c.id AND fr.round_type = 'Series B'::round_type);

-- =====================
-- BEAM - $5M total (privacy-focused Mimblewimble)
-- =====================
-- Seed - 2018 ($5M - fair launch, no ICO)
INSERT INTO notalone_funding_rounds (id, company_id, round_type, amount_raised_usd, round_date, lead_investor, other_investors)
SELECT gen_random_uuid(), c.id, 'Seed'::round_type, 5000000, '2018-06-01'::date,
    'Recruit Strategic Partners', '["Collider Ventures", "Altonomy", "Alternity Capital", "LionsChain", "Lemniscap"]'::jsonb
FROM notalone_companies c WHERE c.company_name = 'Beam'
AND NOT EXISTS (SELECT 1 FROM notalone_funding_rounds fr WHERE fr.company_id = c.id AND fr.round_type = 'Seed'::round_type);

-- =====================
-- CHROMIA - $15.5M total (relational blockchain)
-- =====================
-- Private Sale - 2018 ($3M)
INSERT INTO notalone_funding_rounds (id, company_id, round_type, amount_raised_usd, round_date, lead_investor, other_investors)
SELECT gen_random_uuid(), c.id, 'Pre-Seed'::round_type, 3000000, '2018-01-01'::date,
    'NGC Ventures', '["JRR Crypto"]'::jsonb
FROM notalone_companies c WHERE c.company_name = 'Chromia'
AND NOT EXISTS (SELECT 1 FROM notalone_funding_rounds fr WHERE fr.company_id = c.id AND fr.round_type = 'Pre-Seed'::round_type);

-- Token Sale - 2019 ($2.5M via KuCoin Spotlight)
INSERT INTO notalone_funding_rounds (id, company_id, round_type, amount_raised_usd, round_date, lead_investor, other_investors)
SELECT gen_random_uuid(), c.id, 'Token Sale'::round_type, 2500000, '2019-05-01'::date,
    'KuCoin Spotlight', '[]'::jsonb
FROM notalone_companies c WHERE c.company_name = 'Chromia'
AND NOT EXISTS (SELECT 1 FROM notalone_funding_rounds fr WHERE fr.company_id = c.id AND fr.round_type = 'Token Sale'::round_type);

-- Series A - January 2022 ($10M)
INSERT INTO notalone_funding_rounds (id, company_id, round_type, amount_raised_usd, round_date, lead_investor, other_investors)
SELECT gen_random_uuid(), c.id, 'Series A'::round_type, 10000000, '2022-01-13'::date,
    'True Global Ventures', '["Arrington Capital", "MiH Ventures", "Unanimous Capital"]'::jsonb
FROM notalone_companies c WHERE c.company_name = 'Chromia'
AND NOT EXISTS (SELECT 1 FROM notalone_funding_rounds fr WHERE fr.company_id = c.id AND fr.round_type = 'Series A'::round_type);

-- =====================
-- BIT2C - ~$1.1M (first Israeli crypto exchange, crowdfunded)
-- =====================
-- Crowdfunding - 2013 (~4M shekels)
INSERT INTO notalone_funding_rounds (id, company_id, round_type, amount_raised_usd, round_date, lead_investor, other_investors)
SELECT gen_random_uuid(), c.id, 'Seed'::round_type, 1100000, '2013-02-01'::date,
    NULL, '["Crowdfunding"]'::jsonb
FROM notalone_companies c WHERE c.company_name = 'Bit2C'
AND NOT EXISTS (SELECT 1 FROM notalone_funding_rounds fr WHERE fr.company_id = c.id AND fr.round_type = 'Seed'::round_type);

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
WHERE c.company_name IN ('DAOStack', 'Colu', 'Beam', 'Chromia', 'Bit2C')
ORDER BY c.company_name, fr.round_date;

-- Network stats after import
SELECT
    COUNT(*) as total_edges,
    COUNT(DISTINCT source) as unique_sources
FROM v_network_graph_full;
