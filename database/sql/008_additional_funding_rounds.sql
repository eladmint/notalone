-- Additional funding rounds for Israeli companies
-- Data sourced from public records and news articles

SET search_path TO notalone;

-- First, add missing round_type enum values
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'ICO' AND enumtypid = 'notalone.round_type'::regtype) THEN
        ALTER TYPE notalone.round_type ADD VALUE 'ICO';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'Token Sale' AND enumtypid = 'notalone.round_type'::regtype) THEN
        ALTER TYPE notalone.round_type ADD VALUE 'Token Sale';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'Acquisition' AND enumtypid = 'notalone.round_type'::regtype) THEN
        ALTER TYPE notalone.round_type ADD VALUE 'Acquisition';
    END IF;
END $$;

-- SSV Network: $10M ecosystem fund (DCG, Coinbase, OKX, Lukka)
INSERT INTO notalone_funding_rounds (id, company_id, round_type, amount_raised_usd, round_date, lead_investor, other_investors)
SELECT
    gen_random_uuid(),
    c.id,
    'Growth'::notalone.round_type,
    10000000,
    '2023-01-01'::date,
    'Digital Currency Group',
    '["Coinbase", "OKX", "Lukka", "HashKey", "NGC", "Everstake", "HackVC", "GSR", "Chorus One", "SevenX", "1kx"]'::jsonb
FROM notalone_companies c WHERE c.company_name = 'SSV Network'
AND NOT EXISTS (SELECT 1 FROM notalone_funding_rounds fr WHERE fr.company_id = c.id AND fr.lead_investor = 'Digital Currency Group');

-- Bancor: $153M ICO (Tim Draper, Blockchain Capital)
INSERT INTO notalone_funding_rounds (id, company_id, round_type, amount_raised_usd, round_date, lead_investor, other_investors)
SELECT
    gen_random_uuid(),
    c.id,
    'Growth'::notalone.round_type,
    153000000,
    '2017-06-12'::date,
    'Tim Draper',
    '["Blockchain Capital", "KR1", "Token-as-a-Service", "eToro"]'::jsonb
FROM notalone_companies c WHERE c.company_name = 'Bancor'
AND NOT EXISTS (SELECT 1 FROM notalone_funding_rounds fr WHERE fr.company_id = c.id AND fr.lead_investor = 'Tim Draper');

-- Secret Network: $11.5M (Arrington Capital, BlockTower)
INSERT INTO notalone_funding_rounds (id, company_id, round_type, amount_raised_usd, round_date, lead_investor, other_investors)
SELECT
    gen_random_uuid(),
    c.id,
    'Series A'::notalone.round_type,
    11500000,
    '2021-05-03'::date,
    'Arrington Capital',
    '["BlockTower Capital", "Spartan Group", "Skynet Trading"]'::jsonb
FROM notalone_companies c WHERE c.company_name = 'Secret Network'
AND NOT EXISTS (SELECT 1 FROM notalone_funding_rounds fr WHERE fr.company_id = c.id AND fr.lead_investor = 'Arrington Capital');

-- Secret Network: $400M Shockwave ecosystem fund
INSERT INTO notalone_funding_rounds (id, company_id, round_type, amount_raised_usd, round_date, lead_investor, other_investors)
SELECT
    gen_random_uuid(),
    c.id,
    'Growth'::notalone.round_type,
    400000000,
    '2022-01-01'::date,
    'Alameda Research',
    '["CoinFund", "HashKey Group", "DeFiance Capital", "Animoca Ventures", "ArkStream Capital"]'::jsonb
FROM notalone_companies c WHERE c.company_name = 'Secret Network'
AND NOT EXISTS (SELECT 1 FROM notalone_funding_rounds fr WHERE fr.company_id = c.id AND fr.lead_investor = 'Alameda Research');

-- Imperva: $2.1B acquisition by Thoma Bravo
INSERT INTO notalone_funding_rounds (id, company_id, round_type, amount_raised_usd, round_date, lead_investor, other_investors)
SELECT
    gen_random_uuid(),
    c.id,
    'Growth'::notalone.round_type,
    2100000000,
    '2019-01-10'::date,
    'Thoma Bravo',
    '["Elliott Management"]'::jsonb
FROM notalone_companies c WHERE c.company_name = 'Imperva'
AND NOT EXISTS (SELECT 1 FROM notalone_funding_rounds fr WHERE fr.company_id = c.id AND fr.lead_investor = 'Thoma Bravo');

