import { NgModule }              from '@angular/core';
import { RouterModule, Routes }  from '@angular/router';

//les composants principaux de l'application
import {MainPageComponent} from "./pages/main.page.component";
import {ConfigComponent} from "./pages/config.component";

const routes:Routes =[ 
  {
    path:"",
    redirectTo:"/hrdw",
    pathMatch: 'full'
  },
  {
    path:"hrdw",
    component:MainPageComponent
  },
  {
    path:"config",
    component:ConfigComponent
  }
];

 
@NgModule({
  imports: [
    RouterModule.forRoot(
      routes,
      //{ enableTracing: true } // <-- debugging purposes only
    )
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}