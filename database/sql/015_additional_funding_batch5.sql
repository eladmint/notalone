-- Additional funding rounds - Batch 5
-- Generated: 2026-01-12
-- Companies: Efficient Frontier, Lightblocks, Superfluid, Crowdsense

SET search_path TO notalone;

-- =====================
-- EFFICIENT FRONTIER - $12M total (Israeli crypto market maker)
-- =====================
-- Seed/Strategic - March 2021 ($2M from Alameda + others)
INSERT INTO notalone_funding_rounds (id, company_id, round_type, amount_raised_usd, round_date, lead_investor, other_investors)
SELECT gen_random_uuid(), c.id, 'Seed'::round_type, 12000000, '2021-03-01'::date,
    'Alameda Research', '["Collider Ventures", "Follow The Seed", "Animoca Brands", "Cipholio Ventures", "Hillrise Ventures", "Kyber Ventures", "Bering Waters Ventures", "StarkWare"]'::jsonb
FROM notalone_companies c WHERE c.company_name = 'Efficient Frontier'
AND NOT EXISTS (SELECT 1 FROM notalone_funding_rounds fr WHERE fr.company_id = c.id AND fr.round_type = 'Seed'::round_type);

-- =====================
-- LIGHTBLOCKS - $5M+ (Israeli, building eoracle)
-- =====================
-- Seed - November 2022 ($5M)
INSERT INTO notalone_funding_rounds (id, company_id, round_type, amount_raised_usd, round_date, lead_investor, other_investors)
SELECT gen_random_uuid(), c.id, 'Seed'::round_type, 5000000, '2022-11-01'::date,
    'Pillar VC', '["Mensch Capital Partners", "Dispersion Capital", "HashKey Capital", "Zero Knowledge Venture", "Entrée Capital", "Propel Venture Partners"]'::jsonb
FROM notalone_companies c WHERE c.company_name = 'Lightblocks'
AND NOT EXISTS (SELECT 1 FROM notalone_funding_rounds fr WHERE fr.company_id = c.id AND fr.round_type = 'Seed'::round_type);

-- =====================
-- SUPERFLUID - $14.1M total (Token streaming protocol)
-- =====================
-- Seed - July 2021 ($9M)
INSERT INTO notalone_funding_rounds (id, company_id, round_type, amount_raised_usd, round_date, lead_investor, other_investors)
SELECT gen_random_uuid(), c.id, 'Seed'::round_type, 9000000, '2021-07-13'::date,
    'Multicoin Capital', '["Delphi Digital", "DeFiance Capital", "MetaCartel Ventures", "MMC Ventures", "Fabric Ventures", "The LAO", "DeFi Alliance", "WhiteStar Capital"]'::jsonb
FROM notalone_companies c WHERE c.company_name = 'Superfluid'
AND NOT EXISTS (SELECT 1 FROM notalone_funding_rounds fr WHERE fr.company_id = c.id AND fr.round_type = 'Seed'::round_type);

-- Strategic - February 2024 ($5.1M)
INSERT INTO notalone_funding_rounds (id, company_id, round_type, amount_raised_usd, round_date, lead_investor, other_investors)
SELECT gen_random_uuid(), c.id, 'Bridge'::round_type, 5100000, '2024-02-01'::date,
    'Fabric Ventures', '["Multicoin Capital", "Circle Ventures", "Safe Foundation", "IOSG Ventures", "WAGMI Ventures", "Eterna Capital", "Skyland Ventures"]'::jsonb
FROM notalone_companies c WHERE c.company_name = 'Superfluid'
AND NOT EXISTS (SELECT 1 FROM notalone_funding_rounds fr WHERE fr.company_id = c.id AND fr.round_type = 'Bridge'::round_type);

-- =====================
-- CROWDSENSE - $1.48M total (Israeli social media crypto analytics)
-- =====================
-- Pre-Seed/Seed - 2019-2021 ($1.5M)
INSERT INTO notalone_funding_rounds (id, company_id, round_type, amount_raised_usd, round_date, lead_investor, other_investors)
SELECT gen_random_uuid(), c.id, 'Seed'::round_type, 1500000, '2021-06-01'::date,
    'Techstars', '["Barclays", "Goldfingr", "Stardust Ventures", "WIX Founders"]'::jsonb
FROM notalone_companies c WHERE c.company_name = 'Crowdsense'
AND NOT EXISTS (SELECT 1 FROM notalone_funding_rounds fr WHERE fr.company_id = c.id AND fr.round_type = 'Seed'::round_type);

-- =====================
-- ANOMA - $57.8M+ total (Intent-centric architecture)
-- =====================
-- Seed - January 2021 
INSERT INTO notalone_funding_rounds (id, company_id, round_type, amount_raised_usd, round_date, lead_investor, other_investors)
SELECT gen_random_uuid(), c.id, 'Seed'::round_type, 7000000, '2021-01-01'::date,
    'Polychain Capital', '[]'::jsonb
FROM notalone_companies c WHERE c.company_name = 'Anoma'
AND NOT EXISTS (SELECT 1 FROM notalone_funding_rounds fr WHERE fr.company_id = c.id AND fr.round_type = 'Seed'::round_type);