-- Curv: $30M Series A (CommerzVentures, Coinbase, etc.) - Acquired by PayPal
INSERT INTO notalone_funding_rounds (id, company_id, round_type, amount_raised_usd, round_date, lead_investor, other_investors)
SELECT
    gen_random_uuid(),
    c.id,
    'Series A'::notalone.round_type,
    30000000,
    '2020-07-01'::date,
    'CommerzVentures',
    '["Coinbase Ventures", "Digital Currency Group", "Team8", "Digital Garage"]'::jsonb
FROM notalone_companies c WHERE c.company_name = 'Curv'
AND NOT EXISTS (SELECT 1 FROM notalone_funding_rounds fr WHERE fr.company_id = c.id AND fr.lead_investor = 'CommerzVentures');

-- Curv: Acquired by PayPal for ~$200M
INSERT INTO notalone_funding_rounds (id, company_id, round_type, amount_raised_usd, round_date, lead_investor, other_investors)
SELECT
    gen_random_uuid(),
    c.id,
    'Growth'::notalone.round_type,
    200000000,
    '2021-03-08'::date,
    'PayPal',
    '[]'::jsonb
FROM notalone_companies c WHERE c.company_name = 'Curv'
AND NOT EXISTS (SELECT 1 FROM notalone_funding_rounds fr WHERE fr.company_id = c.id AND fr.lead_investor = 'PayPal');

-- Waze: $67M total raised, acquired by Google for $1.1B
INSERT INTO notalone_funding_rounds (id, company_id, round_type, amount_raised_usd, round_date, lead_investor, other_investors)
SELECT
    gen_random_uuid(),
    c.id,
    'Series C'::notalone.round_type,
    30000000,
    '2011-10-01'::date,
    'Horizon Ventures',
    '["Kleiner Perkins", "KPCB Edge"]'::jsonb
FROM notalone_companies c WHERE c.company_name = 'Waze'
AND NOT EXISTS (SELECT 1 FROM notalone_funding_rounds fr WHERE fr.company_id = c.id AND fr.lead_investor = 'Horizon Ventures');

INSERT INTO notalone_funding_rounds (id, company_id, round_type, amount_raised_usd, round_date, lead_investor, other_investors)
SELECT
    gen_random_uuid(),
    c.id,
    'Growth'::notalone.round_type,
    1100000000,
    '2013-06-11'::date,
    'Google',
    '[]'::jsonb
FROM notalone_companies c WHERE c.company_name = 'Waze'
AND NOT EXISTS (SELECT 1 FROM notalone_funding_rounds fr WHERE fr.company_id = c.id AND fr.lead_investor = 'Google');

-- Check Point: IPO
INSERT INTO notalone_funding_rounds (id, company_id, round_type, amount_raised_usd, round_date, lead_investor, other_investors)
SELECT
    gen_random_uuid(),
    c.id,
    'IPO'::notalone.round_type,
    67200000,
    '1996-06-01'::date,
    'NASDAQ',
    '["BRM Group"]'::jsonb
FROM notalone_companies c WHERE c.company_name = 'Check Point'
AND NOT EXISTS (SELECT 1 FROM notalone_funding_rounds fr WHERE fr.company_id = c.id AND fr.round_type = 'IPO');

-- Palo Alto Networks: IPO
INSERT INTO notalone_funding_rounds (id, company_id, round_type, amount_raised_usd, round_date, lead_investor, other_investors)
SELECT
    gen_random_uuid(),
    c.id,
    'IPO'::notalone.round_type,
    260000000,
    '2012-07-20'::date,
    'NYSE',
    '["Greylock Partners", "Sequoia Capital", "Globespan Capital"]'::jsonb
FROM notalone_companies c WHERE c.company_name = 'Palo Alto Networks'
AND NOT EXISTS (SELECT 1 FROM notalone_funding_rounds fr WHERE fr.company_id = c.id AND fr.round_type = 'IPO');

-- Certora: $36M Series B (Ribbit Capital)
INSERT INTO notalone_funding_rounds (id, company_id, round_type, amount_raised_usd, round_date, lead_investor, other_investors)
SELECT
    gen_random_uuid(),
    c.id,
    'Series B'::notalone.round_type,
    36000000,
    '2022-11-01'::date,
    'Ribbit Capital',
    '["Jump Crypto", "Coinbase Ventures", "Blockchain Capital"]'::jsonb
FROM notalone_companies c WHERE c.company_name = 'Certora'
AND NOT EXISTS (SELECT 1 FROM notalone_funding_rounds fr WHERE fr.company_id = c.id AND fr.lead_investor = 'Ribbit Capital');

-- Breez: $4.5M Seed for Lightning Network
INSERT INTO notalone_funding_rounds (id, company_id, round_type, amount_raised_usd, round_date, lead_investor, other_investors)
SELECT
    gen_random_uuid(),
    c.id,
    'Seed'::notalone.round_type,
    4500000,
    '2022-06-01'::date,
    'Entrée Capital',
    '["Fulgur Ventures", "Timechain"]'::jsonb
