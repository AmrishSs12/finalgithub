import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const testJSON = require('../../pageobjects/standardPageobjects/Table1/table1Detail.json');
const testCustomJSON = require('../../pageobjects/customPageobjects/Table1/table1Detail.json');
const mockData = require('../../mockData/Table1/table1Detailmockdata.json');
import testcaseService from '../../../services/testcase.service.ts';
import { browser, $, $$ } from '@wdio/globals';
testJSON.components = testJSON.components.concat(testCustomJSON.components);
import { environment } from '../../environment.ts';
let resultResponse = {};
var cookies: any;
await describe(testJSON.pageName + ' | PageLoad | Open', async () => {
    await it('Verify whether the page is open', async () => {
        await browser.url(environment.baseUrl);
        await $('#main-container').waitForExist({ timeout: 50000 });
        cookies = await browser.getCookies(['RSESSION']);
        await testcaseService.createMockupRecord(mockData.create, cookies, resultResponse);
        function checkMockdatacreated(){
            if(Object.keys(resultResponse)?.sort()?.toString() == Object.keys(mockData.create)?.sort()?.toString()){
                $('#dummyForUITest').click();
            }else{
                setTimeout(()=>{
                    checkMockdatacreated();
                },1000)
            }
        }
        checkMockdatacreated();
        await $('.mockdatacreated').waitForExist({ timeout: 50000 });
        await browser.pause(2000);
        await browser.url(environment.baseUrl + environment.defaultPath + testJSON.pageUrl);
        if (testJSON.elementConfirm)
            await $(testJSON.elementConfirm.selector).waitForExist({ timeout: testJSON.elementConfirm.time || 50000 });
    });
})
var lastComponent = testJSON.components[testJSON.components.length - 1];
var lastTest = lastComponent.tests[lastComponent.tests.length - 1];
var lastTestCasename = lastTest.testcases[lastTest.testcases.length - 1].name;
await testJSON.components.forEach(async (component: any) => {
    if (!component || component.length == 0)
        return
    for (const test of component.tests) {
        describe(testJSON.pageName + ' | ' + component.name + ' | ' + test.name, async () => {
            await testcaseService.iterateTestCases(test.testcases, callback, lastTestCasename);
        })
    }
});
function callback() {
    testcaseService.deleteMockupRecordFull(mockData.delete, (resultResponse || []), cookies)
}

