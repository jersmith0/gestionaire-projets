import { Component } from '@angular/core';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { SideNavComponent } from "./side-nav/side-nav.component";

@Component({
  selector: 'app-home',
  imports: [ToolbarComponent, SideNavComponent],
  template: `
      <app-toolbar/>
      <app-side-nav/> 
  `,
  styles: `

    mat-drawer-container{
      height: calc(100vh - 65px);
      display: flex;
      flex-direction: column;
    }

    mat-drawer{
      width: 220px;
      border-right: 1px solid var(--mat-sys-outline-variant); 
      border-radius: 0%;
    }
  
  `
})
export default class HomeComponent {

}