-- Series A - November 2021
INSERT INTO notalone_funding_rounds (id, company_id, round_type, amount_raised_usd, round_date, lead_investor, other_investors)
SELECT gen_random_uuid(), c.id, 'Series A'::round_type, 26000000, '2021-11-17'::date,
    'Polychain Capital', '["Electric Capital", "Coinbase Ventures", "Maven 11", "Figment"]'::jsonb
FROM notalone_companies c WHERE c.company_name = 'Anoma'
AND NOT EXISTS (SELECT 1 FROM notalone_funding_rounds fr WHERE fr.company_id = c.id AND fr.round_type = 'Series A'::round_type);

-- Series B - 2023 ($25M, led by CMCC Global)
INSERT INTO notalone_funding_rounds (id, company_id, round_type, amount_raised_usd, round_date, lead_investor, other_investors)
SELECT gen_random_uuid(), c.id, 'Series B'::round_type, 25000000, '2023-06-01'::date,
    'CMCC Global', '["Delphi Digital"]'::jsonb
FROM notalone_companies c WHERE c.company_name = 'Anoma'
AND NOT EXISTS (SELECT 1 FROM notalone_funding_rounds fr WHERE fr.company_id = c.id AND fr.round_type = 'Series B'::round_type);

-- =====================
-- ODSY NETWORK - $12.5M (dWallet - Israeli founders)
-- =====================
-- Pre-Seed - August 2022 ($5M)
INSERT INTO notalone_funding_rounds (id, company_id, round_type, amount_raised_usd, round_date, lead_investor, other_investors)
SELECT gen_random_uuid(), c.id, 'Pre-Seed'::round_type, 5000000, '2022-08-01'::date,
    'Node Capital', '["Digital Currency Group", "Amplify Partners", "Lightshift Capital", "Liquid2 Ventures", "Collider Ventures", "Lemniscap", "Heroic Ventures"]'::jsonb
FROM notalone_companies c WHERE c.company_name = 'Odsy Network'
AND NOT EXISTS (SELECT 1 FROM notalone_funding_rounds fr WHERE fr.company_id = c.id AND fr.round_type = 'Pre-Seed'::round_type);

-- Seed - May 2023 ($7.5M at $250M valuation)
INSERT INTO notalone_funding_rounds (id, company_id, round_type, amount_raised_usd, round_date, lead_investor, other_investors)
SELECT gen_random_uuid(), c.id, 'Seed'::round_type, 7500000, '2023-05-11'::date,
    'Blockchange Ventures', '["Rubik Ventures", "No Limit Holdings", "Node Capital", "FalconX"]'::jsonb
FROM notalone_companies c WHERE c.company_name = 'Odsy Network'
AND NOT EXISTS (SELECT 1 FROM notalone_funding_rounds fr WHERE fr.company_id = c.id AND fr.round_type = 'Seed'::round_type);

-- =====================
-- BREVIS - $7.5M (ZK Coprocessor)
-- =====================
-- Seed - November 2024 ($7.5M)
INSERT INTO notalone_funding_rounds (id, company_id, round_type, amount_raised_usd, round_date, lead_investor, other_investors)
SELECT gen_random_uuid(), c.id, 'Seed'::round_type, 7500000, '2024-11-11'::date,
    'Polychain Capital', '["Binance Labs", "IOSG Ventures", "Nomad Capital", "Bankless Ventures", "HashKey Capital"]'::jsonb
FROM notalone_companies c WHERE c.company_name = 'Brevis'
AND NOT EXISTS (SELECT 1 FROM notalone_funding_rounds fr WHERE fr.company_id = c.id AND fr.round_type = 'Seed'::round_type);

-- =====================
-- SEI NETWORK - $85M+ total
-- =====================
-- Seed - August 2022 ($5M)
INSERT INTO notalone_funding_rounds (id, company_id, round_type, amount_raised_usd, round_date, lead_investor, other_investors)
SELECT gen_random_uuid(), c.id, 'Seed'::round_type, 5000000, '2022-08-01'::date,
    'Multicoin Capital', '["Coinbase Ventures", "GSR Ventures", "Hudson River Trading"]'::jsonb
FROM notalone_companies c WHERE c.company_name = 'Sei Network'
AND NOT EXISTS (SELECT 1 FROM notalone_funding_rounds fr WHERE fr.company_id = c.id AND fr.round_type = 'Seed'::round_type);

-- Series A - April 2023 ($30M at $800M valuation)
INSERT INTO notalone_funding_rounds (id, company_id, round_type, amount_raised_usd, round_date, lead_investor, other_investors)
SELECT gen_random_uuid(), c.id, 'Series A'::round_type, 30000000, '2023-04-11'::date,
    'Jump Crypto', '["Distributed Global", "Multicoin Capital", "Asymmetric", "Flow Traders", "Hypersphere", "Bixin Ventures"]'::jsonb
FROM notalone_companies c WHERE c.company_name = 'Sei Network'
AND NOT EXISTS (SELECT 1 FROM notalone_funding_rounds fr WHERE fr.company_id = c.id AND fr.round_type = 'Series A'::round_type);

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
WHERE c.company_name IN ('Efficient Frontier', 'Lightblocks', 'Superfluid', 'Crowdsense', 'Anoma', 'Odsy Network', 'Brevis', 'Sei Network')
ORDER BY c.company_name, fr.round_date;

-- Network stats after import
SELECT
    COUNT(*) as total_edges,
    COUNT(DISTINCT source) as unique_sources
FROM v_network_graph_full;
