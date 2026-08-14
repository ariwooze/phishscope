function isSupportedUrl(url) {
    return (
        url.startsWith("http://") ||
        url.startsWith("https://")
    );
}

function getDisplayPort(
    protocol,
    port
) {

    if (port) {
        return port;
    }

    if (protocol === "https:") {
        return "443 (default)";
    }

    if (protocol === "http:") {
        return "80 (default)";
    }

    return "Default";
}

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        const currentUrlElement =
            document.getElementById(
                "current-url"
            );

        const analyzeButton =
            document.getElementById(
                "analyze-button"
            );

        const statusElement =
            document.getElementById(
                "status"
            );

        const resultsElement =
            document.getElementById(
                "analysis-results"
            );

        const riskLevelElement =
            document.getElementById(
                "risk-level"
            );

        const riskScoreElement =
            document.getElementById(
                "risk-score"
            );

        const findingsListElement =
            document.getElementById(
                "findings-list"
            );
            
        const protocolElement =
            document.getElementById(
                "detail-protocol"
            );

        const hostnameElement =
            document.getElementById(
                "detail-hostname"
            );

        const portElement =
            document.getElementById(
                "detail-port"
            );

        const pathElement =
            document.getElementById(
                "detail-path"
            );


        let currentUrl = "";


        try {

            const tabs =
                await chrome.tabs.query({
                    active: true,
                    currentWindow: true
                });

            const currentTab =
                tabs[0];


            if (
                currentTab &&
                currentTab.url
            ) {

                currentUrl =
                    currentTab.url;

                currentUrlElement.textContent =
                    currentUrl;


                // Check whether the current page
                // is supported by PhishScope
                if (!isSupportedUrl(currentUrl)) {

                    currentUrlElement.textContent =
                        "This page cannot be analyzed.";

                    analyzeButton.disabled =
                        true;

                    statusElement.textContent =
                        "Only HTTP and HTTPS URLs are supported.";

                }

            } else {

                currentUrlElement.textContent =
                    "Unable to retrieve URL";

                analyzeButton.disabled =
                    true;

            }

        } catch (error) {

            console.error(error);

            currentUrlElement.textContent =
                "Error retrieving current URL";

            analyzeButton.disabled =
                true;

        }


        analyzeButton.addEventListener(
            "click",
            () => {

                if (!currentUrl) {
                    return;
                }

                const result =
                    analyzeUrl(currentUrl);

                if (!result.valid) {

                    statusElement.textContent =
                        result.error;

                    return;
                }

                protocolElement.textContent =
                    result.protocol
                        .replace(":", "")
                        .toUpperCase();

                hostnameElement.textContent =
                    result.hostname;

                portElement.textContent =
                    getDisplayPort(
                        result.protocol,
                        result.port
                    );

                pathElement.textContent =
                    result.pathname || "/";

                riskLevelElement.textContent =
                    result.risk;

                riskScoreElement.textContent =
                    `Score: ${result.score}/100`;

                findingsListElement.innerHTML =
                    "";

                if (
                    result.findings.length === 0
                ) {

                    findingsListElement.innerHTML =
                        `
                        <div class="finding">
                            No suspicious URL indicators detected.
                        </div>
                        `;

                } else {

                    for (
                        const finding
                        of result.findings
                    ) {

                        const findingElement =
                            document.createElement(
                                "div"
                            );

                        findingElement.className =
                            "finding";

                        findingElement.innerHTML =
                            `
                            <div class="finding-header">
                                <span class="severity">
                                    ${finding.severity}
                                </span>

                                <strong>
                                    ${finding.title}
                                </strong>
                            </div>

                            <p>
                                ${finding.description}
                            </p>

                            <span class="finding-score">
                                +${finding.score}
                            </span>
                            `;

                        findingsListElement.appendChild(
                            findingElement
                        );

                    }

                }

                resultsElement.classList.remove(
                    "hidden"
                );

                statusElement.textContent =
                    "Analysis complete";

            }
        );

    }
);