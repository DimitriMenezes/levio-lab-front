import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { UserModel } from 'src/app/models/UserModel';
import { LoginModel } from 'src/app/models/LoginModel';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private userSubject: BehaviorSubject<UserModel | null>;
    public user: Observable<UserModel | null>;

    constructor(
        private router: Router,
        private http: HttpClient
    ) {
        this.userSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('user')!));
        this.user = this.userSubject.asObservable();
    }

login(email: string, password: string) {
    var loginModel = new LoginModel(email,password);
    console.log(loginModel);
    return this.http.post<UserModel>(`https://dimitri-stock-market-test.azurewebsites.net/authentication/login`, loginModel)
        .pipe(map(login => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('user', JSON.stringify(login));
            this.userSubject.next(login);
            return login;
        }));
}

logout() {
    // remove user from local storage and set current user to null
    localStorage.removeItem('user');
    this.userSubject.next(null);
    this.router.navigate(['/account/login']);
}

register(user: UserModel) {
    return this.http.post(`https://dimitri-stock-market-test.azurewebsites.net/users/`, user);
}
}