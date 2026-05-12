import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Input, inject, Directive } from '@angular/core';
import { AppConstants } from '@app/app-constants';
import { AppUtilService } from '@app/app.util.service';
import { TranslateService } from '@ngx-translate/core';
import { Subscription, fromEvent, map } from 'rxjs';
@Directive({})
export class ChangeLogsGridBaseComponent {
  @Input("changelogConfig") changelogConfig: any;
  @Input("gridConfig") gridConfig: any
  @Input("gridType") gridType: any
  columns = []
  logsData: any = []
  logsCompareData: any = []
  logsKey: any = []
  excludedColums: any = []
  compareValue1: any;
  subscriptions: Subscription[] = [];
  modifiedDate: any;
  compareValue2: any;
  logsRawData = [];
  updatedValue: any;
  scrollTop: number = 0;
  total: number = 0;
  params: any;
  changeLogListGrid: any = []
  changeLogCompareGrid: any = []
  changeLogAPIDetails: any = {}
  baseAppConstants: any = AppConstants;
  private http = inject(HttpClient);
  private datePipe = inject(DatePipe);
  private appUtilBaseService = inject(AppUtilService)
  private translateService = inject(TranslateService);


  onInit(): void {
    this.getParms()
    this.getData(10)
  }
  getParms() {
    this.changeLogListGrid = this.gridConfig.changeLogListGrid
    this.changeLogCompareGrid = this.gridConfig.changeLogCompareGrid
    this.changeLogAPIDetails = this.gridConfig.changeLogApis
  }
  getData(end: any) {
    const pagination = {
      length: end
    }
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    // this.logsData = []
    console.log(this.changeLogListGrid.ajaxMethod);

    if (this.changeLogListGrid.ajaxMethod == 'GET') {
      this.http.get(this.changeLogListGrid.ajaxUrl).subscribe((res: any) => {
        this.getListData(res.results)
        this.getComparesionData(res.results)
      })
    } else {

      this.http.post(this.changeLogListGrid.ajaxUrl, pagination, { headers: headers }).subscribe((res: any) => {
        if (res && res.results) {
          this.modifiedDate = res.results[res.results.length - 1].modifiedDate;

          this.getListData(res.results)
          this.getComparesionData(res.results)
        }
      })
    }

  }
  updateUrlProperties(modifyDate: any) {


    let config = this.changeLogListGrid;




    let lastIndex = this.changeLogListGrid.ajaxUrl.lastIndexOf("/");

    this.changeLogListGrid.ajaxUrl = this.changeLogListGrid.ajaxUrl.slice(0, lastIndex) + '/' + modifyDate;


  }
  tableConfig: any = {
    "infiniteScroll": "true"
  }
  attachInfiniteScroll() {
    const tracker = (<HTMLInputElement>document.getElementsByClassName('p-datatable-wrapper')[0])
    let windowYOffsetObservable = fromEvent(tracker, 'scroll').pipe(map(() => {
      return Math.round(tracker.scrollTop);
    }));

    const scrollSubscription = windowYOffsetObservable.subscribe((scrollPos: number) => {
      if (this.scrollTop != scrollPos) {
        this.scrollTop = scrollPos;
        let MscrollPos = scrollPos - 2;

        if ((tracker.offsetHeight + scrollPos >= tracker.scrollHeight)) {
          this.updateUrlProperties(this.modifiedDate);
          this.getData(10);
        }
      }
    });
    this.subscriptions.push(scrollSubscription);
  }
  getListData(results: any) {
    let rawData = results
    this.logsRawData = results
    rawData.forEach((ele: any, index: any) => {
      ele.modifiedDate = this.datePipe.transform(ele.modifiedDate, this.baseAppConstants.dateTimeFormatAngular)
      ele.modifiedBy = ele.modifiedBy.split('@')[0]
    })
    this.logsData = [...this.logsData, ...rawData]

  }
  getDateFormat(date: string | Date): string | null {
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) return null;
  
