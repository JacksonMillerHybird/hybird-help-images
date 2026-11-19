# Help centre diagrams

Public URL: `https://raw.githubusercontent.com/JacksonMillerHybird/hybird-help-images/main/diagrams/<name>.png`. Sources are in `src/<name>.svg`, rendered at 1600 px wide.

- `account-hierarchy.png` · account › site › panel › controller › breakers (14655041, 14655048)
- `journey-end-customer.png` · end-customer journey, via an installer or directly with Hybird (customer journey article)
- `journey-installer.png` · installer onboarding: webshop registration to first panel (14654920, 14654873)
- `support-tiers.png` · Tier 0 Maggie, Tier 1 installer or energy partner, Tier 2 Hybird support, Tier 3 engineering (14654850)
- `emergency-routing.png` · emergency vs standard support decision (14654842)
- `api-data-flow.png` · breakers → controller → Hybird cloud → your system over HTTPS/JSON (16986339)
- `bill-and-consumption.png` · kWh × spot price = estimated cost, and the parts of a bill, no figures (14655042, 16247521)
- `closed-hours-profile.png` · illustrative 24-hour profile with closed hours shaded, labelled Example (16247521, 14654849)

### Technical diagrams (added 19 Nov 2026)

Built by `src/tech/render.js` (writes `src/<name>.svg`, renders the PNG with Playwright Chromium) and `src/tech/render-checklist.js` (checklist from `src/commissioning-checklist.html`). PNGs over 380 KB are quantised to 256 colours. Facts from `support-facts.md` first, then the article named.

- `panel-lifecycle.png` · Planning → Assembling → Deploying → Operating; **Move Back to Planning** before Operating; **Move to Operating** locks the panel to its account and site, only Hybird admins change it after (16571865) · 19 Nov 2026
- `breaker-led-states.png` · dip switch Work/Setup × handles up/down → red, blue, blue/purple, purple/red; always blinks; arrives in Setup (15804140) · 19 Nov 2026
- `rcbo-face-labelled.png` · photo (crop of `pdf-guides/assets/rs485-daisy-chain.png`) labelling handle set, QR, yellow safety lock, green dip switch, status LED, RS485 plug (14654923) · 19 Nov 2026
- `rs485-daisy-chain.png` · daisy chain ✓, star ✗, T-tap ✗; repeater above 70 breakers (14654881) · 19 Nov 2026
- `rs485-chain-break.png` · break: upstream reporting, downstream silent; two panels on one controller (15359908) · 19 Nov 2026
- `rs485-polarity.png` · A/B correct, swapped at controller (none report), swapped at one breaker (that one drops off); no wire colours (15359902, 15359904) · 19 Nov 2026
- `modbus-address-map.png` · 10–247 devices, RCDs 101–119, meters 120–139, max 247; installer or Hybird assigns (14654927, 15359916) · 19 Nov 2026
- `ups-power-outage.png` · mains lost → controller on UPS up to ~4 h → offline → mains back; readings not stored (15359930) · 19 Nov 2026
- `controller-connectivity.png` · Ethernet (preferred) → Wi-Fi → LTE (pre-configured SIM); outbound HTTPS 443; offline data lost (14654868) · 19 Nov 2026
- `system-architecture.png` · breakers → RS485 → controller → Ethernet/Wi-Fi/LTE → Hybird OS → web app, iOS app, API, MCP (14654905) · 19 Nov 2026
- `breakers-not-reporting-triage.png` · controller online? → one / all / cluster / collision → contact support (15359896) · 19 Nov 2026
- `system-offline-flowchart.png` · power → green LED → network → restart (both arrow buttons 5 s) → support (14655212) · 19 Nov 2026
- `trip-overcurrent-vs-leakage.png` · one or several → readings → leakage / overcurrent / intermittent; no thresholds (14655205) · 19 Nov 2026
- `remote-addressing-lanes.png` · on site vs Hybird support lanes for adding a breaker to an Operating panel (16571862) · 19 Nov 2026
- `wiring-single-phase.png` · supply → 2P RCBOs; PSU → UPS → controller by IDC, 24 V DC; RS485 chain (14654882) · 19 Nov 2026
- `wiring-three-phase.png` · L1/L2/L3/N; 4P and 2P RCBOs; RCD upstream of MCBs; Type B RCD for VFD/EV/PV (14654883) · 19 Nov 2026
- `din-rail-layout.png` · PSU → (UPS) → controller, controller rightmost; only PSU width (35 mm) shown; not to scale (14654870, 14654830) · 19 Nov 2026
- `protection-layouts.png` · RCBOs throughout vs RCD over MCBs vs mixed (14654903) · 19 Nov 2026
- `hybird-vs-traditional.png` · ✓/✗ table; remote switching depends on role and agreement (14654900) · 19 Nov 2026
- `multi-controller-site.png` · one site, two panels, each controller with its own bus and internet link (14655048) · 19 Nov 2026
- `earthing-bonding.png` · RS485 signal ground and screen at the controller GND only (14654871) · 19 Nov 2026
- `commissioning-checklist.png` / `.pdf` · one-page A4 checklist: power-off/DS/EN 50110, power on, detach rule, Assembly guide steps, RCDs and meters, Test the Bus, Move to Operating (14654866) · 19 Nov 2026
