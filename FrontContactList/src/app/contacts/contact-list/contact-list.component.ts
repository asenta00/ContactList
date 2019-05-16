import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ContactService } from '../../shared/contact.service';
import { FormBuilder } from '@angular/forms';
import { Contact } from '../../shared/contact.model';

export interface Selector {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css']
})
export class ContactListComponent implements OnInit {
  @ViewChild('nameInput') nameInput: ElementRef;
  selectors: Selector[];
  selected: string;
  arrEmail: string[] = [];
  arrNumber: number[] = [];
  arr: Contact[] = []
  constructor(private service: ContactService, private fb: FormBuilder) { }

  ngOnInit() {
    this.selectors = [
      { value: 'firstname-0', viewValue: 'FirstName' },
      { value: 'lastname-1', viewValue: 'LastName' },
      { value: 'tag-2', viewValue: 'Tag' },
      { value: 'All', viewValue: 'All' }
    ];
    this.service.refreshList();
  }

  onDelete(id: number) {
    this.service.check(id);
    this.service.deleteContact(id).subscribe(res => this.service.refreshList());
  }

  getFilteredData() {
    this.service.filterList(this.selected, this.nameInput.nativeElement.value);
    this.nameInput.nativeElement.value = '';
  }
  onChange(value) {
    this.selected = value;
    if (value == 'All')
      this.service.refreshList();
  }
  arrayFillEmail(cont: Contact) {
    this.arr = cont['Email'];
    var len = this.arr.length;
    for (var i = 0; i < len; i++) {
      this.arrEmail[i] = cont['Email'][i]['Email1'];
    }
    return this.arrEmail;
  }
  arrayFillNumber(cont: Contact) {
    this.arr = cont['MobileNumber'];
    var len = this.arr.length;
    for (var i = 0; i < len; i++) {
      this.arrNumber[i] = cont['MobileNumber'][i]['MobileNumber1'];
    }
    return this.arrNumber;
  }
  populateForm(cont: Contact) {
    this.service.contactForm = this.fb.group({
      ContactID: cont.ContactID,
      FirstName: cont.FirstName,
      LastName: cont.LastName,
      Birthdate: cont.Birthdate,
      Address: cont.Address,
      City: cont.City,
      Country: cont.Country,
      Tag: cont.Tag,
      Emails: this.fb.array(this.arrayFillEmail(cont)),
      PhoneNumbers: this.fb.array(this.arrayFillNumber(cont))
    })
    this.service.updateId = cont.ContactID;

  }
}


