// const {chromium } = require('playwright-chromium');
const { webkit } = require('playwright');

//const {AppInsightsContextListener } = require('appinsights-playwright')

module.exports = async function (context, req) {
    context.log("Function Entered.");

    // Initialize AppInsightsListener to collect information about Playwright execution
    // -'AutoCollect' to collect screenshots after every action taken
    // -'OnFailure' to collect screenshots only for the failed actions
    // -'No' to skip the screenshots collections. Default value.
    //const listener = new AppInsightsContextListener("OnFailure");

    try {
        const browser = await chromium.launch({headless: true});
        const browserContext = await browser.newContext();

        // Open new page
        const page = await browserContext.newPage();

        // Set timeout in ms
        page.setDefaultTimeout(10000);

        await page.goto('https://mercuryhealth2019v3-dev.azurewebsites.net/');
        await page.click('text="Nutrition"');
        expect(await page.title()).toBe('Nutrition');

        await page.click('text="Exercises"');
        expect(await page.title()).toBe('Exercises');

        await page.click('text="Home"');
        expect(await page.title()).toBe('I Donno Page?');
        assert.notEqual(page.title(),"I Donno Page?");

        // Close page
        await page.close();

        // ---------------------
        await browserContext.close();
        await browser.close();

    } catch (err) {
        context.log.error(err);
        context.log("Ooops! We got an error!!!");
        console.error(err);
        return false;
    } finally {
        // Serialize collected data into the response
        context.res = listener.serializeData();
        context.done();
    }
};
