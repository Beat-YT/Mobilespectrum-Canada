// @ts-ignore
const axios = require('axios').default;
const SPWEB_SESSION_TOKEN_REGX = /SPWEB_SESSION_TOKEN=(.{35,38}); .*/
const JSESSIONID_REGX = /JSESSIONID=(.{20,38}); .*/
const TBODY_REGX = /<tbody>(.*)<\/tbody>/;


const defaultHeaders = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
};

axios.interceptors.response.use(null, function (error) {
    try {

        console.log('Request failed:', error.message, error.response.headers);
        console.log(error.config);
    }
    catch { throw error }
    throw "error";
});

module.exports = class LicenseSearcher {

    constructor(lat, lng) {
        this.lat = lat;
        this.lng = lng;
    }

    lat;
    lng;

    jsessionToken = null;
    spwebToken = null;

    execution = 1;
    mexecution = 1;

    getExecution() {
        return `e${this.mexecution}s${this.execution}`;
    }

    async getGeoCodeId(GeoCode) {
        console.log(this.getExecution())
        const lookupReq = await axios.post(
            'https://sms-sgs.ic.gc.ca/licenseSearch/searchSpectrumLicense',
            `execution=${this.getExecution()}&applicationName=&applicationReferenceNumber=&companyNumber=&companyName=&subservice=&licenceCategory=&vectorGeoCode=&_eventId_lookupLicenceArea=Lookup&vectorGeoName=&areaMatching=E&latituded=struct&latituded_type=dms&latituded_degrees=&latituded_minutes=&latituded_seconds=&latituded_sign=1&longituded=struct&longituded_type=dms&longituded_degrees=&longituded_minutes=&longituded_seconds=&longituded_sign=-1&frequency=&bandwidth=`,
            {
                headers: {
                    ...defaultHeaders,
                    'Cookie': `JSESSIONID=${this.jsessionToken}; SPWEB_SESSION_TOKEN=${this.spwebToken}`,
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                description: 'Lookup request for getGeoCodeId()',
                maxRedirects: 0,
                validateStatus: (status) => status === 200
            }
        );

        console.log('\n\n', lookupReq.headers.location, '\n\n')

        this.execution++;

        const searchReq = await axios.post(
            'https://sms-sgs.ic.gc.ca/licenseSearch/searchSpectrumLicense',
            new URLSearchParams(
                {
                    "execution": this.getExecution(),
                    "GeoName": "",
                    "GeoCode": GeoCode,
                    '_eventId_search': 'Search'
                }
            ).toString(),
            {
                headers: {
                    ...defaultHeaders,
                    'Cookie': `JSESSIONID=${this.jsessionToken}; SPWEB_SESSION_TOKEN=${this.spwebToken}`,
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                description: 'Search request for getGeoCodeId()',
                maxRedirects: 0,
                validateStatus: (status) => status === 302
            }
        )

        console.log(searchReq.headers.location)
        this.execution++;



        const websiteData = await this.getWebsite();
        const idRegex = /<a href=\"\/licenseSearch\/searchSpectrumLicense\?_eventId=select&amp;LicensedAreaGeoId=(.*)&amp;execution=.*">.*<\/a>/
        var id = idRegex.exec(websiteData)[1];

        return id;
    }

    async getWebsite(queryParams = {}) {
        const params = new URLSearchParams({
            ...queryParams,
            execution: this.getExecution(),
        })

        const websiteRequest = await axios.get(
            'https://sms-sgs.ic.gc.ca/licenseSearch/searchSpectrumLicense?' + params.toString(), {
            headers: {
                ...defaultHeaders,
                'Cookie': `JSESSIONID=${this.jsessionToken}; SPWEB_SESSION_TOKEN=${this.spwebToken}`,
            },
            maxRedirects: 0,
            description: 'Get website request'
        });

        return websiteRequest.data;
    }

    async search(GeoCode, categegory) {
        var areaId = await this.getGeoCodeId(GeoCode);

        const redir = await axios.get(`https://sms-sgs.ic.gc.ca/licenseSearch/searchSpectrumLicense?_eventId=select&LicensedAreaGeoId=${areaId}&execution=e1s${this.execution}`, {
            headers: {
                ...defaultHeaders,
                'Cookie': `JSESSIONID=${this.jsessionToken}; SPWEB_SESSION_TOKEN=${this.spwebToken}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            maxRedirects: 0,
            validateStatus: (status) => status === 302
        });


        await axios.get('https://sms-sgs.ic.gc.ca' + redir.headers.location, {
            headers: {
                ...defaultHeaders,
                "Accept-Encoding": null,
                Cookie: `JSESSIONID=${this.jsessionToken}; SPWEB_SESSION_TOKEN=${this.spwebToken}`,
                Cache: 'no-cache'
            },
            maxRedirects: 0,
            validateStatus: (status) => status === 200
        });

        this.execution++;

        console.log(this.execution)

        const searchResult = await axios.post('https://sms-sgs.ic.gc.ca/licenseSearch/searchSpectrumLicense', new URLSearchParams(
            'execution=e1s4&applicationName=&applicationReferenceNumber=&companyNumber=&companyName=&subservice=&licenceCategory=&vectorGeoCode=TEL-086&vectorGeoName=Montreal&areaMatching=E&latituded=struct&latituded_type=dms&latituded_degrees=&latituded_minutes=&latituded_seconds=&latituded_sign=1&longituded=struct&longituded_type=dms&longituded_degrees=&longituded_minutes=&longituded_seconds=&longituded_sign=-1&frequency=&bandwidth=&_eventId_searchLicence=Search'
        ).toString(), {
            headers: {
                ...defaultHeaders,
                'Cookie': `JSESSIONID=${this.jsessionToken}; SPWEB_SESSION_TOKEN=${this.spwebToken}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            maxRedirects: 0,
            validateStatus: (status) => status === 302
        });

        this.execution++;

        const websiteRequest = await axios.get(
            'https://sms-sgs.ic.gc.ca/licenseSearch/searchSpectrumLicense?_eventId=sortPaginateLicenceList&offset=0&max=600&sort=adCompany&order=desc&execution=e1s' + this.execution, {
            headers: {
                ...defaultHeaders,
                'Cookie': `JSESSIONID=${this.jsessionToken}; SPWEB_SESSION_TOKEN=${this.spwebToken}`,
            }
        });

        console.log(websiteRequest.data)

        return websiteRequest.data;
    }


    async fetchCookies() {
        const session = await axios.head('https://sms-sgs.ic.gc.ca/licenseSearch/searchSpectrumLicense', {
            headers: defaultHeaders,
            maxRedirects: 0,
            validateStatus: (status) => status === 302
        });

        const cookies = session.headers['set-cookie']?.toString();

        if (!cookies) {
            throw new Error('ERROR: cookies is null');
        }

        const sessionToken = JSESSIONID_REGX.exec(cookies)?.[1];

        if (!sessionToken) {
            throw new Error('ERROR: sessionToken is null');
        }

        const spweb = await axios.get('https://sms-sgs.ic.gc.ca/' + session.headers.location, {
            headers: {
                Host: "sms-sgs.ic.gc.ca",
                Cookie: `JSESSIONID=${sessionToken}`
            },
            maxRedirects: 0,
            validateStatus: undefined
        });



        const spwebCookies = spweb.headers['set-cookie']?.toString();

        if (!spwebCookies) {
            console.log(spweb.headers);
            throw new Error('ERROR: spwebCookies is null');
        }

        const spwebToken = SPWEB_SESSION_TOKEN_REGX.exec(spwebCookies)?.[1];

        if (!spwebToken) {
            console.log(spweb.headers);
            throw new Error('ERROR: spwebToken is null');
        }

        this.spwebToken = spwebToken;
        this.jsessionToken = sessionToken;
    }

    async refreshExecution() {
        console.log('Refreshing execution');

        const response = await axios.head('https://sms-sgs.ic.gc.ca/licenseSearch/searchSpectrumLicense', {
            headers: {
                ...defaultHeaders,
                'Cookie': `JSESSIONID=${this.jsessionToken}; SPWEB_SESSION_TOKEN=${this.spwebToken}`,
            },
            maxRedirects: 0,
            validateStatus: (status) => status === 302
        });

        console.log(response.headers.location);

        this.mexecution++;
        this.execution = 1;
    }
}


function ConvertDDToDMS(D, lng) {
    return {
        dir: D < 0 ? (lng ? "W" : "S") : lng ? "E" : "N",
        deg: 0 | (D < 0 ? (D = -D) : D),
        min: 0 | (((D += 1e-9) % 1) * 60),
        sec: (0 | (((D * 60) % 1) * 6000)) / 100,
    };
}