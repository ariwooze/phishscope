# PhishScope

**A Phishing Email Investigation and Threat Analysis Dashboard**

PhishScope is a planned beginner-friendly, local web application for investigating suspicious email files. The project aims to convert raw `.eml` email data into readable summaries, explainable security findings, extracted indicators of compromise (IOCs), attachment information, and supporting evidence that an analyst can investigate.

The application is being designed for offline analysis of `.eml` files. It will not access live mailboxes, execute attachments, automatically open suspicious URLs, or replace professional email-security solutions.

> **Project Status:** 🚧 Under Development

## Why This Project?

Phishing emails can contain misleading sender information, suspicious hyperlinks, failed email-authentication checks, potentially dangerous attachments, and social-engineering techniques that may not be immediately obvious to users.

Manually examining email headers, authentication results, URLs, attachments, and threat-intelligence information can be time-consuming, particularly for beginners.

PhishScope aims to simplify the initial stage of phishing email investigation by helping users answer questions such as:

- Who appears to have sent the email?
- Does the Reply-To address match the visible sender?
- What do the SPF, DKIM, and DMARC results indicate?
- Does the email contain suspicious or misleading URLs?
- Are there potentially dangerous attachments?
- Are extracted indicators known to threat-intelligence services?
- What evidence supports each security finding?
- Which findings should an analyst investigate first?

The planned detections will primarily use transparent, rule-based analysis. A finding will indicate suspicious activity that requires further investigation; it will not prove that an email is malicious.

## Planned Features

### Email Parsing and Investigation

The first version of PhishScope is planned to support:

- Uploading `.eml` email files
- Parsing email files locally using Python
- Extracting email information, including:
  - Sender
  - Recipient
  - Subject
  - Date
  - Reply-To address
  - Return-Path
  - Message ID
  - Authentication results
  - Received headers
- Extracting plain-text email content
- Extracting HTML email content
- Identifying email attachments
- Displaying extracted information through a Streamlit dashboard

### Header and Authentication Analysis

The project is planned to analyze selected email-header information for indicators that may require further investigation.

Planned checks include:

- Detecting differences between the sender and Reply-To domains
- Examining the Return-Path
- Extracting SPF results
- Extracting DKIM results
- Extracting DMARC results
- Displaying email routing information from `Received` headers
- Highlighting failed or suspicious authentication results

Authentication failures will be treated as investigation indicators rather than definitive proof of phishing.

### URL Investigation

PhishScope is planned to extract and analyze URLs found in both plain-text and HTML email content.

Planned URL-analysis features include:

- Extracting plain-text URLs
- Extracting hyperlinks from HTML content
- Identifying registered domains
- Detecting URLs that use raw IP addresses
- Detecting known URL-shortening services
- Detecting unusually complex or misleading subdomains
- Comparing displayed hyperlinks with their actual destinations
- Identifying potentially misleading HTML links

For example, a phishing email may display:

```text
https://www.example-bank.test
```

while the actual hyperlink points to:

```text
https://account-verification.example/login
```

PhishScope is planned to highlight these differences as evidence for further investigation.

### Suspicious Content Analysis

The project is also planned to examine email content for language commonly associated with phishing and social-engineering attempts.

Examples may include:

```text
Verify your account
Account suspended
Urgent action required
Confirm your identity
Password expired
Unusual activity detected
Payment failed
Account locked
```

These indicators will receive relatively low weighting because similar language can also appear in legitimate emails.

### Attachment Investigation

PhishScope is planned to perform static analysis of email attachments without executing them.

Planned attachment information includes:

- Filename
- MIME type
- File extension
- File size
- SHA-256 hash

The analysis may also check for:

- Executable attachments
- Script-based attachments
- Potentially dangerous file extensions
- Double-extension filenames

Examples include:

```text
invoice.pdf.exe
payment.pdf.scr
resume.docx.exe
```

Attachments will not be automatically executed or opened by the application.

### Threat-Intelligence Enrichment

