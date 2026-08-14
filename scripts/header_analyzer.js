function getHeaderValue(
    rawHeaders,
    headerName
) {

    const lines =
        rawHeaders.split(/\r?\n/);

    const normalizedHeader =
        headerName.toLowerCase();

    let currentName = "";
    let currentValue = "";

    const headers = {};


    for (const line of lines) {

        // Handle folded / continued header lines
        if (
            /^\s/.test(line) &&
            currentName
        ) {

            currentValue +=
                " " + line.trim();

            continue;
        }


        // Save the previous header before reading a new one
        if (currentName) {

            if (!headers[currentName]) {

                headers[currentName] =
                    currentValue.trim();
            }
        }


        const separatorIndex =
            line.indexOf(":");


        // Skip lines that are not valid header fields
        if (separatorIndex === -1) {

            currentName = "";
            currentValue = "";

            continue;
        }


        currentName =
            line
                .slice(
                    0,
                    separatorIndex
                )
                .trim()
                .toLowerCase();


        currentValue =
            line
                .slice(
                    separatorIndex + 1
                )
                .trim();
    }


    // Save the final header
    if (
        currentName &&
        !headers[currentName]
    ) {

        headers[currentName] =
            currentValue.trim();
    }


    return (
        headers[normalizedHeader] ||
        ""
    );
}


function extractEmailAddress(
    value
) {

    if (!value) {
        return "";
    }

    const angleMatch =
        value.match(
            /<([^<>@\s]+@[^<>@\s]+)>/
        );


    if (angleMatch) {

        return angleMatch[1]
            .toLowerCase();
    }


    // Fallback for addresses without angle brackets
    const emailMatch =
        value.match(
            /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i
        );


    return emailMatch
        ? emailMatch[0].toLowerCase()
        : "";
}


function extractEmailDomain(
    emailAddress
) {

    if (
        !emailAddress ||
        !emailAddress.includes("@")
    ) {

        return "";
    }


    return emailAddress
        .split("@")
        .pop()
        .toLowerCase();
}


function extractAuthResult(
    authenticationResults,
    mechanism
) {

    if (!authenticationResults) {

        return "unknown";
    }


    const pattern =
        new RegExp(
            `${mechanism}\\s*=\\s*([a-zA-Z0-9_-]+)`,
            "i"
        );


    const match =
        authenticationResults.match(
            pattern
        );


    return match
        ? match[1].toLowerCase()
        : "unknown";
}


function getHeaderRiskLevel(
    score
) {

    if (score >= 60) {
        return "High";
    }


    if (score >= 30) {
        return "Medium";
    }


    return "Low";
}


function analyzeEmailHeader(
    rawHeaders
) {

    const findings = [];


    if (
        !rawHeaders ||
        !rawHeaders.trim()
    ) {

        return {
            valid: false,
            error:
                "No email header provided.",
            findings: [],
            score: 0,
            risk: "Unknown"
        };
    }


    // Extract raw header values

    const from =
        getHeaderValue(
            rawHeaders,
            "From"
        );


    const replyTo =
        getHeaderValue(
            rawHeaders,
            "Reply-To"
        );


    const returnPath =
        getHeaderValue(
            rawHeaders,
            "Return-Path"
        );


    const subject =
        getHeaderValue(
            rawHeaders,
            "Subject"
        );


    const messageId =
        getHeaderValue(
            rawHeaders,
            "Message-ID"
        );


    const authenticationResults =
        getHeaderValue(
            rawHeaders,
            "Authentication-Results"
        );


    // Extract email addresses

    const fromAddress =
        extractEmailAddress(
            from
        );


    const replyToAddress =
        extractEmailAddress(
            replyTo
        );


    const returnPathAddress =
        extractEmailAddress(
            returnPath
        );


    // Extract domains

    const fromDomain =
        extractEmailDomain(
            fromAddress
        );


    const replyToDomain =
        extractEmailDomain(
            replyToAddress
        );


    const returnPathDomain =
        extractEmailDomain(
            returnPathAddress
        );


    // Extract authentication results

    const spf =
        extractAuthResult(
            authenticationResults,
            "spf"
        );


    const dkim =
        extractAuthResult(
            authenticationResults,
            "dkim"
        );


    const dmarc =
        extractAuthResult(
            authenticationResults,
            "dmarc"
        );


    // Detection Rule: Sender / Reply-To mismatch

    if (
        fromDomain &&
        replyToDomain &&
        fromDomain !== replyToDomain
    ) {

        findings.push({

            title:
                "Sender / Reply-To Domain Mismatch",

            severity:
                "Medium",

            description:
                `From domain "${fromDomain}" differs from Reply-To domain "${replyToDomain}".`,

            score:
                10
        });
    }


    // Detection Rule: Sender / Return-Path mismatch

    if (
        fromDomain &&
        returnPathDomain &&
        fromDomain !== returnPathDomain
    ) {

        findings.push({

            title:
                "Sender / Return-Path Domain Mismatch",

            severity:
                "Low",

            description:
                `From domain "${fromDomain}" differs from Return-Path domain "${returnPathDomain}".`,

            score:
                5
        });
    }


    // Detection Rule: SPF failure

    if (
        spf === "fail" ||
        spf === "softfail"
    ) {

        findings.push({

            title:
                "SPF Authentication Failure",

            severity:
                "Medium",

            description:
                `SPF result is "${spf}".`,

            score:
                15
        });
    }


    // Detection Rule: DKIM failure

    if (
        dkim === "fail"
    ) {

        findings.push({

            title:
                "DKIM Authentication Failure",

            severity:
                "Medium",

            description:
                "DKIM authentication failed.",

            score:
                10
        });
    }


    // Detection Rule: DMARC failure

    if (
        dmarc === "fail"
    ) {

        findings.push({

            title:
                "DMARC Authentication Failure",

            severity:
                "High",

            description:
                "DMARC authentication failed.",

            score:
                20
        });
    }


    // Calculate final score

    const score =
        Math.min(
            findings.reduce(
                (
                    total,
                    finding
                ) =>
                    total +
                    finding.score,
                0
            ),
            100
        );


    const risk =
        getHeaderRiskLevel(
            score
        );


    // Return analysis result

    return {

        valid:
            true,


        // Raw header fields

        from:
            from,

        replyTo:
            replyTo,

        returnPath:
            returnPath,

        subject:
            subject,

        messageId:
            messageId,

        authenticationResults:
            authenticationResults,


        // Parsed addresses

        fromAddress:
            fromAddress,

        replyToAddress:
            replyToAddress,

        returnPathAddress:
            returnPathAddress,


        // Parsed domains

        fromDomain:
            fromDomain,

        replyToDomain:
            replyToDomain,

        returnPathDomain:
            returnPathDomain,


        // Authentication

        spf:
            spf,

        dkim:
            dkim,

        dmarc:
            dmarc,


        // Analysis

        findings:
            findings,

        score:
            score,

        risk:
            risk
    };
}