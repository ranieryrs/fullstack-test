import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.css']
})
export class PlaylistComponent implements OnInit {
  @Input() playlist;
  constructor() { }

  ngOnInit(): void {
    if (this.playlist && this.playlist.tracks){
      this.playlist = this.playlist.tracks.items;
    }
  }

}
