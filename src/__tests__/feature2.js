const { describe ,expect, test} = require('@jest/globals');
const {Builder, By, until} = require('selenium-webdriver');
//import { URL } from ('../pages/skyhome');

describe('This feature will make the search show the results that are determined by editorial, as well as generic searches', () => {
    test('User sees the editorial section in specific searches', async () => {
        
        let driver = new Builder().forBrowser('chrome').build();
        
        driver.manage().deleteAllCookies();

        const expectedText = 'Unlock the UK’s widest range of Ultra HD entertainment with Sky Q and multiscreen. Take a look at our best broadband deals and discover our range of Mobile phones and data plans.';
        
        //given
        await driver.get('https://www.sky.com');

        const iframe = driver.findElement(By.css("iframe[id*='sp_message']"));
        
        // switching to frame
        await driver.switchTo().frame(iframe);
        await (await driver.findElement(By.xpath("//button[text()='Agree']"))).click();
        // switch to default
        await driver.switchTo().defaultContent();

        await driver.findElement(By.id("masthead-search-toggle")).click();
        await driver.findElement(By.xpath("//input[@data-test-id='input-box']")).sendKeys('sky');

        await driver.wait(until.elementLocated(By.xpath("//div[@data-test-id = 'editorial-section']")),5000);

        const editorialText = await driver.wait(until.elementIsVisible((await driver).findElement(By.xpath("//div[contains (@class, 'c-text-body')]"))));
        
        const actualText = await editorialText.getText();

        expect(actualText).toEqual(expectedText);

        await driver.quit();
        },30000);
});