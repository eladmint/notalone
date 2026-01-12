




Textile: Programmable Private Credit

Benoit Nolens, Tomer Bariach
May 2025




About This Paper
This is not a traditional white paper. It’s an early look at the design principles behind Textile, a programmable credit infrastructure for reputation-driven lending. While the architecture is live and evolving, this document is meant as a working blueprint: part vision, part spec, part invitation. We’re sharing it early to align contributors, attract feedback, and accelerate what’s already happening on-chain.
Abstract 
A fully programmable credit system allows capital to flow passively from lenders to borrowers, without manual underwriting process of each borrower by each lender. 
Tokenization, and DeFi infrastructure provide part of the solution, but without data from the real world, the benefits are lost. 
We propose a solution, using 2 layer 
Financial layer - DeFi existing tools 
AMM - for secondary markets
Lending markets - to take loans against private credit positions
Vaults - to create baskets and indexes 
Data layer - Oracle system 
Translation of the underlying data of the assets, standardizing it, and writing on chain 
Introduction 
Credit solutions in emerging markets suffer from a huge shortage, as it mainly runs on private credit relays. 
Private credit in developed markets enjoys a unique situation - it has the borrowers, capital needed, and the data needed all under a single financial system and a single regulatory system, allowing its debt fund to fill the gap. 
Markets that are not the US, need to look for the capital outside, for capital allocators the overhead of underwriting different credit positions in different markets creates a broken supply chain of credit. 
A global decentralized credit market unifies all assets under a single financial infrastructure and standardized data reporting framework, making global participation and underwriting simpler and more accessible.
But it also creates a new layer of assets - Programmable credit. 
one can create a vault that buys any debt token that is - energy backed, Senior pool, above 50m Assets under management, and 11% return. 
Another can make a vault that buys only debt tokens who have consistently returned 15% for over 2 years, and has a TVL of $250m. 
Or even give loans against the top 25 performing vaults in Textile. 
These new rails of capital can create new capital efficiency in private credit markets. 
 

Granular markets - Borrowers & Debt token
Borrowers are alternative credit companies looking to borrow money for their loan books. Borrowers issue & sell Debt tokens in return for capital, each token is attached with characteristics, minimum stake size, max pool size, interest payment intervals and more. 

Revolving credit - capital life cycle 
All origination pools offer a flexible credit arrangement where capital providers allocate capital to an originator without a fixed maturity date.  Revolving credit is particularly well-suited to originators who manage short-duration, high-turnover lending operations and need continuous, flexible access to working capital (e.g., microfinance, BNPL, invoice-based, and remittance-backed lending).
Revolving credit is the first type of credit pool Textile supports, and will expand to others in the future.
One of the biggest challenges credit companies face today is capital drag — a situation where one side (either the lender or the borrower) ends up paying for idle capital. Textile proposes a different solution to this problem by leveraging its life cycle.
Staked yet Undrawn Capital - Capital that a liquidity provider (LP) has deposited but has not yet been drawn by the borrower.

Borrowers can draw this capital at any time.
To minimize capital drag, undrawn capital may be staked into low-risk DeFi protocols or RWA strategies (e.g., T-bills).
Borrowers pays a minimal interest on that capital of 2%
That way liquidity providers earn the DeFi yield + 2% paid by the originator. 
 Drawn Principal- Once the borrower draws the capital, it becomes working capital for their lending activities - the borrower pays the full interest.
The interest paid is calculated as compounded per second. 
If the borrower wishes he can repay the capital to the pool, and go back to paying AAVE + 2% on the capital. 
Withdrawal - The capital provider has the right to withdraw their capital once per year 
Interest payment & Token price 
Borrowers pay interest back to the pool, the interest raises the tokens price & goes immediately in operative capital flow. 
Capital providers who are not interested in appreciating assets and looking for capital flow, can lock their tokens and receive the interest directly, in the back the pro rata tokens will be redeemed from the pool.  
Deal manager 
Companies can choose to add a deal manager to their pools. If a company chose to add, the deal manager plays a central role in structuring, marketing, and handling the collateral. Here’s a breakdown of their responsibilities:
The deal manager helps the company decide on the key terms of the pool: currency, size of the issue, and covenants.
Pricing: The underwriter uses market data, comparable bonds, and investor feedback to set the yield spread and offering price.
Deal lead - many times the deal manager will also hold debt tokens.
Any changes the borrower wishes to do to the terms must be approved by the deal manager first. 



