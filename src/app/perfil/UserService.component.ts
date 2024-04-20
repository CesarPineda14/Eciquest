import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private avatarUrlSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  avatarUrl$: Observable<string | null> = this.avatarUrlSubject.asObservable();

  constructor() { }

  setAvatarUrl(avatarUrl: string | null): void {
    this.avatarUrlSubject.next(avatarUrl);
  }
}


