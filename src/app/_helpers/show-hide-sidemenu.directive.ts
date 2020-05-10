import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appShowHideSidemenu]'
})
export class ShowHideSidemenuDirective {
  @HostListener('click', ['$event'])
  manageSideMenu(event: Event) {

  }

}
