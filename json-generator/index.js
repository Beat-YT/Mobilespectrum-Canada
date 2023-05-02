//const LicenseSearcher = require('./api');

// using the old api since the new one is broken
const { getCookies, getAreaData } = require('./old_api');


const { load } = require('cheerio');
const mapHtml = require('./bandmapping');
const fs = require('fs');
const axios = require("axios").default
const LICENSE_TYPE = 'PCS'

const mdata = require('./test.json')

// table columns are:
// 0: Authorization Number
// 1: Account Number
// 2: Company Name
// 3: Subservice
// 4: License Category
// 5: Area Code (Tier) and Area Name ('TEL-XXX\n' + '                        \n' + '                            Name')
// 6: Frequency range from (MHz)
// 7: Frequency range to (MHz)

var type = '';
var tier = 'tel';


const allTypes = ['PCS', 'CELL', '600B', 'AWS', 'AWS-3', 'MBS', 'BRS', 'PCSG', 'WCS']
const result = {};

if (tier == 'tier2') {
  ; (async () => {
    for (let tt of allTypes) {
      type = tt;
      await main()
    }
    fs.writeFileSync(`./data/${tier}.json`, JSON.stringify(result, null, 2));
  })()
} else {
  main().then(() => {
    fs.writeFileSync(`./data/${tier}.json`, JSON.stringify(result, null, 2));
  })
}

async function main() {

  // use FOR OF instead of forEach because forEach doesn't support async

  for (const x of mdata[tier]) {
    async function dod() {
      const cookies = await getCookies();
      var data = await getAreaData(x.serviceCode, type, cookies);
      //console.log('got data for', x.serviceCode);
      if (data.includes('Too many results found')) {
        console.log('too many results found for', x.serviceCode);
        return;
      }

      const $ = load(data);
      $("table.table-striped.table-bordered.table-condensed.dataTable");
      const tbody = $('tbody');

      // get the table rows into an object with the column names as keys
      const rows = tbody.children('tr').toArray();

      if (!result[x.serviceCode]) result[x.serviceCode] = [];

      result[x.serviceCode] = result[x.serviceCode].concat(
        rows.map(row => {
          const columns = $(row).children('td').toArray();
          // separate the area code and area name
          const splittext = $(columns[5]).text().trim().split('\n');
          const areaCode = splittext[0];
          const areaName = splittext[2].trim();
          return {
            authorizationNumber: $(columns[0]).text().trim(),
            accountNumber: $(columns[1]).text().trim(),
            companyName: $(columns[2]).text().trim(),
            subservice: $(columns[3]).text().trim(),
            licenseCategory: $(columns[4]).text().trim(),
            areaCode: areaCode,
            areaName: areaName,
            frequencyRangeFrom: $(columns[6]).text().trim(),
            frequencyRangeTo: $(columns[7]).text().trim(),
          }
        })
      )

      console.log(`added ${rows.length} rows for ${x.serviceCode} in ${type}`);
    }


    let done = false
    while (!done) {
      try {
        await dod()
        done = true
      } catch (e) {

        console.log('error', e)
      }
    }
  }
  console.log('done!!!!!!!!!!!!!!! yay!');

}