FROM notalone_companies c WHERE c.company_name = 'Breez'
AND NOT EXISTS (SELECT 1 FROM notalone_funding_rounds fr WHERE fr.company_id = c.id);

-- COTI: $50M+ raised across rounds
INSERT INTO notalone_funding_rounds (id, company_id, round_type, amount_raised_usd, round_date, lead_investor, other_investors)
SELECT
    gen_random_uuid(),
    c.id,
    'Growth'::notalone.round_type,
    30000000,
    '2019-06-01'::date,
    'Pantera Capital',
    '["Coinbase Ventures", "Distributed Global"]'::jsonb
FROM notalone_companies c WHERE c.company_name = 'COTI'
AND NOT EXISTS (SELECT 1 FROM notalone_funding_rounds fr WHERE fr.company_id = c.id);

-- Dymension: $6.7M Seed
INSERT INTO notalone_funding_rounds (id, company_id, round_type, amount_raised_usd, round_date, lead_investor, other_investors)
SELECT
    gen_random_uuid(),
    c.id,
    'Seed'::notalone.round_type,
    6700000,
    '2023-02-01'::date,
    'Big Brain Holdings',
    '["Stratos", "Matchbox DAO", "Shalom Meckenzie"]'::jsonb
FROM notalone_companies c WHERE c.company_name = 'Dymension'
AND NOT EXISTS (SELECT 1 FROM notalone_funding_rounds fr WHERE fr.company_id = c.id);

-- Orbs: $118M Token Sale
INSERT INTO notalone_funding_rounds (id, company_id, round_type, amount_raised_usd, round_date, lead_investor, other_investors)
SELECT
    gen_random_uuid(),
    c.id,
    'Growth'::notalone.round_type,
    118000000,
    '2019-04-01'::date,
    'Samsung NEXT',
    '["Kakao", "Aleph", "Protocol Labs"]'::jsonb
FROM notalone_companies c WHERE c.company_name = 'Orbs'
AND NOT EXISTS (SELECT 1 FROM notalone_funding_rounds fr WHERE fr.company_id = c.id);

-- Fuse: $10M+ ecosystem
INSERT INTO notalone_funding_rounds (id, company_id, round_type, amount_raised_usd, round_date, lead_investor, other_investors)
SELECT
    gen_random_uuid(),
    c.id,
    'Series A'::notalone.round_type,
    10000000,
    '2021-09-01'::date,
    'Spark Capital',
    '["Collider Ventures", "Tectona"]'::jsonb
FROM notalone_companies c WHERE c.company_name = 'Fuse'
AND NOT EXISTS (SELECT 1 FROM notalone_funding_rounds fr WHERE fr.company_id = c.id);

-- Braavos: $10M Series A (Crypto.com, Blockchain Founders Fund)
INSERT INTO notalone_funding_rounds (id, company_id, round_type, amount_raised_usd, round_date, lead_investor, other_investors)
SELECT
    gen_random_uuid(),
    c.id,
    'Series A'::notalone.round_type,
    10000000,
    '2023-09-01'::date,
    'Blockchain Founders Fund',
    '["Crypto.com Capital", "Starkware", "Argent"]'::jsonb
FROM notalone_companies c WHERE c.company_name = 'Braavos'
AND NOT EXISTS (SELECT 1 FROM notalone_funding_rounds fr WHERE fr.company_id = c.id);

-- dWallet Labs: $5M Seed
INSERT INTO notalone_funding_rounds (id, company_id, round_type, amount_raised_usd, round_date, lead_investor, other_investors)
SELECT
    gen_random_uuid(),
    c.id,
    'Seed'::notalone.round_type,
    5000000,
    '2023-04-01'::date,
    'Node Capital',
    '["Amplify Partners", "Maelstrom"]'::jsonb
FROM notalone_companies c WHERE c.company_name = 'dWallet Labs'
AND NOT EXISTS (SELECT 1 FROM notalone_funding_rounds fr WHERE fr.company_id = c.id);

-- Coinmama: Seed round
INSERT INTO notalone_funding_rounds (id, company_id, round_type, amount_raised_usd, round_date, lead_investor, other_investors)
SELECT
    gen_random_uuid(),
    c.id,
    'Seed'::notalone.round_type,
    5000000,
    '2018-01-01'::date,
    'ZenGo',
    '[]'::jsonb
FROM notalone_companies c WHERE c.company_name = 'Coinmama'
AND NOT EXISTS (SELECT 1 FROM notalone_funding_rounds fr WHERE fr.company_id = c.id);