A later development stage is planned to integrate the VirusTotal API for selected reputation checks.

The initial integration is expected to support:

- URL reputation checks
- Domain reputation checks
- SHA-256 attachment-hash reputation checks

For privacy reasons, the project is intended to perform hash-based attachment lookups rather than automatically uploading attachment files to VirusTotal.

### IOC Extraction

PhishScope is planned to collect Indicators of Compromise discovered during an investigation.

Possible IOC categories include:

```text
Domains
URLs
IP Addresses
SHA-256 Hashes
```

These indicators may later be displayed in a dedicated investigation section and included in exported reports.

### Explainable Risk Scoring

The project is planned to include a transparent rule-based risk-scoring system.

Instead of only displaying a final classification, PhishScope will aim to show which findings contributed to the score.

A possible scoring model is:

| Finding | Planned Score |
|---|---:|
| Sender / Reply-To domain mismatch | +10 |
| SPF failure | +15 |
| DKIM failure | +10 |
| DMARC failure | +20 |
| IP-based URL | +15 |
| URL-shortening service | +10 |
| HTML link destination mismatch | +20 |
| Suspicious email language | +5 |
| Potentially dangerous attachment | +25 |
| Malicious threat-intelligence result | +30 |

The total score is planned to be capped at `100`.

Possible classifications:

| Score | Classification |
|---:|---|
| 0–29 | Low |
| 30–59 | Medium |
| 60–79 | High |
| 80–100 | Critical |

> **Important:** These values are initial design ideas for a learning project. The rules and thresholds may change during implementation and testing.

## Planned Workflow

The intended investigation workflow is:

1. The user uploads an `.eml` email file.
2. The email parser extracts headers, message content, URLs, and attachments.
3. Header-analysis modules examine sender information and authentication results.
4. URL-analysis modules inspect extracted links for suspicious characteristics.
5. Attachment-analysis modules calculate hashes and inspect file metadata.
6. Selected indicators are enriched using threat-intelligence services.
7. Findings from each analysis module are combined.
8. The risk engine calculates an explainable risk score.
9. Streamlit displays the investigation summary, findings, IOCs, and evidence.
10. Investigation results may be exported for further analysis.

## Technology Stack

The following technologies are currently planned for the project:

| Tool | Purpose |
|---|---|
| Python | Core application and investigation logic |
| Python `email` | Parse `.eml` files and MIME content |
| BeautifulSoup4 | Extract and analyze HTML hyperlinks |
| tldextract | Extract and compare registered domains |
| dnspython | Support DNS-related investigation |
| Requests | Communicate with threat-intelligence APIs |
| hashlib | Generate SHA-256 attachment hashes |
| python-dotenv | Store and load API credentials |
| Pandas | Structure findings and extracted IOC data |
| Streamlit | Local web investigation dashboard |
| VirusTotal API | Planned IOC reputation checking |

The technology stack may be adjusted during development depending on implementation requirements.

## Planned Project Structure

```text
phishscope/
├── app.py                         # Streamlit application
├── requirements.txt               # Python dependencies
├── .env.example                   # Example environment configuration
├── .gitignore
├── core/
│   ├── __init__.py
│   ├── email_parser.py            # EML parsing and data extraction
│   ├── header_analyzer.py         # Header and authentication analysis
│   ├── url_analyzer.py            # URL extraction and analysis
│   ├── attachment_analyzer.py     # Attachment metadata and hashing
│   ├── content_analyzer.py        # Suspicious language analysis
│   ├── threat_intel.py            # Planned VirusTotal integration
│   └── risk_engine.py             # Planned risk scoring
├── utils/
│   ├── __init__.py
│   └── helpers.py                 # Shared helper functions
├── samples/
│   ├── legitimate/                # Synthetic legitimate emails
│   └── phishing/                  # Synthetic phishing samples
├── tests/
│   ├── test_parser.py
│   └── test_analysis.py
├── screenshots/                   # Dashboard screenshots
└── README.md
```

