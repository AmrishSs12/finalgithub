import { Injectable, SecurityContext } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { forkJoin, Observable, Observer, Subject } from 'rxjs';
import { formatDate, formatNumber, formatCurrency, getCurrencySymbol } from '@angular/common';
import { BaseAppConstants } from './app-constants.base';
import { TranslateService } from '@ngx-translate/core';
import { AppGlobalService } from './app-global.service';
import { environment } from '@env/environment';
import { HttpParams } from '@angular/common/http';
import { inject, Inject } from '@angular/core';
import { AppConstants } from '@app/app-constants';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import DOMPurify from 'dompurify';import { decode } from 'html-entities';
import { DecimalPipe } from '@angular/common';
import { Router } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { SaveChangesDialogService, SaveChangesDialogResult } from './shared/save-changes-dialog/save-changes-dialog.service';
import { DOCUMENT } from '@angular/common';


@Injectable({
  providedIn: 'root',
})


export class AppUtilBaseService {
  public confirmationService = inject(ConfirmationService);
  public translateService = inject(TranslateService);
  public appGlobalService = inject(AppGlobalService);
  public domSanitizer = inject(DomSanitizer);
  public _decimalPipe = inject(DecimalPipe);
  public router = inject(Router);
  public dialogService = inject(DialogService);
  public saveChangesDialogService = inject(SaveChangesDialogService);
  constructor(@Inject(DOCUMENT) private document: Document) { }
  wizard: any = [];




  isEqualIgnoreCase(data1: any, data2: any, ignoreProperties?: any, isCaseSensitive?: boolean) {
    //data1 - should be formData;
    //data2 - should be backupData;
    isCaseSensitive = isCaseSensitive || false;
    if (this.checkCase(data1, isCaseSensitive) === this.checkCase(data2, isCaseSensitive) || data1 === data2) { return true; }
    if ((typeof data1 !== 'object' || typeof data2 !== 'object')) {
      return this.checkCase(data1, isCaseSensitive) === this.checkCase(data2, isCaseSensitive);
    }
    const isValueEmpty1 = (data1 == null || data1 === '' || data1 === undefined || $.isEmptyObject(data1));
    const isValueEmpty2 = (data2 == null || data2 === '' || data2 === undefined || $.isEmptyObject(data2));
    if (isValueEmpty1 && isValueEmpty2) { return true; }

    if (isValueEmpty1 && !isValueEmpty2) { return false; }
    if (!isValueEmpty1 && isValueEmpty2) { return false; }

    ignoreProperties = ignoreProperties || [];
    let keys = Object.keys(data1 || {});
    const data2Keys = Object.keys(data2 || {});
    keys = keys.concat(Object.keys(data2 || {}));
    for (let index = 0; index < keys.length; index++) {

      const key = keys[index];
      const value1 = this.checkCase(data1[key], isCaseSensitive);
      const value2 = this.checkCase(data2[key], isCaseSensitive);
      if (ignoreProperties.indexOf(key) !== -1) { continue; }
      if (value1 === value2
        || ((value1 === null || value1 === '' || value1 === undefined)
          && (value2 === null || value2 === '' || value2 === undefined))) { continue; }

      const isValue1Array = Array.isArray(value1);
      const isValue2Array = Array.isArray(value2);
      if ((isValue1Array && !isValue2Array)
        || (!isValue1Array && isValue2Array)
        || (isValue1Array && isValue2Array
          && value1.length !== value2.length)) { return false; }
      let retVal = false;
      if (isValue1Array && isValue2Array) {
        if (value1.length === 0 && value2.length === 0) {
          retVal = true;
        } else {
          for (let arrIndex = 0; arrIndex < value1.length; arrIndex++) {
            let ignoreFields = (typeof value1[arrIndex] === 'object' && typeof value1[arrIndex] === 'object') ? this.getIgnorableFields(value1[arrIndex], value2[arrIndex]) : ignoreProperties;
            retVal = this.isEqualIgnoreCase(value1[arrIndex], value2[arrIndex], ignoreFields, isCaseSensitive)
            if (!retVal) { return false; }
          }
        }
      } else if (value1 !== null && value2 !== null && typeof value1 === 'object' && typeof value2 === 'object') {
        if (value1 instanceof Date && value2 instanceof Date) {
          if (value1.getTime() === value2.getTime()) {
            retVal = true;
          }
        }
        else if (value1 instanceof Date && value2 && value2.hasOwnProperty('lLimit') && value2.hasOwnProperty('uLimit')) {
          const { lLimit, uLimit } = value2;

          // Set value1 to midnight for lLimit
          const tempDate1 = new Date(value1);
          tempDate1.setHours(0, 0, 0, 0); // Set to midnight

          // Set value1 to end of day for uLimit
          const tempDate2 = new Date(value1);
          tempDate2.setHours(23, 59, 59, 999); // Set to end of day

          // Compare adjusted value1 with lLimit and uLimit
          if (tempDate1.getTime() === lLimit && tempDate2.getTime() === uLimit)
            retVal = true;
        }
        else if (value1 && value1.hasOwnProperty('min') && value1.hasOwnProperty('max') &&
          value2 && value2.hasOwnProperty('lLimit') && value2.hasOwnProperty('uLimit')) {
          const { min: min1, max: max1 } = value1;
          const { lLimit: min2, uLimit: max2 } = value2;

          // Check for both lLimit and uLimit being null or both being non-null and equal
          if ((min1 === null && min2 === null && max1 === null && max2 === null) ||
            (min1 === min2 && max1 === max2)) {
            retVal = true;
          }
        }
        else {
          retVal = this.isEqualIgnoreCase(value1, value2, this.getIgnorableFields(value1, value2), isCaseSensitive)
        }
      } else if ((typeof value1 === 'string' && typeof value2 === 'string') || (typeof value1 === 'number' && typeof value2 === 'number')) {
        retVal = (value1 === value2);
      }
      if (!retVal) {
        return false;
      }
    }

    return true;
  };


  getIgnorableFields(formControls: any, backupData: any, ignoreFields?: any) {
    ignoreFields = ignoreFields || [];
    let result: any = [];
    var keys = Object.keys(formControls);
    for (var key in backupData) {
      if (!keys.includes(key)) {
        result.push(key)
      }
    }
    result = [...result, ...ignoreFields];
    return result;
  }

  checkCase(data: any, isCaseSensitive: boolean) {
    if (!data || !data.toUpperCase) { return data; }
    return isCaseSensitive ? data : data.toUpperCase();
  }
  getErrorLabel(error: string, fieldName = '') {
    let errLabel = error;
    switch (error) {
      case 'required':
        errLabel = 'field_is_a_mandatory_field';
        break;
      case 'mandatoryCondition':
        errLabel = 'not_matching_its_mandatory_condition';
        break;
      case 'mandatoryCondition':
        errLabel = 'not_matching_its_mandatory_condition';
        break;
      case 'customMax':
      case 'max':
        errLabel = 'not_matching_its_max_HYP_value_condition';
        break;
      case 'customMin':
      case 'min':
        errLabel = 'not_matching_its_min_HYP_value_condition';
        break;
      case 'maxLength':
      case 'max_length':
      case 'maxlength':
        errLabel = 'not_matching_its_max_HYP_length_condition';
        break;
      case 'minLength':
      case 'min_length':
      case 'minlength':
        errLabel = 'not_matching_its_min_HYP_length_condition';
        break;
      case 'mandatoryCharacters':
        errLabel = 'not_matching_with_mandatory_characters';
        break;
      case 'allowedValues':
        errLabel = 'not_matching_with_allowed_values';
        break;
      case 'notAllowedValues':
        errLabel = 'contains_not_allowed_values';
        break;

      case 'pattern':
        errLabel = 'not_matching_its_accepted_pattern';
        break;
      case 'email':
        errLabel = 'not_valid';
        break;
      case 'invalidDate':
        errLabel = 'not_valid';
        break;
      case 'weekDaysOnly':
        errLabel = 'allowing_weekdays_only';
        break;
      case 'weekEndsOnly':
        errLabel = 'allowing_weekends_only';
        break;
      default:
        errLabel = error;
    }

    return this.translateService.instant(errLabel);;
  }

  validateNestedForms(form: any, formErrors: any, finalArr: string[] = [], inValidFields: any = {}, fieldConfiguration?: any): boolean {
    let isValid: boolean = true;
    let fieldConfig = fieldConfiguration || {};
    Object.keys(form.controls).forEach(field => {
      if (form.controls[field] instanceof FormGroup) {
        Object.keys(form.controls[field].controls).forEach(childField => {
          const obj = this.isValidForm(form.controls[field].controls, childField, formErrors, finalArr, inValidFields, fieldConfig, field,);
          if (!obj.isValid) {
            isValid = false;
          }
          finalArr = obj.finalArr;
          inValidFields = obj.inValidFields
        })
      }
      else {
        const obj = this.isValidForm(form.controls, field, formErrors, finalArr, inValidFields, fieldConfig);
        if (!obj.isValid) {
          isValid = false;
        }
        finalArr = obj.finalArr;
        inValidFields = obj.inValidFields
      }

    })
    return isValid;
  }

