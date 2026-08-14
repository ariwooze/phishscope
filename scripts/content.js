if (!window.phishScopeContentLoaded) {

    window.phishScopeContentLoaded =
        true;


    function looksLikeUrl(text) {

        const value =
            text.trim().toLowerCase();

        return (
            value.startsWith("http://") ||
            value.startsWith("https://") ||
            value.startsWith("www.")
        );
    }


    function parseDisplayedUrl(text) {

        let value =
            text.trim();


        if (
            value.startsWith("www.")
        ) {

            value =
                "https://" + value;
        }


        try {

            return new URL(value);

        } catch {

            return null;
        }
    }


    function inspectLinks() {

        const links =
            Array.from(
                document.querySelectorAll(
                    "a[href]"
                )
            );


        const mismatches =
            [];


        for (
            const link
            of links
        ) {

            const displayedText =
                link.textContent.trim();


            if (
                !looksLikeUrl(
                    displayedText
                )
            ) {
                continue;
            }


            const displayedUrl =
                parseDisplayedUrl(
                    displayedText
                );


            if (!displayedUrl) {
                continue;
            }


            let actualUrl;


            try {

                actualUrl =
                    new URL(
                        link.href
                    );

            } catch {

                continue;
            }


            if (
                displayedUrl.hostname !==
                actualUrl.hostname
            ) {

                mismatches.push({

                    title:
                        "Link Destination Mismatch",

                    severity:
                        "High",

                    displayed:
                        displayedText,

                    destination:
                        link.href,

                    description:
                        `Displayed hostname "${displayedUrl.hostname}" differs from destination "${actualUrl.hostname}".`
                });
            }
        }


        return {

            totalLinks:
                links.length,

            mismatches:
                mismatches
        };
    }


    chrome.runtime.onMessage.addListener(
        (
            message,
            sender,
            sendResponse
        ) => {

            if (
                message.type ===
                "PHISHSCOPE_INSPECT_LINKS"
            ) {

                sendResponse(
                    inspectLinks()
                );
            }
        }
    );
}