import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

/**
 * Details of Providers
 */

export interface Provider2 {
  /**
   * Short Name
   */
  name: string;
  /**
   * Long Name
   */
  longName: string;
  /**
   * Home Page
   */
  homePage: string;
  /**
   * Background Color
   */
  backgroundColor: string;
  /**
   * Text Color
   */
  textColor: string;
}

/**
 * DownLink Frequency
 */

export interface DownLink {
  /**
   * Start Download Frequency
   */
  start: number;
  /**
   * End Download Frequency
   */
  end: number;
}

/**
 * Uplink Frequency
 */

export interface UpLink {
  /**
   * Start Uplink Frequency
   */
  start: number;
  /**
   * End Uplink Frequency
   */
  end: number;
}

/**
 * Frequencies
 */

export interface Frequency {
  /** Downlink Frequency */
  downLink: DownLink;
  /** Uplink Frequency */
  upLink: UpLink;
}

/**
 * Provider Inteface, contains data of provider
 */

export interface Provider {
  /**
   * Provider Object
   */
  provider: Provider2;
  /**
   * Frequency Object
   */
  frequency: Frequency;
  /**
   * Technology Array
   * example: ["NR", "LTE"]
   */
  technology?: string[];
  /**
   * Source Array
   */
  source: Source[];
  /**
   * Valid date Object
   */
  valid?: Valid;

  /**
   * _band
   * @private
   * @ignore
   * @internal
   * @hidden
   */
  _band: number;
}

/**
 * Source of Data
 */

export interface Source {
  /**
   * Source link name shown as link text
   */
  name: string;
  /**
   * Source link url
   */
  url: string;
}

/**
 * Spectrum valid time
 */
export interface Valid {
  /**
   * Start date, in #RFC3339 compliant format
   */
  start: string;
  /**
   * End date, in #RFC3339 compliant format
   */
  end: string;
}

/**
 * Frequencies
 */
export interface Frequencies {
  /**
   * Band Number
   */
  band: number;
  /**
   * Providers in Array
   */
  providers: Provider[];
}

export interface ServiceArea {
  /**
   * Service Area Code
   */
  area: string;
  /**
   * Service Area Name
   */
  name: string;
  /**
   * Tier of Service Area
   */
  tier: string;
}

type Tiers = Record<string, Tel[]>;

export interface Tel {
  authorizationNumber: string;
  accountNumber: string;
  companyName: string;
  subservice: Subservice;
  licenseCategory: LicenseCategory;
  areaCode: string;
  areaName: string;
  frequencyRangeFrom: string;
  frequencyRangeTo: string;
}

export type LicenseCategory = "Cellular" |
  "Personal Communication Service" |
  "Mobile Broadband Service" |
  "Advanced Wireless Service" |
  "Broadband Radio Service" |
  "Advanced Wireless Service- Band 4" |
  "Flexible broadband services (FBS) (600 MHz)" |
  "Advanced Wireless Service- Band 3" |
  "Personal Communication Service (Block G)" |
  "Flexible broadband services (FBS) (3500 MHz)" |
  "Wireless Communication Services";

export type Subservice = "Non-Auction" | "Subordinate" | "Auction";

/**
 * Common Service
 */

@Injectable({
  providedIn: 'root'
})
export class CommonServiceService {

  /** API URL depends environment */
  apiUrl = environment.api_url;

  constructor(
    private http: HttpClient,
  ) { }

  /**
   * Get JSON formated data
   * @param {string} country Country Name
   * @param {string} [region] Region Name
   * @returns {Array} Country or Region Frequency Data
   */