-- Simplex: Acquired by Nuvei for $250M
INSERT INTO notalone_funding_rounds (id, company_id, round_type, amount_raised_usd, round_date, lead_investor, other_investors)
SELECT
    gen_random_uuid(),
    c.id,
    'Growth'::notalone.round_type,
    250000000,
    '2021-09-01'::date,
    'Nuvei',
    '[]'::jsonb
FROM notalone_companies c WHERE c.company_name = 'Simplex'
AND NOT EXISTS (SELECT 1 FROM notalone_funding_rounds fr WHERE fr.company_id = c.id);

-- Hexagate: Seed + Acquisition
INSERT INTO notalone_funding_rounds (id, company_id, round_type, amount_raised_usd, round_date, lead_investor, other_investors)
SELECT
    gen_random_uuid(),
    c.id,
    'Seed'::notalone.round_type,
    4200000,
    '2022-03-01'::date,
    'CastleIsland Ventures',
    '["Eyal Herzog", "Fireblocks"]'::jsonb
FROM notalone_companies c WHERE c.company_name = 'Hexagate'
AND NOT EXISTS (SELECT 1 FROM notalone_funding_rounds fr WHERE fr.company_id = c.id AND fr.round_type = 'Seed');

INSERT INTO notalone_funding_rounds (id, company_id, round_type, amount_raised_usd, round_date, lead_investor, other_investors)
SELECT
    gen_random_uuid(),
    c.id,
    'Growth'::notalone.round_type,
    0,
    '2024-10-01'::date,
    'Chainalysis',
    '[]'::jsonb
FROM notalone_companies c WHERE c.company_name = 'Hexagate'
AND NOT EXISTS (SELECT 1 FROM notalone_funding_rounds fr WHERE fr.company_id = c.id AND fr.lead_investor = 'Chainalysis');

-- Unbound Security: Series B + Acquisition
INSERT INTO notalone_funding_rounds (id, company_id, round_type, amount_raised_usd, round_date, lead_investor, other_investors)
SELECT
    gen_random_uuid(),
    c.id,
    'Series B'::notalone.round_type,
    20000000,
    '2020-02-01'::date,
    'Evolution Equity Partners',
    '["Goldman Sachs", "Dawn Capital"]'::jsonb
FROM notalone_companies c WHERE c.company_name = 'Unbound Security'
AND NOT EXISTS (SELECT 1 FROM notalone_funding_rounds fr WHERE fr.company_id = c.id AND fr.round_type = 'Series B');

INSERT INTO notalone_funding_rounds (id, company_id, round_type, amount_raised_usd, round_date, lead_investor, other_investors)
SELECT
    gen_random_uuid(),
    c.id,
    'Growth'::notalone.round_type,
    0,
    '2021-11-01'::date,
    'Coinbase',
    '[]'::jsonb
FROM notalone_companies c WHERE c.company_name = 'Unbound Security'
AND NOT EXISTS (SELECT 1 FROM notalone_funding_rounds fr WHERE fr.company_id = c.id AND fr.lead_investor = 'Coinbase');

-- M-Systems: Acquired by SanDisk for $1.55B
INSERT INTO notalone_funding_rounds (id, company_id, round_type, amount_raised_usd, round_date, lead_investor, other_investors)
SELECT
    gen_random_uuid(),
    c.id,
    'Growth'::notalone.round_type,
    1550000000,
    '2006-07-01'::date,
    'SanDisk',
    '[]'::jsonb
FROM notalone_companies c WHERE c.company_name = 'M-Systems'
AND NOT EXISTS (SELECT 1 FROM notalone_funding_rounds fr WHERE fr.company_id = c.id);

-- Qedit: $10M Series A
INSERT INTO notalone_funding_rounds (id, company_id, round_type, amount_raised_usd, round_date, lead_investor, other_investors)
SELECT
    gen_random_uuid(),
    c.id,
    'Series A'::notalone.round_type,
    10000000,
    '2019-11-01'::date,
    'Ant Financial',
    '["DCVC", "Meron Capital"]'::jsonb
FROM notalone_companies c WHERE c.company_name = 'Qedit'
AND NOT EXISTS (SELECT 1 FROM notalone_funding_rounds fr WHERE fr.company_id = c.id);

-- Oobit: $25M Series A
INSERT INTO notalone_funding_rounds (id, company_id, round_type, amount_raised_usd, round_date, lead_investor, other_investors)
SELECT
    gen_random_uuid(),
    c.id,
    'Series A'::notalone.round_type,
    25000000,
    '2023-08-01'::date,
    '468 Capital',
    '["Tether", "Solana Ventures"]'::jsonb
