import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { AdminService } from '@/_services';
import { defineBase } from '@angular/core/src/render3';
@Component({
  selector: 'app-restaurant-applications',
  templateUrl: './restaurant-applications.component.html',
  styleUrls: ['./restaurant-applications.component.css']
})
export class RestaurantApplicationsComponent implements OnInit {
  restaurants: any;
  constructor(
    private adminService: AdminService,
  ) {
   }

  ngOnInit() {
    this.adminService.getRestaurantApplications().pipe(first()).subscribe(restaurants => {
      this.restaurants = restaurants;
    })

  }

}
