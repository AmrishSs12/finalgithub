import { Component, inject, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FormControl, FormGroup } from '@angular/forms';
import { SearchService } from './search-service';


@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})


export class SearchBarComponent implements OnInit {

  globalSearch: string = '';
  searchForm!: FormGroup;
  showAdvancedSearch: boolean = false;

  @Input() searchConfig: any;

  private searchService = inject(SearchService)


  toggleAdvancedSearch() {
    this.showAdvancedSearch = !this.showAdvancedSearch;
  }

  clearAllFilters() {
    this.globalSearch = '';
    this.searchService.changeGlobalSearchKey('');
    this.clearFilterValues();
  }

  clearFilterValues() {
    this.searchForm.reset();
    this.searchService.changeAdvSearchObj('');

  }

  advancedSearch() {
    this.searchService.changeAdvSearchObj(this.searchForm.value);
    this.toggleAdvancedSearch();
  }

  onKeydown(event: any) {
    if (event.which === 13 || event.keyCode === 13) {
      this.searchService.changeGlobalSearchKey(this.globalSearch);
    }
  }

  initForm() {
    let group: any = {}
    this.searchConfig.forEach((input: any) => {
      group[input.label] = new FormControl('');
    })
    this.searchForm = new FormGroup(group);
  }

  ngOnInit() {
    this.initForm();
  }
}
