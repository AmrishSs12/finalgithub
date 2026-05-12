import { Key } from 'webdriverio'
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import { expect } from "chai";
import * as config from './constants.js';
import { browser, $, $$ } from '@wdio/globals'
import fetch from 'node-fetch';
import { environment } from '../test/environment.js';
class testcaseService {
  async iterateTestCases(data: any, callback: any, lastTestCasename: any) {
    if (!data || data.length == 0)
      return
    for (const testCase of data) {
      if (testCase.name) {
        it(testCase.name, async () => {
          console.log('Test cases name', testCase.name);
          await this.executeEachTestCases(testCase, callback, lastTestCasename);
          if (testCase.name === lastTestCasename) {
            callback();
          }
        });
      } else {
        console.log('Test cases without name', testCase);
        await this.executeEachTestCases(testCase, callback, lastTestCasename);
      }
    }
  }

  async executeEachTestCases(testCase: any, callback: any, lastTestCasename: any) {
    await this.iterateTestCases(testCase.beforeActions, callback, lastTestCasename);
    const selector = testCase.selector ? await $(testCase.selector) : null;
    let res;
    if (testCase.action == 'enter') {
      await browser.keys([Key.Enter]);
      await browser.pause(100);
    } else if (testCase.action == 'back') {
      await browser.back();
      await browser.pause(100);
    } else if (testCase.action == 'forward') {
      await browser.forward();
      await browser.pause(100);
    }  else if (testCase.action == 'wait') {
      await browser.pause(testCase.time || config.defaultWait);
    } else if (testCase.action == 'getUrl') {
      res = await browser.getUrl();
    } else if (testCase.action == 'waitUntil') {
      await $(testCase.selector).waitUntil(async function () {
        return await $(testCase.waited.selector)[testCase.waited.action]() == testCase.waited.match;
      }, {
        timeout: testCase.waited.timeout || config.defaultWait
      })
      await browser.pause(100);
    } else if (config.actions.includes(testCase.action)) {
      console.log('ACTION', testCase)
      if (testCase.value == undefined || testCase.value == null)
        res = await (selector as any)[testCase.action]();
      else
        res = await (selector as any)[testCase.action](testCase.value);
    }
    await this.iterateTestCases(testCase.expected, callback, lastTestCasename);

    if (testCase.condition && res) {
      let result = res;
      if (testCase.action === 'getCSSProperty' && (testCase.value === 'background-color')) {
        let hexA = this.functionRGBAToHexA(res.value);
        let hsl = this.functionHexToHSL(hexA);
        console.log("hsl:" + hsl);
        result = hsl;
        console.log("colorrrr:" + result);
      }
      else if (testCase.action === 'getCSSProperty') {
        result = res.value;
      }
      await expect(result).to[testCase.condition](testCase.match);
    }

    await this.iterateTestCases(testCase.afterActions, callback, lastTestCasename);

    await browser.pause(500);
  }

