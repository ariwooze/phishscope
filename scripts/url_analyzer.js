const suspiciousKeywords = [
    "login",
    "signin",
    "verify",
    "verification",
    "secure",
    "security",
    "account",
    "password",
    "update",
    "authentication"
];


const urlShorteners = [
    "bit.ly",
    "tinyurl.com",
    "t.co",
    "goo.gl",
    "ow.ly",
    "is.gd",
    "buff.ly"
];


function isIpAddress(hostname) {

    const ipv4Pattern =
        /^(25[0-5]|2[0-4]\d|1?\d?\d)(\.(25[0-5]|2[0-4]\d|1?\d?\d)){3}$/;

    return ipv4Pattern.test(hostname);
}


function hasSuspiciousPort(parsedUrl) {

    if (!parsedUrl.port) {
        return false;
    }

    const commonPorts = [
        "80",
        "443"
    ];

    return !commonPorts.includes(
        parsedUrl.port
    );
}


function findSuspiciousKeywords(urlString) {

    const lowerUrl =
        urlString.toLowerCase();

    return suspiciousKeywords.filter(
        keyword =>
            lowerUrl.includes(keyword)
    );
}


function isUrlShortener(hostname) {

    const normalizedHostname =
        hostname
            .toLowerCase()
            .replace(/^www\./, "");

    return urlShorteners.includes(
        normalizedHostname
    );
}


function countSubdomains(hostname) {

    if (isIpAddress(hostname)) {
        return 0;
    }

    const parts =
        hostname
            .replace(/^www\./, "")
            .split(".");

    if (parts.length <= 2) {
        return 0;
    }

    return parts.length - 2;
}


function containsPunycode(hostname) {

    return hostname
        .toLowerCase()
        .split(".")
        .some(part =>
            part.startsWith("xn--")
        );
}


function containsAtSymbol(urlString) {

    const withoutProtocol =
        urlString.replace(
            /^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//,
            ""
        );

    return withoutProtocol.includes("@");
}


function isLongUrl(urlString) {

    return urlString.length >= 100;
}


function getRiskLevel(score) {

    if (score >= 60) {
        return "High";
    }

    if (score >= 30) {
        return "Medium";
    }

    return "Low";
}


function analyzeUrl(urlString) {

    const findings = [];

    let parsedUrl;


    try {

        parsedUrl = new URL(
            urlString
        );

    } catch (error) {

        return {
            valid: false,
            error: "Invalid URL",
            findings: [],
            score: 0,
            risk: "Unknown"
        };
    }


    if (
        parsedUrl.protocol === "http:"
    ) {

        findings.push({
            title:
                "Unencrypted HTTP Connection",

            severity:
                "Low",

            description:
                "The URL uses HTTP instead of HTTPS.",

            score:
                5
        });

    }


    if (
        isIpAddress(
            parsedUrl.hostname
        )
    ) {

        findings.push({
            title:
                "Raw IP Address Used",

            severity:
                "Medium",

            description:
                "The URL uses an IP address instead of a domain name.",

            score:
                15
        });

    }


    if (
        hasSuspiciousPort(
            parsedUrl
        )
    ) {

        findings.push({
            title:
                "Unusual Web Port",

            severity:
                "Low",

            description:
                `The URL uses port ${parsedUrl.port}.`,

            score:
                5
        });

    }


    const detectedKeywords =
        findSuspiciousKeywords(
            parsedUrl.href
        );


    if (
        detectedKeywords.length > 0
    ) {

        findings.push({
            title:
                "Suspicious URL Keywords",

            severity:
                "Low",

            description:
                `Detected keywords: ${detectedKeywords.join(", ")}`,

            score:
                Math.min(
                    detectedKeywords.length * 3,
                    10
                )
        });

    }


    if (
        isUrlShortener(
            parsedUrl.hostname
        )
    ) {

        findings.push({
            title:
                "URL Shortening Service",

            severity:
                "Medium",

            description:
                "The URL uses a shortening service that hides the final destination.",

            score:
                10
        });

    }


    const subdomainCount =
        countSubdomains(
            parsedUrl.hostname
        );


    if (
        subdomainCount >= 3
    ) {

        findings.push({
            title:
                "Excessive Subdomains",

            severity:
                "Medium",

            description:
                `The hostname contains ${subdomainCount} subdomain levels.`,

            score:
                10
        });

    }


    if (
        containsPunycode(
            parsedUrl.hostname
        )
    ) {

        findings.push({
            title:
                "Punycode Domain",

            severity:
                "Medium",

            description:
                "The hostname contains a Punycode-encoded domain label.",

            score:
                10
        });

    }


    if (
        containsAtSymbol(
            urlString
        )
    ) {

        findings.push({
            title:
                "At Symbol in URL",

            severity:
                "High",

            description:
                "The URL contains an @ symbol that may obscure the actual destination.",

            score:
                20
        });

    }


    if (
        isLongUrl(
            parsedUrl.href
        )
    ) {

        findings.push({
            title:
                "Unusually Long URL",

            severity:
                "Low",

            description:
                `The URL contains ${parsedUrl.href.length} characters.`,

            score:
                5
        });

    }


    const score =
        Math.min(
            findings.reduce(
                (total, finding) =>
                    total +
                    finding.score,
                0
            ),
            100
        );


    return {
        valid: true,

        url:
            parsedUrl.href,

        protocol:
            parsedUrl.protocol,

        hostname:
            parsedUrl.hostname,

        port:
            parsedUrl.port,

        pathname:
            parsedUrl.pathname,

        findings:
            findings,

        score:
            score,

        risk:
            getRiskLevel(score)
    };

}