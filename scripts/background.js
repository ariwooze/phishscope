importScripts("url_analyzer.js");

console.log("PhishScope background worker loaded");


chrome.runtime.onInstalled.addListener(() => {

    console.log("PhishScope installed/reloaded");

    chrome.contextMenus.removeAll(() => {

        chrome.contextMenus.create({
            id: "phishscope-analyze-link",
            title: "Analyze link with PhishScope",
            contexts: ["link"]
        });

        console.log("Context menu created");
    });
});


chrome.contextMenus.onClicked.addListener(
    async (info) => {

        if (
            info.menuItemId !==
            "phishscope-analyze-link"
        ) {
            return;
        }


        if (!info.linkUrl) {
            return;
        }


        console.log(
            "Analyzing:",
            info.linkUrl
        );


        const result =
            analyzeUrl(
                info.linkUrl
            );


        await chrome.storage.local.set({
            lastLinkAnalysis: {
                originalUrl:
                    info.linkUrl,

                result:
                    result,

                timestamp:
                    Date.now()
            }
        });


        console.log(
            "Analysis stored successfully"
        );
    }
);