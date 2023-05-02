import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { HttpStatusCodeService } from '../http-status-code.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';

interface Coordinates {
  address: string;
  latitude: number;
  longitude: number;
}

/**
 * Map Page Component
*/

@Component({
  selector: 'app-location-page',
  templateUrl: './location-page.component.html',
  styleUrls: ['./location-page.component.css']
})
export class LocationPageComponent implements OnInit {

  /**
   * Load Depencies
   * @param titleService Load Tile
   * @param statusCodeService Load HttpStatusCode Service
   */
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private titleService: Title,
    private metaTagService: Meta,
    private statusCodeService: HttpStatusCodeService,
    private modalService: NgbModal
  ) {  }

  coorinates: string = "";

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

    this.route.params.subscribe(params => {
      this.coorinates = params['coorinates'];
    });

    this.statusCodeService.setStatus(200, 'OK');
  }

  ngAfterViewInit(): void {
    console.log(this.coorinates);
  }

  onSubmit(): void {
  }
}
