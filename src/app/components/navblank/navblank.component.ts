import { Component, computed, DoCheck, inject, OnInit, Signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-navblank',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navblank.component.html',
  styleUrl: './navblank.component.scss'
})
export class NavblankComponent implements OnInit{
  /*##################################### Inject Servcies ##################################### */
  private readonly _CartService = inject(CartService)
  private readonly _Router = inject(Router)

  /*##################################### Global Properties ##################################### */
  // countNumber: number = 0
  countNumber: Signal<number> = computed( ()=> this._CartService.cartNumber() )

  logOut():void{
    localStorage.removeItem('userToken')
    this._Router.navigate(['/login'])
  }

  /*#####################################  Number of products In Cart ##################################### */
  ngOnInit(): void {
    this._CartService.displayCart().subscribe({
      next:(res)=>{
        // this._CartService.cartNumber.next(res.numOfCartItems)
        this._CartService.cartNumber.set(res.numOfCartItems)
      }
    })

    // this._CartService.cartNumber.subscribe({
    //   next:(data)=>{
    //     this.countNumber = data
    //   }
    // })
  }

}
