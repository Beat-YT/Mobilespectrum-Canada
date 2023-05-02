const axios = require('axios').default;
const SPWEB_SESSION_TOKEN_REGX = /SPWEB_SESSION_TOKEN=(.{35,38}); .*/
const JSESSIONID_REGX = /JSESSIONID=(.{20,38}); .*/
const defaultHeaders = {
    'sec-ch-ua': '"Chromium";v="112", "Google Chrome";v="112", "Not:A-Brand";v="99"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'DNT': '1',
    'Upgrade-Insecure-Requests': '1',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
    'Sec-Fetch-Site': 'same-origin',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-User': '?1',
    'Sec-Fetch-Dest': 'document',
    'Referer': 'https://sms-sgs.ic.gc.ca/licenseSearch/searchSpectrumLicense',
    'Accept-Encoding': 'gzip, deflate, br',
    'Accept-Language': 'en-CA,en;q=0.9,fr-CA;q=0.8,fr;q=0.7,en-GB;q=0.6,en-US;q=0.5',
}

// POV: me when there is no API so I just scrape the website

async function getCookies() {
    const sessionRes = await axios.head(
        'https://sms-sgs.ic.gc.ca/licenseSearch/searchSpectrumLicense',
        {
            headers: defaultHeaders,
            maxRedirects: 0,
            validateStatus: undefined
        }
    );

    if (sessionRes.status !== 302) {
        console.log('sessionRes.status !== 302');
        return undefined;
    }

    const sessionCookie = sessionRes.headers['set-cookie'];

    if (!sessionCookie) {
        console.log('!sessionCookie');
        return undefined;
    }

    const jSessionId = JSESSIONID_REGX.exec(sessionCookie)?.[1];

    if (!jSessionId) {
        console.log('!jSessionId');
        return undefined;
    }

    const tokenRes = await axios.head(
        'https://sms-sgs.ic.gc.ca/' + sessionRes.headers.location,
        {
            headers: {
                ...defaultHeaders,
                'Cookie': `JSESSIONID=${jSessionId}`,
            },
            maxRedirects: 0,
        }
    );

    if (tokenRes.status !== 200) {
        console.log('tokenRes.status !== 200', tokenRes.status);
        return undefined;
    }

    const tokenCookie = tokenRes.headers['set-cookie'];

    if (!tokenCookie) {
        console.log('!tokenCookie');
        return undefined;
    }

    const spwebSessionToken = SPWEB_SESSION_TOKEN_REGX.exec(tokenCookie)?.[1];

    if (!spwebSessionToken) {
        console.log('!spwebSessionToken');
        return undefined;
    }

    return {
        jSessionId,
        spwebSessionToken,
    };
}


