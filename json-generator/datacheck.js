const tier4 = require('./data/tier4.json');

/*
    <datalist name="bandsName">
        <option value="WCS-GC">2.3 GHz (Grid Cells)</option>
        <option value="3800I">3800 MHz - Interim Authorization</option>
        <option value="AWS">Advanced Wireless Service</option>
        <option value="AWS-3">Advanced Wireless Service- Band 3</option>
        <option value="AWS-4">Advanced Wireless Service- Band 4</option>
        <option value="AGND">Air-Ground (800 MHz)</option>
        <option value="BRS">Broadband Radio Service </option>
        <option value="BWA24">Broadband Wireless Access (24 GHz) </option>
        <option value="BWA38">Broadband Wireless Access (38 GHz) </option>
        <option value="FCFS38">Broadband Wireless Access (38 GHz) - FCFS</option>
        <option value="CELL">Cellular</option>
        <option value="DEV_EARTH">Developmental Earth Stations</option>
        <option value="DEVGSONGSO">Developmental Satellite</option>
        <option value="DEVSL_SAES">Developmental Spectrum Licences for Site-Approved Earth Stations</option>
        <option value="ESIM">Earth stations in motion (ESIMs)</option>
        <option value="FSS-A">FSS/BSS Authorization</option>
        <option value="FSS-SO">FSS/BSS Spectrum Operational</option>
        <option value="FIXED">Fixed Earth Stations</option>
        <option value="FIXED_ESIM">Fixed Earth Stations and ESIMs</option>
        <option value="FWA">Fixed Wireless Access </option>
        <option value="FCFS34">Fixed Wireless Access (3.4 GHz) - FCFS</option>
        <option value="3500B">Flexible broadband services (FBS) (3500 MHz)</option>
        <option value="600B">Flexible broadband services (FBS) (600 MHz)</option>
        <option value="GSO">Geostationary Satellite Orbit (GSO)</option>
        <option value="HPOD">High Power Outdoor RLAN Devices (HPOD)</option>
        <option value="I-Block">I-Block (1670 MHz)</option>
        <option value="LIGHT">Light licensing (70-80-90 GHz)</option>
        <option value="MSSHigh">MSS Above 1 GHz</option>
        <option value="MSSLow">MSS Below 1 GHz</option>
        <option value="MBS">Mobile Broadband Service </option>
        <option value="MSS">Mobile Satellite Service (MSS)</option>
        <option value="NMCS">Narrowband MCS</option>
        <option value="NON_DEVSL_SAES">Non-Developmental Spectrum Licences for Site-Approved Earth Stations</option>
        <option value="NGSO">Non-geostationary Satellite Orbit (NGSO)</option>
        <option value="PCS">Personal Communication Service</option>
        <option value="PCSG">Personal Communication Service (Block G)</option>
        <option value="PS49">Public Safety (4.9 GHz)</option>
        <option value="PS700">Public Safety (700 MHz)</option>
        <option value="RAC">Railway Association of Canada</option>
        <option value="WBS">Wireless Broadband Service</option>
        <option value="WCS">Wireless Communication Services </option>
    </datalist>
*/

const valid = ['Personal Communication Service', 'Cellular', 'Flexible broadband services (FBS) (600 MHz)', 'Flexible broadband services (FBS) (3500 MHz)', 'Advanced Wireless Service', 'Advanced Wireless Service- Band 3', 'Advanced Wireless Service- Band 4', 'Mobile Broadband Service', 'Broadband Radio Service', 'Personal Communication Service (Block G)', 'Wireless Communication Services']
// ['PCS', 'CELL', '600B', 'AWS', 'AWS-3', 'MBS', 'BRS', 'PCSG', 'WCS']

for (const key in tier4) {
    const value = tier4[key];
    if (value.length !== 0) {
        value.forEach((element, i) => {
            if (!element) return
            if (!valid.includes(element.licenseCategory)) {
                tier4[key][i] = undefined;
            }
        });
    }
}

// save the file

const fs = require('fs');
fs.writeFile('./data/tier4.json', JSON.stringify(tier4, null, 2), (err) => {
    if (err) {
        console.log(err);
    }
});