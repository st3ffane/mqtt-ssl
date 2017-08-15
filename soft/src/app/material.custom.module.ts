/**
 * Simple reexport des modules utilisés
 */
import {MdButtonModule, MdCardModule,
MdInputModule, MdProgressSpinnerModule,
MdDialogModule, MdSelectModule, MdIconModule, MdListModule,
MdSliderModule } from '@angular/material';
import { NgModule } from '@angular/core';


const md_modules = [MdButtonModule, MdCardModule, MdInputModule,
MdProgressSpinnerModule, MdDialogModule, MdSelectModule, MdIconModule,
MdListModule, MdSliderModule];

@NgModule({
  imports: md_modules,
  exports: md_modules,
})
export class MaterialCustomModule { }