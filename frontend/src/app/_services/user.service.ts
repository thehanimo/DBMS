import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { UserProfile } from '@/_models';

@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<UserProfile[]>(`http://localhost:3000/admin/users`);
    }

    getUserProfile() {
        return this.http.get<UserProfile>(`http://localhost:3000/user`);
    }
    updateUserProfile(username,options){
        return this.http.post<UserProfile>(`http://localhost:3000/user`,{username,options});
    }
}