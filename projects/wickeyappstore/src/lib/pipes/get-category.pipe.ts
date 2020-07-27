import { Pipe, PipeTransform } from '@angular/core';
/*
 * https://angular.io/docs/ts/latest/guide/pipes.html
 * Format large numbers nicely for human consumption.
 * Usage:
 *   value | getCategory
 * Example:
 *   {{ 1 |  getCategory}}
 *   formats to: demo
*/
/**
 * @ignore
 */
enum Categories {
  business = 0,
  demo,
  event,
  game,
  news,
  reference,
  shopping,
  social,
  tool,
  other
}
/** @ignore */
@Pipe({
  name: 'getCategory'
})
export class GetCategoryPipe implements PipeTransform {
  transform(value: number): string {
    if (value === Categories.business) {
      return 'Business';
    } else if (value === Categories.demo) {
      return 'Demo';
    } else if (value === Categories.event) {
      return 'Event';
    } else if (value === Categories.game) {
      return 'Games';
    } else if (value === Categories.news) {
      return 'News';
    } else if (value === Categories.reference) {
      return 'Reference';
    } else if (value === Categories.shopping) {
      return 'Shopping';
    } else if (value === Categories.social) {
      return 'Social';
    } else if (value === Categories.tool) {
      return 'Tools';
    } else if (value === Categories.other) {
      return 'Other';
    } else {
      return 'Other'; // default or undefined
    }
  }

}
