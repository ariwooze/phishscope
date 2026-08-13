document.addEventListener("DOMContentLoaded", async () => {

    const currentUrlElement =
        document.getElementById("current-url");

    const analyzeButton =
        document.getElementById("analyze-button");

    const statusElement =
        document.getElementById("status");

    try {

        const tabs = await chrome.tabs.query({
            active: true,
            currentWindow: true
        });

        const currentTab = tabs[0];

        console.log("Current tab:", currentTab);

        if (currentTab && currentTab.url) {

            currentUrlElement.textContent =
                currentTab.url;

        } else {

            currentUrlElement.textContent =
                "Unable to retrieve URL";

        }

    } catch (error) {

        console.error(
            "Unable to retrieve current tab:",
            error
        );

        currentUrlElement.textContent =
            "Error retrieving current URL";
    }


    analyzeButton.addEventListener("click", () => {

        statusElement.textContent =
            "URL analysis will be added in Phase 2.";

    });

});