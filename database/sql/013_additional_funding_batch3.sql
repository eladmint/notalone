-- Additional funding rounds - Batch 3
-- Generated: 2026-01-12
-- Companies: Secret Network, Bancor, Lava Network, Utila, Dynamic

SET search_path TO notalone;

-- =====================
-- SECRET NETWORK - $400M ecosystem fund
-- =====================
INSERT INTO notalone_funding_rounds (id, company_id, round_type, amount_raised_usd, round_date, lead_investor, other_investors)
SELECT gen_random_uuid(), c.id, 'Growth'::round_type, 400000000, '2022-01-18'::date,
    'SCRT Labs', '["Arrington Capital", "BlockTower Capital", "Alameda Research", "CoinFund", "Spartan Group", "DeFiance Capital", "Hashed"]'::jsonb
FROM notalone_companies c WHERE c.company_name = 'Secret Network'
AND NOT EXISTS (SELECT 1 FROM notalone_funding_rounds fr WHERE fr.company_id = c.id AND fr.round_type = 'Growth'::round_type);

-- =====================
-- BANCOR - $153M ICO (largest at the time)
-- =====================
INSERT INTO notalone_funding_rounds (id, company_id, round_type, amount_raised_usd, round_date, lead_investor, other_investors)
SELECT gen_random_uuid(), c.id, 'ICO'::round_type, 153000000, '2017-06-12'::date,
    NULL, '["Tim Draper", "Blockchain Capital", "Viola FinTech"]'::jsonb
FROM notalone_companies c WHERE c.company_name = 'Bancor'
AND NOT EXISTS (SELECT 1 FROM notalone_funding_rounds fr WHERE fr.company_id = c.id AND fr.round_type = 'ICO'::round_type);

-- =====================
-- LAVA NETWORK - $26M total ($15M seed + $11M extension)
-- =====================
-- Seed - February 2024 ($15M)
INSERT INTO notalone_funding_rounds (id, company_id, round_type, amount_raised_usd, round_date, lead_investor, other_investors)
SELECT gen_random_uuid(), c.id, 'Seed'::round_type, 15000000, '2024-02-20'::date,
    'Tribe Capital', '["Jump Crypto", "HashKey Capital", "Alliance DAO", "Node Capital"]'::jsonb
FROM notalone_companies c WHERE c.company_name = 'Lava Network'
AND NOT EXISTS (SELECT 1 FROM notalone_funding_rounds fr WHERE fr.company_id = c.id AND fr.round_type = 'Seed'::round_type);

-- Extension - May 2024 ($11M)
INSERT INTO notalone_funding_rounds (id, company_id, round_type, amount_raised_usd, round_date, lead_investor, other_investors)
SELECT gen_random_uuid(), c.id, 'Bridge'::round_type, 11000000, '2024-05-01'::date,
    'Animoca Brands', '["Gate.io", "GSR Markets", "OKX Ventures"]'::jsonb
FROM notalone_companies c WHERE c.company_name = 'Lava Network'
AND NOT EXISTS (SELECT 1 FROM notalone_funding_rounds fr WHERE fr.company_id = c.id AND fr.round_type = 'Bridge'::round_type);

-- =====================
-- UTILA - $51.5M total (MPC wallet infrastructure)
-- =====================
-- Seed - March 2024 ($11.5M)
INSERT INTO notalone_funding_rounds (id, company_id, round_type, amount_raised_usd, round_date, lead_investor, other_investors)
SELECT gen_random_uuid(), c.id, 'Seed'::round_type, 11500000, '2024-03-12'::date,
    'Distributed Global', '["Boldstart Ventures", "Kraken Ventures", "Alumni Ventures"]'::jsonb
FROM notalone_companies c WHERE c.company_name = 'Utila'
AND NOT EXISTS (SELECT 1 FROM notalone_funding_rounds fr WHERE fr.company_id = c.id AND fr.round_type = 'Seed'::round_type);

-- Series A - September 2024 ($18M)
INSERT INTO notalone_funding_rounds (id, company_id, round_type, amount_raised_usd, round_date, lead_investor, other_investors)
SELECT gen_random_uuid(), c.id, 'Series A'::round_type, 18000000, '2024-09-17'::date,
    'Nyca Partners', '["Citi Ventures", "Distributed Global", "Susquehanna"]'::jsonb
FROM notalone_companies c WHERE c.company_name = 'Utila'
AND NOT EXISTS (SELECT 1 FROM notalone_funding_rounds fr WHERE fr.company_id = c.id AND fr.round_type = 'Series A'::round_type);

-- Series A Extension - December 2024 ($22M)
INSERT INTO notalone_funding_rounds (id, company_id, round_type, amount_raised_usd, round_date, lead_investor, other_investors)
SELECT gen_random_uuid(), c.id, 'Bridge'::round_type, 22000000, '2024-12-10'::date,
    'Nyca Partners', '["Citi Ventures"]'::jsonb
FROM notalone_companies c WHERE c.company_name = 'Utila'
AND NOT EXISTS (SELECT 1 FROM notalone_funding_rounds fr WHERE fr.company_id = c.id AND fr.round_type = 'Bridge'::round_type);

-- =====================
-- DYNAMIC - $21M total (acquired by Fireblocks for $90M)
-- =====================
-- Seed - December 2022 ($7.5M)
INSERT INTO notalone_funding_rounds (id, company_id, round_type, amount_raised_usd, round_date, lead_investor, other_investors)
SELECT gen_random_uuid(), c.id, 'Seed'::round_type, 7500000, '2022-12-07'::date,
    'a16z crypto', '["Castle Island Ventures", "Solana Ventures", "Circle Ventures", "Breyer Capital"]'::jsonb
FROM notalone_companies c WHERE c.company_name = 'Dynamic'
AND NOT EXISTS (SELECT 1 FROM notalone_funding_rounds fr WHERE fr.company_id = c.id AND fr.round_type = 'Seed'::round_type);

-- Series A - September 2024 ($13.5M)
INSERT INTO notalone_funding_rounds (id, company_id, round_type, amount_raised_usd, round_date, lead_investor, other_investors)
SELECT gen_random_uuid(), c.id, 'Series A'::round_type, 13500000, '2024-09-10'::date,
    'a16z crypto', '["Union Square Ventures", "Castle Island Ventures"]'::jsonb
FROM notalone_companies c WHERE c.company_name = 'Dynamic'
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
WHERE c.company_name IN ('Secret Network', 'Bancor', 'Lava Network', 'Utila', 'Dynamic')
ORDER BY c.company_name, fr.round_date;

-- Network stats after import
SELECT
    COUNT(*) as total_edges,
    COUNT(DISTINCT source) as unique_sources
FROM v_network_graph_full;
