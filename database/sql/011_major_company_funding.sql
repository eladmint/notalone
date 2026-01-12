-- Major company funding rounds
-- Generated: 2026-01-12
-- Companies: Fireblocks, StarkWare, ZenGo, Blockaid, Certora, Braavos, Simplex, Orbs, COTI, Fordefi, Chaos Labs

SET search_path TO notalone;

-- =====================
-- FIREBLOCKS - $1.04B total, $8B valuation
-- =====================
-- Series D - July 2021 ($310M)
INSERT INTO notalone_funding_rounds (id, company_id, round_type, amount_raised_usd, round_date, lead_investor, other_investors)
SELECT gen_random_uuid(), c.id, 'Series D'::round_type, 310000000, '2021-07-27'::date,
    'Sequoia Capital', '["Stripes", "Spark Capital", "Coatue", "DRW VC", "SCB 10X"]'::jsonb
FROM notalone_companies c WHERE c.company_name = 'Fireblocks'
AND NOT EXISTS (SELECT 1 FROM notalone_funding_rounds fr WHERE fr.company_id = c.id AND fr.round_type = 'Series D'::round_type);

-- Series E - January 2022 ($550M)
INSERT INTO notalone_funding_rounds (id, company_id, round_type, amount_raised_usd, round_date, lead_investor, other_investors)
SELECT gen_random_uuid(), c.id, 'Series E'::round_type, 550000000, '2022-01-27'::date,
    'Spark Capital', '["D1 Capital Partners", "General Atlantic", "Index Ventures", "CapitalG", "Canapi Ventures", "Altimeter Capital", "ParaFi Capital", "Mammoth", "Iconiq Capital"]'::jsonb
FROM notalone_companies c WHERE c.company_name = 'Fireblocks'
AND NOT EXISTS (SELECT 1 FROM notalone_funding_rounds fr WHERE fr.company_id = c.id AND fr.round_type = 'Series E'::round_type);

-- =====================
-- STARKWARE - $287M total, $8B valuation
-- =====================
-- Series C - November 2021 ($50M)
INSERT INTO notalone_funding_rounds (id, company_id, round_type, amount_raised_usd, round_date, lead_investor, other_investors)
SELECT gen_random_uuid(), c.id, 'Series C'::round_type, 50000000, '2021-11-16'::date,
    'Sequoia Capital', '["Paradigm", "Alameda Research", "Three Arrows Capital"]'::jsonb
FROM notalone_companies c WHERE c.company_name = 'Starkware'
AND NOT EXISTS (SELECT 1 FROM notalone_funding_rounds fr WHERE fr.company_id = c.id AND fr.round_type = 'Series C'::round_type);

-- Series D - May 2022 ($100M)
INSERT INTO notalone_funding_rounds (id, company_id, round_type, amount_raised_usd, round_date, lead_investor, other_investors)
SELECT gen_random_uuid(), c.id, 'Series D'::round_type, 100000000, '2022-05-25'::date,
    'Greenoaks Capital', '["Coatue", "Tiger Global"]'::jsonb
FROM notalone_companies c WHERE c.company_name = 'Starkware'
AND NOT EXISTS (SELECT 1 FROM notalone_funding_rounds fr WHERE fr.company_id = c.id AND fr.round_type = 'Series D'::round_type);

-- =====================
-- ZENGO - $52M total
-- =====================
-- Seed - October 2018 ($4M)
INSERT INTO notalone_funding_rounds (id, company_id, round_type, amount_raised_usd, round_date, lead_investor, other_investors)
SELECT gen_random_uuid(), c.id, 'Seed'::round_type, 4000000, '2018-10-02'::date,
    'Benson Oak Ventures', '["Samsung Next", "FJ Labs", "Elron Ventures"]'::jsonb
FROM notalone_companies c WHERE c.company_name = 'ZenGo'
AND NOT EXISTS (SELECT 1 FROM notalone_funding_rounds fr WHERE fr.company_id = c.id AND fr.round_type = 'Seed'::round_type);

-- Series A - April 2021 ($20M)
INSERT INTO notalone_funding_rounds (id, company_id, round_type, amount_raised_usd, round_date, lead_investor, other_investors)
SELECT gen_random_uuid(), c.id, 'Series A'::round_type, 20000000, '2021-04-27'::date,
    'Insight Partners', '["Distributed Global", "Samsung Next", "Benson Oak Ventures", "Collider Ventures"]'::jsonb
FROM notalone_companies c WHERE c.company_name = 'ZenGo'
AND NOT EXISTS (SELECT 1 FROM notalone_funding_rounds fr WHERE fr.company_id = c.id AND fr.round_type = 'Series A'::round_type);

