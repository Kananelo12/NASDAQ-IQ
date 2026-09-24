## Product Requirements Document NASDAQ Macro Intelligence

Version 1.0 | Product concept & developer specification

## 1. Executive Summary

NASDAQ Macro Intelligence is a trader-focused economic intelligence application designed to collect authorised financial-news and economic data, organise upcoming macroeconomic releases and Federal Reserve communications, and generate transparent, evidence-based NASDAQ reaction scenarios.

The product is not intended to claim certainty about future market movements. Its core function is to answer: “Given the forecast, previous release, historical surprise behaviour, current market regime and current macro context, what has NASDAQ historically done in comparable situations?”

The primary reference market is the NASDAQ-100 / NDX, with NQ and related market variables used where licensed and available.

## 2. Product Vision

Turn a fast-moving stream of macroeconomic information into a structured decision-support workflow for NASDAQ traders: upcoming event → possible outcomes → historical comparisons → current context → observed market response.

## 3. Problem Statement

- Economic news is fragmented across calendars, headlines, central-bank communications and market data.

- A forecast alone does not tell a trader how large a surprise would be or how NASDAQ has historically responded to comparable surprises.

- Fed speeches can change the interpretation of economic releases and interest-rate expectations.

- The same economic surprise can produce different market reactions under different volatility, trend, rate and risk regimes.

- Traders need an auditable explanation rather than an unexplained bullish/bearish label.

## 4. Goals

- Provide a single NASDAQ-focused macro dashboard.

- Identify and rank upcoming market-sensitive economic events by relevance.

- Generate scenario bands around consensus forecasts.

- Match each scenario against historical releases with comparable surprises and market conditions.

- Analyse Federal Reserve communications and changes in policy language.

- Compare the scenario framework with the actual post-release market response.


- Build a historical dataset that can be used to evaluate and improve the model without look-ahead bias.

## 5. Non-Goals

- Guaranteed prediction of NASDAQ direction.

- Automated trade execution in the MVP.

- Personalised investment advice.

- Replacing primary economic data providers or licensed market-data vendors.

- Copying or redistributing Financial Juice content without the appropriate permission or licence.

## 6. Critical Data-Licensing Requirement

Financial Juice’s current Terms state that its service and content are licensed for personal use and restrict collection, aggregation, copying, duplication, display and derivative use unless expressly permitted; the Terms state that a written licence is required for other collection/aggregation/derivative uses, including commercial purposes. Therefore the production architecture must use an authorised Financial Juice feed/API/licence or another permitted integration. The app must not be designed around scraping Financial Juice pages.

Source: Financial Juice Terms of Service. cite turn0search0

The product should also maintain source attribution, timestamps and provenance for each data item where the relevant licence permits it.

## 7. Target Users

- Active NASDAQ/NQ discretionary traders.

- Day traders who monitor US macroeconomic releases.

- Traders who follow Federal Reserve policy closely.

- Advanced traders who want historical evidence behind macro scenarios.

## 8. Core User Journey

- 1. Open the dashboard.

- 2. See the next high-impact NASDAQ-relevant events.

- 3. Open an event to view previous, forecast and historical context.

- 4. Review scenario bands based on possible actual outcomes.

- 5. Inspect historical comparable releases and NASDAQ reactions.

- 6. Review Treasury yields, DXY, volatility and market-regime context.

- 7. Monitor Fed communications relevant to the event.

- 8. Receive the actual release and surprise calculation.

- 9. Compare the predicted scenario with the live market response.

- 10. After the event, store the outcome for future model evaluation.


## 9. Functional Requirements

## 9.1 Economic Event Engine

- Ingest economic events from authorised data sources.

- Store event name, country, currency, scheduled time, previous, forecast/consensus, actual and revision.

- Support major US releases including CPI, PCE, NFP, unemployment, jobless claims, GDP, retail sales, ISM, PPI, FOMC decisions and other relevant releases.

- Detect changes to scheduled times and revised economic values.

- Maintain historical versions of data rather than overwriting prior values.

## 9.2 Financial News Engine

- Ingest authorised Financial Juice data where licensing permits.

- Normalise timestamps and source metadata.

- Classify headlines by topic and asset relevance.

- Identify headlines potentially relevant to NASDAQ, rates, yields, USD, technology and risk sentiment.

- Retain source links/provenance where permitted.

## 9.3 Federal Reserve Intelligence

- Track Fed Chair, Governors, regional Fed presidents and other relevant official communications.

- Store speech/interview date, speaker, role, source and text/transcript where legally available.

- Extract references to inflation, employment, growth, rates, balance sheet and financial conditions.

- Compare current language with previous statements by the same speaker.