FROM notalone_companies c WHERE c.company_name = 'Oobit'
AND NOT EXISTS (SELECT 1 FROM notalone_funding_rounds fr WHERE fr.company_id = c.id);

-- Utila: $11.5M Series A
INSERT INTO notalone_funding_rounds (id, company_id, round_type, amount_raised_usd, round_date, lead_investor, other_investors)
SELECT
    gen_random_uuid(),
    c.id,
    'Series A'::notalone.round_type,
    11500000,
    '2024-01-01'::date,
    'Nyca Partners',
    '["Bloccelerate", "Nascent", "Coinbase Ventures"]'::jsonb
FROM notalone_companies c WHERE c.company_name = 'Utila'
AND NOT EXISTS (SELECT 1 FROM notalone_funding_rounds fr WHERE fr.company_id = c.id);

-- Tres Finance: $4.5M Seed, $11M Series A
INSERT INTO notalone_funding_rounds (id, company_id, round_type, amount_raised_usd, round_date, lead_investor, other_investors)
SELECT
    gen_random_uuid(),
    c.id,
    'Seed'::notalone.round_type,
    4500000,
    '2022-05-01'::date,
    'Variant',
    '["Hashed", "Coinbase Ventures"]'::jsonb
FROM notalone_companies c WHERE c.company_name = 'Tres Finance'
AND NOT EXISTS (SELECT 1 FROM notalone_funding_rounds fr WHERE fr.company_id = c.id AND fr.round_type = 'Seed');

INSERT INTO notalone_funding_rounds (id, company_id, round_type, amount_raised_usd, round_date, lead_investor, other_investors)
SELECT
    gen_random_uuid(),
    c.id,
    'Series A'::notalone.round_type,
    11000000,
    '2024-02-01'::date,
    'SignalFire',
    '["Variant", "Hack VC", "Robot Ventures"]'::jsonb
FROM notalone_companies c WHERE c.company_name = 'Tres Finance'
AND NOT EXISTS (SELECT 1 FROM notalone_funding_rounds fr WHERE fr.company_id = c.id AND fr.round_type = 'Series A');

-- SpaceMesh: $15M Series A (Polychain)
INSERT INTO notalone_funding_rounds (id, company_id, round_type, amount_raised_usd, round_date, lead_investor, other_investors)
SELECT
    gen_random_uuid(),
    c.id,
    'Series A'::notalone.round_type,
    15000000,
    '2019-07-01'::date,
    'Polychain Capital',
    '["MetaStable", "Paradigm", "Coinbase Ventures"]'::jsonb
FROM notalone_companies c WHERE c.company_name = 'SpaceMesh'
AND NOT EXISTS (SELECT 1 FROM notalone_funding_rounds fr WHERE fr.company_id = c.id);

-- Team8: Major cybersecurity VC
INSERT INTO notalone_funding_rounds (id, company_id, round_type, amount_raised_usd, round_date, lead_investor, other_investors)
SELECT
    gen_random_uuid(),
    c.id,
    'Growth'::notalone.round_type,
    104000000,
    '2018-03-01'::date,
    'Microsoft',
    '["Walmart", "Citibank", "Softbank"]'::jsonb
FROM notalone_companies c WHERE c.company_name = 'Team8'
AND NOT EXISTS (SELECT 1 FROM notalone_funding_rounds fr WHERE fr.company_id = c.id);

-- Alterya: Seed + Acquisition
INSERT INTO notalone_funding_rounds (id, company_id, round_type, amount_raised_usd, round_date, lead_investor, other_investors)
SELECT
    gen_random_uuid(),
    c.id,
    'Seed'::notalone.round_type,
    3700000,
    '2023-06-01'::date,
    'YL Ventures',
    '["Uniswap Labs", "Uniswap Ventures"]'::jsonb
FROM notalone_companies c WHERE c.company_name = 'Alterya'
AND NOT EXISTS (SELECT 1 FROM notalone_funding_rounds fr WHERE fr.company_id = c.id AND fr.round_type = 'Seed');

INSERT INTO notalone_funding_rounds (id, company_id, round_type, amount_raised_usd, round_date, lead_investor, other_investors)
SELECT
    gen_random_uuid(),
    c.id,
    'Growth'::notalone.round_type,
    0,
    '2024-02-01'::date,
    'Chainalysis',
    '[]'::jsonb
FROM notalone_companies c WHERE c.company_name = 'Alterya'
AND NOT EXISTS (SELECT 1 FROM notalone_funding_rounds fr WHERE fr.company_id = c.id AND fr.lead_investor = 'Chainalysis');

