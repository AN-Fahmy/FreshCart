import { Subscription } from 'rxjs';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ProductsService } from '../../core/services/products.service';
import { ActivatedRoute } from '@angular/router';
import { IProduct } from '../../core/interfaces/iproduct';
import { CurrencyPipe } from '@angular/common';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { CartService } from '../../core/services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { WishlistService } from '../../core/services/wishlist.service';
import { HeartDirective } from '../../core/directive/heart.directive';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CurrencyPipe, CarouselModule, HeartDirective],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent implements OnInit, OnDestroy{
  /*##################################### Inject Servcies ##################################### */
  private readonly _ProductsService = inject(ProductsService)
  private readonly _ActivatedRoute = inject(ActivatedRoute)
  private readonly _CartService = inject(CartService)
  private readonly _ToastrService = inject(ToastrService)
  private readonly _WishlistService = inject(WishlistService)

  /*##################################### Global Properties ##################################### */
  specificProductSub!:Subscription
  cartSub!:Subscription
  wishListSub!:Subscription
  detailsProduct:IProduct | null = null

  /*##################################### Get Id Product And Get Details Product ##################################### */
  ngOnInit(): void {
    this._ActivatedRoute.paramMap.subscribe({
      next:(param)=>{
        let idProduct = param.get('id');
        this.specificProductSub = this._ProductsService.specificProduct(idProduct).subscribe({
          next:(res)=> {
            this.detailsProduct = res.data
          }
        })
      }
    })
  }

  /*##################################### Slider Options Image Product ##################################### */
  customImages: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: true,
    autoplay:true,
    autoplayHoverPause:true,
    autoplayTimeout:2000,
    navSpeed: 700,
    navText: ['', ''],
    items:1,
    nav: false
  }

  /*##################################### Add Product To Cart ##################################### */
  addCart(id:string):void{
    this.cartSub = this._CartService.addProductCart(id).subscribe({
      next:(res)=>{
        if(res.status == 'success'){
          this._ToastrService.success(res.message, 'FreshCart')
          this._CartService.cartNumber.next(res.numOfCartItems)
        }
      }
    })
  }

  /*##################################### Add Product To WishList ##################################### */
  addWishlist(productId:string):void{
    this.wishListSub = this._WishlistService.addProductToWishlist(productId).subscribe({
      next:(res)=>{
        if(res.status == 'success'){
          this._ToastrService.success(res.message)
        }
      }
    })
  }

  /*##################################### Unsubscrib ##################################### */
  ngOnDestroy(): void {
    this.specificProductSub?.unsubscribe()
    this.cartSub?.unsubscribe()
    this.wishListSub?.unsubscribe()
  }
}
