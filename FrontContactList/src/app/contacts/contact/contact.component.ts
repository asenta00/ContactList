import { Component, OnInit } from '@angular/core';
import { ContactService } from '../../shared/contact.service';
import { FormArray, FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Email } from '../../shared/email.model';
import { Number as NumberPhone } from "../../shared/number.model";

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  contactForm: FormGroup;
  emaiList: FormArray;
  emailListUpdate: FormArray;
  numberList: FormArray;
  numberListUpdate: FormArray;
  numEmail: number;
  numNumbers: number;
  constructor(private service: ContactService, private fb: FormBuilder) {
  }

  ngOnInit() {
    this.resetForm();
    this.contactForm = this.fb.group({
      FirstName: new FormControl('', Validators.required),
      LastName: new FormControl('', Validators.required),
      Birthdate: new FormControl('', Validators.required),
      Address: new FormControl('', Validators.required),
      City: new FormControl('', Validators.required),
      Country: new FormControl('', Validators.required),
      Tag: new FormControl('', Validators.required),
      PhoneNumbers: this.fb.array([this.createNumber()]),
      Emails: this.fb.array([this.createEmail()])
    });

    if (this.service.contactForm != null)
      this.contactForm = this.service.contactForm;

    this.emaiList = this.contactForm.get('Emails') as FormArray;
    this.numEmail = this.emaiList.length;
    this.numberList = this.contactForm.get('PhoneNumbers') as FormArray;
    this.numNumbers = this.numberList.length;

  }
  createEmail(): FormControl {
    return this.fb.control('');
  }
  createNumber(): FormControl {
    return this.fb.control('');
  }
  addNumber() {
    this.numberList.push(this.createNumber());
  }

  deleteNumber(index) {
    this.numberList.removeAt(index);
  }
  addEmail() {
    this.emaiList.push(this.createEmail());
  }
  deleteEmail(index) {
    this.emaiList.removeAt(index);
  }

  onSubmit(form: FormGroup) {
    if (this.service.contactForm == null) {
      this.insertRecord(form);
      this.insertNumber(form);

    }
    else {
      this.emailListUpdate = this.contactForm.get('Emails') as FormArray;
      this.numberListUpdate = this.contactForm.get('PhoneNumbers') as FormArray;
      // Update new Email
      if (this.numEmail != this.emailListUpdate.length) {
        for (var i = this.numEmail; i < this.emailListUpdate.length; i++) {
          var email = new Email;
          email.Email1 = this.emailListUpdate.at(i).value;
          email.EmailContactID = this.service.updateId;
          this.service.postEmailUpdate(email);
        }
      }
      for (let i = 0; i < this.emaiList.length; i++) {
        this.deleteEmail(i);
      }
      // Update new Number
      if (this.numNumbers != this.numberListUpdate.length) {
        for (var i = this.numNumbers; i < this.numberListUpdate.length; i++) {
          var number = new NumberPhone;
          number.MobileNumber1 = Number(this.numberListUpdate.at(i).value);
          number.MobileContactID = this.service.updateId;
          this.service.postNumberUpdate(number);
        }
      }
      this.updateRecord(form);
    }
    this.service.contactForm = null;
    this.resetForm(form);
    form.reset();
    this.ngOnInit();
  }

  insertRecord(form: FormGroup) {
    this.service.postContact(form.value).subscribe(res => console.log(res));
    this.insertEmail(form);

  }
  updateRecord(form: FormGroup) {
    this.service.putContact(form.value).subscribe(res => {

      this.service.refreshList();
    })
  }
  insertEmail(form: FormGroup) {
    var emails = form.get('Emails') as FormArray;

    for (let i = 0; i < emails.length; i++) {
      var data = emails.at(i).value;
      this.service.emailArr.push(data);
    }
    this.service.postEmail();

    for (let i = 0; i < emails.length; i++) {
      this.deleteEmail(i);
    }
  }
  insertNumber(form: FormGroup) {
    var numbers = form.get('PhoneNumbers') as FormArray;
    for (let i = 0; i < numbers.length; i++) {
      var data = numbers.at(i).value;
      this.service.numbersArr.push(data);
    }
    this.service.postNumber();
    for (let i = 0; i < numbers.length; i++) {
      this.deleteNumber(i);
    }
  }


  resetForm(form?: FormGroup) {
    if (form != null) {
      form.reset();
      var emails = form.get('Emails') as FormArray;
      if (emails.length > 0) {
        for (let i = 0; i < emails.length; i++) {
          this.deleteEmail(i);
        }
      }
      var numbers = form.get('PhoneNumbers') as FormArray;
      if (numbers.length > 0) {
        for (let i = 0; i < numbers.length; i++) {
          this.deleteNumber(i);
        }
      }
    }

    this.service.formData = {
      ContactID: null,
      FirstName: '',
      LastName: '',
      Birthdate: null,
      Address: '',
      City: '',
      Country: '',
      Tag: ''
    }
    this.service.formEmail = {
      EmailID: null,
      EmailContactID: null,
      Email1: ''
    }
    this.service.formNumber = {
      MobileID: null,
      MobileContactID: null,
      MobileNumber1: null
    }

  }
}