The exact structure may change as the project develops.

## Prerequisites

The project is planned to use the following tools:

- Python 3.10 or newer
- `pip`
- Python virtual-environment support
- Git
- A modern web browser

Development is planned primarily on Kali Linux, although the application should also be able to run on other operating systems if Python and the required dependencies are installed correctly.

### Verify the Required Tools

Run:

```bash
python3 --version
python3 -m pip --version
git --version
```

On Kali Linux or another Debian-based Linux distribution, the required Python and Git packages can be installed using:

```bash
sudo apt update
sudo apt install python3-pip python3-venv git -y
```

## Installation

Clone the repository and enter the project directory:

```bash
git clone https://github.com/ariwooze/phishscope.git
cd phishscope
```

Create a virtual environment:

```bash
python3 -m venv venv
```

Activate it:

```bash
source venv/bin/activate
```

Install the project dependencies:

```bash
pip install -r requirements.txt
```

> Because the project is currently under development, the dependency list may change as new features are implemented.

## Environment Configuration

Threat-intelligence integration is planned to use environment variables to prevent API credentials from being committed to GitHub.

The intended configuration is:

```text
VIRUSTOTAL_API_KEY=your_virustotal_api_key_here
```

The repository will use an `.env.example` file to document the expected environment variables.

The actual `.env` file should remain excluded through `.gitignore`.

Example:

```text
.env
venv/
__pycache__/
*.pyc
.streamlit/
```

## Running the Dashboard

Once the initial application has been implemented, it is planned to run using:

```bash
streamlit run app.py
```

Streamlit will normally make the local dashboard available at:

```text
http://localhost:8501
```

The user will then be able to upload an authorized `.eml` file for investigation.

Stop the application by pressing `Ctrl+C` in the terminal.

## Planned Detection Logic

PhishScope is intended to use rule-based analysis to identify email characteristics that may require further investigation.

A finding will not confirm that an email is malicious. Analysts should validate findings using all available evidence and relevant environmental context.

### Sender / Reply-To Mismatch

The planned detector will compare the registered domains associated with the sender and Reply-To addresses.

For example:

```text
From:
Security Team <security@example-bank.test>

Reply-To:
support@suspicious.example
```

If the domains differ, PhishScope may generate a finding.

However, legitimate organizations may use third-party email providers, ticketing platforms, mailing systems, or customer-support services that produce similar differences.

The finding should therefore be treated as an investigation lead rather than confirmation of phishing.

### Authentication Failures

The application is planned to inspect available email-authentication results for:

- SPF
- DKIM
- DMARC

Possible results may include:

```text
PASS
FAIL
NONE
UNKNOWN
```

Failures may increase the investigation risk score.

However, authentication failures may also occur because of email forwarding, mailing-list behaviour, misconfigured domains, or incomplete email headers.

Authentication findings should therefore be considered together with other evidence.

### Suspicious URLs

The planned URL detector may evaluate several URL characteristics.

#### Raw IP Address

A URL such as:

```text
http://192.0.2.50/login
```

may be considered more suspicious than a normal domain-based URL.

The use of an IP address alone will not confirm malicious activity.

#### URL Shorteners

The project may identify common shortening services such as:

```text
bit.ly
tinyurl.com
t.co
```

URL shorteners can hide the final destination from the recipient but are also widely used for legitimate purposes.

#### HTML Link Mismatch

The project is planned to compare visible hyperlink text with the actual hyperlink destination.

For example:

```text
Displayed:
https://www.example-bank.test

Actual:
https://login.suspicious.example
```

A mismatch may indicate an attempt to mislead the recipient and may receive a higher risk score.

### Suspicious Email Language

The planned content analyzer may identify phrases commonly associated with urgency, credential theft, account warnings, or payment-related phishing.

Examples include:

```text
Urgent action required
Verify your account
Your account has been suspended
Confirm your password
Payment failed
Unusual activity detected
```