  fireService(tableObjects: any, key: any, cookie: any, resultResponse: any) {
    const tableObj = Object.values(tableObjects.inputData);
    var obj: any = {};
    Object.values(tableObjects.foreignKeyConfiguration).forEach((element: any, idx: any) => {
      obj[Object.keys(tableObjects.foreignKeyConfiguration)[idx]] = resultResponse[element.tableName][element.tableRecordNo][element.field];
    });

    tableObj.forEach(async (req: any) => {
      const response = await fetch(environment.baseUrl + tableObjects.requestUrl, {
        method: tableObjects.method,
        body: JSON.stringify(req),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          'Cookie': 'RSESSION=' + cookie[0]['value']
        }
      });
      const res = await response?.text();
      if (!resultResponse[key]) resultResponse[key] = {}
      resultResponse[key][Object.keys(resultResponse[key]).length] = JSON.parse(res);
    });

  }

  checkDependantServiceCompleted(tableObj: any, key: any, cookie: any, resultResponse: any) {
    const gettables = Object.values(tableObj.foreignKeyConfiguration).map((o: any) => o.tableName);
    if (gettables.every(element => Object.keys(resultResponse).includes(element))) {
      this.fireService(tableObj, key, cookie, resultResponse);
    } else {
      setTimeout(() => {
        this.checkDependantServiceCompleted(tableObj, key, cookie, resultResponse)
      }, 1000)
    }
  }

  createMockupRecord(createObj: any, cookies: any, resultResponse: any) {
    Object.values(createObj).forEach((o: any, idx) => {
      var key = Object.keys(createObj)[idx];
      if (Object.keys(o.foreignKeyConfiguration).length > 0) {
        this.checkDependantServiceCompleted(o, key, cookies, resultResponse);
      } else {
        this.fireService(o, key, cookies, resultResponse);
      }
    })
  }

  async createMockupRecordold(reqParam: any, cookie: any, mockDataRes: any) {
    reqParam?.requestDetails?.inputData.forEach(async (req: any) => {
      const response = await fetch(reqParam.requestDetails.requestUrl, {
        method: reqParam.requestDetails.method,
        body: JSON.stringify(req),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          'Cookie': 'RSESSION=' + cookie[0]['value']
        }
      });
      const res = await response?.text();
      mockDataRes.push(JSON.parse(res).sid);
    });
  }
  async deleteMockupRecordFull(mockdata: any, resultResponse: any, cookie: any) {
    let ids: any = [];
    Object.keys(resultResponse).forEach((key: any) => {
      Object.values(resultResponse[key]).forEach((ele: any) => {
        ids.push(ele.sid)
      })
      this.deleteMockupRecord(mockdata[key].url, ids, cookie);
    });
  }
  async deleteMockupRecord(url: any, param: any, cookie: any) {
    const response = await fetch(url + '/' + param, {
      method: 'DELETE', headers: {
        "Content-type": "application/json; charset=UTF-8",
        'Cookie': 'RSESSION=' + cookie[0]['value']
      }
    });
    const res = await response?.text();
  }
  functionRGBAToHexA(rgba: any, forceRemoveAlpha = true) {
    return "#" + rgba.replace(/^rgba?\(|\s+|\)$/g, '') // Get's rgba / rgb string values
      .split(',') // splits them at ","
      .filter((_string: any, index: number) => !forceRemoveAlpha || index !== 3)
      .map((string: string) => parseFloat(string)) // Converts them to numbers
      .map((number: number, index: number) => index === 3 ? Math.round(number * 255) : number) // Converts alpha to 255 number
      .map((number: { toString: (arg0: number) => any; }) => number.toString(16)) // Converts numbers to hex
      .map((string: string | any[]) => string.length === 1 ? "0" + string : string) // Adds 0 when length of one number is 1
      .join("") // Puts the array to togehter to a string
  }
  functionHexToHSL(H: any) {
    let ex = /^#([\da-f]{3}){1,2}$/i;
    if (ex.test(H)) {
      // convert hex to RGB first
      let r: any = 0, g: any = 0, b: any = 0;
      if (H.length == 4) {
        r = "0x" + H[1] + H[1];
        g = "0x" + H[2] + H[2];
        b = "0x" + H[3] + H[3];
      } else if (H.length == 7) {
        r = "0x" + H[1] + H[2];
        g = "0x" + H[3] + H[4];
        b = "0x" + H[5] + H[6];
      }
      // then to HSL
      r /= 255;
      g /= 255;
      b /= 255;
      let cmin = Math.min(r, g, b),
        cmax = Math.max(r, g, b),
        delta = cmax - cmin,
        h = 0,
        s = 0,
        l = 0;

      if (delta == 0)
        h = 0;
      else if (cmax == r)
        h = ((g - b) / delta) % 6;
      else if (cmax == g)
        h = (b - r) / delta + 2;
      else
        h = (r - g) / delta + 4;

      h = Math.round(h * 60);

      if (h < 0)
        h += 360;

      l = (cmax + cmin) / 2;
      s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
      s = +(s * 100).toFixed(1);
      l = +(l * 100).toFixed(1);
      s = Math.round(s)
      l = Math.round(l)

      return "hsl(" + h + "," + s + "%," + l + "%)";

    } else {
      return "Invalid input color";
    }
  }

}

export default new testcaseService();