import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  playlist = null;
  location = '';

  constructor(private http: HttpClient, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }
  getPlaylist(){
    return new Promise(resolve => {
      this.http.get('http://localhost:3000/playlist/' + this.location).subscribe(
        data => {
          if (data) {
            resolve(data);
          }else {
            resolve(null);
          }
        },
        error => console.error('Error', error)
      );
    });
  }
  async consultMusics(){
    this.playlist = null;
    this.playlist = await this.getPlaylist();
    if (!this.playlist){
      this.snackBar.open('Location not found', 'Close', {
        duration: 2000,
      });
    }
  }

}
