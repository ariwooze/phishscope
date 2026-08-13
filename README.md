# PhishScope

**A Browser Extension for Phishing Link Analysis and Email Triage**

PhishScope is a planned browser extension designed to help users investigate suspicious links, webpages, and email-related indicators directly from their browser.

The project aims to provide a lightweight phishing-triage workflow without requiring users to open a separate dashboard. PhishScope will focus on analyzing URLs, identifying potentially misleading links, reviewing selected email-header information, and presenting explainable security findings through a browser-extension interface.

> **Project Status:** 🚧 Under Development

## Why This Project?

Phishing attacks often rely on deceptive URLs, misleading hyperlinks, suspicious domains, urgency-based social engineering, and email-header inconsistencies.

Users may encounter suspicious links while browsing the web or reviewing emails, but manually checking every domain, URL structure, and email header can be time-consuming.

PhishScope aims to simplify the initial phishing-triage process by allowing users to investigate suspicious indicators directly from the browser.

The project is planned to help answer questions such as:

- Does this link point to the domain it appears to represent?
- Is the URL using an IP address instead of a normal domain?
- Does the URL contain suspicious subdomains or phishing-related keywords?
- Is a shortened URL hiding its destination?
- Does a webpage contain misleading hyperlinks?
- Is the domain associated with suspicious threat-intelligence results?
- Do the sender and Reply-To domains in an email header match?
- What do the SPF, DKIM, and DMARC results indicate?
- Which indicators should be investigated further?

All planned detections will be explainable. A finding will indicate that an indicator deserves further investigation; it will not automatically confirm that a website, URL, or email is malicious.

## Planned Features

### Browser Extension Interface

PhishScope is planned to operate directly from a Chromium-based browser.

The first version is expected to provide:

- A lightweight browser-extension popup
- Analysis of the current webpage
- Manual URL analysis
- Right-click context-menu analysis for hyperlinks
- Display of detected phishing indicators
- Explainable risk findings
- A simple risk classification for analyzed URLs or webpages

### Current Page Analysis

The extension is planned to collect selected information from the active webpage, including:

- Full URL
- Domain
- Hostname
- Protocol
- Port
- Page title
- Visible hyperlinks

The extracted information will be passed to rule-based analysis modules.

PhishScope will not automatically submit form data, credentials, or private page contents to external services.

### URL Analysis

PhishScope is planned to examine URLs for characteristics commonly associated with phishing.

Planned checks include:

- Raw IP addresses used as hosts
- HTTP instead of HTTPS
- URL-shortening services
- Excessive subdomains
- Unusually long URLs
- Suspicious ports
- `@` characters within URLs
- Punycode domains
- Login-related keywords
- Verification-related keywords
- Security-related keywords
- Brand names appearing outside the registered domain
- Potentially misleading domain structures

Examples of URLs that may require further investigation include:

```text
http://192.0.2.50/login
```

```text
https://paypal.account-security.example/login
```

```text
https://example.com@192.0.2.50/login
```

A suspicious characteristic alone will not be treated as proof that a URL is malicious.

### Right-Click Link Analysis

A planned context-menu option will allow users to analyze links without manually copying them.

Example workflow:

```text
Right-click suspicious link
        ↓
Analyze with PhishScope
        ↓
Extract URL
        ↓
Run phishing checks
        ↓
Display findings
```

This feature is intended to provide quick phishing triage while browsing or reviewing web-based email.

### Misleading Hyperlink Detection

PhishScope is planned to inspect hyperlinks on supported webpages and compare the visible link text against the actual destination.

For example:

```text
Displayed:
https://www.example-bank.test

Actual Destination:
https://login.suspicious.example
```

If the visible domain differs from the actual destination, the extension may create a high-priority finding.

Legitimate websites may occasionally use redirects or different domains, so the result will still require analyst validation.

### Email Header Analysis

A manual email-header analysis feature is planned for the extension.

Users will be able to paste raw email headers into PhishScope for basic investigation.

Planned extracted fields include:

- From
- Reply-To
- Return-Path
- Subject
- Message ID
- Authentication-Results
- Received headers

Planned checks include:

- Sender and Reply-To domain mismatch
- Sender and Return-Path inconsistencies
- SPF result
- DKIM result
- DMARC result

Email authentication results will be treated as supporting evidence rather than definitive phishing indicators.

### Threat-Intelligence Enrichment

VirusTotal integration is planned as an optional feature.

The extension may use extracted indicators for reputation checks, including:

- URLs
- Domains

Threat-intelligence information will be used to support the investigation rather than determine the final verdict by itself.

API credentials will not be stored directly inside the public GitHub repository.

### Explainable Risk Findings

PhishScope is planned to use a transparent rule-based scoring approach.

Possible findings may include:

| Indicator | Planned Severity |
|---|---|
| Raw IP address used in URL | Medium |
| HTTP connection | Low |
| URL-shortening service | Medium |
| Excessive subdomains | Medium |
| Suspicious login-related keywords | Low |
| Punycode domain | Medium |
| Misleading hyperlink destination | High |
| Sender / Reply-To mismatch | Medium |
| SPF failure | Medium |
| DMARC failure | High |
| Malicious threat-intelligence result | High |

The final scoring rules may change during development and testing.

The extension is planned to summarize findings similar to:

```text
Risk: HIGH

Findings
--------------------------------
HIGH    Link destination mismatch
MEDIUM  Suspicious domain structure
MEDIUM  URL-shortening service detected
LOW     Login-related keyword detected
```

> **Important:** Severity levels and thresholds are initial design ideas for a learning project and may be adjusted as testing progresses.

## Planned Workflow

The intended link-analysis workflow is:

1. The user opens the PhishScope extension or right-clicks a hyperlink.
2. The extension extracts the selected URL or current-page information.
3. URL-analysis modules examine the indicator using transparent rules.
4. The registered domain and URL structure are evaluated.
5. Optional threat-intelligence enrichment is performed.
6. Findings are combined and assigned severity levels.
7. The extension displays the investigation result.

## Planned Technology Stack

| Tool | Purpose |
|---|---|
| JavaScript | Core extension and analysis logic |
| HTML | Extension popup interface |
| CSS | Extension styling |
| Chrome Extension APIs | Browser integration |
| Manifest V3 | Extension configuration and permissions |
| Content Scripts | Inspect supported webpage content |
| Service Worker | Background extension operations |
| URL API | Parse and inspect URLs |
| VirusTotal API | Planned URL and domain reputation checks |

Additional libraries may be introduced if required during development.

## Planned Project Structure

```text
phishscope/
├── manifest.json                 # Browser-extension configuration
├── README.md
├── LICENSE
├── .gitignore
│
├── popup/
│   ├── popup.html                # Extension popup
│   ├── popup.css                 # Popup styling
│   └── popup.js                  # Popup logic
│
├── scripts/
│   ├── background.js             # Extension service worker
│   ├── content.js                # Page-content inspection
│   ├── url_analyzer.js           # URL-analysis rules
│   ├── header_analyzer.js        # Email-header analysis
│   ├── threat_intel.js           # Planned threat-intelligence logic
│   └── risk_engine.js            # Planned scoring logic
│
├── utils/
│   └── helpers.js                # Shared helper functions
│
├── assets/
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
│
├── samples/
│   ├── urls.txt                  # Safe URL test cases
│   └── email_headers.txt         # Synthetic header samples
│
├── tests/
│   └── url_analyzer.test.js
│
└── screenshots/
```

The exact structure may change as the project develops.

## Prerequisites

Before developing or testing PhishScope, the following tools are expected to be required:

- Git
- A Chromium-based browser such as:
  - Google Chrome
  - Chromium
  - Microsoft Edge
- Visual Studio Code or another code editor
- Internet access for optional threat-intelligence checks

Node.js may be introduced later if automated JavaScript testing or additional development tooling is added.

### Verify Git

```bash
git --version
```

## Installation

Because PhishScope is currently under development, the extension is intended to be installed manually in developer mode.

Clone the repository:

```bash
git clone https://github.com/ariwooze/phishscope.git
cd phishscope
```

### Load the Extension in Chrome or Chromium