  async doGetFrequencyData(lng: number, lat: number): Promise<Frequencies[]> {
    // the AndroidFunction2 is a Javascript Interface defined in the Android App
    // @ts-ignore 
    var mock = [{ "area": "TEL-080", "name": "Southern Quebec, Québec, Charlevoix, Saguenay, Bas Saint-Laurent, Thetford Mines, Plessisville, Saint-Rosaire, Victoriaville, Saint-Barnabé South, Saint-Valérien-de-Milton, Saint-Jacques-de-Horton, Hudson's Bay", "tier": "TEL" }, { "area": "TEL-086", "name": "Montreal", "tier": "TEL" }, { "area": "1-001", "name": "Canada", "tier": "1" }, { "area": "2-005", "name": "Southern Quebec", "tier": "2" }, { "area": "3-013", "name": "Montreal", "tier": "3" }, { "area": "4-051", "name": "Montreal", "tier": "4" }]
    const serviceAreas: ServiceArea[] = mock //JSON.parse(AndroidFunction2.getAreas(lng, lat));
    console.log(JSON.stringify(serviceAreas));
    const licenses = Object.values(await this.http.get<Record<string, Tiers>>(this.apiUrl + '/licenses.json').toPromise()).map(x => Object.values(x)).flat(2);
    console.log('test, licenses: ' + licenses.length);

    const areaLicences = licenses.filter((license: Tel) => {
      return serviceAreas.some((serviceArea: ServiceArea) => {
        return serviceArea.area === license.areaCode;
      });
    }).filter(x => x.subservice !== 'Subordinate')

    console.log('area licenses: ' + areaLicences.length);


    // first group licenses that have the same authorizationNumber
    let providers = areaLicences.map(this.mapLicense).filter(license => license !== undefined) as Provider[];

    console.log('area providers: ' + providers.length);


    // now remove duplicates
    providers = providers.filter((provider, index, self) =>
      index === self.findIndex((t) => (
        t.provider.name === provider.provider.name &&
        t.frequency.downLink.start === provider.frequency.downLink.start &&
        t.frequency.downLink.end === provider.frequency.downLink.end
      ))
    );

    console.log('providers filter: ' + providers.length);


    // now sort by downlink frequency start
    providers = providers.sort((a, b) => a.frequency.downLink.start - b.frequency.downLink.start);

    console.log('providers sort: ' + providers.length);

    // now group contigous providers (of the same provider name) into one provider
    const groupedProviders: Provider[] = [];
    let lastProvider: Provider | undefined = undefined;

    for (const provider of providers) {
      if (lastProvider === undefined) {
        lastProvider = provider;
        continue;
      }

      if (lastProvider.provider.name === provider.provider.name &&
        lastProvider.frequency.downLink.end === provider.frequency.downLink.start) {
        lastProvider.frequency.downLink.end = provider.frequency.downLink.end;
        if (provider.frequency.upLink !== undefined &&
          lastProvider.frequency.upLink !== undefined) {
          lastProvider.frequency.upLink.end = provider.frequency.upLink.end;
        }
        lastProvider.source = lastProvider.source.concat(provider.source);
      } else {
        groupedProviders.push(lastProvider);
        lastProvider = provider;
      }
    }

    if (lastProvider !== undefined) {
      groupedProviders.push(lastProvider);
    }

    console.log('providers group: ' + groupedProviders.length);


    // now group by band

    const frequencies: Frequencies[] = Object.values(
      groupedProviders.reduce((acc, provider) => {
        const band = provider._band;

        if (acc[band] === undefined) {
          acc[band] = {
            band,
            providers: []
          };
        }

        acc[band].providers.push(provider);

        return acc;
      }, {} as Record<number, Frequencies>)
    );




    //console.log(JSON.stringify(frequencies));

    // we did it! we have the frequencies!
    // that was a lot of work, but it's worth it
    // hopefully this doesn't break in the future

    return frequencies;
  }

  /**
   * 
   * @param licenses {Tel[]} An array of licenses, if it's a paired license block, there will be two licenses in the array. otherwise there will be only one.
   */
  mapLicense = (license: Tel): Provider | undefined => {
    const returning: Partial<Provider> = {
      provider: this.getProvider(license),
      source: []
    };

    const frequencyRangeFrom = parseFloat(license.frequencyRangeFrom);
    const frequencyRangeTo = parseFloat(license.frequencyRangeTo);

    if (isNaN(frequencyRangeFrom) || isNaN(frequencyRangeTo)) {
      return;
    }

    const paired = this.getPairedFrequency(license);

    if (!paired) {
      console.log('no band found for license', license);
      return;
    }

    returning._band = paired.band;

    if (!paired.result) {
      const bandwidth = frequencyRangeTo - frequencyRangeFrom;
      // @ts-ignore
      returning.source = [
        {
          name: `${frequencyRangeFrom} - ${frequencyRangeTo} MHz (${bandwidth} MHz)`,
          url: 'https://beat-yt.github.io/caspectrum-redirect/?licenceNumber=' + license.authorizationNumber,
        }
      ];

      // @ts-ignore
      returning.frequency = {
        downLink: {
          start: frequencyRangeFrom,
          end: frequencyRangeTo
        }
      };

      return returning as Provider;
    }

    returning.frequency = {
      downLink: {
        start: paired.result.bIsUpLink ? frequencyRangeFrom : paired.result.start,
        end: paired.result.bIsUpLink ? frequencyRangeTo : paired.result.end
      },
      upLink: {
        start: paired.result.bIsUpLink ? paired.result.start : frequencyRangeFrom,
        end: paired.result.bIsUpLink ? paired.result.end : frequencyRangeTo
      }
    };

    const bandwidth = paired.result.end - paired.result.start;
    returning.source = [
      {
        name: `${returning.frequency.upLink.start} - ${returning.frequency.upLink.end} MHz (${bandwidth} Mhz)`,
        url: 'https://beat-yt.github.io/caspectrum-redirect/?licenceNumber=' + license.authorizationNumber,
      }
    ];

    if (license.companyName.toLowerCase().includes('terrestar')) {
      returning.source = [
        {
          name: 'Licences - TerreStar Solutions Inc.',
          url: 'https://strigo.ca/en/about-us/licences'
        }
      ];
    }

    return returning as Provider;
  }

