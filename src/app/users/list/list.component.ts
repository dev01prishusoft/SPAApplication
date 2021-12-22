import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';


export interface User {
  No: number;
  Avatar: string;
  Name: string;
  Age: number;
  Status: string;
}


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  users: MatTableDataSource<User>;
  displayedColumns: string[] = ['No', 'Avatar', 'Name', 'Age', 'Status', 'Action'];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private router: Router, private sanitized: DomSanitizer) {
    if (localStorage.getItem('users')) {
      this.users = new MatTableDataSource(JSON.parse(localStorage.getItem('users')));
    }
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.users.sort = this.sort;
    this.users.paginator = this.paginator;
  }

  getSafeHtml(imgUrl: string) {
    return this.sanitized.bypassSecurityTrustUrl(imgUrl);
  }

  deleteUser(user: User) {

      if (confirm('Are you sure to delete this user?')) {
        const users = this.users.data.filter((item) => { return (item.No != user.No) });
        this.users = new MatTableDataSource(users);
        this.users.sort = this.sort;
        this.users.paginator = this.paginator;
        localStorage.setItem('users', JSON.stringify(users));
      }
  }

}
