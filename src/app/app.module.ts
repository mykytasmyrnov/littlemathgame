import { BrowserModule }            from '@angular/platform-browser';
import { NgModule }                 from '@angular/core';
import { AppComponent }             from './app.component';
import { BrowserAnimationsModule }  from '@angular/platform-browser/animations';
import { MatIconModule }            from '@angular/material/icon';
import { MatSnackBarModule }        from '@angular/material/snack-bar';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatSnackBarModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