DeFi - The financial infrastructure
By issuing a Debt token per pool, Textile enables immediate composability with existing DeFi solutions. However, composability alone is not enough, most existing DeFi protocols are designed for high-volume, liquid assets. Textile adapts these solutions to meet the specific needs of the private credit space, addressing critical challenges such as secondary markets, baskets, and programmable investing.
Secondary market 
Understanding Existing Liquidity Solutions
To understand Textile’s approach and liquidity model, it’s important to understand how liquidity solutions generally work.
Traditional liquidity solutions are built on top of market makers, entities that provide liquidity to both sides of the market so participants can enter or exit specific positions. However, once market makers commit their capital, it remains locked to serve those positions.
This model works in liquid markets, but private credit markets are different.
What’s Different About Private Credit Markets
Primary markets remain active: In private credit, lenders can ask to redeem their  principal within a defined period (e.g., X months).


Secondary markets are one-sided: Most activity comes from lenders seeking to sell their positions early, rather than buyers entering at fair value.


Low volumes and high slippage: Private credit secondary markets typically see very low transaction volumes, which results in large price swings.


Because of these dynamics, market makers tend to avoid private credit altogether.


Textile’s Liquidity Solution
Textile introduces a new model designed specifically for private credit:
Curator Vaults: A Curator opens a liquidity pool in a stablecoin.


Capital staking: Any one can stake capital into the pool is used to provide secondary market liquidity for selected debt pools.


Token selection: The Curator chooses which Debt tokens the pool will support.


Duration-based pricing: The Curator sets the duration risk for each pool on a monthly basis, which defines the buy price in the secondary market.


Example: Debt token X has a monthly duration risk of 2%, and its next redemption is in 4 months.


A lender who needs liquidity now can sell Debt token X to the pool at an 8% discount (2% × 4 months).


The Vault immediately submits the token for redemption on the primary market.


While this mechanism resembles a timed order book, there is one critical difference: the Curator can manage multiple Debt tokens within a single Vault, creating diversified secondary market liquidity, and using the same liquidity for multiple assets.
As a result, multiple liquidity providers can contribute to a Vault that supports multiple debt pools, making the private credit secondary market more efficient, scalable, and resilient.
For example, imagine a Vault that supports five pools, each with a $1M TVL. The Vault itself holds $500K of liquidity, which can be accessed by token holders from any of the supported pools. Importantly, Curators can apply tiered pricing depending on liquidity depth. For instance, the first $100K might be available at a 2% monthly discount rate, while a larger conversion—say $200K—could be priced at 3%, and so forth. This flexible structure allows Curators to manage risk while providing transparent and efficient access to liquidity.
Baskets and programmable credit  
While access to real-time data makes participation more transparent and informed, being a capital provider is not a passive position—they actively choose which borrowers to support, monitor live performance signals, and retain the right to withdraw capital based on predefined terms.
This creates a challenge, as Textile’s goal is to connect capital with businesses, this is where curators and vaults come into play
Curators are credit experts who create and manage baskets. They pool capital from passive LPs, select borrowers, and oversee performance. Their role is to deliver risk-adjusted returns while maintaining transparency and trust with LPs.
Curators may charge a performance fee, deducted from the interest earned by the vault, in exchange for managing capital allocation, monitoring originators, and maintaining vault performance. This aligns incentives: curators earn more when they manage risk effectively and generate steady returns for LPs.
Unlike debt pools, vaults do not commit to a fixed interest rate. Each vault holds a basket of debt tokens and earns a blended yield based on the performance of the selected credit facilities. This enables passive capital allocation for capital providers, who rely on curators to manage originator selection, risk, and yield optimization.
One might ask what’s the difference between a basket and simply lending the the capital to the entity, beside the fact that vaults are represented by a token which is composable with DeFi, Vaults are limited in the actions that they can take, once a Vault declares its strategy - it’s written as an onchain role, the vault manager may perform actions within these rules. 
I.e Invest only in Senior pools with 2 years of 15% + interest rate, once the vault is deployed the vault is limited to its own roles. 
Another option is a programmable basket. In this model, the Curator defines a set of rules that automatically govern allocation. For example, a Curator could create an index of energy companies and allocate capital only to those with at least two years of consistent repayment history. Allocations within the basket would then be weighted by each company’s TVL relative to the total TVL of all qualifying energy companies. This rule-based approach allows Curators to design systematic, transparent strategies while still leveraging on-chain composability.