  isValidForm(form: any, field: string, formErrors: any, finalArr: string[] = [], inValidFields: any = {}, fieldConfig?: any, parentForm?: string) {
    const allErrors: any = {};
    let errors: any;
    let isValid: boolean = true;
    let formFieldConfig = fieldConfig || {};
    if(fieldConfig[field]?.uiType == "email" && form[field]?.errors?.hasOwnProperty("pattern"))
     errors = {"email":true};
    else
     errors = form[field]?.errors;
    let fieldName = "";
    let referredFielderrors: any = [];
    let referredFields = {};
    let referredFieldName = "";

    fieldName = (fieldConfig[field] && (fieldConfig[field]?.label != "" || fieldConfig[field]?.label != undefined)) ? (this.translateService.instant(fieldConfig[field].label)) : field;
    if (errors) {
      isValid = false;
      Object.keys(errors).forEach(errKey => {
        if (!allErrors[errKey]) {
          allErrors[errKey] = [];
        }
        allErrors[errKey].push(fieldName);
        if (parentForm) {
          if (!inValidFields[parentForm])
            inValidFields[parentForm] = {};
          inValidFields[parentForm][field] = true;
        }
        else
          inValidFields[field] = true;
      });
    }
    finalArr = this.findFormErrors(allErrors, finalArr, fieldConfig, field);
    return {
      isValid: isValid,
      finalArr: finalArr,
      inValidFields: inValidFields
    }
  }




  findFormErrors(allErrors: any, finalArr: any, errorField: any, field: string) {
    let referredFieldName = '';


    for (const error in allErrors) {
      if (allErrors.hasOwnProperty(error)) {
        const element = allErrors[error];
        const referred = referredFieldName ? `${referredFieldName} is invalid, ` : '';
        if (error === 'pattern' && errorField[field].regexError) {
          finalArr.push(this.translateService.instant(`${referred}${errorField[field].regexError}`));
        }
        else {
          const referred = referredFieldName ? `${referredFieldName} is invalid, ` : '';
          finalArr.push(`
          ${referred}
          ${error == 'required' ? this.translateService.instant('The') + ' ' + allErrors[error].join(', ') : allErrors[error].join(', ')}
          ${error === 'notAllowedValues' ? '' : allErrors[error].length > 1 ? this.translateService.instant('are') : (error != 'required' ? this.translateService.instant('is') : '')}
          ${this.getErrorLabel(error)}`);
        }

      }
    }
    return finalArr;
  }

  canDeactivateCall(form: FormGroup, backupData: any): Observable<boolean> | boolean {
    if (this.isEqualIgnoreCase(form.getRawValue(), backupData, [], true)) {
      return true;
    }

    return Observable.create((observer: Observer<boolean>) => {

      this.confirmationService.confirm({
        message: this.translateService.instant("Do_you_want_to_reset_all_changes_QUESTION"),
        header: this.translateService.instant('Confirmation'),
        icon: 'pi pi-info-circle',
        accept: () => {
          observer.next(true);
          observer.complete();
        },
        reject: () => {
          observer.complete();
        },
      });
    });
  }

  /**
   * Shows a save changes confirmation dialog with three options: Cancel, Don't Save, and Save.
   * Returns an Observable that emits the user's choice.
   *
   * @returns Observable<SaveChangesDialogResult> - 'cancel' | 'dontSave' | 'save'
   */
  showSaveChangesDialog(): Observable<SaveChangesDialogResult> {
    return this.saveChangesDialogService.confirm();
  }

  frameFormFromConfig(formConfig: any) {

    formConfig = {
      readonlyForm: false,
      items: [
        {
          type: "section",
          items: [
            {
              type: "control"
            }
          ]
        },
        {
          type: "section",
          items: [
            {
              type: "section",
              items: [
                {
                  type: "control"
                },
                {
                  type: "control"
                }
              ]
            }
          ]
        }
      ]
    }

    const controls = this.getControlsFromSectionConfig(formConfig);
    const formControls = {};


    formConfig = {
      id: new FormControl(''),
      name: new FormControl('', [Validators.required]),
      createdBy: new FormControl(),
      modifiedBy: new FormControl(),
    };

    return formConfig;
  }

  getControlsFromSectionConfig(config: any, result: any = []): any {
    if (config?.items) {
      for (let index = 0; index < config.items.length; index++) {
        const current = config.items[index];
        if (current.type == "section") {
          this.getControlsFromSectionConfig(current, result);
        } else {
          result.push(current)
        }
      }
    }
    return result;
  }

  getControlsFromFormConfig(config: any, fields: any = {}, fileFields: string[] = []): any {
    const configData = config?.children || config.mapping || config;
    if (configData?.length) {
      for (let index = 0; index < configData.length; index++) {
        let current = configData[index];
        if (current?.children && current?.children.length) {
          this.getControlsFromFormConfig(current, fields, fileFields);
        } else {
          current.isRequired = configData[index].mandatory === 'yes' ? true : false;
          current.multiple = configData[index].multipleValues ? true : false;
          if (configData[index].uiType == 'autosuggest') {
            current.lookupFields = configData[index].lookupFields;
            current.displayField = configData[index].displayField;
            current.multiple = configData[index].multipleValues ? true : false;
          }
          if (configData[index].type == 'customButton') {
            current.field = configData[index].name;
          }
          if (configData[index].fieldType == 'Table') {
            current = this.getComplexData(configData[index]);
          }
          if (configData[index].fieldType == 'Date') {
            current.calendarMinDate = configData[index].minDate ? new Date(configData[index].minDate) : null;
            current.calendarMaxDate = configData[index].maxDate ? new Date(configData[index].maxDate) : null;
          }
          if (configData[index].uiType == 'currency') {
            current.currencyCode = configData[index].currencySymbol?.toUpperCase() || 'USD';
          }
          if (configData[index].uiType == 'email' && configData[index]?.multipleValues) {
            current.uiType = 'multiEmail'
          }
          current.allowEditing = configData[index].allowEditing === 'no' ? 'no' : (configData[index].allowEditing === 'yes' || configData[index].allowEditing == 'undefined') ? 'yes' : 'conditional';
          current.allowViewing = configData[index].allowViewing === 'no' ? 'no' : (configData[index].allowViewing === 'yes' || configData[index].allowViewing == 'undefined') ? 'yes' : 'conditional';
          if (configData[index].allowEditing === 'conditional' && configData[index].editConditionally) {
            current.editConditionally = configData[index].editConditionally;
          }
          if (configData[index].allowViewing === 'conditional' && configData[index].viewConditionally) {
            current.viewConditionally = configData[index].viewConditionally;
          }
          if (['file', 'image'].includes(current.uiType)) {
            fileFields.push(current.data);
          } else if (['dropdown', 'select'].includes(current.uiType)) {
            current.options = current.allowedValues?.values;
            current.optionConditions = {};
            if (current?.allowedValues?.conditions?.conditions) {
              current.allowedValues.conditions.conditions.forEach((condition: any) => {
                current.optionConditions[condition.id] = Object.assign({}, condition.style, {
                  iconStyle: {},
                  cellStyle: {
                    'background-color': condition.style['background-color'],
                    'color': condition.style['color'],
                  }
                });

                switch (condition?.style?.icon?.type) {
                  case 'uploaded':
                    Object.assign(current.optionConditions[condition.id], {
                      image: this.frameAttachmentURL(condition?.style?.icon?.icon[0]?.fileName, true)
                    })
                    break;
                  case 'icon':
                    Object.assign(current.optionConditions[condition.id], {
                      iconClass: condition?.style?.icon?.icon.value
                    });
                    if (condition?.style?.icon.iconColor) {
                      Object.assign(current.optionConditions[condition.id].iconStyle, { color: condition?.style?.icon.iconColor })
                    }
                    if (condition?.style?.icon.iconSize) {
                      Object.assign(current.optionConditions[condition.id].iconStyle, { 'font-size': condition?.style?.icon.iconSize })
                    }
                    break;
                  default: break;
                }
              });
            }

          }
          if (current?.operator?.toLowerCase()?.trim() == 'is empty') {
            if (!current.allowedValues) {
              current.allowedValues = {
                values: []
              }
            }
            const isEmptyExists = current.allowedValues.values.some(
              (value: { label: string; value: string; }) => value.label === 'IS_EMPTY' && value.value === 'IS_EMPTY'
            );

            if (!isEmptyExists) {
              current.allowedValues.values.push({
                label: 'IS_EMPTY',
                value: 'IS_EMPTY'
              });
            }
            current.options = current.allowedValues.values;
          }
          fields[current.field || current.name] = current;
        }
      }
    }
    return fields;
  }


  getComplexData(config: any) {
    let nestedFields: any = config;
    config.columns.map((ele: any) => {
      nestedFields[ele.name] = ele;
      nestedFields[ele.name].isRequired = nestedFields[ele.name].mandatory === 'yes' ? true : false;
      if (['dropdown', 'select'].includes(ele.type)) {
        nestedFields[ele.name].options = nestedFields[ele.name].allowedValues?.values;
        nestedFields[ele.name].multiple = nestedFields[ele.name].multipleValues ? true : false;
      }
    })
    return nestedFields;
  }


  getWizardItemFromFormConfig(formConfig: any, component: any) {
    this.wizard = [];
    if (formConfig?.children?.length) {
      this.getWizardSections(formConfig, component);
      if (this.wizard.length) {
        this.wizard[0].styleClass = 'wizard-active';
        this.wizard.splice(-1);
      }

      if (this.wizard.length) {
        this.wizard.unshift({
          label: this.translateService.instant('Section'),
          disabled: true
        }, {
          separator: true
        });
      }
    }
    return this.wizard
  }

  getWizardSections(formConfig: any, component: any) {
    formConfig.children.forEach((config: any, index: number) => {
      if (config.children) {
        this.getWizardSections(config, component);
      }
      if (config.type === 'formSection') {
        const label = config.label ? config.label : ' ';
        this.wizard.push({
          id: config.label,
          label: this.translateService.instant(label),
          command: component.onWizardClick.bind(component)
        }, {
          separator: true
        });
      }
    });
  }


