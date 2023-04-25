import { Component } from '@angular/core';

@Component({
  selector: 'app-test-popups',
  templateUrl: './test-popups.component.html',
  styleUrls: ['./test-popups.component.scss']
})
export class TestPopupsComponent {
  constructor() {

  }

  ngAfterViewInit() {
    // const maskStyle = computed(() => {
    //   return {
    //     transform: `translate(${x.value}px, ${y.value}px)`,
    //     backgroundImage: enter.value
    //       ? `radial-gradient(transparent, #000 ${props.radius}px)`
    //       : "",
    //     backgroundColor: enter.value ? "" : "#000",
    //     height: height.value + "px",
    //   };
    // });
  }

}
