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

        // Elements

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


        // Right-click analysis elements

        const contextAnalysisElement =
            document.getElementById(
                "context-analysis"
            );

        const contextUrlElement =
            document.getElementById(
                "context-url"
            );

        const viewContextButton =
            document.getElementById(
                "view-context-button"
            );

        const inspectLinksButton =
            document.getElementById(
                "inspect-links-button"
            );


        const pageLinkResultsElement =
            document.getElementById(
                "page-link-results"
            );


        const pageLinkSummaryElement =
            document.getElementById(
                "page-link-summary"
            );


        const linkMismatchListElement =
            document.getElementById(
                "link-mismatch-list"
            );


        let currentUrl = "";


        // Reusable result renderer

        function displayAnalysisResult(
            result
        ) {

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

                    const item =
                        document.createElement(
                            "div"
                        );


                    item.className =
                        "finding";


                    item.innerHTML =
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
                        item
                    );
                }
            }


            resultsElement.classList.remove(
                "hidden"
            );


            statusElement.textContent =
                "Analysis complete";
        }


         // Load current browser URL

        try {

            const tabs =
                await chrome.tabs.query({
                    active: true,
                    currentWindow: true
                });


            const tab =
                tabs[0];


            if (
                tab &&
                tab.url
            ) {

                currentUrl =
                    tab.url;


                if (
                    isSupportedUrl(
                        currentUrl
                    )
                ) {

                    currentUrlElement.textContent =
                        currentUrl;

                } else {

                    currentUrlElement.textContent =
                        "This page cannot be analyzed.";

                    analyzeButton.disabled =
                        true;

                    statusElement.textContent =
                        "Only HTTP and HTTPS URLs are supported.";
                }

            }

        } catch (error) {

            console.error(error);

            currentUrlElement.textContent =
                "Unable to retrieve URL";

            analyzeButton.disabled =
                true;
        }


        // Load last right-click result

        try {

            const storedData =
                await chrome.storage.local.get(
                    "lastLinkAnalysis"
                );


            if (
                storedData.lastLinkAnalysis
            ) {

                contextUrlElement.textContent =
                    storedData
                        .lastLinkAnalysis
                        .originalUrl;


                contextAnalysisElement
                    .classList
                    .remove(
                        "hidden"
                    );
            }

        } catch (error) {

            console.error(
                "Unable to load stored analysis:",
                error
            );
        }


        // Analyze current page URL

        analyzeButton.addEventListener(
            "click",
            () => {

                if (!currentUrl) {
                    return;
                }


                const result =
                    analyzeUrl(
                        currentUrl
                    );


                displayAnalysisResult(
                    result
                );
            }
        );


        // View right-click result

        viewContextButton.addEventListener(
            "click",
            async () => {

                const storedData =
                    await chrome.storage.local.get(
                        "lastLinkAnalysis"
                    );


                if (
                    !storedData.lastLinkAnalysis
                ) {
                    return;
                }


                const result =
                    storedData
                        .lastLinkAnalysis
                        .result;


                displayAnalysisResult(
                    result
                );
            }
        );

        inspectLinksButton.addEventListener(
            "click",
            async () => {

                try {

                    const tabs =
                        await chrome.tabs.query({
                            active: true,
                            currentWindow: true
                        });


                    const tab =
                        tabs[0];


                    if (
                        !tab ||
                        !tab.id ||
                        !tab.url ||
                        !isSupportedUrl(
                            tab.url
                        )
                    ) {

                        statusElement.textContent =
                            "This page cannot be inspected.";

                        return;
                    }


                    await chrome.scripting.executeScript({

                        target: {
                            tabId:
                                tab.id
                        },

                        files: [
                            "scripts/content.js"
                        ]
                    });


                    const response =
                        await chrome.tabs.sendMessage(
                            tab.id,
                            {
                                type:
                                    "PHISHSCOPE_INSPECT_LINKS"
                            }
                        );


                    pageLinkSummaryElement.textContent =
                        `${response.totalLinks} links inspected. ` +
                        `${response.mismatches.length} mismatches found.`;


                    linkMismatchListElement.innerHTML =
                        "";


                    for (
                        const mismatch
                        of response.mismatches
                    ) {

                        const item =
                            document.createElement(
                                "div"
                            );


                        item.className =
                            "finding";


                        item.innerHTML =
                            `
                            <div class="finding-header">

                                <span class="severity">
                                    HIGH
                                </span>

                                <strong>
                                    ${mismatch.title}
                                </strong>

                           </div>

                            <p>
                                ${mismatch.description}
                            </p>

                            <p>
                                <strong>
                                    Displayed
                                </strong>
                                <br>
                                ${mismatch.displayed}
                            </p>

                            <p>
                                <strong>
                                    Destination
                                </strong>
                                <br>
                                ${mismatch.destination}
                            </p>
                            `;


                        linkMismatchListElement
                            .appendChild(
                                item
                            );
                    }


                    pageLinkResultsElement
                        .classList
                        .remove(
                            "hidden"
                        );


                    statusElement.textContent =
                        "Page inspection complete";

                } catch (error) {

                    console.error(error);

                    statusElement.textContent =
                        "Unable to inspect this page.";
                }
            }
        );
    }
);