1. Open the browser.
2. Navigate to:

```text
chrome://extensions/
```

3. Enable **Developer mode**.
4. Select **Load unpacked**.
5. Choose the `phishscope` project directory.
6. Pin PhishScope to the browser toolbar if required.

The installation procedure may change as the extension develops.

## Planned URL Detection Logic

PhishScope is intended to use rule-based analysis to identify URL characteristics that may require further investigation.

### Raw IP Address

The analyzer may flag URLs that use an IP address rather than a domain name.

Example:

```text
http://192.0.2.25/account/login
```

Attackers may use direct IP addresses to avoid registering recognizable domain names.

However, legitimate internal systems, test environments, and network appliances may also use IP-based URLs.

### HTTP Instead of HTTPS

The analyzer may identify pages using:

```text
http://
```

rather than:

```text
https://
```

This will likely receive a relatively low severity because the use of HTTP alone does not indicate phishing.

### Excessive Subdomains

Phishing pages may attempt to make a malicious URL appear legitimate by placing trusted-looking words before the actual registered domain.

Example:

```text
https://paypal.security.authentication.example/login
```

The registered domain in this example is not `paypal.com`.

The extension is planned to analyze these structures and highlight potentially misleading domain patterns.

### Suspicious Keywords

The first version may inspect URLs for terms commonly associated with credential harvesting or account verification.

Examples may include:

```text
login
signin
verify
verification
secure
security
account
password
update
authentication
```

Because legitimate websites frequently use these terms, keyword findings are expected to receive low weighting.

### URL Shorteners

Known URL-shortening services may be identified because they hide the final destination from the user.

Examples include:

```text
bit.ly
tinyurl.com
t.co
```

URL shorteners are also widely used legitimately, so the finding alone will not indicate phishing.

### Punycode Domains

PhishScope is planned to identify internationalized domain names represented using Punycode.

Example:

```text
xn--example-domain
```

Punycode itself is legitimate, but visually similar Unicode characters can sometimes be used for domain impersonation.

### Misleading Hyperlinks

When technically possible, the extension will compare displayed URLs with actual hyperlink destinations.

Example:

```text
Displayed:
https://example-bank.test

Destination:
https://phishing.example/login
```

A mismatch may receive a higher severity because the recipient may be intentionally misled about where the link leads.

## Planned Email Header Logic

PhishScope is also intended to provide lightweight email-header triage.

### Sender / Reply-To Mismatch

Example:

```text
From:
Support <support@example-bank.test>

Reply-To:
accounthelp@suspicious.example
```

Different domains may indicate that replies are being redirected elsewhere.

However, third-party support systems and mailing platforms may also legitimately use different domains.

### SPF, DKIM, and DMARC

The header analyzer is planned to extract authentication results where available.

Possible results include:

```text
SPF   : PASS / FAIL / NONE
DKIM  : PASS / FAIL / NONE
DMARC : PASS / FAIL / NONE
```

Authentication failures will contribute to the investigation but should not independently determine that an email is phishing.

## Planned Test Samples

PhishScope is planned to include synthetic test indicators.

### URL Samples

Possible test cases include:

| Test | Intended Result |
|---|---|
| Normal HTTPS URL | Minimal or no findings |
| IP-based URL | IP-address finding |
| Shortened URL | URL-shortener finding |
| Excessive subdomains | Domain-structure finding |
| Suspicious keywords | Keyword finding |
| Punycode URL | Punycode finding |
| Misleading hyperlink | Link-mismatch finding |
| Combined sample | Multiple findings |

### Email Header Samples

Possible email-header test cases include:

| Sample | Intended Result |
|---|---|
| Normal header | Minimal findings |
| Reply-To mismatch | Domain-mismatch finding |
| SPF failure | Authentication finding |
| DMARC failure | Authentication finding |
| Combined header | Multiple findings |

All repository samples should use synthetic or reserved testing information rather than live phishing infrastructure.

## Development Roadmap

### Phase 1 — Extension Foundation

- [ ] Create repository structure
- [ ] Create `manifest.json`
- [ ] Create extension popup
- [ ] Add extension icons
- [ ] Load extension in developer mode
- [ ] Read current browser tab URL

