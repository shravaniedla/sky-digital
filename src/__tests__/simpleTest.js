const { TestWatcher } = require('@jest/core');
const {Builder, By, until} = require('selenium-webdriver');

describe('This feature will make sure that the shop page is navigable and usable.', () => {
   test('User navigates to shop page', async () => {
        let driver = new Builder().forBrowser('chrome').build();
        try {
        //given
         await driver.get('https://www.sky.com');
        
         driver.manage().deleteAllCookies();
         const iframe = driver.findElement(By.css("iframe[id*='sp_message']"));
         
        // switching to frame
        await driver.switchTo().frame(iframe);
        await (await driver.findElement(By.xpath("//button[text()='Agree']"))).click();
        // switch to default
        await driver.switchTo().defaultContent();

        const skyText = await driver.findElement(By.css('h2')).getText();
        expect(skyText).toContain('Epic. Endless. Entertainment.');

        await driver.findElement(By.xpath("//a[contains(@href, '/deals')]")).click();
        
        await driver.wait(until.elementIsVisible((await driver).findElement(By.xpath("//h1[text()='Sky Deals']"))));
        let url = await driver.getCurrentUrl();
        expect(url).toEqual('https://www.sky.com/deals');

        
    } catch (error) {
            console.log(error);
        }

        await driver.quit();
    }, 30000);

    test('User sees tiles on the shop page', async () => {

        let driver = new Builder().forBrowser('chrome').build();

        try {
            await driver.get('https://www.sky.com');

            const iframe = driver.findElement(By.css("iframe[id*='sp_message']"));
         
            // switching to frame
            await driver.switchTo().frame(iframe);
            await (await driver.findElement(By.xpath("//button[text()='Agree']"))).click();
            // switch to default
            await driver.switchTo().defaultContent();

            await driver.findElement(By.xpath("//a[contains(@class, 'sign-in-link')]")).click();
            await driver.findElement(By.xpath("//input[@id='username']")).sendKeys('shravani.edla@gmail.com');
            await driver.findElement(By.xpath("//input[@id='password']")).sendKeys('invalid');

            await driver.findElement(By.xpath("//button[@id='signinButton']")).click();

            let errorMessage = await driver.findElement(By.xpath("//div[@class='globalErrors']")).getText();
            expect(errorMessage).toBe("Sorry, we did not recognise either your username or password");           
        
        } catch (error) {
            console.log(error)
        }
        await driver.quit();
    },30000);

   test( 'User sees a list of deals on the deals page', async() => {
    let driver = new Builder().forBrowser('chrome').build();
    const expectedPrices = ['£25','£43','£36'];
    try {
        //given
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

        expect(actualDeals).toStrictEqual(expectedDeals);
        
        let prices = await driver.findElements(By.xpath("//span[@class='text__Text-sc-1u9gciq-0 ebwAcM']"));
        
        const allPrices = [];
        
        for (const x in prices) {
            let element = await prices[x].getText();
            let finalPrice = element.split("\n").pop();
            
            allPrices.push(finalPrice);
        }
        const actualPrices = allPrices.slice(0,3);

        expect(actualPrices).toStrictEqual(expectedPrices);

    } catch (error) {
        console.log(error);
    }
    await driver.quit();
   }, 30000);
})