  private getPairedFrequency(license: Tel) {
    const frequencyRangeFrom = parseFloat(license.frequencyRangeFrom);
    const frequencyRangeTo = parseFloat(license.frequencyRangeTo);

    let bIsUpLink: boolean = false;
    let spacing: number = 0;
    let band: number = 0;

    switch (license.licenseCategory) {
      // CLR UL(824 – 849) DL(869 – 894) spacing is 45
      case 'Cellular':
        bIsUpLink = frequencyRangeFrom >= 824 && frequencyRangeFrom < 849;
        spacing = 45;
        band = 5;
        break;

      // PCS UL(1850 – 1915) DL(1930 – 1995) spacing is 80
      case 'Personal Communication Service':
      case 'Personal Communication Service (Block G)':
        bIsUpLink = frequencyRangeFrom >= 1850 && frequencyRangeFrom < 1915;
        spacing = 80;
        band = 25;
        break;

      // AWS 1-3 UL(1710 – 1780) DL(2110 – 2200) spacing is 400
      case 'Advanced Wireless Service':
      case 'Advanced Wireless Service- Band 3':
        bIsUpLink = frequencyRangeFrom >= 1710 && frequencyRangeFrom < 1780;
        spacing = 400;
        band = 66;
        break;

      // AWS 1-4 UL(2000 – 2020) DL(2180 – 2200) spacing is 180
      case 'Advanced Wireless Service- Band 4':
        bIsUpLink = frequencyRangeFrom >= 2000 && frequencyRangeFrom < 2020;
        spacing = 180;
        band = 23;
        break;

      // BRS UL(2500 – 2570) DL(2620 – 2690) spacing is 120
      case 'Broadband Radio Service': {
        // there is a special case for BRS, there is a unpaired license in the middle of the paired license block (2570-2620)
        // so we need to check if the license is in the middle of the block, if it is, we need to return the unpaired license
        if (frequencyRangeFrom >= 2570 && frequencyRangeFrom <= 2620 && frequencyRangeTo >= 2570 && frequencyRangeTo <= 2620) {
          return { band: 38 };
        };

        bIsUpLink = frequencyRangeFrom >= 2500 && frequencyRangeFrom < 2570;
        spacing = 120;
        band = 7;
        break;
      }

      // WCS UL(2305 – 2315) DL(2350 – 2360) spacing is 45
      case 'Wireless Communication Services':
        bIsUpLink = frequencyRangeFrom >= 2300 && frequencyRangeFrom < 2320;
        spacing = 40;
        band = 30;
        break;

      // 600mhz UL(663 – 698) DL(617 – 652) spacing is −46
      case 'Flexible broadband services (FBS) (600 MHz)':
        bIsUpLink = frequencyRangeFrom >= 663 && frequencyRangeTo <= 698;
        spacing = -46;
        band = 71;
        break;

      // 3500mhz is TDD
      case 'Flexible broadband services (FBS) (3500 MHz)':
        return { band: 78 };

      // 700mhz (MBS) is a special case, it's like two seperate bands
      // B12 : UL(698 – 716) DL(728 – 746) spacing is 30
      // B13 : UL(777 – 787) DL(746 – 756) spacing is −31
      // B14 : UL(788 – 798) DL(758 – 768) spacing is −30
      // B29 : (712-728) is not paired
      case 'Mobile Broadband Service': {
        // check for B29
        if (frequencyRangeFrom >= 712 && frequencyRangeFrom < 728 && frequencyRangeTo > 712 && frequencyRangeTo <= 728) {
          return { band: 29 };
        };

        // check for B12 (if it's inside the frequency range)
        if (
          (frequencyRangeFrom >= 698 && frequencyRangeFrom < 716 && frequencyRangeTo > 698 && frequencyRangeTo <= 716) ||
          (frequencyRangeFrom >= 728 && frequencyRangeFrom < 746 && frequencyRangeTo > 728 && frequencyRangeTo <= 746)
        ) {
          bIsUpLink = frequencyRangeFrom >= 698 && frequencyRangeFrom < 716;
          spacing = 30;
          band = 12;
          break;
        }

        // check for B13
        if (
          (frequencyRangeFrom >= 777 && frequencyRangeFrom < 787 && frequencyRangeTo > 777 && frequencyRangeTo <= 787) ||
          (frequencyRangeFrom >= 746 && frequencyRangeFrom < 756 && frequencyRangeTo > 746 && frequencyRangeTo <= 756)
        ) {
          bIsUpLink = frequencyRangeFrom >= 777 && frequencyRangeFrom < 787;
          spacing = -31;
          band = 13;
          break;
        }

        // check for B14
        if (
          (frequencyRangeFrom >= 788 && frequencyRangeFrom < 798 && frequencyRangeTo > 788 && frequencyRangeTo <= 798) ||
          (frequencyRangeFrom >= 758 && frequencyRangeFrom < 768 && frequencyRangeTo > 758 && frequencyRangeTo <= 768)
        ) {
          bIsUpLink = frequencyRangeFrom >= 788 && frequencyRangeFrom < 798;
          spacing = -30;
          band = 14;
          break;
        }

        console.warn('could not identify the band for license: ', license);
        return;
      }

      default: return;
    }

    return {
      band,
      result: {
        bIsUpLink: !bIsUpLink,
        start: frequencyRangeFrom + (bIsUpLink ? spacing : -spacing),
        end: frequencyRangeTo + (bIsUpLink ? spacing : -spacing)
      }
    }
  }

