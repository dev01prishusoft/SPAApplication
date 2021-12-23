import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup , Validators} from '@angular/forms';
import { createAvatar } from '@dicebear/avatars';
import * as style from '@dicebear/avatars-male-sprites';
import axios from "axios";
import { DomSanitizer } from '@angular/platform-browser';
import { User } from '../user';



@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {

  UserForm: FormGroup;
  users: User[] = [];
  No: number;
  constructor(private fb: FormBuilder, private sanitized: DomSanitizer, private router: Router, private route: ActivatedRoute) {
    this.UserForm = this.fb.group({
      No: new FormControl(null, Validators.required),
      Avatar: new FormControl(null, Validators.required),
      Name: new FormControl(null, Validators.required),
      Age: new FormControl(null, Validators.required),
      Status: new FormControl(null, Validators.required)
    });
    if (localStorage.getItem('users')) {
      this.users = JSON.parse(localStorage.getItem('users'));
    }
    let no = this.route.snapshot['params'].no;
    if (no) {
      this.No = no;
      let cRow = this.users.filter((row) => { return (row.No == this.No )});
      if (cRow.length) {
        this.UserForm.patchValue(cRow[0]);
      } else {
        this.router.navigate(['/']);
      }
    } else {
      let nos = 1;
      if (this.users.length) {
        nos = this.users[this.users.length - 1]['No'];
        nos += 1;
      }
      this.UserForm.controls.No.setValue(nos);
      this.getStatus();
    }
  }

  ngOnInit(): void {

  }

  getAvatar() {
    if (this.UserForm.value.Name && this.UserForm.value.Age) {
      let seed = this.UserForm.value.Name + this.UserForm.value.Age;
      let svg = createAvatar(style, {
        seed: seed,
        dataUri: true
      });
      if (svg) {
        this.UserForm.controls.Avatar.setValue(svg);
      }
    }
  }

  checkAge() {
    if (this.UserForm.value.Age < 0) {
      this.UserForm.controls.Age.setValue(null);
    }
  }

  getSafeHtml(imgUrl: string) {
    return this.sanitized.bypassSecurityTrustUrl(imgUrl);
  }

  getStatus() {
    axios.get('https://yesno.wtf/api')
    .then(res => {
      if (res.data) {
        const status = (res.data.answer == 'yes') ? 'Active': '-';
        this.UserForm.controls.Status.setValue(status);
      }
    });
  }

  saveUser() {
    if (!this.UserForm.invalid) {
      if (this.No) {
        this.users.forEach((item) => {
          if (item.No == this.No) {
            item.Name = this.UserForm.value.Name;
            item.Avatar = this.UserForm.value.Avatar;
            item.Age = this.UserForm.value.Age;
            console.log('Update')
          }
        });
      } else {
        this.users.push(this.UserForm.value);
      }
      localStorage.setItem('users', JSON.stringify(this.users));
      this.router.navigate(['/']);
    }
  }


}
