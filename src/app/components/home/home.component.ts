import { Component, ElementRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ProductsService } from '../../core/services/products.service';
import { IProduct } from '../../core/interfaces/iproduct';
import { CurrencyPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CategoriesService } from '../../core/services/categories.service';
import { ICategories } from '../../core/interfaces/icategories';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { CartService } from '../../core/services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { WishlistService } from '../../core/services/wishlist.service';
import { SearchPipe } from '../../core/pipes/search.pipe';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { HeartDirective } from '../../core/directive/heart.directive';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CurrencyPipe,RouterLink,CarouselModule, SearchPipe,FormsModule, HeartDirective],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit , OnDestroy {
  /*##################################### Inject Servcies ##################################### */
  private readonly _ProductsService = inject(ProductsService)
  private readonly _CategoriesService = inject(CategoriesService)
  private readonly _CartService = inject(CartService)
  private readonly _WishlistService = inject(WishlistService)
  private readonly _Router = inject(Router)
  private readonly _ToastrService = inject(ToastrService)

  /*##################################### Global Properties ##################################### */
  allProducts:IProduct[] = []
  allCategories:ICategories[] = []
  getAllProductSub!:Subscription
  getALlCategoriesSub!:Subscription
  dataSearch:string = ''

  /*##################################### Get All Product And Categories ##################################### */
  ngOnInit(): void {
    this.getAllProductSub = this._ProductsService.getAllProducts().subscribe({
      next:(res)=>{
        this.allProducts = res.data
      }
    })

    this.getALlCategoriesSub = this._CategoriesService.getAllCategories().subscribe({
      next:(res)=>{
        this.allCategories = res.data
      }
    })
  }

  /*##################################### Slider Options Categories ##################################### */
  customOptionsCategory: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    autoplay:true,
    autoplayTimeout:2000,
    autoplayHoverPause:true,
    dots: false,
    navText:['',''],
    navSpeed: 700,
    responsive: {
      0: {
        items: 2
      },
      400: {
        items: 3
      },
      740: {
        items: 4
      },
      940: {
        items: 6
      }
    },
    nav: true
  }

  customMainCategory: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    autoplay:true,
    autoplayTimeout:1500,
    autoplayHoverPause:true,
    dots: false,
    navSpeed: 700,
    items: 1,
    nav: false
  }

  /*##################################### Add Products To Cart ##################################### */
  addCart(productId:string):void{
    this._CartService.addProductCart(productId).subscribe({
      next:(res)=>{
        if(res.status == "success"){
          this._ToastrService.success(res.message)
          this._CartService.cartNumber.next(res.numOfCartItems)
        }
      }
    })
  }

  /*##################################### Add Products To WishList ##################################### */
  addWishList(productId:string):void{
    this._WishlistService.addProductToWishlist(productId).subscribe({
      next:(res)=>{
        if(res.status == 'success'){
          this._ToastrService.success(res.message)
        }
      }
    })
  }

  /*##################################### Unsubscrib ##################################### */
  ngOnDestroy(): void {
    this.getAllProductSub?.unsubscribe()
    this.getALlCategoriesSub?.unsubscribe()
  }
}
