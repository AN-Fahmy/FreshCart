import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private readonly _HttpClient = inject(HttpClient)


  addProductToWishlist(productId:string):Observable<any>{
    return this._HttpClient.post(`${environment.baseURL}/api/v1/wishlist`,
      {
        'productId': productId
      }
    )

  }

  getProductWishlist():Observable<any>{
    return this._HttpClient.get(`${environment.baseURL}/api/v1/wishlist`)
  }

  removeProductWishlist(id:string):Observable<any>{
    return this._HttpClient.delete(`${environment.baseURL}/api/v1/wishlist/${id}`)
  }
}