  configureValidators(detailFormControls: FormGroup, formFieldConfig: any) {
    for (let field in formFieldConfig) {
      const fielConfig = formFieldConfig[field];
      if (fielConfig?.uiType?.toUpperCase() == 'MULTIEMAIL') {
        detailFormControls.get(field)?.addValidators(Validators.pattern(/^([\w+-.%]+@[\w-.]+\.[A-Za-z]{2,4},?)+$/));
        detailFormControls.get(field)?.updateValueAndValidity();
      }
      if (fielConfig?.uiType?.toUpperCase() == 'EMAIL') {
        detailFormControls.get(field)?.addValidators(Validators.pattern(/^(?![.!#$%&'*+/=?^_`{|}~-])(?!.*[!#$%&'*+/=?^_`{|}~.-]{2,})[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/));
        detailFormControls.get(field)?.updateValueAndValidity();
      }
      if (fielConfig?.uiType?.toUpperCase() == 'LINK') {
        if (fielConfig?.multiple) {
          detailFormControls.get(field)?.addValidators(Validators.pattern(/^(https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*),?)+$/));
        }
        else {
          detailFormControls.get(field)?.addValidators(Validators.pattern(/^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/));
        }
        detailFormControls.get(field)?.updateValueAndValidity();
      }
    }
  }


  public formatDate(date: number, format?: string, locale?: string): string {
    if (typeof date !== 'number') {
      return date;
    }
    format = format || BaseAppConstants.dateFormatPrimeNG;
    locale = this.translateService.currentLang;

    return date ? formatDate(date, format, locale) : '';
  }

  public formatDateTime(date: number, format?: string, locale?: string): string {
    format = format || BaseAppConstants.dateTimeFormatPrimeNG;
    locale = this.translateService.currentLang;

    return date ? formatDate(date, format, locale) : '';
  }


  public formatNumber(value: number, digitsInfo?: string, locale?: string): string {
    locale = locale || BaseAppConstants.defaultLocale;
    return value ? formatNumber(value, locale, digitsInfo) : '';
  }

  public formatCurrency(value: number, currencyCode: string, currencyDisplay?: string, currency?: string, locale?: string, col?: any): any {
    locale = locale || BaseAppConstants.defaultLocale;
    currencyCode = currencyCode?.toUpperCase() || BaseAppConstants.currency?.toUpperCase();
    const currencySymbol = getCurrencySymbol(currencyCode, 'wide', locale);
    if (col) {
      value = this.getFormattedNumber(value, col)
    }
    if (currencyDisplay?.toLowerCase() == 'code' || BaseAppConstants?.currencyDisplay.toLowerCase() == 'code') {
      return currencyCode + ' ' + value;
    } else if (currencyDisplay?.toLowerCase() == 'symbol' || BaseAppConstants?.currencyDisplay.toLowerCase() == 'symbol') {
      return currencySymbol + ' ' + value;
    } else {
      return value ? value : '';
    }
  }

  public getFormattedNumber(data: any, col: any, locale?: string): any { // Commented minInteger, thousandSeparator, decimalSeperator cause of primeNg not supporting this
    // const minInteger = col.minInteger || AppConstants.minInteger || 0;
    const minInteger = 0;
    let maxFraction = col.maxFraction || BaseAppConstants.maxFraction || 0;
    const minFraction = col.minFraction || BaseAppConstants.minFraction || 0;
    // const tS = col?.numberFormat?.thousandSeparator || AppConstants?.numberFormat?.thousandSeparator || ','
    // const dS = col?.numberFormat?.decimalSeperator || AppConstants?.numberFormat?.decimalSeperator || '.';
    locale = locale || BaseAppConstants.defaultLocale;
    (minFraction > maxFraction) ? maxFraction = minFraction : '';
    if (typeof col.maxFraction !== 'undefined' || typeof col.minFraction !== 'undefined' || col.uiType?.toLowerCase() == 'currency') {
      data = this._decimalPipe.transform(data, minInteger + '.' + minFraction + '-' + maxFraction, locale)
    } else {
      data = this.formatNumber(data);
    }
    // const formattedData = data?.replaceAll('.', '?')?.replaceAll(',', tS)?.replaceAll('?', dS)
    // return formattedData
    return data;
  }

  public getHourFormat(dateTimeFormat: string) {
    let fieldHourFormat = (dateTimeFormat?.toLowerCase()?.includes('a') ? '12' : '24');
    return dateTimeFormat ? fieldHourFormat : (BaseAppConstants.timeFormatPrimeNG?.toLowerCase()?.includes('a') ? '12' : '24')
  }

  public getCurrencySymbol(code: string, format?: string, locale?: string | undefined) {
    locale = locale || BaseAppConstants.defaultLocale;

    return code ? getCurrencySymbol(code, 'wide', locale) : '';
  }


  /// workflow - starts

  getFormSecurityConfigFromSecurityJSON(securityJSON: any, form: FormGroup, actionConfig: any, workflowInfo: any) {
    const role = workflowInfo?.actors || [];
    const step = workflowInfo?.step || '';
    const actions: any = [];

    const roleSecurityConf = (securityJSON[role[0]] && securityJSON[role[0]][step]) || {
      hidefields: [],
      enableonlyfields: [],
      disableonlyfields: [],
      enableonlyactions: [],
      disableonlyactions: [],
      hideactions: ['*'],
      showactions: [],
      mandatoryfields: {},
    };
    const formSecurityConfig: any = {
      hidefields: [],
      enableonlyfields: [],
      disableonlyfields: [],
      enableonlyactions: [],
      disableonlyactions: [],
      hideactions: [],
      showactions: [],
      mandatoryfields: {},
      comments: {}
    };

    actionConfig.forEach((item: any) => {
      if (item.type == 'buttonGroup') {
        item.children.forEach((k: any) => {
          actions.push(k.wfAction);
        })
      }
      else if (item.type == 'button') {
        actions.push(item.wfAction);
      }
    })

    const workflowActions = this.getActions(role, securityJSON, step, actions);
    const workflowFields = this.getFields(role, securityJSON, step, form);

    const mergedHideandShowActions = this.merge(workflowActions.hideactions, workflowActions.showactions);
    const mergedenableandDisableActions = this.merge(workflowActions.disableonlyactions, workflowActions.enableonlyactions);

    const mergedHideandShowFields = this.merge(workflowFields.hidefields, workflowFields.showfields);
    const mergedEnableandDisableFields = this.merge(workflowFields.disableonlyfields, workflowFields.enableonlyfields);

    formSecurityConfig.hideactions = mergedHideandShowActions.arr1;
    formSecurityConfig.showactions = mergedHideandShowActions.arr2;

    formSecurityConfig.disableonlyactions = mergedenableandDisableActions.arr1;
    formSecurityConfig.enableonlyactions = mergedenableandDisableActions.arr2;

    formSecurityConfig.mandatoryfields = workflowActions.mandatoryfields;
    formSecurityConfig.comments = workflowActions.comments;

    formSecurityConfig.hidefields = mergedHideandShowFields.arr1;
    formSecurityConfig.showfields = mergedHideandShowFields.arr2;


    formSecurityConfig.disableonlyfields = mergedEnableandDisableFields.arr1;
    formSecurityConfig.enableonlyfields = mergedEnableandDisableFields.arr2;

    return formSecurityConfig;
  }

  getActions(role: any, json: any, step: any, actions: any) {
    const json1: any = [];
    const json2: any = [];
    const json3: any = [];
    const json4: any = [];
    const json5: any = [];
    const json6: any = [];
    let hideActionsEmpty: boolean = false;
    let disableActionsEmpty: boolean = false;

    const mergedJson: any = {
      enableonlyactions: [],
      disableonlyactions: [],
      hideactions: [],
      showactions: [],
      mandatoryfields: {},
      comments: {}
    }
    if (role.length > 0 && json) {
      role?.map((user: string) => {
        let filterdJson = json[user] && json[user][step];

        actions.forEach((action: string) => {

          if (filterdJson?.hideactions.includes('*') || filterdJson?.hideactions.includes(action) || filterdJson?.hideactions.length === 0
            && this.checkCondition(filterdJson?.showactions, action)) {
            json1.push(action);
          }
          if (filterdJson?.showactions.includes('*') || filterdJson?.showactions.includes(action) || filterdJson?.showactions.length === 0
            && this.checkCondition(filterdJson?.hideactions, action)) {
            json2.push(action);
          }
          if (filterdJson?.enableonlyactions.includes('*') || filterdJson?.enableonlyactions.includes(action) || filterdJson?.enableonlyactions.length === 0
            && this.checkCondition(filterdJson?.disableonlyactions, action)) {
            json3.push(action);
          }
          if (filterdJson?.disableonlyactions.includes('*') || filterdJson?.disableonlyactions.includes(action) || filterdJson?.disableonlyactions.length === 0
            && this.checkCondition(filterdJson?.enableonlyactions, action)) {
            json4.push(action);
          }
          if (filterdJson?.mandatoryfields.hasOwnProperty(action)) {
            if (!mergedJson.mandatoryfields[action]) {
              mergedJson.mandatoryfields[action] = filterdJson.mandatoryfields[action];
            }
          }
          if (filterdJson?.comments.hasOwnProperty(action)) {
            if (!mergedJson.comments[action]) {
              mergedJson.comments[action] = filterdJson.comments[action];
            }
          }
        })
        mergedJson.hideactions.push(json1);
        mergedJson.showactions.push(json2);
        mergedJson.enableonlyactions.push(json3);
        mergedJson.disableonlyactions.push(json4);
      });
    }

    actions.forEach((action: string) => {
      if (mergedJson.hideactions.flat().length <= 0 && mergedJson.showactions.flat().length <= 0) {
        hideActionsEmpty = true;
        mergedJson.hideactions = mergedJson.hideactions.flat();
        json5.push(action);
      }
      if (mergedJson.enableonlyactions.flat().length <= 0 && mergedJson.disableonlyactions.flat().length <= 0) {
        disableActionsEmpty = true;
        mergedJson.disableonlyactions = mergedJson.disableonlyactions.flat();
        json6.push(action)
      }
    })
    if (hideActionsEmpty || disableActionsEmpty) {
      mergedJson.hideactions.push(json5);
      mergedJson.disableonlyactions.push(json6);
    }




    return mergedJson;
  }

  getFields(role: any, json: any, step: any, form: any) {
    const json1: any = [];
    const json2: any = [];
    const json3: any = [];
    const json4: any = [];
    const json5: any = [];
    let disableFieldsEmpty: boolean = false;

    const mergedJson: any = {
      hidefields: [],
      showfields: [],
      enableonlyfields: [],
      disableonlyfields: [],
    }
    role?.map((user: string) => {

      let filterdJson = json[user] && json[user][step];
      for (const field in form.controls) {
        if (filterdJson?.hidefields.includes('*') || filterdJson?.hidefields.includes(field) ||
          filterdJson?.hidefields.length === 0 && this.checkCondition(filterdJson?.showfields, field)) {
          json1.push(field);
        }
        if (filterdJson?.showfields.includes('*') || filterdJson?.showfields.includes(field) ||
          filterdJson?.showfields.length === 0 && this.checkCondition(filterdJson?.hidefields, field)) {
          json2.push(field);
        }
        if (filterdJson?.enableonlyfields.includes('*') || filterdJson?.enableonlyfields.includes(field) ||
          filterdJson?.enableonlyfields.length === 0 && this.checkCondition(filterdJson?.disableonlyfields, field)) {
          json3.push(field);
        }

        if (filterdJson?.disableonlyfields.includes('*') || filterdJson?.disableonlyfields.includes(field) ||
          filterdJson?.disableonlyfields.length === 0 && this.checkCondition(filterdJson?.enableonlyfields, field)) {
          json4.push(field);
        }
      }
      mergedJson.hidefields.push(json1);
      mergedJson.showfields.push(json2);
      mergedJson.enableonlyfields.push(json3);
      mergedJson.disableonlyfields.push(json4);
    });

      if (mergedJson.enableonlyfields.flat().length <= 0 && mergedJson.disableonlyfields.flat().length <= 0) {
        disableFieldsEmpty = true;
    for (const field in form.controls) {

        json5.push(field);
      }
    }
    if (disableFieldsEmpty) {
      mergedJson.disableonlyfields.push(json5);
    }

    return mergedJson;
  }

  checkCondition(data: string[], name: string) {
    return (data.length > 0 && !data?.includes(name) && !data.includes('*'))
  }

  merge(arr1: any, arr2: any) {
    let json1: any = [];
    let json2: any = [];
    json1 = this.intersectJson(arr1);
    json2 = arr2?.flatMap((a: any) => a);
    return {
      arr1: this.filterBasedonPriority(json2, json1),
      arr2: json2
    }
  }

  intersectJson(arr1: any) {
    if (!arr1.length) return [];
    const formattedArray = arr1?.shift().filter(function (v: any) {
      return arr1.every(function (a: any) {
        return a.indexOf(v) !== -1;
      });
    });
    return formattedArray
  }

  filterBasedonPriority(firstPriority: any[], secondPriority: any[]) {
    const filterd: any = []
    secondPriority?.forEach((action: string) => {
      if (!firstPriority.includes(action)) {
        filterd.push(action);
      }
    })
    return filterd;
  }


  /// workflow - ends

  getPageUrl(pageUrl: any, json?: any) {
    // console.log(json)
    // if(json.children1){
    //   pageUrl = '/tabs'+pageUrl;
    // }
    if (pageUrl) {
      let index = pageUrl?.indexOf('/')
      let currPath = pageUrl.substr(index)
      return "#" + currPath
    } else {
      return null
    }
  }

  formatTableConfig(config: any) {
    return config?.reduce((acc1: any, curr1: any) => {
      if (curr1?.allowedValues) {
        // const allowedValues = JSON.parse(curr1.allowedValues);
        const allowedValues = curr1.allowedValues;
        curr1.options = allowedValues.values;
        let count = 0;
        curr1.conditionalStyling = allowedValues.conditions?.conditions?.reduce((acc2: any, curr2: any) => {
          const identifierKey = (curr2.id.replace(/ /g, "_")).toUpperCase();
          curr2.query.rules.map((con: any) => {
            con.value
          })
          for (var i = 0; i < curr2.query.rules.length; i++) {
            curr2.query.rules[i].value = (curr2.query.rules[i].value.replace(/ /g, "_")).toUpperCase();
          }
          acc2[identifierKey] = curr2;
          acc2[identifierKey].class = 'condition-' + count;
          if (acc2[identifierKey].style) {
            acc2[identifierKey].style.showIcon = (curr2.style.icon) ? 'inline-block' : 'none';
            acc2[identifierKey].style.showlabel = (curr2.style.showText) ? 'inline-block' : 'none';
          }

          count++;
          return acc2;

        }, {})
      }
      acc1.push(curr1)
      return acc1;
    }, [])

  }


  getTableRequestParams(tableConfig: any): void {
    const params: any = {};
    params.start = 0;
    const limit = Number(tableConfig.pageLimit);
    params.length = limit || BaseAppConstants.defaultPageSize;

    params.search = {};
    params.columns = [];
    for (const col of tableConfig.children) {
      const column: any = {};
      column.data = col.data;
      column.name = col.name;
      column.searchable = true;
      column.orderable = col.orderable = true;

      column.search = {};
      params.columns.push(column);
    }
    params.columns.order = [];

    return params;
  }

  restricedtFilterParams(value: any): boolean {
    const restrictedKeys = [
      'advancedSearch',
      'globalSearch',
      'pageStart',
      'quickFilter',
      'softDeleteFilter'
    ];
    let parsedValue;
    try {
      parsedValue = JSON.parse(value);
    } catch (error) {
      return true;
    }

    for (const innerKey in parsedValue) {
      if (restrictedKeys.includes(innerKey)) {
        return false;
      }
    }
    return true;
  }

  createNotificationList(messages: string[]) {
    let $listElem: any = '';
    if (messages.length > 1) {
      $listElem = $('<ul>').addClass('list-messages');
      messages.forEach(item => {
        $listElem.append($('<li>').addClass('list-messages-item').text(item))
      });

    } else {
      $listElem = $('<div>')
        .addClass('list-messages-item')
        .append($('<span>').addClass('list-messages-item').text(messages[0] || ''))
    }

    return $('<div>').append($listElem).html()

  }

  frameAttachmentURL(field: string, isLocal = false) {
    const baseURL = isLocal ? BaseAppConstants.localFilePath : BaseAppConstants.attachmentBaseURL
    return !field ? '' : baseURL + field;
  }
  createImagePreviewURL(files: [{ fileName: string, id: string, file?: any }]) {
    const responseFiles: any = [];
    files.forEach(file => {
      responseFiles.push({
        previewSrc: this.frameAttachmentURL(file.id),
        id: file.id,
        fileName: file.fileName,
        file: file.file || file
      })
    })
    return responseFiles;
  }

  removeImagePreviewProperties(files: [{ fileName: string, id: string, file?: any }]) {
    const responseFiles: any = [];
    files.forEach(file => {
      responseFiles.push({
        fileName: file.fileName,
        id: file.id
      })
    })
    return responseFiles;
  }

  setImagePreview(files: File[]): Observable<any> {
    const ObserGroup: any = []
    const obsr$ = new Subject<any>();
    if (files && files.length) {
      for (const file of files) {
        ObserGroup.push(this.readImage(file));
      }
      forkJoin(ObserGroup).subscribe((res: any) => { obsr$.next(res); obsr$.complete(); })
    }
    else {
      setTimeout(() => {
        obsr$.next([])
        obsr$.complete();
      }, 10)
    }
    return obsr$.asObservable();
  }


  readImage(file: File): Observable<any> {
    const obsr$ = new Subject<any>();
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      obsr$.next({
        previewSrc: reader.result as string,
        fileName: file.name,
        file: file
      });
      obsr$.complete();
    };
    return obsr$.asObservable();
  }


  evaluateListConditions(key: any, value: any, operator: string) {
    let result: boolean;
    switch (operator) {
      case '==':
      case '=':
        result = (key == value);
        break;
      case '!=':
        result = (key != value);
        break;
      case '&&':
      case "and":
        result = (key && value);
        break;
      case '||':
      case "or":
        result = (key || value);
        break;
      default:
        result = false;
    }
    return result;
  }

  evaluvateCondition(rules: any, condition: any, formData?: any, fieldConfig?: any) {

    const data: any = formData;

    const currentUserData = this.appGlobalService.getCurrentUserData();


    let valueConfig: any = {
      lhsConfig: {},
      rhsConfig1: {},
      rhsConfig2: {}
    }

    const val = rules?.reduce((acc: boolean, curr: any) => {
      const isParentCondtion = curr.hasOwnProperty("condition");

      if (acc === undefined)
        acc = (condition === 'and') ? true : false;
      if (isParentCondtion) {
        const currentCondition = curr.condition;
        acc = this.evaluate(acc, this.evaluvateCondition(curr.rules, currentCondition, data, fieldConfig), condition, valueConfig)
      }
      else if (data || currentUserData) {
        const lhs = this.getLHsValue(curr, data, currentUserData, fieldConfig);
        const lhsValue = lhs.value;
        valueConfig.lhsConfig = lhs.config;
        const rhs = this.getRHSValue(curr, data, currentUserData, fieldConfig);
        const rhsValue = rhs.value;
        valueConfig.rhsConfig1 = rhs.config.rhsConfig1;
        valueConfig.rhsConfig2 = rhs.config.rhsConfig2;
        const operator = curr.operator;
        acc = this.evaluate(acc, this.evaluate(lhsValue, rhsValue, operator, valueConfig), condition, valueConfig);
      }
      else
        acc = false;
      return acc;
    }, undefined)

    return val
  }


  getLHsValue(curr: any, data: any, currentUserData: any, fieldConfig: any) {
    let lhsValue: any;
    let config: any
    if (curr.lhsTableName != 'currentUser') {
      lhsValue = data[curr.label]
    }
    else if (curr.lhsTableName === 'currentUser' && curr.label === 'role') {
      const roles = [];
      for (const field in currentUserData) {
        if (currentUserData[field] == true && field !== 'recDeleted') {
          roles.push(field);
        }
      }
      lhsValue = roles;
    }
    else {
      lhsValue = currentUserData[curr.label]
    }
    config = ((curr.label === 'role' || curr.label === 'userRoles') && curr.lhsTableName === 'currentUser') ? { uiType: 'checkboxgroup' } :
      ((curr.label === 'createdDate' || curr.label === 'modifiedDate') && curr.lhsTableName === 'currentUser') ? { fieldType: 'Date' } :
        fieldConfig ? fieldConfig[curr.label] : { fieldType: 'string' };

    return {
      value: lhsValue,
      config: config
    }
  }


  getRHSValue(curr: any, data: { [x: string]: any; }, currentUserData: { [x: string]: any; }, fielConfig: any) {
    let rhsValue = {};
    let config: any = {};
    switch (curr.type) {

      case 'value':
        rhsValue = {
          value1: curr.value1,
          value2: curr.value2
        }
        break;
      case 'field':
        if (curr.rhsTableName1) {
          rhsValue = {
            value1: ((curr.rhsTableName1 != 'currentUser') ? data[curr.value1] || '' :
              currentUserData[curr.value1] || ''),

            value2: ((curr.rhsTableName1 != 'currentUser') ? data[curr.value2] || '' :
              currentUserData[curr.value2] || '')
          }
          //  config = {rhsConfig1:fielConfig[curr.value1],rhsConfig2:fielConfig[curr.value2]}
          config = { rhsConfig1: (fielConfig) ? fielConfig[curr.value1] : { fieldType: 'string' }, rhsConfig2: (fielConfig) ? fielConfig[curr.value2] : { fieldType: 'string' } }

        }

        break;
      case 'field_value':
        rhsValue = {
          value1: (curr.rhsTableName1 === 'currentUser') ? currentUserData[curr.value1] || '' : data[curr.value1] || '',
          value2: curr.value2
        }
        // config = {rhsConfig1:fielConfig[curr.value1], rhsConfig2:''};
        config = { rhsConfig1: (fielConfig) ? fielConfig[curr.value1] : { fieldType: 'string' }, rhsConfig2: '' }

        break;

      case 'value_field':
        rhsValue = {
          value1: curr.value1,
          value2: (curr.rhsTableName2 === 'currentUser') ? currentUserData[curr.value2] || '' : data[curr.value2] || '',
        }

        //config = {rhsConfig1:'', rhsConfig2:fielConfig[curr.value2]}
        config = { rhsConfig1: '', rhsConfig2: (fielConfig) ? fielConfig[curr.value2] : { fieldType: 'string' } }
        break;
    }
    return {
      value: rhsValue,
      config: config
    }
  }

  evaluate(key: any, values: any, operator: string, fieldType?: any) {
    let result: boolean = false;
    if (fieldType) {
      const value1 = (typeof values === 'object') ? values?.value1 : values;
      const value2 = values?.value2;
      switch (operator) {
        case "and":
          result = (key && value1);
          break;

        case "or":
          result = (key || value1);
          break;

        default:
          result = this.evaluateOperators(key, value1, value2, operator, fieldType);
      }
      return result;
    }
    else {
      return result = this.evaluateListConditions(key, values, operator);
    }

  }


  getAutoSuggestValues(valueConfig: any, value: any, primaryKey: any) {
    let values: any[] = [];

    if (valueConfig.multipleValues && !environment.prototype) {
      let keys: any[] = [];
      value?.map((o: any) => {
        keys = []
        primaryKey?.map((k: any) => {
          keys.push(o[k] || o.value[k])
        },
          values.push(keys.join("_")))
      });
    }
    else if (!valueConfig.multipleValues && !environment.prototype && Array.isArray(primaryKey) && primaryKey.length > 0) {
      if (value)
        primaryKey.map((o: string) => values.push(value?.[o] || value?.value?.[o]));
    }
    else {
        if (Array.isArray(value)) {
          values = [...value];
        } else if (value !== undefined && value !== null && typeof value === 'object' && Object.keys(value).length > 0) {
          values = [value.referenceField];
        } else {
          values = [];
        }
    }

    return values;

  }


  evaluateOperators(key: any, value1: any, value2: any, operator: any, valueConfig: any) {
    let result: boolean = false;

    if (valueConfig?.lhsConfig?.uiType === 'autosuggest') {

      const lhsPrimaryKey = valueConfig.lhsConfig.functionalPrimaryKey || [];
      const rhsPrimaryKey = valueConfig.rhsConfig1?.functionalPrimaryKey || [];

      const lhsValues = this.getAutoSuggestValues(valueConfig.lhsConfig, key, lhsPrimaryKey) || [];
      const rhsValues = rhsPrimaryKey.length > 0 ? this.getAutoSuggestValues(valueConfig.lhsConfig, value1, rhsPrimaryKey) || [] : value1;

      result = valueConfig.lhsConfig.multipleValues ? this.arrayOperations(lhsValues, rhsValues, operator) :
        this.stringOperations(lhsValues.join(), Array.isArray(rhsValues) ? rhsValues.join() : rhsValues, operator);

    }
    else if (valueConfig.lhsConfig?.fieldType === 'number') {
      result = this.numberOperations(key, value1, value2, operator);
    }
    else if (valueConfig.lhsConfig?.fieldType === 'Date') {
      result = this.dateOperations(key, value1, value2, operator);
    }
    else if (valueConfig.lhsConfig?.uiType === 'select' && (valueConfig.lhsConfig.multipleValues) || valueConfig.lhsConfig?.uiType === 'checkboxgroup') {
      result = this.arrayOperations(key, value1, operator);
    }
    else {
      if (valueConfig.rhsConfig1?.uiType === 'autosuggest' && !environment.prototype) {
        const rhsPrimaryKey = valueConfig.rhsConfig1?.functionalPrimaryKey || [];
        const rhsValues = this.getAutoSuggestValues(valueConfig.rhsConfig1, value1, rhsPrimaryKey);
        value1 = (valueConfig.rhsConfig1.multipleValues) ? rhsValues : rhsValues.join("_");
      }
      result = this.stringOperations(key, value1, operator);
    }

    return result;

  }

  arrayOperations(key: any, value: any, operator: string) {
    key = key === '' ? [] : key;
    let result: boolean = false;
    switch (operator) {
      case 'is equal to':
        if (Array.isArray(key) && Array.isArray(value))
          result = (key?.join() === value?.join());
        break;
      case 'is not equal to':
        if (Array.isArray(key) && Array.isArray(value))
          result = (key?.join() !== value?.join());
        break;

      case 'is empty':
        result = (key == null || key === undefined || key.length == 0)
        break;

      case 'is not empty':
        result = (key?.length > 0)
        break;

      case 'has none of':
        result = (key?.every((val: any) => !value?.includes(val)));
        break;

      case 'has all of':
        result = key?.every((elem: any) => value?.includes(elem));
        break;

      case 'has any of':
        result = key?.some((elem: any) => value?.includes(elem));
        break;
    }
    return result;
  }


  stringOperations(key: any, value: any, operator: string) {
    let result: boolean = false;
    switch (operator) {

      case 'is equal to':
        result = (key === value);
        break;

      case 'is not equal to':
        result = (key !== value);
        break;

      case 'is empty':
        result = key === '' || key === null || key === undefined;
        break;

      case 'is not empty':
        result = key != '' && key !== null && key !== undefined;
        break;

      case 'is in':
      case 'has any of':
        result = value.includes(key);
        break;

      case 'is not in':
      case 'has none of':
        result = !value.includes(key);
        break;
    }
    return result;
  }

  dateOperations(key: any, value1: any, value2: any, operator: string) {
    let result: boolean = false;
    key = new Date(key)?.getTime();
    value1 = new Date(value1)?.getTime();
    value2 = new Date(value2)?.getTime()
    switch (operator) {

      case 'is equal to':
        result = key === value1;
        break;

      case 'is before':
        result = (key < value1);
        break;

      case 'is after':
        result = (key > value1);
        break;

      case 'is equal or before':
        result = (key <= value1);
        break;

      case 'is equal or later than':
        result = (key >= value1);
        break;

      case 'is empty':
        result = key === '';
        break;

      case 'is not empty':
        result = key;
        break;

      case 'is between':
        result = value1 < key && value2 > key;
        break;

      case 'is not between':
        result = value1 > key || value2 < key;
        break;

    }

    return result;

  }
  numberOperations(key: any, value1: any, value2: any, operator: string) {
    let result: boolean = false;
      if (key === null || key === undefined) {
      return result;
    }
    switch (operator) {
      case 'is equal to':
        result = (key === value1);
        break;
      case 'is not equal to':
        result = (key !== value1);
        break;
      case 'is less than':
        result = (key < value1);
        break;
      case 'is greater than':
        result = (key > value1);
        break;
      case 'is less than or equal to':
        result = (key <= value1);
        break;
      case 'is greater than or equal to':
        result = (key >= value1);
        break;
      case 'is between':
        result = (value1 < key && value2 > key);
        break;
      case 'is not between':
        result = (value1 > key || value2 < key);
        break;
    }
    return result;

  }

  formatRawDatatoRedableFormat(config:any, data:any ,fieldtype?:string,fromFilters?:boolean){
    let type = fieldtype ?? config.uiType;

    if (data?.hasOwnProperty('displayField')) {
      type = 'autosuggest';
    }

    let formattedValue: any;

    switch (type) {
      case 'date':
        const dateField = new Date(data).getTime();
        formattedValue = this.formatDate(dateField, '');
        break;
      case 'datetime':
        const dateTimeField = new Date(data).getTime();
        formattedValue = this.formatDateTime(dateTimeField, '');
        break;
      case 'currency':
        formattedValue = this.formatCurrency(data, '', '');
        break;

      case 'number':
        formattedValue = this.getFormattedNumber(data, '');
        break;

      case 'autosuggest':
        if(fromFilters){
          formattedValue = (data?.displayField)?data.displayField : data;
        }
        else{
        formattedValue = (environment.prototype)? data : (config.multipleValues === true)?
        ((data && data?.map((o: { [x: string]: any; })=> o[config.displayField])) || []).toString():
        (data && data[config.displayField]);
        }
        break;

      case 'dropdown':
      case 'select':
        formattedValue = (config.multipleValues === true) ?
          (data && data?.map((o: any) => this.translateService.instant((o.replace(/ /g, "_")).toUpperCase())) || []).toString() :
          data && this.translateService.instant((data?.replace(/ /g, "_")).toUpperCase());
        break;

        case 'checkbox':
        case 'boolean':
          if (typeof data != 'undefined') {
            if (config.fieldType == 'Boolean' || typeof data === 'boolean') {
              formattedValue = data ? 'True' : 'False';
            }
            if (config?.isToggle == true) {
              formattedValue = `<div class="toggle-container ${data ? 'on' : ''}"><div class="toggle-knob"></div></div>`
            }
          }
          break;

        case 'attachments' :
        case 'imageCarousel' :
          formattedValue = '';
          data.map((o: any) => {
            formattedValue = formattedValue + `<span>
          <a target='_blank' href="${AppConstants.attachmentBaseURL}${o.id}" class="ellipsis white-space-nowrap">${this.domSanitizer.sanitize(SecurityContext.HTML, o.fileName)}</a>
          </span>`
          })
        break;

      default:
        formattedValue = data;
    }
    return (formattedValue);
  }

  getQueryForAutosuggest(urlObj: any): any {
    const firstIndex = urlObj.indexOf('?');
    const pUrl = urlObj.substring(firstIndex + 1, urlObj.length);
    const index = pUrl.indexOf('?');
    let total;

    if (index > 0) {
      let finalIndex = index + firstIndex;
      const pre = urlObj.substring(0, finalIndex + 1);
      const sub = urlObj.substring(finalIndex + 2, urlObj.length);
      total = pre + '&' + sub;
    }
    else
      total = urlObj;
    return total;
  }

  generateDynamicQueryParams(urlObj: any, fromSearch?: boolean, queryView?: boolean) {
    let queryParams: any = new HttpParams();
    const config = JSON.parse(JSON.stringify(urlObj));
    if (BaseAppConstants.isSql && fromSearch && !queryView) {
      config.colConfig.filterInputMapping = config.colConfig?.filterInputMapping?.filter((mapping: { lookupField: any; }) => config.colConfig?.mandatoryFilters?.includes(mapping.lookupField));
    }
    config.colConfig?.filterInputMapping?.map((paramsObj: any) => {
      const fieldName = paramsObj.tableField.split('.');
      const tableFields = urlObj.value;
      const value = (fieldName[1]) ? (tableFields[fieldName[0]][fieldName[1]]) : tableFields[fieldName[0]];
      if (value && fromSearch) {
        if (typeof value == 'object') {
          if (value instanceof Date) {
            if (config.formConfig[fieldName]?.uiType === 'date') {
              const d = value.getFullYear() + '-' + this.leftPad((value.getMonth() + 1), 2) + '-' + this.leftPad(value.getDate(), 2)
              queryParams = queryParams.append(paramsObj.lookupField, d);
            } else {
              queryParams = queryParams.append(paramsObj.lookupField, new Date(value).getTime());
            }

          } else {
            const existField = config.formConfig[paramsObj.tableField] || {};
            queryParams = queryParams.append(paramsObj.lookupField, (value[existField?.parentField] || value[paramsObj.lookupField] || value['displayField']));
          }
        } else {
          queryParams = queryParams.append(paramsObj.lookupField, value);
        }
      }
      else if (!value && fromSearch) {
        const isEmptyString = typeof value === 'string' && value.trim() === '';
        if (queryView && (isEmptyString || value == null)) {
          queryParams = queryParams.append(paramsObj.lookupField, null);
        }
      }
      else if (value && typeof value !== 'object') { // sql filters
          queryParams = queryParams.append(paramsObj.lookupField, value);
      }
    })

    queryParams = queryParams.append('query', urlObj.searchText || '');
    queryParams = queryParams.append('pgNo', urlObj.pageNo);
    queryParams = queryParams.append('pgLen', BaseAppConstants.defaultPageSize);
    queryParams = queryParams.append('dField', config?.colConfig?.displayFields[0]?.name);

    const url = `${urlObj.url}?${queryParams}`;
    let totalUrl = this.getQueryForAutosuggest(url);
    if (urlObj?.id) {
      totalUrl = totalUrl + '&sid=' + urlObj?.id;
    }
    return totalUrl;
  }

  getActionsConfig(config: any) {
    return config?.flatMap((o: any) => {
      if (o.type === 'button') {
        return o;
      }
      else if (o.type === 'buttonGroup')
        return o.children
    })
  }

  validateMultipleComp(formValues: any, config: any) {
    let ctrl = config.field;
    let mulFormErrors: string[] = [];
    if (config.columns.length) {
      if (formValues[ctrl] && formValues[ctrl].length) {
        formValues[ctrl].forEach((row: any) => {
          let obj = this.isValidObject(row, config);
          if (obj.error) {
            let errVal: string[] = Object.values(obj.error).map((msg) => `${msg} in ${config.label}`);
            mulFormErrors = [...mulFormErrors, ...errVal];
          }
        });
      }
    }
    return mulFormErrors;
  }

  isValidObject(obj: any, config: any) {
    let errors: any;
    config.columns.forEach((col: any) => {
      if (col.name !== 'jid') {
        if (col.mandatory === 'yes') {
          if (!obj[col.name]) {
            errors = { ...errors, ...{ [col.name]: `${col.name} is required` } };
          }
        }
        if (col.uiType === 'email') {
          let reg = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
          if (obj[col.name] && !reg.exec(obj[col.name])) {
            errors = { ...errors, ...{ [col.name]: `${col.label} is not matching its accepted pattern` } };
          }
        }
        if (col.minLength && obj[col.name] && obj[col.name].length < col.minLength) {
          errors = { ...errors, ...{ [col.name]: `${col.label} is not matching its min-length condition` } };
        }
        if (obj[col.name] && col.acceptedChars) {
          let exp = new RegExp(col.acceptedChars);
          if (!exp.exec(obj[col.name])) {
            errors = { ...errors, ...{ [col.name]: `${col.regexError}` } };
          }
        }
      }
    });
    if (errors) {
      obj.error = errors;
    } else {
      if (obj.error) {
        delete obj.error;
      }
    }
    return obj
  }

  deepClone(obj: any) {
    if (obj === null) return null;
    let clone = Object.assign({}, obj);
    Object.keys(clone).forEach(
      key =>
      (clone[key] =
        (typeof obj[key] === 'object' && !(obj[key] instanceof Date)) ? this.deepClone(obj[key]) : obj[key])
    );
    if (Array.isArray(obj)) {
      clone.length = obj.length;
      return Array.from(clone);
    }
    return clone;
  };

  public splitFileAndData(data: any, fileFields: string[]) {
    const returnData: any = {
      data: {},
      files: {}
    };
    if (!fileFields || !fileFields.length) {
      returnData.data = data;
      return returnData;
    }
    const dataKeys = Object.keys(data);
    dataKeys.forEach(d => {
      if (fileFields.indexOf(d) > -1 && data[d]?.length > 0) {
        returnData.files[d] = data[d];
      } else {
        returnData.data[d] = data[d] === "" ? null : data[d];
      }
    });

    return returnData;
  }



  formatTableFieldConfig(config: any) {
    return config?.reduce((acc1: any, curr1: any) => {
      acc1[curr1.name] = curr1;
      return acc1;
    }, {})
  }

  generateDynamicTabViewProps(array: any, tabIndexes: any = {}) {
    array.children.map((o: any, index: number) => {
      if (o.type === 'tabView') {
        tabIndexes[`${o.tabName}`] = 0;
      }
      else {
        if (o.children)
          this.generateDynamicTabViewProps(o, tabIndexes);
      }

    })
    return tabIndexes;
  }


  public removeUnSafeParams(input: any) {
    if (!input || typeof input !== 'object') return;
    for (let key of Object.keys(input)) {
      if (!input[key]) continue;
      if (typeof input[key] === 'object') {
        this.removeUnSafeParams(input[key])
      } else if (typeof input[key] == 'string') {
        // decode is done to skip encoding any special characters, Only the HTML tags are removed if needed.
        input[key] = decode(this.domSanitizer.sanitize(SecurityContext.HTML, input[key]));
      }
    }
  }

  public getRandomNum() {
    const cryptoObj = window.crypto;
    const randomBuffer = new Uint32Array(1);
    cryptoObj.getRandomValues(randomBuffer);
    return randomBuffer[0] / (0xffffffff + 1);
  }

  getFormattedCurrency(data: any, row: any, col: any) {
    let cCode: any;
    const self = this;
    const curFormatField = col.field + 'CurrencyFormat';
    if (row[curFormatField]) {
      cCode = row[curFormatField];
    } else {
      cCode = col.currency ? col.currency : null;
    }
    const cDisplay = col.currencyDisplay ? col.currencyDisplay : null;
    return this.domSanitizer.sanitize(SecurityContext.HTML, this.formatCurrency(row[col.field], cCode, cDisplay, '', '', col));
  }

  getFormattedEmail(data: any, col: any) {
    return data;
  }

  getlookupDisplayData(data: any, col: any) {
    const displayField = col.displayField || ''
    if (Array.isArray(data)) {
      let tempData: any = []
      data.map((i: any) => {
        tempData.push(i?.value[displayField]);
      })
      return tempData.join(',');
    }
    return data?.value ? data?.value[displayField] : (data || '');
  }

  getBooleanData(data: any, col: any) {
    return data;
  }

  coerceBoolean(value: any): any {
    if (typeof value === 'string') {
      const normalized = value.trim().toLowerCase();
      if (normalized === 'true') return true;
      if (normalized === 'false') return false;
    }
    return value;
  }

  getTableView(tableStyle?: any, rowSpacing?: any, rowHeight?: any) {
    let baseAppConstants: any = BaseAppConstants;
    if (baseAppConstants?.tableView) {
      if (baseAppConstants?.tableView?.toLowerCase() == 'compact') {
        return {
          tableStyle: 'style_2',
          rowHeight: 'small',
          rowSpacing: 'medium'
        }
      } else if (baseAppConstants?.tableView?.toLowerCase() == 'comfortable') {
        return {
          tableStyle: 'style_1',
          rowHeight: 'medium',
          rowSpacing: 'medium'
        }
      } else {
        return {
          tableStyle: 'style_2',
          rowHeight: 'medium',
          rowSpacing: 'medium'
        }
      }
    } else {
      return {
        tableStyle: tableStyle,
        rowHeight: rowHeight,
        rowSpacing: rowSpacing
      }
    }
  }

  formatAllowedValues(real_Data: any, uiType: any) {
    if (uiType?.toLowerCase() == 'lookup' && real_Data) {
      return (Array.isArray(real_Data) ? Object.keys(real_Data)?.map((x: any) => real_Data[x]) : '');
    } else {
      if (real_Data) {
        if (typeof real_Data === 'string') {
          real_Data = this.translateService.instant(real_Data);
        }
        else if (Array.isArray(real_Data)) {
          real_Data = real_Data.map(x => this.translateService.instant(x)).join(', ');
        }
        return real_Data;
      } else {
        return '';
      }
    }
  }

  navigateWithQueryParams(params: { [key: string]: any }, url: string) {
    const queryParams = new URLSearchParams();
    // Add parameters dynamically
    Object.keys(params).forEach(key => {
      const value = params[key];

      if (Array.isArray(value)) {
        // If the parameter value is an array, convert it to a comma-separated string
        queryParams.set(key, value.join(','));
      } else if (typeof value === 'object') {
        // If the parameter value is an object, stringify it
        queryParams.set(key, JSON.stringify(value));
      } else {
        // Otherwise, set the parameter value as is
        queryParams.set(key, value);
      }
    });
    const queryString = queryParams.toString();
    this.router.navigateByUrl(`${url}?${queryString}`);
  }

  mergeConfigs(baseConfig: any, overrideConfig: any) {
    // This method use to merge configuration based on the unique value
    const baseFields = baseConfig.children;
    const overrideFields = overrideConfig.children;

    const baseFieldMap = new Map(
      baseFields.map((field: { field: any }) => [field.field, field])
    );

    overrideFields.forEach((overrideField: { [x: string]: any; field?: any }) => {
      const { field: fieldName } = overrideField;
      // Find matching field in baseFields using the Map
      const matchingBaseField = baseFieldMap.get(fieldName);

      if (matchingBaseField) {
        // Merge properties from overrideField into matchingBaseField
        Object.assign(matchingBaseField, overrideField);
      } else {
        baseFields.push(overrideField);
      }
    });

    return baseConfig;
  }
  capitalizeFirstLetter(sentence: string) {
    if (sentence.length === 0) return sentence;
    if (/[a-zA-Z]/.test(sentence.charAt(0))) {
      return sentence.charAt(0).toUpperCase() + sentence.slice(1);
    }
    return sentence;
  }

  isObject(value: any) {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
  }

  closeAllActivePopups() {
    this.dialogService.dialogComponentRefMap.forEach((dialog: any) => {
      dialog.destroy();
    });
  }

/**
* Updates button visibility based on the actions that are not allowed.
*
* @param {string[]} notAllowedActions - List of actions that are not allowed. This list will be converted to lowercase for comparison.
* @param {Object} actionBarConfigs - Configuration objects for the action bars.
* @param {Object} conditionalActions - Object to store actions that should be disabled.
* @param {Object} extraProps
*/

updateButtonVisibilityBasedonAllowedActions(
  notAllowedActions: any[],
  actionBarConfigs: { left: { children: any; }; right: { children: any; }; },
  conditionalActions: { hideActions: any[]; },
  extraProps: any,
) {
  const additionalProps = extraProps || {};
  const isCreateMode = additionalProps.queryParams?.['isCreate'] === 'yes';
  const isUpdateMode = additionalProps.id || additionalProps.queryParams?.['isCreate'] !== 'yes';
  const hasNoQueryParams = Object.keys(additionalProps.queryParams || {}).length === 0;
  const hasNoData = Object.keys(additionalProps.data || {}).length === 0;
  // Convert all actions to lowercase for uniform comparison
  const lowerCaseNotAllowedActions = notAllowedActions.map(action => action.toLowerCase());
  const lowercaseAllowedActions = additionalProps.allowedActions?.map((action: string) => action.toLowerCase()) || [];

  const modifyAction = (actionConfig: any) => {
    if (lowerCaseNotAllowedActions.includes(actionConfig.action)) {
      if (additionalProps.hasConfigurationPriority && (actionConfig.buttonEnabled == 'conditional' || actionConfig.buttonEnabled == 'no')) {
        return;
      }
      if (!conditionalActions.hideActions.includes(actionConfig.buttonId)) {
        conditionalActions.hideActions.push(actionConfig.buttonId);
      }
    }
    else if (lowercaseAllowedActions.includes(actionConfig.action)) {
      if (additionalProps.hasConfigurationPriority && (actionConfig.buttonEnabled == 'conditional' || actionConfig.buttonEnabled == 'no')) {
        return;
      }
      let index: number;
      while ((index = conditionalActions.hideActions.indexOf(actionConfig.buttonId)) !== -1) {
        conditionalActions.hideActions.splice(index, 1);
      }
    }
  };


  // Combine action bar configurations if needed
  const combinedActionBar = {
    ...actionBarConfigs?.left,
    children: [
      ...actionBarConfigs?.left?.children || [],
      ...(actionBarConfigs?.right?.children || [])
    ]
  };

  // Check each action config in the combinedActionBar
  combinedActionBar.children.forEach(actionConfig => {
    if (actionConfig.type === 'buttonGroup' && actionConfig.children) {
      actionConfig.children.forEach((groupButtonConfig: { action: string; buttonId: any; }) => {
        if (groupButtonConfig.action === 'save') {
          if (
            (lowerCaseNotAllowedActions.includes('insert') && (!additionalProps.id && (isCreateMode || (hasNoQueryParams && hasNoData)))) ||
            (lowerCaseNotAllowedActions.includes('update') && isUpdateMode)
          ) {
            conditionalActions.hideActions.push(groupButtonConfig.buttonId);
          }
        }
        else {
          // Handle other group button actions
          modifyAction(groupButtonConfig);
        }
      });
    }

    else {
      // Handle actions not in button groups, including individual 'save' actions
      if (actionConfig.action === 'save') {
        // Handle 'save' action specifically for non-button group actions
        // Handle 'save' action specifically
        if (
          (lowerCaseNotAllowedActions.includes('insert') && (!additionalProps.id && (isCreateMode || (hasNoQueryParams && hasNoData)))) ||
          (lowerCaseNotAllowedActions.includes('update') && isUpdateMode)
        ) {
          {
            conditionalActions.hideActions.push(actionConfig.buttonId);
          }
        }
      }
      else {
        // Handle other non-group actions
        modifyAction(actionConfig);
        // disableAction(actionConfig);
      }
    }
  });
}


  setCurrentPageGlobally(){
    this.appGlobalService.write('FromPage',this.router.routerState?.snapshot?.url);
  }

 /**
 * Compares two URLs for equality after normalizing them.
 *
 * This function normalizes the URLs by:
 * 1. Removing any query parameters.
 * 2. Removing leading and trailing slashes.
 *
 * @param {string} url1 - The first URL to compare.
 * @param {string} url2 - The second URL to compare.
 * @returns {boolean} - Returns `true` if the normalized URLs are equal, otherwise `false`.
 */
  areUrlsEqual(url1: string, url2: string): boolean {
    const normalizeUrl = (url: string) => {
    const urlWithoutQueryParams = url?.split('?')[0];
    return urlWithoutQueryParams.replace(/^\/|\/$/g, '');
    };
    return normalizeUrl(url1) === normalizeUrl(url2);
  }

/**
  Restore the values in List
*/
setGridConfigProperty(key: string, value: any): void {
  this.appGlobalService.write('gridConfig', { [key]: value });
  localStorage.setItem('gridConfig', JSON.stringify(value));
}

  getGridConfigProperty(key: string): any {
    const config = this.appGlobalService.get('gridConfig');
    return config ? config[key] : undefined;
  }

  removeGridConfigProperty(key?: string): void {
    this.appGlobalService.write('gridConfig', '');
  }

  //copy any text to clipboard
  copyValue(value:string){
    navigator.clipboard.writeText(value);
    }

  // Generate Workflow actionbar buttons config based on RC configuration
  formWorkflowActionBarConfig(buttonsConfig: any = [], displayCount: any = 2) {
    let wfConfig: any = {
      "outline": false,
      "children": [{
        "outline": true,
        "children": [],
        "buttonStyle": "curved",
        "displayCount": displayCount,
        "label": "BUTTON_GROUP",
        "type": "buttonGroup"
      }],
      "label": "Workflow Action Bar",
      "type": "workflowActionBar"
    }

    let buttons: any = [];
    buttonsConfig?.forEach((obj: any) => {
      buttons.push({
        "visibility": "show",
        "buttonStyle": "curved",
        "label": obj.eventName,
        "type": "button",
        "outline": true,
        "buttonType": "icon_on_left",
        "showOn": "both",
        "buttonId": obj.eventId,
        "buttonEnabled": "yes",
        "action": "call_a_backend_webservice",
        "fields": [],
        "wfAction": obj.eventId
      })
    })
    wfConfig.children[0].children = buttons;

    return wfConfig;
  }

  leftPad(num:number, length:number) {
    var result = '' + num;
    while (result.length < length) {
      result = '0' + result;
    }
    return result;
  }

  assignInitialValueToPageVariables(pageVariables: { children: any[] }, formControls: FormGroup) {
    pageVariables?.children?.forEach((variable: any) => {
      if (variable?.fieldType === 'Date' || (variable?.uiType == 'datetime' && (variable?.value === 'today' || variable?.value === 'tomorrow'))) {
        let convertedValue = new Date();

        if (variable.value === 'tomorrow') {
          convertedValue.setDate(convertedValue.getDate() + 1);
        }

        // Set time to midnight without overwriting the date
        convertedValue.setHours(0, 0, 0, 0);

        if (formControls.contains(variable.name)) {
          formControls.get(variable.name)?.patchValue(convertedValue, { emitEvent: false });
        }
      } else if (formControls.contains(variable.name)) {
        formControls.get(variable.name)?.patchValue(variable.value, { emitEvent: false });
      }
    });
  }


  getAdjustedDate(daysOffset: any, type?: any): Date {
    if (type?.toLowerCase() == 'minusdays') {
      daysOffset = "-" + daysOffset;
    }
    const today = new Date();
    const adjustedDate = new Date(today);
    adjustedDate.setDate(today.getDate() + parseInt(daysOffset));
    adjustedDate.setHours(0, 0, 0, 0); // Set time to 00:00:00.000
    return adjustedDate;
  }
  hasAtleastOneValidValue(obj: any): boolean {
    if (typeof obj !== 'object' || obj === null) {
      return false;
    }

    return Object.values(obj).some(value => value !== null && value !== undefined && value !== '');
  }

  isSwitchNull(value: any): boolean {
    return value === null || value === undefined || typeof value !== 'boolean';
  }

  isBooleanValueSet(value: any): boolean {
    return value !== '' && value !== null && value !== undefined;
  }

  getThemeColor(): string {
    const getVar = (name: string) =>
      getComputedStyle(document.documentElement).getPropertyValue(name).trim();

    const hue = getVar('--base-color');
    const saturation = getVar('--base-saturation');
    const lightness = getVar('--base-lightness');

    return `hsl(${hue}, ${saturation}, ${lightness})`;
  }
  invertExecuteOnPageVariable(config: any) {
    const result: { [key: string]: any } = {};
    Object.values(config).forEach((obj: any) => {
      obj?.executeOn?.variableChanges?.forEach((triggerField: any) => {
        if (!result[triggerField]) {
          result[triggerField] = { executeOnInv: { variableChanges: [] } };
        }
        result[triggerField].executeOnInv.variableChanges.push(obj.fieldName);
      });
    });
    return result;
  }

  invertExecuteOnConfig(config: any) {
    const result: { [key: string]: any } = {};
    Object.values(config).forEach((obj: any) => {
      obj?.executeOn?.fieldChanges?.forEach((triggerField: any) => {
        if (!result[triggerField]) {
          result[triggerField] = { executeOnInv: { fieldChanges: [] } };
        }
        result[triggerField].executeOnInv.fieldChanges.push(obj.fieldName);
      });
    });
    return result;
  }


  //  Cross-App Navigation Methods
  // These methods support navigation between suite app (no context path) and member apps (with context paths)

  getCurrentContextPath(): string {
    const path = window.location.pathname;
    const segments = path.split('/').filter(s => s);
    // If there's a segment before the hash, it's the context path
    return segments.length > 0 ? segments[0] : '';
  }

  navigateWithContextPath(item: any): void {
    const targetContextPath = item?.contextPath || '';
    const currentContextPath = this.getCurrentContextPath();
    const targetUrl = item?.customUrl || item?.page?.url || '';

    // Determine navigation type
    if (item?.onClick === 'navigate_to_member_app' || targetContextPath) {
      // Navigate to member app
      this.navigateToApp(targetContextPath, targetUrl);
    } else if (item?.onClick === 'navigate_to_suite_app') {
      // Navigate to suite app (no context path)
      this.navigateToApp('', targetUrl);
    } else {
      // Default behavior - check if cross-app navigation is needed
      if (targetContextPath !== currentContextPath) {
        this.navigateToApp(targetContextPath, targetUrl);
      }
      // else: same app navigation handled by routerLink in template
    }
  }

  navigateToApp(contextPath: string, url: string): void {
    const origin = window.location.origin;
    let fullUrl = origin;

    if (contextPath) {
      fullUrl += `/${contextPath}`;
    }

    fullUrl += `/#${url}`;

    this.document.location.href = fullUrl;
  }

  isCrossAppNavigation(item: any): boolean {
    const targetContextPath = item?.contextPath || '';
    const currentContextPath = this.getCurrentContextPath();

    return (item?.onClick === 'navigate_to_member_app' ||
      item?.onClick === 'navigate_to_suite_app' ||
      (targetContextPath !== currentContextPath && (targetContextPath || item?.contextPath !== undefined)));
  }

  getTabPageUrl(item: any): string | null {
    let level1 = item?.children?.length > 0 ? item?.children[0] : null;
    if (level1?.element == 'tabGroup') {
      let level2 = level1?.children?.length > 0 ? level1?.children[0] : null;
      if (level2?.element == 'tabGroup' && level2?.children[0]?.element == 'tabItem') {
        return (level2?.children[0]?.page?.url || level2?.children[0]?.customUrl || null)
      } else if (level2?.element == 'tabItem') {
        return (level2?.page?.url || level2?.customUrl || null)
      }
      return null;
    } else if (level1?.element == 'tabItem') {
      return (level1?.page?.url || level1?.customUrl || null)
    }
    return null;
  }


  isValidInput(value: string): boolean {
    const validatedValue = value.replace(/[^a-zA-Z0-9_-]/g, '');
    return validatedValue === value;
  }

  isSafeUrl(url: string): boolean {
    try {
    const parsed = new URL(url);

    return (
      parsed.protocol === 'http:' || parsed.protocol === 'https:'
    );
   } catch {
    return false;
  }
 }
  // ==================== HTML Sanitization Methods ====================
  // These methods provide secure HTML sanitization using DOMPurify
  // to prevent XSS attacks while still allowing safe HTML rendering

  /**
   * Sanitize general HTML content
   */
  sanitizeHtml(html: string): SafeHtml {
    if (!html) return '';
    const clean = DOMPurify.sanitize(html, {
      RETURN_TRUSTED_TYPE: false
    });
    return this.domSanitizer.bypassSecurityTrustHtml(clean as string);
  }

  /**
   * Sanitize SVG content using DOMPurify's built-in SVG profile.
   * USE_PROFILES provides pre-configured security rules maintained by DOMPurify's
   * security team - automatically updated when new attack vectors are discovered.
   * No need to manually maintain allowlists/blocklists.
   */
  sanitizeSvg(svg: string): SafeHtml {
    if (!svg) return '';
    const clean = DOMPurify.sanitize(svg, {
      // Use DOMPurify's built-in SVG security profile
      // This includes safe SVG tags, filters, and automatically blocks dangerous elements
      USE_PROFILES: { svg: true, svgFilters: true },
      // Additional security hardening
      SANITIZE_DOM: true,
      RETURN_TRUSTED_TYPE: false
    });
    return this.domSanitizer.bypassSecurityTrustHtml(clean as string);
  }
}

