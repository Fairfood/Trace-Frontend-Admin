import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchOptions',
  pure: false,
})
export class FilterDropdownPipe implements PipeTransform {
  transform(items: any[], searchKey: any): any {
    if (!items || !searchKey) {
      return items;
    }
    // filter items array, items which match and return true will be
    // kept, false will be filtered out
    return items.filter(
      item => item.name.toLowerCase().indexOf(searchKey.toLowerCase()) !== -1
    );
  }
}