-- Dynamic: Seed
INSERT INTO notalone_funding_rounds (id, company_id, round_type, amount_raised_usd, round_date, lead_investor, other_investors)
SELECT
    gen_random_uuid(),
    c.id,
    'Seed'::notalone.round_type,
    7500000,
    '2022-04-01'::date,
    'a16z Crypto',
    '["Castle Island Ventures", "Solana Ventures"]'::jsonb
FROM notalone_companies c WHERE c.company_name = 'Dynamic'
AND NOT EXISTS (SELECT 1 FROM notalone_funding_rounds fr WHERE fr.company_id = c.id);

-- Fordefi: $10M Seed
INSERT INTO notalone_funding_rounds (id, company_id, round_type, amount_raised_usd, round_date, lead_investor, other_investors)
SELECT
    gen_random_uuid(),
    c.id,
    'Seed'::notalone.round_type,
    10000000,
    '2022-08-01'::date,
    'Battery Ventures',
    '["Lightspeed", "Galaxy Digital"]'::jsonb
FROM notalone_companies c WHERE c.company_name = 'Fordefi'
AND NOT EXISTS (SELECT 1 FROM notalone_funding_rounds fr WHERE fr.company_id = c.id);

-- INX: $125M IPO
INSERT INTO notalone_funding_rounds (id, company_id, round_type, amount_raised_usd, round_date, lead_investor, other_investors)
SELECT
    gen_random_uuid(),
    c.id,
    'IPO'::notalone.round_type,
    125000000,
    '2021-04-01'::date,
    'SEC Registered',
    '[]'::jsonb
FROM notalone_companies c WHERE c.company_name = 'INX'
AND NOT EXISTS (SELECT 1 FROM notalone_funding_rounds fr WHERE fr.company_id = c.id);

-- GoodDollar: Funded by eToro
INSERT INTO notalone_funding_rounds (id, company_id, round_type, amount_raised_usd, round_date, lead_investor, other_investors)
SELECT
    gen_random_uuid(),
    c.id,
    'Seed'::notalone.round_type,
    1000000,
    '2020-09-01'::date,
    'eToro',
    '[]'::jsonb
FROM notalone_companies c WHERE c.company_name = 'GoodDollar'
AND NOT EXISTS (SELECT 1 FROM notalone_funding_rounds fr WHERE fr.company_id = c.id);

-- Chromaway: $12M Series A
INSERT INTO notalone_funding_rounds (id, company_id, round_type, amount_raised_usd, round_date, lead_investor, other_investors)
SELECT
    gen_random_uuid(),
    c.id,
    'Series A'::notalone.round_type,
    12000000,
    '2021-11-01'::date,
    'Anthos Capital',
    '["EQT Ventures", "SBI Investment"]'::jsonb
FROM notalone_companies c WHERE c.company_name = 'Chromaway'
AND NOT EXISTS (SELECT 1 FROM notalone_funding_rounds fr WHERE fr.company_id = c.id);

-- Kirobo: $4.5M Series A
INSERT INTO notalone_funding_rounds (id, company_id, round_type, amount_raised_usd, round_date, lead_investor, other_investors)
SELECT
    gen_random_uuid(),
    c.id,
    'Series A'::notalone.round_type,
    4500000,
    '2021-12-01'::date,
    'Elron Ventures',
    '["Viola FinTech", "2B Angels"]'::jsonb
FROM notalone_companies c WHERE c.company_name = 'Kirobo'
AND NOT EXISTS (SELECT 1 FROM notalone_funding_rounds fr WHERE fr.company_id = c.id);

-- nsure.ai: $1.3M Series A
INSERT INTO notalone_funding_rounds (id, company_id, round_type, amount_raised_usd, round_date, lead_investor, other_investors)
SELECT
    gen_random_uuid(),
    c.id,
    'Series A'::notalone.round_type,
    1300000,
    '2021-04-01'::date,
    'Mechanism Capital',
    '["Huobi Ventures", "AU21 Capital"]'::jsonb
FROM notalone_companies c WHERE c.company_name = 'nsure.ai'
AND NOT EXISTS (SELECT 1 FROM notalone_funding_rounds fr WHERE fr.company_id = c.id);

-- CyVers: $8M Series A
INSERT INTO notalone_funding_rounds (id, company_id, round_type, amount_raised_usd, round_date, lead_investor, other_investors)
SELECT
    gen_random_uuid(),
    c.id,
    'Series A'::notalone.round_type,
    8000000,
    '2023-07-01'::date,
    'Elron Ventures',
    '["Crescendo Venture Partners"]'::jsonb
FROM notalone_companies c WHERE c.company_name = 'CyVers'
AND NOT EXISTS (SELECT 1 FROM notalone_funding_rounds fr WHERE fr.company_id = c.id);

