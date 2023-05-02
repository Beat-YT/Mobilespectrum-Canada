import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { HttpStatusCodeService } from '../http-status-code.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as L from 'leaflet';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import { Router } from '@angular/router';

interface Coordinates {
  address: string;
  latitude: number;
  longitude: number;
}

/**
 * Map Page Component
*/

@Component({
  selector: 'app-map-page',
  templateUrl: './map-page.component.html',
  styleUrls: ['./map-page.component.css']
})
export class MapPageComponent implements OnInit {

  /**
   * Load Depencies
   * @param titleService Load Tile
   * @param statusCodeService Load HttpStatusCode Service
   */
  constructor(
    private router: Router,
    private titleService: Title,
    private metaTagService: Meta,
    private statusCodeService: HttpStatusCodeService,
    private modalService: NgbModal
  ) { }



  // @ts-ignore
  private map: L.Map;

  // @ts-ignore
  private marker: L.Marker;

  private initMap(): void {
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
    let icon = new L.Icon.Default();
    icon.options.iconRetinaUrl = 'marker-icon.png';
    icon.options.shadowSize = [0, 0];

    this.marker = L.marker(this.map.getCenter(), { icon });
    this.marker.addTo(this.map);

    var onMapClick = (e: any) => {
      this.marker.setLatLng(e.latlng)
    };

    this.map.on('click', onMapClick);
    this.map.on('locationfound', onMapClick);
    this.map.locate({ setView: true, maxZoom: 16 });

    const provider = new OpenStreetMapProvider();
    // @ts-ignore
    const searchControl = new GeoSearchControl({
      provider: provider,
      showMarker: false,
      showPopup: true,
      // @ts-ignore
      popupFormat: ({ query, result }) => result.label,
    });
    this.map.addControl(searchControl);

  }

  /**
  * Set Title
  * 
  * Set StatusCode 404 and Not Found
  */
  ngOnInit(): void {
    this.titleService.setTitle('Map | MobileSpectrum');
    this.metaTagService.updateTag({ name: 'description', content: 'Check here your country\'s mobile network spectrum allocation' });

    this.metaTagService.updateTag({ property: 'og:title', content: 'Not Map | MobileSpectrum' });
    this.metaTagService.updateTag({ property: 'og:description', content: 'Check here your country\'s mobile network spectrum allocation' });

    this.metaTagService.updateTag({ name: 'twitter:title', content: 'Map | MobileSpectrum' });
    this.metaTagService.updateTag({ name: 'twitter:description', content: 'Check here your country\'s mobile network spectrum allocation' });

    this.statusCodeService.setStatus(200, 'OK');
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  onSubmit(): void {
    const location = this.marker.getLatLng();
    const lat = location.lat
    const lng = location.lng

    this.router.navigate([`/location/${lat}x${lng}`]);
  }
}