  /**
  * This function will return the provider information based on the license
  * @param license {Tel} license information
  * @returns {Provider2} provider information
  */
  getProvider(license: Tel): Provider2 {
    const providerInfo: Provider2 = {
      name: license.companyName,
      longName: license.companyName,
      homePage: '',
      backgroundColor: 'white',
      textColor: 'black'
    };

    const company = license.companyName.toLowerCase();

    if (company.includes('bell')) {
      providerInfo.name = 'Bell';
      //providerInfo.longName = 'Bell Mobility';
      providerInfo.homePage = 'https://www.bell.ca/Mobility';
      providerInfo.backgroundColor = '#0067a5';
      providerInfo.textColor = 'white';
    } else if (company.includes('telus')) {
      providerInfo.name = 'Telus';
      //providerInfo.longName = 'Telus Mobility';
      providerInfo.homePage = 'https://www.telus.com/en/mobility';
      providerInfo.backgroundColor = '#4B286D';
      providerInfo.textColor = 'white';
    } else if (company.includes('rogers') || company.includes('fido')) {
      providerInfo.name = 'Rogers';
      //providerInfo.longName = 'Rogers Wireless';
      providerInfo.homePage = 'https://www.rogers.com/mobility';
      providerInfo.backgroundColor = '#e32024';
      providerInfo.textColor = 'white';
    } else if (company.includes('sasktel') || company == 'saskatchewan telecommunications') {
      providerInfo.name = 'SaskTel';
      //providerInfo.longName = 'SaskTel Mobility';
      providerInfo.homePage = 'https://www.sasktel.com/wps/wcm/connect/content/home/wireless';
      providerInfo.backgroundColor = '#2a8fcc';
      providerInfo.textColor = 'white';
    } else if (company.includes('videotron') || company.includes('vidéotron') || company.includes('freedom')) {
      providerInfo.name = 'Videotron';
      //providerInfo.longName = 'Videotron Mobility';
      providerInfo.homePage = 'https://videotron.com/en/mobile';
      providerInfo.backgroundColor = '#fdd201';
      providerInfo.textColor = 'black';
    } else if (company.includes('xplornet') || company.includes('xplore')) {
      providerInfo.name = 'Xplore';
      //providerInfo.longName = 'Xplornet';
      providerInfo.homePage = 'https://www.xplore.ca/';
      providerInfo.backgroundColor = '#003434';
      providerInfo.textColor = 'white';
    } else if (company.includes('bragg')) {
      providerInfo.name = 'Eastlink';
      //providerInfo.longName = 'Eastlink Mobile';
      providerInfo.homePage = 'https://www.eastlink.ca/mobile';
      providerInfo.backgroundColor = '#372e88';
      providerInfo.textColor = 'white';
    } else if (company.includes('terrestar')) {
      providerInfo.name = 'TerreStar';
      providerInfo.homePage = 'https://strigo.ca/en/about-us/who-we-are';
      providerInfo.backgroundColor = '#49baf0';
      providerInfo.textColor = 'black';
    }

    return providerInfo;
  }

  /**
    * Handle Http operation that failed.
    * Let the app continue.
    * @param operation - name of the operation that failed
    * @param result - optional value to return as the observable result
    */
  private handleError() {
    return (error: any): Observable<any> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      return throwError(
        'Something bad happened; please try again later.');
    };
  }

  /** Log a ApiService message with the MessageService */
  private log(message: string) {
    console.log(`ApiService: ${message}`);
  }

}