- Identify changes in wording and policy emphasis.

- Present the underlying source evidence alongside AI-generated interpretation.

## 9.4 Scenario Engine

For each major event, calculate possible outcome bands relative to consensus. The initial implementation should use statistically defined surprise bands rather than arbitrary fixed thresholds.

- Calculate surprise = actual minus consensus, using event-appropriate units.

- Normalise surprise where appropriate so different releases can be compared.

- Generate below-consensus, near-consensus and above-consensus scenarios.

- Estimate historical NASDAQ reaction for comparable surprise sizes.

- Condition comparisons on market regime where sufficient data exists.

- Show sample size and historical dispersion rather than only a directional label.

## 9.5 Historical Matching Engine

- Search historical releases by event type and surprise magnitude.

- Optionally match market regime, volatility regime, rate environment and risk regime.

- Measure NASDAQ reaction at 1m, 5m, 15m, 30m, 60m and session horizons where data granularity permits.

- Track Treasury yield, DXY and volatility responses where available.

- Expose the comparable observations used by the model.


## 9.6 Market-Regime Engine

- Classify trend/range conditions.

- Classify volatility conditions.

- Track rate-policy environment.

- Track risk-on/risk-off context.

- Store the regime that existed immediately before each historical event.

- Use only information available before the event when generating historical comparisons.

## 9.7 Live Release Mode

- Countdown to event.

- Display latest forecast and previous values.

- Show scenario map before release.

- Immediately calculate actual-versus-forecast surprise.

- Update historical comparison after actual release.

- Display current NASDAQ response.

- Flag when actual price action diverges from the historical scenario.

## 10. Scenario Output Example

US CPI | Forecast: 3.0% | Previous: 3.1%

| Scenario | Actual | Interpretation | NASDAQ context |
| --- | --- | --- | --- |
| Very soft | <2.8% | Large downside surprise Historical NASDAQ | response for comparable releases |
| Soft | 2.8–2.9% | Moderate downside surprise | Historical comparable response |
| In line | ≈3.0% | Small/no surprise | Historical comparable response |
| Hot | 3.1–3.2% | Moderate upside surprise | Historical comparable response |
| Very hot | >3.2% | Large upside surprise | Historical comparable response |

## 11. Explainability Requirements

Every generated scenario must be explainable. The user should be able to see:

- What data was used.

- What forecast and previous values were available at the time.

- How the surprise bands were calculated.

- How many historical observations matched.

- What NASDAQ did after those observations.

- Which market regimes were represented.

- Which factors could invalidate the historical relationship.

- The source and timestamp for important inputs.


## 12. Confidence / Evidence Framework

Avoid presenting a single unexplained probability such as “85% bullish”. Instead, the application should expose evidence quality.

- Comparable observations.

- Directional consistency.

- Average and median reaction.

- Reaction dispersion.

- Current-regime similarity.

- Data completeness.

- Model version.

The UI may summarise these inputs as an evidence-strength category, but it should always provide the underlying numbers and limitations.

## 13. Data Architecture

- Event database: economic releases, consensus, previous, actual, revisions and source timestamps.

- News database: headlines, categories, source, timestamp and relevance tags.

- Fed database: speaker, communication, transcript/source and extracted policy-language features.

- Market database: NDX/NQ and supporting instruments at the required intraday resolution.

- Regime database: pre-event market state and derived regime features.

- Scenario database: generated scenario, model version, inputs and output.

- Outcome database: actual release, market reaction and post-event evaluation.

## 14. AI / Statistical Architecture

The recommended architecture is hybrid rather than “LLM only”.

- Deterministic data pipeline for economic values and timestamps.

- Statistical engine for surprise calculation and historical event matching.

- Machine-learning layer for regime similarity and nonlinear relationships once sufficient data exists.

- LLM layer for source-grounded explanation, summarisation and Fed-language comparison.

- Rule-based safeguards preventing the language model from inventing economic values or sources.

## 15. Anti-Look-Ahead / Backtesting Requirements

This is a critical technical requirement.

- The model must only use information that was actually available before each historical event.

- Forecast revisions must be timestamped.

- Economic revisions must not leak future information into historical simulations.

- Market-regime features must be calculated using pre-event data.

- The system must store model versions so historical tests can be reproduced.

- Backtests must separate training, validation and out-of-sample periods.


## 16. Main Application Screens

- 11. Dashboard — next events, market regime, NASDAQ context and Fed watch.

- 12. Economic Calendar — filterable macro calendar.

- 13. Event Detail — previous, forecast, scenarios, historical matches and market reaction.

- 14. Live Release — real-time actual, surprise and price response.

- 15. Fed Watch — speeches, language changes and source evidence.

