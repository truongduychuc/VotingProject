import {Pipe, PipeTransform} from '@angular/core';
import {DatePipe} from '@angular/common';
import {Constants} from '../_enums/constants';


@Pipe({
  name: 'dateTimeFormat'
})
export class DatetimeFormatPipe extends DatePipe implements PipeTransform {
  transform(value: any, format?: string, timezone?: string, locale?: string): string | null {
    return super.transform(value, Constants.DATE_TIME_FMT);
  }
}