    return this.appUtilBaseService.formatDateTime(
      parsedDate.getTime(), 
      this.baseAppConstants.dateTimeFormatAngular || AppConstants.dateTimeFormatAngular || null
    );
  }
  getDataById(event: any, entiyId: any) {
    $('.cursor.selected').removeClass('selected');
    $('tr.cursor:nth-child(' + (entiyId + 1) + ')').addClass('selected');
    this.getComparesionData(this.logsData, entiyId)
    console.log(this.excludedColums);
  }
  getComparesionData(results: any, curIndex?: any) {
    this.compareValue1 = ''
    this.compareValue1 = ''
    let rawData = results

    if (rawData.length === 1) {
      this.compareValue1 = JSON.parse(rawData[0].value)
      this.logsCompareData = []
      this.populateData(this.compareValue1)
    } else if (rawData.length > 1) {
      if (curIndex != undefined) {
        console.log(curIndex);
        if (curIndex == rawData.length - 1) {
          this.compareValue1 = JSON.parse(rawData[curIndex].value)
          this.logsCompareData = []
          this.populateData(this.compareValue1)
        } else {

          this.compareValue1 = JSON.parse(rawData[curIndex].value)
          this.compareValue2 = JSON.parse(rawData[curIndex + 1].value)
          this.logsCompareData = []
          this.populateData(this.compareValue1, this.compareValue2)
        }
      } else {
        this.compareValue1 = JSON.parse(rawData[0].value)
        this.compareValue2 = JSON.parse(rawData[1].value)
        this.logsCompareData = []
        this.populateData(this.compareValue1, this.compareValue2)

      }

    } else {

    }
  }

  compareData(newData: any, oldData: any) {
    for (let key in oldData) {
      if (!newData.hasOwnProperty(key)) {
        newData[key] = '';
      }
    }
    return newData;
  }

  populateData(value1: any = {}, value2: any = {}, parentKey?: any) {
    value1 = this.compareData(value1, value2);
    for (let key in value1) {
      if (key != undefined) {
        if (!this.changeLogCompareGrid.excludedColums.includes(key)) {
          if (typeof value1[key] === 'object' && this.changeLogCompareGrid.config[key]?.uiType != 'autosuggest') {
            let parent_keys = this.findParentGrandparent(this.compareValue1, key).reverse().toString().replace(',', '.')
            this.populateData(value1[key], value2[key], parent_keys)
          } else {
            let oldValue;
            let newValue;
            if (this.changeLogCompareGrid.dateTimeFields.indexOf(key) > -1) {
              oldValue = value2[key] ? this.appUtilBaseService.formatDateTime(value2[key], this.changeLogCompareGrid.config[key]?.dateTimeFormatAngular || AppConstants.dateTimeFormatAngular || null) : null;
              newValue = value1[key] ? this.appUtilBaseService.formatDateTime(value1[key], this.changeLogCompareGrid.config[key]?.dateTimeFormatAngular || AppConstants.dateTimeFormatAngular || null) : null;
            }
            else if (this.changeLogCompareGrid.dateFields.indexOf(key) > -1) {
              oldValue = value2[key] ? this.appUtilBaseService.formatDate(value2[key], this.changeLogCompareGrid.config[key]?.dateFormatAngular || AppConstants.dateFormatAngular || null) : null;
              newValue = value1[key] ? this.appUtilBaseService.formatDate(value1[key], this.changeLogCompareGrid.config[key]?.dateFormatAngular || AppConstants.dateFormatAngular || null) : null;
            }
            else if (this.changeLogCompareGrid.translatableFields.indexOf(key) > -1 || (parentKey && this.changeLogCompareGrid.translatableFields.indexOf(parentKey) > -1)) {
              if (value2[key]) {
                oldValue = this.translateService.instant(value2[key]);
              }
              else {
                oldValue = value2[key];
              }
              if (value1[key]) {
                newValue = this.translateService.instant(value1[key]);
              }
              else {
                newValue = value1[key];
              }
            }
            else if (this.changeLogCompareGrid.emailFields.indexOf(key) > -1) {
              oldValue = value2[key] ? this.appUtilBaseService.getFormattedEmail(value2[key], this.changeLogCompareGrid.config[key]) : null;
              newValue = value1[key] ? this.appUtilBaseService.getFormattedEmail(value1[key], this.changeLogCompareGrid.config[key]) : null;
            }
            else if (this.changeLogCompareGrid.config[key]?.uiType == 'autosuggest') {
              oldValue = value2[key] ? this.appUtilBaseService.getlookupDisplayData(value2[key], this.changeLogCompareGrid.config[key]) : null;
              newValue = value1[key] ? this.appUtilBaseService.getlookupDisplayData(value1[key], this.changeLogCompareGrid.config[key]) : null;
            }
            else if (this.changeLogCompareGrid.config[key]?.fieldType == 'Boolean') {
              oldValue = this.appUtilBaseService.getBooleanData(value2[key], this.changeLogCompareGrid.config[key]);
              newValue = this.appUtilBaseService.getBooleanData(value1[key], this.changeLogCompareGrid.config[key]);
            }
            else if (this.changeLogCompareGrid.config[key]?.uiType == 'currency') {
              oldValue = value2[key] ? this.appUtilBaseService.formatCurrency(value2[key], this.changeLogCompareGrid.config[key].currency, this.changeLogCompareGrid.config[key]?.currencyDisplay) : null;
              newValue = value1[key] ? this.appUtilBaseService.formatCurrency(value1[key], this.changeLogCompareGrid.config[key].currency, this.changeLogCompareGrid.config[key]?.currencyDisplay) : null;
            }
            else if (this.changeLogCompareGrid.config[key]?.uiType == 'number') {
              const config = this.changeLogCompareGrid.config[key];
              const formatValue = (value: any) => {
                if (value === 0 || value === '0') {
                  return value;
                }
                return value !== undefined && value !== null ? this.appUtilBaseService.getFormattedNumber(value, config) : null;
              };
            
              oldValue = formatValue(value2[key]);
              newValue = formatValue(value1[key]);
            }
            else {
              oldValue = value2[key];
              newValue = value1[key];
            }

            let newObj = {
              "attribute": parentKey != undefined ? `${parentKey}.${key}` : key,
              "old_value": oldValue,
              "new_value": newValue,
              "is_differ": value2[key] === value1[key] ? "noChange" : "valueChanged"
            }
            this.logsCompareData.push(newObj)
          }
        }
      }
    }
    this.updatedValue = []
    this.updatedValue = [...this.logsCompareData]
  }
  findParentGrandparent(obj: any, target: any): any {
    if(obj){
      for (const child of Object.entries(obj)) {
        if (typeof child[1] === 'object' && child[0] !== target) {
          const result = this.findParentGrandparent(child[1], target);
          if (result != undefined) return [...result, child[0]];
        } else if (child[0] === target) {
          return [child[0]];
        }
      };
      return
    }
    else{
      return
    }
  };
}
