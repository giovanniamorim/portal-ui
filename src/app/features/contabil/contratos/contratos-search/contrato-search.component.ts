import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-contrato-search',
  templateUrl: './contrato-search.component.html',
  styleUrls: ['./contrato-search.component.scss']
})
export class ContratoSearchComponent implements OnInit {

  public form!: FormGroup;
  @Output() public auditSearch: any = new EventEmitter<string>();

  constructor(private fb: FormBuilder) { }

  public ngOnInit(): void {
    this.form = this.fb.group({
      searchText: ['']
    })

    this.form.valueChanges.subscribe(value=>{
      this.auditSearch.emit(value)
    })
  }

}