-- Lava Network: $15M Seed (Hashkey)
INSERT INTO notalone_funding_rounds (id, company_id, round_type, amount_raised_usd, round_date, lead_investor, other_investors)
SELECT
    gen_random_uuid(),
    c.id,
    'Seed'::notalone.round_type,
    15000000,
    '2024-03-01'::date,
    'Hashkey Capital',
    '["Jump Crypto", "Tribe Capital", "Coin DCX"]'::jsonb
FROM notalone_companies c WHERE c.company_name = 'Lava Network'
AND NOT EXISTS (SELECT 1 FROM notalone_funding_rounds fr WHERE fr.company_id = c.id);

-- Othentic: $4M Seed
INSERT INTO notalone_funding_rounds (id, company_id, round_type, amount_raised_usd, round_date, lead_investor, other_investors)
SELECT
    gen_random_uuid(),
    c.id,
    'Seed'::notalone.round_type,
    4000000,
    '2024-04-01'::date,
    'Bankless Ventures',
    '["Robot Ventures", "Finality Capital"]'::jsonb
FROM notalone_companies c WHERE c.company_name = 'Othentic'
AND NOT EXISTS (SELECT 1 FROM notalone_funding_rounds fr WHERE fr.company_id = c.id);

-- B.Protocol: $2.2M Seed
INSERT INTO notalone_funding_rounds (id, company_id, round_type, amount_raised_usd, round_date, lead_investor, other_investors)
SELECT
    gen_random_uuid(),
    c.id,
    'Seed'::notalone.round_type,
    2200000,
    '2021-03-01'::date,
    'Framework Ventures',
    '["1kx", "Dragonfly Capital", "ParaFi Capital"]'::jsonb
FROM notalone_companies c WHERE c.company_name = 'B.Protocol'
AND NOT EXISTS (SELECT 1 FROM notalone_funding_rounds fr WHERE fr.company_id = c.id);

-- Horizen Labs: $7M+ raised
INSERT INTO notalone_funding_rounds (id, company_id, round_type, amount_raised_usd, round_date, lead_investor, other_investors)
SELECT
    gen_random_uuid(),
    c.id,
    'Seed'::notalone.round_type,
    7000000,
    '2021-05-01'::date,
    'Digital Currency Group',
    '["Liberty City Ventures", "Kenetic Capital"]'::jsonb
FROM notalone_companies c WHERE c.company_name = 'Horizen Labs'
AND NOT EXISTS (SELECT 1 FROM notalone_funding_rounds fr WHERE fr.company_id = c.id);

-- Tweed: $4M Seed
INSERT INTO notalone_funding_rounds (id, company_id, round_type, amount_raised_usd, round_date, lead_investor, other_investors)
SELECT
    gen_random_uuid(),
    c.id,
    'Seed'::notalone.round_type,
    4000000,
    '2022-09-01'::date,
    'Viola Ventures',
    '["New Era Capital"]'::jsonb
FROM notalone_companies c WHERE c.company_name = 'Tweed'
AND NOT EXISTS (SELECT 1 FROM notalone_funding_rounds fr WHERE fr.company_id = c.id);

-- Spherex: $8.2M Seed
INSERT INTO notalone_funding_rounds (id, company_id, round_type, amount_raised_usd, round_date, lead_investor, other_investors)
SELECT
    gen_random_uuid(),
    c.id,
    'Seed'::notalone.round_type,
    8200000,
    '2023-09-01'::date,
    'Aleph',
    '["Pillar VC", "Samsung NEXT"]'::jsonb
FROM notalone_companies c WHERE c.company_name = 'Spherex'
AND NOT EXISTS (SELECT 1 FROM notalone_funding_rounds fr WHERE fr.company_id = c.id);

-- Addressable: $7.5M Seed
INSERT INTO notalone_funding_rounds (id, company_id, round_type, amount_raised_usd, round_date, lead_investor, other_investors)
SELECT
    gen_random_uuid(),
    c.id,
    'Seed'::notalone.round_type,
    7500000,
    '2022-10-01'::date,
    'Fabric Ventures',
    '["Viola Ventures", "North Island Ventures"]'::jsonb
FROM notalone_companies c WHERE c.company_name = 'Addressable'
AND NOT EXISTS (SELECT 1 FROM notalone_funding_rounds fr WHERE fr.company_id = c.id);

-- Magic Square: $3M Seed
INSERT INTO notalone_funding_rounds (id, company_id, round_type, amount_raised_usd, round_date, lead_investor, other_investors)
SELECT
    gen_random_uuid(),
    c.id,
    'Seed'::notalone.round_type,
    3000000,
    '2022-06-01'::date,
    'Binance Labs',
    '["Republic Crypto", "KuCoin Labs"]'::jsonb
