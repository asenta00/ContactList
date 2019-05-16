import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { RouterModule, Routes } from '@angular/router'


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ContactsComponent } from './contacts/contacts.component';
import { ContactComponent } from './contacts/contact/contact.component';
import { ContactListComponent } from './contacts/contact-list/contact-list.component';
import { ContactService } from './shared/contact.service';


const appRoutes: Routes = [
  {
    path: 'list', component: ContactListComponent
  },
  {
    path: 'add', component: ContactComponent
  },
  {
    path: '', redirectTo: '/list', pathMatch: 'full'
  }
];

@NgModule({
  declarations: [
    AppComponent,
    ContactsComponent,
    ContactComponent,
    ContactListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [ContactService],
  bootstrap: [AppComponent]
})
export class AppModule { }