-- =====================
-- BLOCKAID - $83M total (8200 alumni)
-- =====================
-- Series A - October 2023 ($33M combined seed+A)
INSERT INTO notalone_funding_rounds (id, company_id, round_type, amount_raised_usd, round_date, lead_investor, other_investors)
SELECT gen_random_uuid(), c.id, 'Series A'::round_type, 33000000, '2023-10-23'::date,
    'Ribbit Capital', '["Variant", "Cyberstarts", "Sequoia Capital", "Greylock Partners"]'::jsonb
FROM notalone_companies c WHERE c.company_name = 'Blockaid'
AND NOT EXISTS (SELECT 1 FROM notalone_funding_rounds fr WHERE fr.company_id = c.id AND fr.round_type = 'Series A'::round_type);

-- Series B - February 2025 ($50M)
INSERT INTO notalone_funding_rounds (id, company_id, round_type, amount_raised_usd, round_date, lead_investor, other_investors)
SELECT gen_random_uuid(), c.id, 'Series B'::round_type, 50000000, '2025-02-18'::date,
    'Ribbit Capital', '["Variant", "Cyberstarts"]'::jsonb
FROM notalone_companies c WHERE c.company_name = 'Blockaid'
AND NOT EXISTS (SELECT 1 FROM notalone_funding_rounds fr WHERE fr.company_id = c.id AND fr.round_type = 'Series B'::round_type);

-- =====================
-- CERTORA - $43.2M total
-- =====================
-- Series A - May 2021 ($7.2M)
INSERT INTO notalone_funding_rounds (id, company_id, round_type, amount_raised_usd, round_date, lead_investor, other_investors)
SELECT gen_random_uuid(), c.id, 'Series A'::round_type, 7200000, '2021-05-21'::date,
    'Electric Capital', '[]'::jsonb
FROM notalone_companies c WHERE c.company_name = 'Certora'
AND NOT EXISTS (SELECT 1 FROM notalone_funding_rounds fr WHERE fr.company_id = c.id AND fr.round_type = 'Series A'::round_type);

-- Series B - May 2022 ($36M)
INSERT INTO notalone_funding_rounds (id, company_id, round_type, amount_raised_usd, round_date, lead_investor, other_investors)
SELECT gen_random_uuid(), c.id, 'Series B'::round_type, 36000000, '2022-05-17'::date,
    'Jump Crypto', '["Tiger Global", "Galaxy Digital", "Electric Capital", "Framework Ventures", "CoinFund", "Coinbase Ventures"]'::jsonb
FROM notalone_companies c WHERE c.company_name = 'Certora'
AND NOT EXISTS (SELECT 1 FROM notalone_funding_rounds fr WHERE fr.company_id = c.id AND fr.round_type = 'Series B'::round_type);

-- =====================
-- BRAAVOS - $10M total (Starknet wallet)
-- =====================
-- Seed - October 2022 ($10M)
INSERT INTO notalone_funding_rounds (id, company_id, round_type, amount_raised_usd, round_date, lead_investor, other_investors)
SELECT gen_random_uuid(), c.id, 'Seed'::round_type, 10000000, '2022-10-31'::date,
    'Pantera Capital', '["Brevan Howard Digital", "DCVC", "Crypto.com", "Matrixport", "Starkware", "Viola FinTech"]'::jsonb
FROM notalone_companies c WHERE c.company_name = 'Braavos'
AND NOT EXISTS (SELECT 1 FROM notalone_funding_rounds fr WHERE fr.company_id = c.id AND fr.round_type = 'Seed'::round_type);

-- =====================
-- SIMPLEX - $17.5M total (acquired by Nuvei for $250M)
-- =====================
-- Series A - February 2016 ($7M)
INSERT INTO notalone_funding_rounds (id, company_id, round_type, amount_raised_usd, round_date, lead_investor, other_investors)
SELECT gen_random_uuid(), c.id, 'Series A'::round_type, 7000000, '2016-02-05'::date,
    'Bitmain', '["Cumberland Mining"]'::jsonb
FROM notalone_companies c WHERE c.company_name = 'Simplex'
AND NOT EXISTS (SELECT 1 FROM notalone_funding_rounds fr WHERE fr.company_id = c.id AND fr.round_type = 'Series A'::round_type);

-- =====================
-- ORBS - $128M total
-- =====================
-- ICO - June 2018 ($111M)
INSERT INTO notalone_funding_rounds (id, company_id, round_type, amount_raised_usd, round_date, lead_investor, other_investors)
SELECT gen_random_uuid(), c.id, 'ICO'::round_type, 111000000, '2018-06-01'::date,
    NULL, '[]'::jsonb
FROM notalone_companies c WHERE c.company_name = 'Orbs'
AND NOT EXISTS (SELECT 1 FROM notalone_funding_rounds fr WHERE fr.company_id = c.id AND fr.round_type = 'ICO'::round_type);

-- Series A - December 2018 ($15.4M)
INSERT INTO notalone_funding_rounds (id, company_id, round_type, amount_raised_usd, round_date, lead_investor, other_investors)
SELECT gen_random_uuid(), c.id, 'Series A'::round_type, 15400000, '2018-12-13'::date,
    'Kakao Investment', '[]'::jsonb
