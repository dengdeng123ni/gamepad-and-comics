import { Component } from '@angular/core';

@Component({
  selector: 'app-page-theme',
  templateUrl: './page-theme.component.html',
  styleUrl: './page-theme.component.scss'
})
export class PageThemeComponent {
   list=[
    {
      id:"yeshu",
      name:"椰树"
    }
   ]

   on(index){
     document.documentElement.setAttribute('theme',this.list[index].id)
   }

   del(){
    document.documentElement.removeAttribute('theme')
   }
}