The Lending Graph 
Each participant in Textile is a node in the network, and capital flows between them as edges. LPs can allocate funds directly to origination pools or indirectly through vaults managed by curators. Vaults, in turn, can allocate capital to one or more origination pools based on their capital allocation strategy. Origination pools then fund borrowers.
This layered structure gives LPs flexibility: more control and risk if they engage directly, or more convenience and diversification if they delegate to a curator.
Furthermore, these same mechanics incentivize curators to actively bring both originators and senior capital providers into the protocol. The more loans they issue and the more capital providers back them, the more revenue they generate.
This is crucial—it establishes a strong incentive mechanism for key participants in the network to both perform well and attract new participants to the protocol, even before introducing a native token.

Verifiable Credit Data Infrastructure on Chain
While financial infrastructure is crucial for the creation of programmable credit, what’s actually being “programmed” is not the assets - but the data behind the assets - similarly you don’t buy the S&P500, that’s a programmed index, you can buy funds that mimic that behavior of the index.  
Textile attach each pool with a schema of data the borrower can report to, the borrower can choose to report from its own systems or from a third party validating the data. 
Role of schemas and reporting
To enable this, every credit pool is attached to a schema of required data fields. This schema defines how performance, risk, and structural details must be reported in a common language. Borrowers or issuers then have flexibility in how they meet this requirement: they can either report directly from their own systems of record, or leverage a third-party validator to extract, reconcile, and attest to the accuracy of that data. The result is that each pool carries a verifiable, comparable data package that makes analysis and benchmarking across issuers possible.
Verification and trust
In the early stages of a company’s life, reporting often relies on a “trust me” model lenders and investors accept self-reported data with limited verification. But as markets mature, this approach is no longer enough. Capital providers expect verifiable and trusted data they can rely on to make decisions.
Meeting that expectation requires third-party validation. This role can be filled by auditors, trustees, or specialized data verification firms, a field that is growing quickly. Validators independently review reported data, check that it aligns with the agreed schema, and confirm that key figures match underlying records or independent checks.
Once their review is complete, validators post attestations tied cryptographically to the dataset. These attestations act as tamper-resistant proof that the data has been independently verified. The result is a system where reported information is not only standardized, but also carries a clear signal of credibility and provenance — essential for building trust in credit markets.
Textile Economy ($TEXT)
Textile is a fully decentralized market, built of multiple actors. The textile economy is successful when loans are being repaid on price and on time. 
Textile economy actors 
Borrower
Deal manager
Curator
Data validator 
Lender
The borrower and the lender are participating in textile for specific reasons, making money or borrowing money. 
The 3 other players on the other hand will come only if being paid for, in classic deals the intermediaries are seen by the borrowers as “extra weight” and crucial for the lenders. 
We built a textile economy to help support that cost pressure. 
Token Distribution
Every block $TEXT meme pool is filled with tokens both from inflation and fees.
 is emitted per block, and distributed between all pools who are registered as healthy in the protocol.
The deal manager, curator and data validator will receive a portion of the $TEXT tokens, the tokens are distributed per block - but can be claimed only on a lifetime of the loan, to ensure accountability until the end of the deal. 
Utility: Gaining Access via Fee Auctions
Access to high-demand loan pools (with limited capacity) is granted via a fee auction mechanism that uses $TEXT as the bidding currency.
Although loan pools are denominated in stablecoins, access is granted to the LP who bids the highest $TEXT fee to stake capital. This makes $TEXT the native bidding currency for priority capital allocation.
Today access to these types of deals is a question of personal network, and your ability to be “invited” . 
Fee Distribution & Deflation
$TEXT paid as access fees is distributed as follows:
Pool Manager, curators, data verifier: earns a portion for sourcing/managing the opportunity.


Textile Protocol: earns a portion to sustain development and operations.


Burn: a fixed portion is permanently burned, making $TEXT deflationary over time.


Conclusion 
While many RWA protocols connect capital providers to originators, Textile plays a fundamentally different role. For the first time, originators can permissionlessly create their own credit markets — fully programmable, reputation-driven, and owned end-to-end. Textile is not just a platform; it’s a network. And unlike ecosystems where value accrues to centralized intermediaries, Textile is designed to deliver value directly to the originators. From day one, they can raise, manage, and scale credit without gatekeepers — and as the network grows, so does the power of its reputation-driven flywheel.


