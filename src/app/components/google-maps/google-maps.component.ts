// google-maps.component.ts
import { Component, OnInit, ViewChild, ElementRef, NgZone, Input } from '@angular/core';
import { MapsAPILoader } from '@agm/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as L from 'leaflet';
import axios from 'axios';

@Component({
  selector: 'app-google-maps',
  templateUrl: './google-maps.component.html',
  styleUrls: ['./google-maps.component.css']
})
export class GoogleMapsComponent implements OnInit {

  title: string = 'AGM project';
  // @ts-ignore
  latitude: number;
  // @ts-ignore
  longitude: number;
  // @ts-ignore
  zoom: number;
  // @ts-ignore
  address: string;
  // @ts-ignore
  private geoCoder;

  @ViewChild('search')
  // @ts-ignore
  public searchElementRef: ElementRef;
  // @ts-ignore
  @Input() fromParent;


  // @ts-ignore
  private map: L.Map;

  // @ts-ignore
  private marker: L.Marker;

  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit() {
    this.map = L.map('map', {
      center: [39.8282, -98.5795],
      zoom: 3
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(this.map);

    this.marker = L.marker([51.5, -0.09]);
    this.marker.addTo(this.map);

    var onMapClick = (e: any) => {
      this.marker.setLatLng(e.latlng)
    };


    this.map.on('click', onMapClick);
    this.map.on('locationfound', onMapClick);
    this.map.locate({ setView: true, maxZoom: 16 });
  }

  // @ts-ignore
  closeModal(sendData) {
    this.activeModal.close(sendData);
  }

  saveLocation() {
    const data = {
      address: this.address,
      latitude: this.latitude,
      longitude: this.longitude
    }
    this.activeModal.close(data);
  }
}
