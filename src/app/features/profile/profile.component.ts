import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { UserService } from '@core/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTabsModule,
    MatButtonModule,
    MatIconModule,
  ]
})
export class ProfileComponent implements OnInit {

  activeTab: unknown;
  user: any;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    if (this.userService.isLoggedIn()) {
      this.user = this.userService.getUserProfile();
    }
  }
}