Because legitimate organizations may use similar wording, these findings are planned to receive a lower score than stronger technical indicators.

### Potentially Dangerous Attachments

The attachment analyzer is planned to inspect filenames and extensions without executing files.

Potentially higher-risk extensions may include:

```text
.exe
.scr
.js
.vbs
.bat
.cmd
.ps1
.hta
```

The detector may also check for double-extension filenames such as:

```text
invoice.pdf.exe
document.docx.scr
payment.pdf.js
```

These findings will require analyst validation because filename characteristics alone cannot determine whether a file is malicious.

### Threat-Intelligence Findings

The planned VirusTotal integration may use extracted:

- URLs
- Domains
- SHA-256 hashes

to determine whether security vendors have previously associated the indicator with malicious activity.

Threat-intelligence information will be treated as supporting evidence rather than an absolute verdict.

## Planned Test Email Pack

The project is planned to include synthetic `.eml` files for validating different investigation features.

Possible samples include:

| File | Intended Test |
|---|---|
| `legitimate.eml` | Baseline email expected to produce few or no findings |
| `replyto_mismatch.eml` | Sender and Reply-To domain mismatch |
| `auth_failure.eml` | SPF, DKIM, or DMARC failure |
| `suspicious_url.eml` | Suspicious URL characteristics |
| `link_mismatch.eml` | Displayed hyperlink differs from actual destination |
| `attachment.eml` | Potentially suspicious attachment |
| `combined_phishing.eml` | Multiple indicators within the same email |

The samples will use synthetic content and safe testing indicators rather than live phishing infrastructure or malware.

## Planned Test Procedure

Once the relevant features have been implemented, testing is planned to follow a process similar to:

1. Start PhishScope using `streamlit run app.py`.
2. Upload `legitimate.eml` and confirm that the email is parsed correctly.
3. Verify that the baseline sample produces few or no suspicious findings.
4. Upload each indicator-specific test email.
5. Confirm that the corresponding analysis module identifies the intended finding.
6. Upload `combined_phishing.eml`.
7. Confirm that multiple findings are displayed.
8. Verify that the risk score reflects the detected indicators.
9. Confirm that extracted IOCs match the contents of the sample email.
10. Test report export once the reporting functionality has been implemented.

Exact findings and risk scores may change as the detection rules are refined during development.

## Data and Privacy

The project is being designed with the following privacy considerations:

- Uploaded emails should be processed locally whenever possible.
- Do not commit real emails containing confidential or personal information to GitHub.
- Do not publish API credentials.
- Sanitize screenshots before adding them to the repository.
- Avoid exposing email addresses, credentials, tokens, internal domains, or personal information.
- Use synthetic, public training, or self-generated email samples whenever possible.
- Suspicious attachments should not be automatically executed.
- Attachment files should not be automatically uploaded to third-party services.

## Expected Limitations

The first version of PhishScope is expected to have several limitations:

- Rule-based findings may produce false positives and false negatives.
- Email-authentication information may be incomplete or unavailable in some `.eml` files.
- Authentication failures do not necessarily indicate phishing.
- Legitimate emails may contain URL shorteners, mismatched domains, or urgency-related language.
- Threat-intelligence results depend on available external information.
- VirusTotal API requests may be subject to usage limits.
- Newly created phishing infrastructure may not yet appear in threat-intelligence databases.
- Static attachment analysis cannot determine all malicious behaviour.
- The project will initially analyze individual `.eml` files rather than live mailboxes.
- A low risk score will not guarantee that an email is safe.
- A security finding should be treated as an investigation lead, not confirmation of an attack.

## Ethical Use

PhishScope is being created for cybersecurity education, defensive analysis, and authorized security investigation.

Users should analyze only email files that they own or are explicitly authorized to examine. Suspicious URLs and attachments should be handled carefully and should not be opened or executed outside an appropriately controlled environment.

The project is intended to support cybersecurity learning and investigation and must not be used for unauthorized access, phishing campaigns, malware delivery, or other malicious activities.