- 16. News Intelligence — authorised financial-news feed and macro categorisation.

- 17. Historical Explorer — search past releases and reactions.

- 18. Model/Research — model performance and scenario evaluation.

- 19. Settings — alerts, watchlist, timezone and notification preferences.

## 17. Alerts

- High-impact event approaching.

- Fed speaker scheduled.

- Unexpected Fed communication.

- Forecast revision.

- Large economic surprise.

- NASDAQ response materially diverging from historical scenario.

- Major change in macro regime.

## 18. User Stories

- As a NASDAQ trader, I want to see the next important macro event so I can prepare before the release.

- As a trader, I want to compare the forecast with previous data so I understand the setup.

- As a trader, I want to see historical NASDAQ reactions to similar surprises so I can assess the range of possible outcomes.

- As a trader, I want to know when a Fed speaker changes policy language so I can investigate the implications.

- As a trader, I want the app to explain why a scenario was generated so I can independently evaluate it.

- As a researcher, I want to replay historical events using only information available at the time so I can evaluate the model honestly.

## 19. Acceptance Criteria — MVP

- A user can view upcoming US macroeconomic events.

- Each supported event contains previous and consensus/forecast values when available.

- The system calculates actual-versus-forecast surprise after release.

- The system generates scenario bands before the event.

- Each scenario displays historical comparable observations where available.

- NASDAQ reactions can be measured at defined post-event horizons.

- Fed communications can be viewed and linked to source evidence.

- The app records model inputs and outputs for later evaluation.

- No scenario is generated using future information in historical backtests.


- Data-source licensing and redistribution restrictions are respected.

## 20. Success Metrics

- Percentage of scheduled high-impact events successfully ingested.

- Data freshness and completeness.

- Percentage of scenarios with sufficient historical sample size.

- Historical directional consistency by event type.

- Scenario calibration and error metrics.

- False-positive and false-negative rates.

- User engagement with event-analysis pages.

- Alert open rate.

- Time from data release to updated scenario/actual analysis.

## 21. Risks

- Licensed data may be unavailable, expensive or restricted.

- Economic forecasts can change before release.

- Historical relationships can break under unusual market conditions.

- Multiple simultaneous events can confound attribution.

- AI-generated explanations can be wrong if not grounded in source data.

- Low sample sizes can make historical comparisons unreliable.

- Market reactions are not deterministic.

## 22. MVP Development Roadmap

- 20. Phase 1 — Data foundation: economic calendar, market data, source provenance and storage.

- 21. Phase 2 — Dashboard: upcoming events, NASDAQ context and event detail pages.

- 22. Phase 3 — Historical engine: surprise calculation, event matching and reaction statistics.

- 23. Phase 4 — Scenario engine: pre-release outcome bands and historical scenario analysis.

- 24. Phase 5 — Fed intelligence: speeches, source-grounded language analysis and Fed watch.

- 25. Phase 6 — Live release mode: actuals, surprise and scenario-versus-reality comparison.

- 26. Phase 7 — Model evaluation: backtesting, calibration and regime-conditioned analysis.

- 27. Phase 8 — Mobile/notifications and commercialisation.

## 23. Future Enhancements

- TradingView integration.

- Custom trader watchlists.

- Personal trading journal.

- Strategy-specific macro filters.

- Additional indices and asset classes.

- Options/implied-volatility context.

- More advanced machine-learning models.


- Broker integrations only after the analytics product is validated.

## 24. Product Positioning

The product should be positioned as a macroeconomic research and decision-support tool, not as a guaranteed prediction or automated trading system. FinancialJuice itself states that its service is informational and not investment advice; the new application should maintain an equally clear distinction between evidence, analysis and trading decisions. cite turn0search6 turn0search0

## 25. Open Decisions for the Next PRD Revision

- Exact authorised Financial Juice integration/licence.

- Primary market-data provider and intraday resolution.

- Whether the first release is web, Android, iOS or cross-platform.

- Whether users require accounts and paid subscriptions.

- Exact economic events included in MVP.

- Exact NASDAQ instruments: NDX, NQ futures, CFD/other licensed feed.

- Historical lookback period.

- Minimum sample size before showing historical scenario statistics.

- Notification channels: push, email, Telegram, WhatsApp or other permitted channels.

- AI model/provider and hosting architecture.

## 26. One-Sentence Product Definition

“A NASDAQ-focused macro intelligence platform that turns upcoming economic releases and Federal Reserve communications into transparent, historically grounded market-reaction scenarios, then compares those scenarios with what the market actually does.”

Source note: Financial Juice Terms of Service were reviewed for the data-licensing requirement in this PRD.

cite turn0search0