### Phase 2 — URL Analysis

- [ ] Parse URLs
- [ ] Extract hostname
- [ ] Extract registered domain
- [ ] Detect raw IP addresses
- [ ] Detect HTTP URLs
- [ ] Detect suspicious ports
- [ ] Detect suspicious keywords
- [ ] Detect URL shorteners
- [ ] Detect excessive subdomains
- [ ] Detect Punycode

### Phase 3 — Browser Integration

- [ ] Add right-click context-menu analysis
- [ ] Analyze selected hyperlinks
- [ ] Add current-page analysis
- [ ] Extract visible hyperlinks
- [ ] Detect misleading hyperlink destinations

### Phase 4 — Email Triage

- [ ] Add email-header input
- [ ] Parse sender information
- [ ] Parse Reply-To
- [ ] Parse Return-Path
- [ ] Extract SPF results
- [ ] Extract DKIM results
- [ ] Extract DMARC results
- [ ] Detect header mismatches

### Phase 5 — Risk Analysis

- [ ] Standardize finding structure
- [ ] Assign severity levels
- [ ] Create explainable risk scoring
- [ ] Display evidence for each finding
- [ ] Improve extension results interface

### Phase 6 — Threat Intelligence

- [ ] Research secure API-key handling
- [ ] Add optional VirusTotal integration
- [ ] Check domain reputation
- [ ] Check URL reputation
- [ ] Handle API errors and rate limits

### Phase 7 — Testing and Documentation

- [ ] Create synthetic URL samples
- [ ] Create synthetic email-header samples
- [ ] Test false positives
- [ ] Test combined indicators
- [ ] Improve error handling
- [ ] Add screenshots
- [ ] Update README with implemented features
- [ ] Document known limitations

## Data and Privacy

PhishScope is being designed with the following privacy principles:

- Analyze only the information required for phishing triage.
- Do not collect browser history.
- Do not collect passwords or form contents.
- Do not automatically submit page content to external services.
- Do not store API keys in the public repository.
- Do not publish real emails containing personal or confidential information.
- Use synthetic or authorized samples for testing.
- Sanitize screenshots before publishing them.
- Keep browser-extension permissions as limited as reasonably possible.

The final permissions required by the extension will be documented as development progresses.

## Expected Limitations

The first version of PhishScope is expected to have several limitations:

- Rule-based findings may produce false positives and false negatives.
- Legitimate websites may contain suspicious-looking URL characteristics.
- HTTPS does not guarantee that a website is legitimate.
- Punycode domains are not automatically malicious.
- URL shorteners are widely used for legitimate purposes.
- Brand-name detection may require additional refinement.
- Email headers may contain incomplete authentication information.
- SPF, DKIM, or DMARC failures do not automatically indicate phishing.
- Threat-intelligence services may not contain information about newly created phishing infrastructure.
- API usage may be subject to external rate limits.
- Browser security restrictions may prevent analysis of some webpage content.
- A low risk classification will not guarantee that a website or email is safe.
- Findings should be treated as investigation leads rather than confirmation of malicious activity.

## Future Enhancements

Features outside the initial development scope may include:

- Domain-registration and domain-age analysis
- Additional threat-intelligence providers
- QR-code phishing detection
- Downloaded-file hash analysis
- Typosquatting detection
- Improved brand-impersonation analysis
- Unicode homograph detection
- Redirect-chain analysis
- Email-body text analysis
- Suspicious form detection
- User-configurable detection rules
- Investigation history
- Exportable analysis reports
- Firefox support
- Gmail or Outlook integration

These features are not part of the initial scope and may be explored after the core extension is completed.

## Ethical Use

PhishScope is being developed for cybersecurity education, defensive security analysis, phishing awareness, and authorized investigation.

Users should investigate only websites, URLs, emails, and systems that they are authorized to examine.

PhishScope should not be used for phishing campaigns, credential theft, unauthorized surveillance, malware delivery, or any other malicious activity.

A PhishScope finding is intended to support investigation and user awareness. It should not be treated as definitive confirmation that an email, website, or URL is malicious.
