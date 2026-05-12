import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PrimeNGConfig } from 'primeng/api';

@Injectable({ providedIn: 'root' })
export class CalendarLocaleService {
  constructor(
    private translate: TranslateService,
    private primengConfig: PrimeNGConfig
  ) {
    this.initCalendarLocale();

    this.translate.onLangChange.subscribe(() => {
      this.initCalendarLocale();
    });
  }

  private initCalendarLocale() {
    const keys = [
      'SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY',
      'SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT',
      'SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA',
      'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
      'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER',
      'JAN', 'FEB', 'MAR', 'APR', 'MAY_SHORT', 'JUN',
      'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC',
      'TODAY', 'CLEAR', 'WEEK_HEADER','AM', 'PM'
    ];

    this.translate.get(keys).subscribe(trans => {
      this.primengConfig.setTranslation({
        dayNames: [
          trans.SUNDAY, trans.MONDAY, trans.TUESDAY, trans.WEDNESDAY,
          trans.THURSDAY, trans.FRIDAY, trans.SATURDAY
        ],
        dayNamesShort: [
          trans.SUN, trans.MON, trans.TUE, trans.WED,
          trans.THU, trans.FRI, trans.SAT
        ],
        dayNamesMin: [
          trans.SU, trans.MO, trans.TU, trans.WE,
          trans.TH, trans.FR, trans.SA
        ],
        monthNames: [
          trans.JANUARY, trans.FEBRUARY, trans.MARCH, trans.APRIL,
          trans.MAY, trans.JUNE, trans.JULY, trans.AUGUST,
          trans.SEPTEMBER, trans.OCTOBER, trans.NOVEMBER, trans.DECEMBER
        ],
        monthNamesShort: [
          trans.JAN, trans.FEB, trans.MAR, trans.APR,
          trans.MAY, trans.JUN, trans.JUL, trans.AUG,
          trans.SEP, trans.OCT, trans.NOV, trans.DEC
        ],
        today: trans.TODAY,
        clear: trans.CLEAR,
        weekHeader: trans.WEEK_HEADER
      });
    });
  }
}