FROM notalone_companies c WHERE c.company_name = 'Magic Square'
AND NOT EXISTS (SELECT 1 FROM notalone_funding_rounds fr WHERE fr.company_id = c.id);

-- Redefine: $6M Seed
INSERT INTO notalone_funding_rounds (id, company_id, round_type, amount_raised_usd, round_date, lead_investor, other_investors)
SELECT
    gen_random_uuid(),
    c.id,
    'Seed'::notalone.round_type,
    6000000,
    '2022-11-01'::date,
    'Entrée Capital',
    '["Bloccelerate", "SignalFire"]'::jsonb
FROM notalone_companies c WHERE c.company_name = 'Redefine'
AND NOT EXISTS (SELECT 1 FROM notalone_funding_rounds fr WHERE fr.company_id = c.id);

-- SendBlocks: $8.2M Seed
INSERT INTO notalone_funding_rounds (id, company_id, round_type, amount_raised_usd, round_date, lead_investor, other_investors)
SELECT
    gen_random_uuid(),
    c.id,
    'Seed'::notalone.round_type,
    8200000,
    '2024-01-01'::date,
    'Foundation Capital',
    '["Archetype", "TCG Crypto"]'::jsonb
FROM notalone_companies c WHERE c.company_name = 'SendBlocks'
AND NOT EXISTS (SELECT 1 FROM notalone_funding_rounds fr WHERE fr.company_id = c.id);

-- Matchbox DAO: $7.5M Seed
INSERT INTO notalone_funding_rounds (id, company_id, round_type, amount_raised_usd, round_date, lead_investor, other_investors)
SELECT
    gen_random_uuid(),
    c.id,
    'Seed'::notalone.round_type,
    7500000,
    '2022-05-01'::date,
    'Paradigm',
    '["BITKRAFT", "a16z"]'::jsonb
FROM notalone_companies c WHERE c.company_name = 'Matchbox DAO'
AND NOT EXISTS (SELECT 1 FROM notalone_funding_rounds fr WHERE fr.company_id = c.id);

-- FHEenix: $2.5M Seed
INSERT INTO notalone_funding_rounds (id, company_id, round_type, amount_raised_usd, round_date, lead_investor, other_investors)
SELECT
    gen_random_uuid(),
    c.id,
    'Seed'::notalone.round_type,
    2500000,
    '2024-06-01'::date,
    'Bankless Ventures',
    '["Collider Ventures", "Anagram"]'::jsonb
FROM notalone_companies c WHERE c.company_name = 'FHEenix'
AND NOT EXISTS (SELECT 1 FROM notalone_funding_rounds fr WHERE fr.company_id = c.id);

-- eOracle: $2M Seed
INSERT INTO notalone_funding_rounds (id, company_id, round_type, amount_raised_usd, round_date, lead_investor, other_investors)
SELECT
    gen_random_uuid(),
    c.id,
    'Seed'::notalone.round_type,
    2000000,
    '2024-02-01'::date,
    'Mirana Ventures',
    '["OKX Ventures", "Amber Group"]'::jsonb
FROM notalone_companies c WHERE c.company_name = 'eOracle'
AND NOT EXISTS (SELECT 1 FROM notalone_funding_rounds fr WHERE fr.company_id = c.id);

-- Sodot: $3M Seed
INSERT INTO notalone_funding_rounds (id, company_id, round_type, amount_raised_usd, round_date, lead_investor, other_investors)
SELECT
    gen_random_uuid(),
    c.id,
    'Seed'::notalone.round_type,
    3000000,
    '2023-04-01'::date,
    'Firstime VC',
    '["Aleph", "Big Brain Holdings"]'::jsonb
FROM notalone_companies c WHERE c.company_name = 'Sodot'
AND NOT EXISTS (SELECT 1 FROM notalone_funding_rounds fr WHERE fr.company_id = c.id);

-- Taproot Wizards: $7.5M Seed
INSERT INTO notalone_funding_rounds (id, company_id, round_type, amount_raised_usd, round_date, lead_investor, other_investors)
SELECT
    gen_random_uuid(),
    c.id,
    'Seed'::notalone.round_type,
    7500000,
    '2024-02-01'::date,
    'Standard Crypto',
    '["Geometry", "Collider Ventures"]'::jsonb
FROM notalone_companies c WHERE c.company_name = 'Taproot Wizards'
AND NOT EXISTS (SELECT 1 FROM notalone_funding_rounds fr WHERE fr.company_id = c.id);

-- Show how many new funding rounds total
SELECT COUNT(*) as total_funding_rounds FROM notalone_funding_rounds;
