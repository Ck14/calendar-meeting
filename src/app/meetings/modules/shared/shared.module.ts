import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GrdFilterPipePipe } from 'src/app/pipes/grd-filter-pipe.pipe';



@NgModule({
  declarations: [GrdFilterPipePipe],
  imports: [
    CommonModule,
  ],
  exports: [
    GrdFilterPipePipe
  ]
})
export class SharedModule { }
