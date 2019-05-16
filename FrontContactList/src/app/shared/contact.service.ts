import { Injectable } from '@angular/core';
import { Contact } from './contact.model';
import { HttpClient } from "@angular/common/http";
import { Email } from './email.model';
import { Number as NumberPhone } from "./number.model";
import 'rxjs/add/operator/map'
import { FormGroup } from '@angular/forms';


@Injectable({
  providedIn: 'root'
})
export class ContactService {
  formData: Contact;
  formEmail: Email;
  formNumber: NumberPhone;
  list: Contact[];
  filteredList: Contact[];
  id: number;
  emailArr: string[] = [];
  numbersArr: string[] = [];
  idDelete: number = 0;
  contactForm: FormGroup;
  updateId: number;

  readonly rootURL = "http://localhost:57297/api";
  constructor(private http: HttpClient) { }

  compareId(id: number, idCont: number) {
    if (id == idCont) {
      this.idDelete = id;
    }
  }
  check(id: number) {
    this.http.get(this.rootURL + '/values').map(res => res.toString()).subscribe(res => { this.id = Number(res); this.compareId(this.id, id) });
  }
  putContact(formData: Contact) {
    return this.http.put(this.rootURL + '/Contact/' + formData.ContactID, formData)
  }
  postContact(formData: Contact) {
    return this.http.post(this.rootURL + '/Contact', formData)
  }
  postEmailHttp(id: number) {
    var email = new Email;
    console.log('email:idDelete ' + this.idDelete);
    console.log('email:id ' + id);
    if (this.idDelete == 0) {
      email.EmailContactID = id + 1;
    }
    else {
      email.EmailContactID = this.idDelete + 1;
    }
    for (var i = 0; i < this.emailArr.length; i++) {
      email.Email1 = this.emailArr[i];
      this.http.post(this.rootURL + '/Email', email).subscribe(res => console.log(res));
    };
    this.emailArr.slice(0, this.emailArr.length);
    this.emailArr = [];
  }

  postEmail() {
    this.http.get(this.rootURL + '/values').map(res => res.toString()).subscribe(res => { this.id = Number(res); this.postEmailHttp(this.id) });
  }

  postNumberHttp(id: number) {
    var num = new NumberPhone;
    console.log('num: idDelete ' + this.idDelete);
    console.log('num: id ' + id);
    if (this.idDelete == 0) {
      num.MobileContactID = id + 1;
    }
    else {
      num.MobileContactID = this.idDelete + 1;
    }

    for (var i = 0; i < this.numbersArr.length; i++) {
      num.MobileNumber1 = Number(this.numbersArr[i]);
      this.http.post(this.rootURL + '/MobileNumber', num).subscribe(res => { console.log(res) });
    }
    this.numbersArr.slice(0, this.numbersArr.length);
    this.numbersArr = [];
    console.log('idDelete after everything ' + this.idDelete);
    if (this.idDelete != 0)
      this.idDelete = 0;
  }
  postNumber() {
    this.http.get(this.rootURL + '/values').map(res => res.toString()).subscribe(res => { this.id = Number(res); this.postNumberHttp(this.id) });
  }

  postEmailUpdate(email: Email) {
    this.http.post(this.rootURL + '/Email', email).subscribe(res => console.log(res));
  }
  postNumberUpdate(number: NumberPhone) {
    this.http.post(this.rootURL + '/MobileNumber', number).subscribe(res => console.log(res));
  }

  refreshList() {
    this.http.get(this.rootURL + '/Contact').toPromise().then(res => { this.list = res as Contact[] });
  }

  filterList(value: string, filter: string) {
    this.http.get(this.rootURL + '/values/' + value + '/' + filter).toPromise().then(res => this.list = res as Contact[]);
  }

  deleteContact(id: number) {
    return this.http.delete(this.rootURL + '/Contact/' + id);
  }

}