FROM notalone_companies c WHERE c.company_name = 'Orbs'
AND NOT EXISTS (SELECT 1 FROM notalone_funding_rounds fr WHERE fr.company_id = c.id AND fr.round_type = 'Series A'::round_type);

-- =====================
-- COTI - $22M total
-- =====================
-- Token Sale - June 2018 ($16M)
INSERT INTO notalone_funding_rounds (id, company_id, round_type, amount_raised_usd, round_date, lead_investor, other_investors)
SELECT gen_random_uuid(), c.id, 'Token Sale'::round_type, 16000000, '2018-06-05'::date,
    NULL, '[]'::jsonb
FROM notalone_companies c WHERE c.company_name = 'Coti'
AND NOT EXISTS (SELECT 1 FROM notalone_funding_rounds fr WHERE fr.company_id = c.id AND fr.round_type = 'Token Sale'::round_type);

-- =====================
-- FORDEFI - $28M total (acquired by Paxos for $100M+)
-- =====================
-- Seed - 2022 ($18M)
INSERT INTO notalone_funding_rounds (id, company_id, round_type, amount_raised_usd, round_date, lead_investor, other_investors)
SELECT gen_random_uuid(), c.id, 'Seed'::round_type, 18000000, '2022-06-01'::date,
    'Jump Crypto', '["Pantera Capital", "Lightspeed Venture Partners"]'::jsonb
FROM notalone_companies c WHERE c.company_name = 'Fordefi'
AND NOT EXISTS (SELECT 1 FROM notalone_funding_rounds fr WHERE fr.company_id = c.id AND fr.round_type = 'Seed'::round_type);

-- Seed Extension - February 2024 ($10M)
INSERT INTO notalone_funding_rounds (id, company_id, round_type, amount_raised_usd, round_date, lead_investor, other_investors)
SELECT gen_random_uuid(), c.id, 'Bridge'::round_type, 10000000, '2024-02-13'::date,
    'Electric Capital', '["Paxos", "Alchemy"]'::jsonb
FROM notalone_companies c WHERE c.company_name = 'Fordefi'
AND NOT EXISTS (SELECT 1 FROM notalone_funding_rounds fr WHERE fr.company_id = c.id AND fr.round_type = 'Bridge'::round_type);

-- =====================
-- CHAOS LABS - $75M total
-- =====================
-- Seed - 2022 ($20M)
INSERT INTO notalone_funding_rounds (id, company_id, round_type, amount_raised_usd, round_date, lead_investor, other_investors)
SELECT gen_random_uuid(), c.id, 'Seed'::round_type, 20000000, '2022-10-01'::date,
    'Galaxy Ventures', '["PayPal Ventures", "Coinbase Ventures", "Wintermute Ventures"]'::jsonb
FROM notalone_companies c WHERE c.company_name = 'Chaos Labs'
AND NOT EXISTS (SELECT 1 FROM notalone_funding_rounds fr WHERE fr.company_id = c.id AND fr.round_type = 'Seed'::round_type);

-- Series A - August 2024 ($55M)
INSERT INTO notalone_funding_rounds (id, company_id, round_type, amount_raised_usd, round_date, lead_investor, other_investors)
SELECT gen_random_uuid(), c.id, 'Series A'::round_type, 55000000, '2024-08-15'::date,
    'Haun Ventures', '["F-Prime Capital", "Slow Ventures", "Spartan Capital", "Lightspeed Venture Partners", "General Catalyst", "Bessemer Venture Partners"]'::jsonb
FROM notalone_companies c WHERE c.company_name = 'Chaos Labs'
AND NOT EXISTS (SELECT 1 FROM notalone_funding_rounds fr WHERE fr.company_id = c.id AND fr.round_type = 'Series A'::round_type);

-- =====================
-- Verify all insertions
-- =====================
SELECT
    c.company_name,
    fr.round_type,
    fr.amount_raised_usd / 1000000 as amount_millions,
    fr.lead_investor,
    fr.round_date
FROM notalone_funding_rounds fr
JOIN notalone_companies c ON fr.company_id = c.id
WHERE c.company_name IN ('Fireblocks', 'Starkware', 'ZenGo', 'Blockaid', 'Certora', 'Braavos', 'Simplex', 'Orbs', 'Coti', 'Fordefi', 'Chaos Labs')
ORDER BY c.company_name, fr.round_date;

-- Summary stats
SELECT
    'New funding rounds' as metric,
    COUNT(*) as count,
    SUM(amount_raised_usd) / 1000000 as total_millions
FROM notalone_funding_rounds fr
JOIN notalone_companies c ON fr.company_id = c.id
WHERE c.company_name IN ('Fireblocks', 'Starkware', 'ZenGo', 'Blockaid', 'Certora', 'Braavos', 'Simplex', 'Orbs', 'Coti', 'Fordefi', 'Chaos Labs');
