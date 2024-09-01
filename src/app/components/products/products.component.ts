import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ProductsService } from '../../core/services/products.service';
import { CartService } from '../../core/services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { IProduct } from '../../core/interfaces/iproduct';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { WishlistService } from '../../core/services/wishlist.service';
import { FormsModule } from '@angular/forms';
import { SearchPipe } from '../../core/pipes/search.pipe';
import { Subscription } from 'rxjs';
import { HeartDirective } from '../../core/directive/heart.directive';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CurrencyPipe,RouterLink, FormsModule, SearchPipe, HeartDirective],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit, OnDestroy {
  /*##################################### Inject Servcies ##################################### */
  private readonly _ProductsService = inject(ProductsService)
  private readonly _CartService = inject(CartService)
  private readonly _WishlistService = inject(WishlistService)
  private readonly _ToastrService = inject(ToastrService)

  /*##################################### Global Properties ##################################### */
  allProductsSub!:Subscription
  CartsSub!:Subscription
  wishSub!:Subscription
  allProducts:IProduct[] = []
  dataSearch:string = ''

  /*##################################### Get All Product ##################################### */
  ngOnInit(): void {
    this.allProductsSub = this._ProductsService.getAllProducts().subscribe({
      next:(res)=>{
        this.allProducts = res.data
      }
    })
  }

  /*##################################### Add Products To Cart ##################################### */
  addCart(productId:string):void{
    this.CartsSub = this._CartService.addProductCart(productId).subscribe({
      next:(res)=>{
        if(res.status == "success"){
          this._ToastrService.success(res.message, 'FreshCart')
          this._CartService.cartNumber.next(res.numOfCartItems)
        }
      }
    })
  }

  /*##################################### Add Products To WishList ##################################### */
  addWishList(productId:string):void{
    this.wishSub = this._WishlistService.addProductToWishlist(productId).subscribe({
      next:(res)=>{
        if(res.status == 'success'){
          this._ToastrService.success(res.message)
        }
      }
    })
  }

  /*##################################### Unsubscrib ##################################### */
  ngOnDestroy(): void {
    this.allProductsSub?.unsubscribe()
    this.CartsSub?.unsubscribe()
    this.wishSub?.unsubscribe()
  }
}
