const { describe ,expect, test} = require('@jest/globals');
const {Builder, By, until} = require('selenium-webdriver');

describe('This feature will make sure that the shop page is navigable and usable.', () => {  
    test('User navigates to shop page', async () => {
        let driver = new Builder().forBrowser('chrome').build();
        //GIVEN
        await driver.get('https://www.sky.com');
    
        await driver.manage().deleteAllCookies();
       // acceptCookie(driver);

        const iframe = driver.findElement(By.css("iframe[id*='sp_message']"));

        // switching to frame
        await driver.switchTo().frame(iframe);

        await driver.findElement(By.xpath("//button[text()='Agree']")).click();

        // switch to default
        await driver.switchTo().defaultContent();

        const skyText = await driver.findElement(By.css('h2')).getText();
        expect(skyText).toContain('Epic. Endless. Entertainment.');

        //WHEN
        await driver.findElement(By.xpath("//a[contains(@href, '/deals')]")).click();
        
        await driver.wait(until.elementIsVisible((await driver).findElement(By.xpath("//h1[text()='Sky Deals']"))));

        let url = await driver.getCurrentUrl();
        await driver.quit();

        //THEN
        expect(url).toEqual('https://www.sky.com/deals');

    }, 30000);

    test('User sees tiles on the shop page', async () => {
        var errorMessage = '';
        let driver = new Builder().forBrowser('chrome').build();
        //GIVEN
        await driver.get('https://www.sky.com');

        const iframe = driver.findElement(By.css("iframe[id*='sp_message']"));
        
        // switching to frame
        await driver.switchTo().frame(iframe);
        await (await driver.findElement(By.xpath("//button[text()='Agree']"))).click();
        // switch to default
        await driver.switchTo().defaultContent();

        //WHEN
        await driver.findElement(By.xpath("//a[contains(@class, 'sign-in-link')]")).click();
        await driver.findElement(By.id('username')).sendKeys('shravani.edla@gmail.com');
        await driver.findElement(By.id('password')).sendKeys('invalid');

        await driver.findElement(By.id('signinButton')).click();

        try{
            errorMessage = await driver.findElement(By.className('globalErrors')).getText();
        }catch (error){
            errorMessage = 'Ive hit captcha error';
        }

        await driver.quit();

        //THEN
        expect(errorMessage).toBe("Sorry, we did not recognise either your username or password");

    },30000);

   test( 'User sees a list of deals on the deals page', async() => {
        let driver = new Builder().forBrowser('chrome').build();
        const expectedPrices = ['£25','£43','£36'];

        //GIVEN
        await driver.get('https://www.sky.com/deals');

        const iframe = driver.findElement(By.css("iframe[id*='sp_message']"));
            
        // switching to frame
        await driver.switchTo().frame(iframe);
        await (await driver.findElement(By.xpath("//button[text()='Agree']"))).click();
        // switch to default
        await driver.switchTo().defaultContent();

        //Assert page text
        let skyDeals = await driver.findElements(By.xpath("//div[@class='box__Box-eb0ezq-0 eTXizI']"));
        const expectedDeals = ['Sofa So Good','Spring Into Action','Sky TV, Netflix & Cinema','The Full House','Sky TV & Kids','Build your own package'];
        const actualDeals = [];
        
        for (const i in skyDeals) {
            const dealText = await skyDeals[i].getText();
            actualDeals.push(dealText);
        }
        //THEN
        expect(actualDeals).toStrictEqual(expectedDeals);
        
        let prices = await driver.findElements(By.xpath("//span[@class='text__Text-sc-1u9gciq-0 ebwAcM']"));
        
        const allPrices = [];
        
        for (const x in prices) {
            let element = await prices[x].getText();
            let finalPrice = element.split("\n").pop();
            
            allPrices.push(finalPrice);
        }
        const actualPrices = allPrices.slice(0,3);

        await driver.quit();
        //THEN
        expect(actualPrices).toStrictEqual(expectedPrices);

   }, 30000);
});
/*
async function acceptCookie (driver) {

    const iframe = driver.findElement(By.css("iframe[id*='sp_message']"));
    // switching to frame
    await driver.switchTo().frame(iframe);

    await driver.findElement(By.xpath("//button[text()='Agree']")).click();

    // switch to default
    await driver.switchTo().defaultContent();
}
*/