async function getAreaData(geoCode, type, cookies) {
    const jSessionId = cookies.jSessionId;
    const spwebSessionToken = cookies.spwebSessionToken;

    // this request start a new execution (eXs1) and redirect to the search page 
    // but we only need the execution so we can use it in the next request
    // Using HEAD instead of GET because we don't need the body at all
    const data = await axios.head('https://sms-sgs.ic.gc.ca/licenseSearch/searchSpectrumLicense',
        {
            headers: {
                ...defaultHeaders,
                'Cookie': `JSESSIONID=${jSessionId}; SPWEB_SESSION_TOKEN=${spwebSessionToken}`
            },
            validateStatus: undefined,
            maxRedirects: 0,
        }
    );

    let execution = data.headers.location.split('execution=')[1];
    //console.log('working with execution', execution);

    // this request set the search mode enable to area search
    //console.log('setting search mode to area');
    const searchMode = await axios.post('https://sms-sgs.ic.gc.ca/licenseSearch/searchSpectrumLicense',
        'execution=e1s1&applicationName=&applicationReferenceNumber=&companyNumber=&companyName=&subservice=&licenceCategory=&vectorGeoCode=&_eventId_lookupLicenceArea=Lookup&vectorGeoName=&areaMatching=E&latituded=struct&latituded_type=dms&latituded_degrees=&latituded_minutes=&latituded_seconds=&latituded_sign=1&longituded=struct&longituded_type=dms&longituded_degrees=&longituded_minutes=&longituded_seconds=&longituded_sign=-1&frequency=&bandwidth=',
        {
            headers: {
                ...defaultHeaders,
                'Content-Type': 'application/x-www-form-urlencoded',
                'Cookie': `JSESSIONID=${jSessionId}; SPWEB_SESSION_TOKEN=${spwebSessionToken}`
            },
            validateStatus: undefined,
            maxRedirects: 0,
        }
    );

    execution = searchMode.headers.location.split('execution=')[1];
    //console.log('now working with execution', execution);

    // now we query the GeoCode for a AreaId redirect
    //console.log('getting area id for', geoCode);
    const searchReq = await axios.post(
        'https://sms-sgs.ic.gc.ca/licenseSearch/searchSpectrumLicense',
        new URLSearchParams(
            {
                "execution": execution,
                "GeoName": "",
                "GeoCode": geoCode,
                '_eventId_search': 'Search'
            }
        ).toString(),
        {
            headers: {
                ...defaultHeaders,
                'Cookie': `JSESSIONID=${jSessionId}; SPWEB_SESSION_TOKEN=${spwebSessionToken}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            // allow 1 redirects because we need to get the data from the next page this time
            maxRedirects: 1
        }
    );

    const AREA_REGX = new RegExp(`<a href=\\"(\\/licenseSearch\\/searchSpectrumLicense\\?_eventId=select&amp;LicensedAreaGeoId=.*&amp;execution=.*)">${geoCode}<\\/a>`);
    // replace &amp; with & because it's not valid in the url
    const redirectUrl = AREA_REGX.exec(searchReq.data)?.[1].replace(/&amp;/g, '&');

    if (!redirectUrl) {
        console.error('woops, no redirectUrl. Maybe the geoCode (' + geoCode + ') is invalid? what did you do? cannot proceed');
        return undefined;
    }

    // now we apply the areaId to the search
    //console.log('applying area id to search');
    const applyArea = await axios.head('https://sms-sgs.ic.gc.ca' + redirectUrl,
        {
            headers: {
                ...defaultHeaders,
                'Cookie': `JSESSIONID=${jSessionId}; SPWEB_SESSION_TOKEN=${spwebSessionToken}`,
            },
            maxRedirects: 0,
            validateStatus: undefined
        }
    );

    execution = applyArea.headers.location.split('execution=')[1];
    //console.log('now working with execution', execution);


    const searchResult = await axios.post('https://sms-sgs.ic.gc.ca/licenseSearch/searchSpectrumLicense', new URLSearchParams(
        {
            "execution": execution,
            "applicationName": "",
            "applicationReferenceNumber": "",
            "companyNumber": "",
            "companyName": "",
            "subservice": "",
            "licenceCategory": type,
            "vectorGeoCode": geoCode,
            "vectorGeoName": "",
            "areaMatching": "E",
            "latituded": "struct",
            "latituded_type": "dms",
            "latituded_degrees": "",
            "latituded_minutes": "",
            "latituded_seconds": "",
            "latituded_sign": "1",
            "longituded": "struct",
            "longituded_type": "dms",
            "longituded_degrees": "",
            "longituded_minutes": "",
            "longituded_seconds": "",
            "longituded_sign": "-1",
            "frequency": "",
            "bandwidth": "",
            "_eventId_searchLicence": "Search"
        }
    ).toString(), {
        headers: {
            ...defaultHeaders,
            'Cookie': `JSESSIONID=${jSessionId}; SPWEB_SESSION_TOKEN=${spwebSessionToken}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        maxRedirects: 0,
        validateStatus: undefined
    });

    execution = searchResult.headers.location.split('execution=')[1];
    //console.log('now working with execution', execution);

    // now we can get the data
    //console.log('getting data');
    const html = await axios.get(`https://sms-sgs.ic.gc.ca/licenseSearch/searchSpectrumLicense?_eventId=sortPaginateLicenceList&offset=0&max=600&sort=adCompany&order=desc&execution=${execution}`, {
        headers: {
            ...defaultHeaders,
            'Cookie': `JSESSIONID=${jSessionId}; SPWEB_SESSION_TOKEN=${spwebSessionToken}`,
        },
        maxRedirects: 1,
        validateStatus: undefined
    });

    // now we have the data, we can parse it!! (I really don't like scraping)
    return html.data;
}

module.exports = {
    getCookies,
    getAreaData
}

async function main() {
    const cookies = await getCookies();
    if (!cookies) {
        console.log('no cookies');
        return;
    }

    const areaData = await getAreaData('TEL-080', cookies);
}

//main();