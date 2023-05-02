// @ts-nocheck
/**
 * 
 * @param {Spectrum} spectrum 
 * @param {*} index 
 * @param {*} array 
 * @returns {Spectrum}
 */
function findChilds(spectrum, index, array) {

    switch (spectrum.category.toLowerCase()) {
        // 600Mhz band 71
        case "flexible broadband services (fbs) (600 mhz)": {
            const pairedFrom = spectrum.from - 46;
            const pairedTo = spectrum.to - 46;

            const paired = array.find(s => s.from === pairedFrom && s.to === pairedTo);
            spectrum.paired = paired;
            break;
        }

        // 700Mhz band 12-13-17-29
        case "mobile broadband service": {
            /*
            Available frequency blocks for the 700 MHz auction

            A	698-704 MHz/728-734 MHz	paired	6+6 MHz
            B	704-710 MHz/734-740 MHz	paired	6+6 MHz
            C	710-716 MHz/740-746 MHz	paired	6+6 MHz
            D	716-722 MHz	           unpaired	6 MHz
            E	722-728 MHz	           unpaired	6 MHz
            C1	777-782 MHz/746-751 MHz	paired	5+5 MHz
            C2	782-787 MHz/751-756 MHz	paired	5+5 MHz
            D	758-763 MHz/788-793 MHz	paired	5+5 MHz
            (refered as Upper D to distinguish from Lower D)
            */


            // match uplink with downlink spectrum

            // A, B, C
            if (spectrum.from >= 698 && spectrum.to <= 716) {
                const pairedFrom = spectrum.from + 30;
                const pairedTo = spectrum.to + 30;

                const paired = array.find(s => s.from === pairedFrom && s.to === pairedTo);
                spectrum.paired = paired;
            }

            // C1, C2
            if (spectrum.from >= 777 && spectrum.to <= 787) {
                const pairedFrom = spectrum.from - 31;
                const pairedTo = spectrum.to - 31;

                const paired = array.find(s => s.from === pairedFrom && s.to === pairedTo);
                spectrum.paired = paired;
            }

            // Upper D (reserved for future use).
            if (spectrum.from >= 758 && spectrum.to <= 763) {
                const pairedFrom = spectrum.from + 30;
                const pairedTo = spectrum.to + 30;

                const paired = array.find(s => s.from === pairedFrom && s.to === pairedTo);
                spectrum.paired = paired;
            }

            break;
        }

        // 700Mhz band 14 (not yet used in Canada)
        case "public safety (700 mhz)": {
            // Public safety spectrum is paired and FDD
            // PSBB     763-768 MHz paired with 788-793 MHz
            // PS NB/WB 768-776 MHz paired with 798-806 MHz

            spectrum.friendlyName = "700Mhz Public Safety (band 14)";

            // PSBB
            if (spectrum.from >= 763 && spectrum.to <= 768) {
                const pairedFrom = spectrum.from + 25;
                const pairedTo = spectrum.to + 25;

                const paired = array.find(s => s.from === pairedFrom && s.to === pairedTo);
                spectrum.paired = paired;
            }

            // PS NB/WB
            if (spectrum.from >= 768 && spectrum.to <= 776) {
                const pairedFrom = spectrum.from + 30;
                const pairedTo = spectrum.to + 30;

                const paired = array.find(s => s.from === pairedFrom && s.to === pairedTo);
                spectrum.paired = paired;
            }

            break;
        }

        // 850Mhz band 5
        case "cellular": {
            /*
            Sub-band B - Telecommunications Common Carriers
                835-845 MHz paired with 880-890 MHz
                846.5-849 MHz paired with 891.5-894 MHz
            Sub-band A - Other Applicants
                824-835 MHz paired with 869-880 MHz
                845-846.5 MHz paired with 890-891.5 MHz 
            */

            // match uplink with downlink spectrum

            const paired = array.find(s => s.from == spectrum.from + 45 && s.to == spectrum.to + 45 && s.category === spectrum.category);
            spectrum.paired = paired;
            break;
        }

        // 1900Mhz band 2
        case "personal communication service": {
            /*
            A/A'  15 MHz 1850-1865 1930-1945
            D/D'   5 MHz 1865-1870 1945-1950
            B1/B1' 5 MHz 1870-1875 1950-1955
            B2/B2' 5 MHz 1875-1880 1955-1960
            B3/B3' 5 MHz 1880-1885 1960-1965
            E/E'   5 MHz 1885-1890 1965-1970
            F/F'   5 MHz 1890-1895 1970-1975
            C1/C1' 5 MHz 1895-1900 1975-1980
            C2/C2' 5 MHz 1900-1905 1980-1985
            C3/C3' 5 MHz 1905-1910 1985-1990
            */

            // match uplink with downlink spectrum

            spectrum.friendlyName = "Band 2"

            const paired = array.find(s =>
                s.from == spectrum.from + 80 &&
                s.to == spectrum.to + 80);

            spectrum.paired = paired;
            break;
        }

        case "personal communication service (block g)": {
            // PCS Block G
            // 1910-1915 MHz paired with 1990-1995 MHz

            spectrum.paired = array.find(s => s.from == spectrum.from + 80 && s.to == spectrum.to + 80);
            break;
        }

        // 1700Mhz-2100Mhz band 4 and 66
        case "advanced wireless service- band 3":
        case "advanced wireless service": {
            /* name - lower band - upper band - bandwidth
            Block A	1710-1720	2110-2120	20
            Block B	1720-1730	2120-2130	20
            Block C	1730-1735	2130-2135	10
            Block D	1735-1740	2135-2140	10
            Block E	1740-1745	2140-2145	10
            Block F	1745-1755	2145-2155	20
            Block G	1755-1760	2155-2160	10
            Block H	1760-1765	2160-2165	10
            Block I	1765-1770	2165-2170	10
            Block J1 1770-1775	2170-2175	10
            Block J2 1775-1780	2175-2180	10
            
            */

            const paired = array.find(s => s.from == spectrum.from + 400 && s.to == spectrum.to + 400);
            spectrum.paired = paired;
            break;
        }

        case "advanced wireless service- band 4": {
            // AWS-4 is downlink only
            break;
        }

        // 2500Mhz~2600Mhz band 41 and 7
        case "broadband radio service": {
            /*
            The band 2500-2570 MHz, which is paired with the band 2620-2690 MHz,
            is divided into seven 10 + 10 MHz paired blocks with a frequency separation of 120 MHz
            
            The band 2570-2620 MHz is divided into two 25 MHz unpaired blocks. 
            The unpaired blocks will each include a 5 MHz restricted band separating the paired and unpaired spectrum 
            (i.e. 2570-2575 MHz and 2615-2620 MHz).

            A / A'	2500-2510 MHz / 2620-2630 MHz	10 + 10 MHz	paired
            B / B'	2510-2520 MHz / 2630-2640 MHz	10 + 10 MHz	paired
            C / C'	2520-2530 MHz / 2640-2650 MHz	10 + 10 MHz	paired
            D / D'	2530-2540 MHz / 2650-2660 MHz	10 + 10 MHz	paired
            E / E'	2540-2550 MHz / 2660-2670 MHz	10 + 10 MHz	paired
            F / F'	2550-2560 MHz / 2670-2680 MHz	10 + 10 MHz	paired
            G / G'	2560-2570 MHz / 2680-2690 MHz	10 + 10 MHz	paired
            H	2570-2595 MHz	25 MHz (includes 5 MHz restricted band)	unpaired
            I	2595-2620 MHz	25 MHz (includes 5 MHz restricted band)	unpaired
            */


            if (spectrum.from >= 2570 && spectrum.to <= 2620) {
                // its TDD spectrum so it doesn't have a paired spectrum.
                break;
            }

            const paired = array.find(s => s.from == spectrum.from + 120 && s.to == spectrum.to + 120);
            spectrum.paired = paired;

            break;
        }

        // 2300Mhz band 30 or 40
        case "wireless communication services": {
            /*
            A Block (2305–2310 and 2350–2355 MHz)
            B Block (2310–2315 and 2355–2360 MHz)
            C Block (2315–2320 MHz)
            D Block (2345–2350 MHz)
            */

            const paired = array.find(s => s.from == spectrum.from + 40 && s.to == spectrum.to + 40);
            spectrum.paired = paired;
            break;
        }

        case "flexible broadband services (fbs) (3500 mhz)": {
            // its a TDD spectrum so it doesn't have a paired spectrum.
            break;
        }
    }

    return spectrum;
}

/**
 * 
 * @param {Spectrum} spectrum 
 * @param {number} index 
 * @param {Spectrum[]} array 
 * @returns {Spectrum | undefined}
 */
function mapSpectrum(spectrum, index, array) {
    //if (spectrum == undefined) { return undefined; }

    if (!spectrum) { return undefined; }

    /*
    if (findOverlappingSpectrumHigh(spectrum, array)) {
        return undefined;
    }*/

    switch (spectrum.category.toLowerCase()) {
        // 600Mhz band 71
        case "flexible broadband services (fbs) (600 mhz)": {
            /*
            Paired Block A	10 MHz	663-668 MHz	617-622 MHz
            Paired Block B	10 MHz	668-673 MHz	622-627 MHz
            Paired Block C	10 MHz	673-678 MHz	627-632 MHz
            Paired Block D	10 MHz	678-683 MHz	632-637 MHz
            Paired Block E	10 MHz	683-688 MHz	637-642 MHz
            Paired Block F	10 MHz	688-693 MHz	642-647 MHz
            Paired Block G	10 MHz	693-698 MHz	647-652 MHz
            */

            // match uplink with downlink spectrum

            spectrum.friendlyName = "band 71";

            const blockLetters = ["A", "B", "C", "D", "E", "F", "G"];

            if (spectrum.from >= 663 && spectrum.to <= 698) {
                // blocks name
                const letterIndex = (spectrum.from - 663) / 5;

                if (blockLetters[letterIndex]) {
                    spectrum.name = `Block ${blockLetters[letterIndex]}`;
                }
            }
            else if (spectrum.from >= 617 && spectrum.to <= 652) {
                const letterIndex = (spectrum.from - 617) / 5;

                if (blockLetters[letterIndex]) {
                    spectrum.name = `Block ${blockLetters[letterIndex]}'`;
                }
            }


            break;
        }

        // 700Mhz band 12-13-17-29
        case "mobile broadband service": {
            /*
            Available frequency blocks for the 700 MHz auction

            A	698-704 MHz/728-734 MHz	paired	6+6 MHz
            B	704-710 MHz/734-740 MHz	paired	6+6 MHz
            C	710-716 MHz/740-746 MHz	paired	6+6 MHz
            D	716-722 MHz	           unpaired	6 MHz
            E	722-728 MHz	           unpaired	6 MHz
            C1	777-782 MHz/746-751 MHz	paired	5+5 MHz
            C2	782-787 MHz/751-756 MHz	paired	5+5 MHz
            D	758-763 MHz/788-793 MHz	paired	5+5 MHz
            (refered as Upper D to distinguish from Lower D)
            */


            // match uplink with downlink spectrum

            // A, B, C
            if (spectrum.from >= 698 && spectrum.to <= 716) {
                spectrum.friendlyName = "Band 12";

                // blocks name
                if (spectrum.from >= 698 && spectrum.to <= 704) {
                    spectrum.name = "Block A";
                } else if (spectrum.from >= 704 && spectrum.to <= 710) {
                    spectrum.name = "Block B";
                } else if (spectrum.from >= 710 && spectrum.to <= 716) {
                    spectrum.name = "Block C";
                }
            }

            // A', B', C'
            else if (spectrum.from >= 728 && spectrum.to <= 746) {
                if (spectrum.from >= 728 && spectrum.to <= 734) {
                    spectrum.name = "Block A'";
                } else if (spectrum.from >= 734 && spectrum.to <= 740) {
                    spectrum.name = "Block B'";
                } else if (spectrum.from >= 740 && spectrum.to <= 746) {
                    spectrum.name = "Block C'";
                }
            }

            // D
            else if (spectrum.from >= 716 && spectrum.to <= 722) {
                spectrum.friendlyName = "Band 29";
                spectrum.name = "Block D";
            }

            // E
            else if (spectrum.from >= 722 && spectrum.to <= 728) {
                spectrum.friendlyName = "Band 29";
                spectrum.name = "Block E";
            }

            // C1, C2
            else if (spectrum.from >= 777 && spectrum.to <= 787) {
                spectrum.friendlyName = "Band 13";

                // blocks name
                if (spectrum.from >= 777 && spectrum.to <= 782) {
                    spectrum.name = "Block C1";
                } else if (spectrum.from >= 782 && spectrum.to <= 787) {
                    spectrum.name = "Block C2";
                }
            }

            // C1', C2'
            else if (spectrum.from >= 746 && spectrum.to <= 756) {
                if (spectrum.from >= 746 && spectrum.to <= 751) {
                    spectrum.name = "Block C1'";
                } else if (spectrum.from >= 751 && spectrum.to <= 756) {
                    spectrum.name = "Block C2'";
                }
            }

            // Upper D (reserved for future use).
            else if (spectrum.from >= 758 && spectrum.to <= 763) {
                spectrum.name = "Upper D Block";
                spectrum.friendlyName = "Band 14";
            } else if (spectrum.from >= 788 && spectrum.to <= 793) {
                spectrum.name = "Upper D' Block";
                spectrum.friendlyName = "Band 14";
            }

            break;
        }

        // 700Mhz band 14 (not yet used in Canada)
        case "public safety (700 mhz)": {
            // Public safety spectrum is paired and FDD
            // PSBB     763-768 MHz paired with 788-793 MHz
            // PS NB/WB 768-776 MHz paired with 798-806 MHz

            spectrum.friendlyName = "700Mhz Public Safety (band 14)";

            // PSBB
            if (spectrum.from >= 763 && spectrum.to <= 768) {
                spectrum.name = "PSBB Block";
            } else if (spectrum.from >= 788 && spectrum.to <= 793) {
                spectrum.name = "PSBB' Block";
            }

            // PS NB/WB
            if (spectrum.from >= 768 && spectrum.to <= 776) {
                spectrum.name = "PS NB/WB Block";
            } else if (spectrum.from >= 798 && spectrum.to <= 806) {
                spectrum.name = "PS NB/WB' Block";
            }

            break;
        }

        // 850Mhz band 5
        case "cellular": {
            /*
            Sub-band B - Telecommunications Common Carriers
                835-845 MHz paired with 880-890 MHz
                846.5-849 MHz paired with 891.5-894 MHz
            Sub-band A - Other Applicants
                824-835 MHz paired with 869-880 MHz
                845-846.5 MHz paired with 890-891.5 MHz 
            */

            // match uplink with downlink spectrum

            spectrum.friendlyName = "Band 5"

            // Sub-band A1
            if (spectrum.from >= 824 && spectrum.to <= 835) {
                spectrum.name = "Sub-band A1";
            } else if (spectrum.from >= 869 && spectrum.to <= 880) {
                spectrum.name = "Sub-band A1'";
            }

            // Sub-band B1
            else if (spectrum.from >= 835 && spectrum.to <= 845) {
                spectrum.name = "Sub-band B1";
            } else if (spectrum.from >= 880 && spectrum.to <= 890) {
                spectrum.name = "Sub-band B1'";
            }

            // Sub-band A2
            else if (spectrum.from >= 845 && spectrum.to <= 846.5) {
                spectrum.name = "Sub-band A2";
            } else if (spectrum.from >= 890 && spectrum.to <= 891.5) {
                spectrum.name = "Sub-band A2'";
            }

            // Sub-band B2
            else if (spectrum.from >= 846.5 && spectrum.to <= 849) {
                spectrum.name = "Sub-band B2";
            } else if (spectrum.from >= 891.5 && spectrum.to <= 894) {
                spectrum.name = "Sub-band B2'";
            }

            break;
        }

        // 1900Mhz band 2
        case "personal communication service": {
            /*
            A/A' 15 MHz 1850-1865 1930-1945
            B1/B1' 5 MHz 1870-1875 1950-1955
            B2/B2' 5 MHz 1875-1880 1955-1960
            B3/B3' 5 MHz 1880-1885 1960-1965
            C1/C1' 10 MHz 1895-1900 1975-1980
            C2/C2' 10 MHz 1900-1905 1980-1985
            C3/C3' 10 MHz 1905-1910 1985-1990
            D/D' 10 MHz 1865-1870 1945-1950
            E/E' 10 MHz 1885-1890 1965-1970
            F/F' 10 MHz 1890-1895 1970-1975
            */

            // match uplink with downlink spectrum

            spectrum.friendlyName = "Band 2"

            // A/A'
            if (spectrum.from >= 1850 && spectrum.to <= 1865) {
                spectrum.name = "Block A";
            } else if (spectrum.from >= 1930 && spectrum.to <= 1945) {
                spectrum.name = "Block A'";
            }

            // B block
            if (spectrum.from == 1870 && spectrum.to == 1885) {
                spectrum.name = "Block B";
            } else if (spectrum.from == 1950 && spectrum.to == 1965) {
                spectrum.name = "Block B'";
            }

            // B1/B1'
            else if (spectrum.from == 1870 && spectrum.to == 1875) {
                spectrum.name = "Block B1";
            } else if (spectrum.from == 1950 && spectrum.to == 1955) {
                spectrum.name = "Block B1'";
            }

            // B2/B2'
            else if (spectrum.from == 1875 && spectrum.to == 1880) {
                spectrum.name = "Block B2";
            } else if (spectrum.from == 1955 && spectrum.to == 1960) {
                spectrum.name = "Block B2'";
            }

            // B3/B3'
            else if (spectrum.from == 1880 && spectrum.to == 1885) {
                spectrum.name = "Block B3";
            } else if (spectrum.from == 1960 && spectrum.to == 1965) {
                spectrum.name = "Block B3'";
            }

            // C block
            if (spectrum.from == 1895 && spectrum.to == 1910) {
                spectrum.name = "Block C";
            }

            // C1/C1'
            else if (spectrum.from >= 1895 && spectrum.to <= 1900) {
                spectrum.name = "Block C1";
            } else if (spectrum.from >= 1975 && spectrum.to <= 1980) {
                spectrum.name = "Block C1'";
            }

            // C2/C2'
            else if (spectrum.from == 1900 && spectrum.to == 1905) {
                spectrum.name = "Block C2";
            } else if (spectrum.from == 1980 && spectrum.to == 1985) {
                spectrum.name = "Block C2'";
            }

            // C3/C3'
            else if (spectrum.from == 1905 && spectrum.to == 1910) {
                spectrum.name = "Block C3";
            } else if (spectrum.from == 1985 && spectrum.to == 1990) {
                spectrum.name = "Block C3'";
            }

            // D/D'
            if (spectrum.from >= 1865 && spectrum.to <= 1870) {
                spectrum.name = "Block D";
            } else if (spectrum.from >= 1945 && spectrum.to <= 1950) {
                spectrum.name = "Block D'";
            }

            // E/E'
            if (spectrum.from >= 1885 && spectrum.to <= 1890) {
                spectrum.name = "Block E";
            } else if (spectrum.from >= 1965 && spectrum.to <= 1970) {
                spectrum.name = "Block E'";
            }

            // F/F' 
            if (spectrum.from >= 1890 && spectrum.to <= 1895) {
                spectrum.name = "Block F";
            } else if (spectrum.from >= 1970 && spectrum.to <= 1975) {
                spectrum.name = "Block F'";
            }

            // G/G'
            if (spectrum.from >= 1910 && spectrum.to <= 1915) {
                spectrum.name = "Block G";
            } else if (spectrum.from >= 1990 && spectrum.to <= 1995) {
                spectrum.name = "Block G'";
            }

            break;
        }

        case "personal communication service (block g)": {
            // PCS Block G
            // 1910-1915 MHz paired with 1990-1995 MHz

            spectrum.friendlyName = "Band 25";

            if (spectrum.from >= 1910 && spectrum.to <= 1915) {
                spectrum.name = "Block G";
            } else if (spectrum.from >= 1990 && spectrum.to <= 1995) {
                spectrum.name = "Block G'";
            }

            break;
        }

        case "advanced wireless service": {
            /* name - lower band - upper band - bandwidth
            Block A	1710-1720	2110-2120	20
            Block B	1720-1730	2120-2130	20
            Block C	1730-1735	2130-2135	10
            Block D	1735-1740	2135-2140	10
            Block E	1740-1745	2140-2145	10
            Block F	1745-1755	2145-2155	20
            */

            spectrum.friendlyName = "AWS (Band 4)";

            // A
            if (spectrum.from == 1710 && spectrum.to == 1720) {
                spectrum.name = "Block A";
            }
            else if (spectrum.from == 2110 && spectrum.to == 2120) {
                spectrum.name = "Block A'";
            }

            // B
            else if (spectrum.from == 1720 && spectrum.to == 1730) {
                spectrum.name = "Block B";
            } else if (spectrum.from == 2120 && spectrum.to == 2130) {
                spectrum.name = "Block B'";
            }


            // C
            else if (spectrum.from == 1730 && spectrum.to == 1735) {
                spectrum.name = "Block C";
            } else if (spectrum.from == 2130 && spectrum.to == 2135) {
                spectrum.name = "Block C'";
            }

            // D 
            else if (spectrum.from == 1735 && spectrum.to == 1740) {
                spectrum.name = "Block D";
            } else if (spectrum.from == 2135 && spectrum.to == 2140) {
                spectrum.name = "Block D'";
            }

            // E
            else if (spectrum.from == 1740 && spectrum.to == 1745) {
                spectrum.name = "Block E";
            } else if (spectrum.from == 2140 && spectrum.to == 2145) {
                spectrum.name = "Block E'";
            }

            // F
            else if (spectrum.from == 1745 && spectrum.to == 1755) {
                spectrum.name = "Block F";
            } else if (spectrum.from == 2145 && spectrum.to == 2155) {
                spectrum.name = "Block F'";
            }

            break;
        }

        // 1700Mhz-2100Mhz band 4 and 66
        case "advanced wireless service- band 3": {
            /*
            Block G	1755-1760	2155-2160	10
            Block H	1760-1765	2160-2165	10
            Block I	1765-1770	2165-2170	10
            Block J1 1770-1775	2170-2175	10
            Block J2 1775-1780	2175-2180	10
            */

            spectrum.friendlyName = "AWS-3 (Band 66)";
            spectrum.name = "AWS-3";

            // GHI
            if (spectrum.from == 1755 && spectrum.to == 1770) {
                spectrum.name = "Block GHI";
            } else if (spectrum.from == 2155 && spectrum.to == 2170) {
                spectrum.name = "Block GHI'";
            }

            // G
            else if (spectrum.from == 1755 && spectrum.to == 1760) {
                spectrum.name = "Block G";
            } else if (spectrum.from == 2155 && spectrum.to == 2160) {
                spectrum.name = "Block G'";
            }

            // H
            else if (spectrum.from == 1760 && spectrum.to == 1765) {
                spectrum.name = "Block H";
            } else if (spectrum.from == 2160 && spectrum.to == 2165) {
                spectrum.name = "Block H'";
            }

            // I
            else if (spectrum.from == 1765 && spectrum.to == 1770) {
                spectrum.name = "Block I";
            } else if (spectrum.from == 2165 && spectrum.to == 2170) {
                spectrum.name = "Block I'";
            }

            // J1
            else if (spectrum.from == 1770 && spectrum.to == 1775) {
                spectrum.name = "Block J1";
            } else if (spectrum.from == 2170 && spectrum.to == 2175) {
                spectrum.name = "Block J1'";
            }

            // J2
            else if (spectrum.from == 1775 && spectrum.to == 1780) {
                spectrum.name = "Block J2";
            } else if (spectrum.from == 2175 && spectrum.to == 2180) {
                spectrum.name = "Block J2'";
            }

            break;
        }

        case "advanced wireless service- band 4": {
            /* 
            AWS-4 is a 20 MHz block of downlink only spectrum in the 2180-2200 MHz range.
            Block C  2180-2190 10Mhz
            Block D  2190-2200 10Mhz
            */

            spectrum.friendlyName = "AWS-4";

            if (spectrum.from == 2180 && spectrum.to == 2200) {
                spectrum.name = "Block C & D";
            }

            else if (spectrum.from == 2180 && spectrum.to == 2190) {
                spectrum.name = "Block C";
            }

            else if (spectrum.from == 2190 && spectrum.to == 2200) {
                spectrum.name = "Block D";
            }

            break;
        }

        // 2500Mhz~2600Mhz band 41 and 7
        case "broadband radio service": {
            /*
            The band 2500-2570 MHz, which is paired with the band 2620-2690 MHz,
            is divided into seven 10 + 10 MHz paired blocks with a frequency separation of 120 MHz
            
            The band 2570-2620 MHz is divided into two 25 MHz unpaired blocks. 
            The unpaired blocks will each include a 5 MHz restricted band separating the paired and unpaired spectrum 
            (i.e. 2570-2575 MHz and 2615-2620 MHz).

            A / A'	2500-2510 MHz / 2620-2630 MHz	10 + 10 MHz	paired
            B / B'	2510-2520 MHz / 2630-2640 MHz	10 + 10 MHz	paired
            C / C'	2520-2530 MHz / 2640-2650 MHz	10 + 10 MHz	paired
            D / D'	2530-2540 MHz / 2650-2660 MHz	10 + 10 MHz	paired
            E / E'	2540-2550 MHz / 2660-2670 MHz	10 + 10 MHz	paired
            F / F'	2550-2560 MHz / 2670-2680 MHz	10 + 10 MHz	paired
            G / G'	2560-2570 MHz / 2680-2690 MHz	10 + 10 MHz	paired
            H	2570-2595 MHz	25 MHz (includes 5 MHz restricted band)	unpaired
            I	2595-2620 MHz	25 MHz (includes 5 MHz restricted band)	unpaired
            */

            const pairedBlocks = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

            // set the name for all paired spectrum
            if (spectrum.from >= 2570 && spectrum.to <= 2620) {
                spectrum.friendlyName = `Band 41`;
            }
            else if (spectrum.from >= 2500 && spectrum.to <= 2570) {
                spectrum.friendlyName = `Band 7`;

                const spectrumIndex = (spectrum.from - 2500) / 10;
                const blockLetter = pairedBlocks[spectrumIndex];

                if (blockLetter) {
                    spectrum.name = `Block ${blockLetter}`;
                }

                break;
            } else if (spectrum.from >= 2620 && spectrum.to <= 2690) {
                spectrum.friendlyName = `Band 7`;

                const spectrumIndex = (spectrum.from - 2620) / 10;
                const blockLetter = pairedBlocks[spectrumIndex];

                if (blockLetter) {
                    spectrum.name = `Block ${blockLetter}'`;
                }

                break;
            } else {
                spectrum.name = `${spectrum.from} - ${spectrum.to} MHz`;
            }


            if ((spectrum.from == 2570 || spectrum.from == 2575) && spectrum.to == 2595) {
                spectrum.name = "Block H";
            }

            if (spectrum.from == 2595 && (spectrum.to == 2620 || spectrum.to == 2615)) {
                spectrum.name = "Block I";
            }

            if ((spectrum.from == 2570 || spectrum.from == 2575) && (spectrum.to == 2620 || spectrum.to == 2615)) {
                spectrum.name = "Block H & I";
            }

            break;
        }

        // 2300Mhz band 30 or 40
        case "wireless communication services": {
            /*
            A Block (2305–2310 and 2350–2355 MHz)
            B Block (2310–2315 and 2355–2360 MHz)
            C Block (2315–2320 MHz)
            D Block (2345–2350 MHz)
            */

            if (spectrum.from == 2305 && spectrum.to == 2320) {
                spectrum.name = "Block W";
            } else if (spectrum.from == 2345 && spectrum.to == 2360) {
                spectrum.name = "Block W'";
            }

            if (spectrum.from == 2305 && spectrum.to == 2310) {
                spectrum.name = "Block A";
            } else if (spectrum.from == 2350 && spectrum.to == 2355) {
                spectrum.name = "Block A'";
            }

            else if (spectrum.from == 2310 && spectrum.to == 2315) {
                spectrum.name = "Block B";
            } else if (spectrum.from == 2355 && spectrum.to == 2360) {
                spectrum.name = "Block B'";
            }

            else if (spectrum.from == 2315 && spectrum.to == 2320) {
                spectrum.name = "Block C";
            }

            else if (spectrum.from == 2345 && spectrum.to == 2350) {
                spectrum.name = "Block D";
            }

            spectrum.friendlyName = `Band 30 & 40`;
            break;
        }

        case "flexible broadband services (fbs) (3500 mhz)": {
            /*
            The 3500 MHz band plan, which includes the frequency range of 3450 to 3650 MHz.
            The frequency range is divided into 20 unpaired blocks of 10 MHz each.
            Block name are from A to V
            */

            spectrum.friendlyName = `Band 78`;

            const blockLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V'];
            const blockNumber = (spectrum.from - 3450) / 10;
            const blockLetter = blockLetters[blockNumber];

            if (blockLetter) {
                spectrum.name = `Block ${blockLetter}`;
            }
        }
    }

    return spectrum;
}

/**
 * @param {Spectrum[]} data
 */
function pairFragmentedBlocks(data) {
    // iterate over the data and find the fragmented blocks
    // no need to sort, the data is already sorted by 'from' value

    const pairedBlocks = [];
    /**
     * @type {Spectrum[]}
     */
    const spectrumArray = [];

    /**
     * 
     * @param {Spectrum[]} fragments
     * @param {Spectrum} spectrum
     * @param {number} index 
     * @returns 
     */
    const isFragment = (fragments, spectrum, index) => {
        if (index == 0) { return false; }
        const previousSpectrum = fragments[index - 1];
        if (!previousSpectrum) { return false; }

        if (previousSpectrum.name != undefined &&
            spectrum.name != undefined &&
            previousSpectrum.name == spectrum.name &&
            previousSpectrum.to == spectrum.from) {
            return true;
        }

        return false;
    }

    for (let i = 0; i < data.length; i++) {

        const spectrumInfo = mapSpectrum(data[i], i, data);
        if (!spectrumInfo) { continue; }

        // check if the nexts spectrum is a fragment.
        let fragments = [spectrumInfo];
        let nextSpectrum = mapSpectrum(data[i + 1], i + 1, data);
        let position = 1;
        let infos = { ...spectrumInfo };


        while (nextSpectrum && isFragment(fragments, nextSpectrum, position)) {
            infos.to = nextSpectrum.to;
            infos.bandwidth += nextSpectrum.bandwidth;

            if (infos.paired) {
                infos.paired.to = nextSpectrum.paired.to;
                infos.paired.bandwidth += nextSpectrum.paired.bandwidth;
            }

            fragments.push(nextSpectrum);
            position++;
            i++;
            nextSpectrum = mapSpectrum(data[i + 1], i, data);
            //if (!nextSpectrum) { break; }
        }

        spectrumArray.push(infos);
    }

    return spectrumArray;
}

/**
 * eliminate duplicates
 * @param {Spectrum} spectrum 
 * @param {Spectrum[]} array 
 */
function findOverlappingSpectrumHigh(spectrum, array) {
    const found = array.find(s => s.category == spectrum.category && s.from <= spectrum.from && s.to >= spectrum.to && s !== spectrum);


    if (!found) { return false; }


    if (spectrum.bandwidth <= found.bandwidth) {
        return true;
    }

    return false;
}

interface Spectrum {
    name: string;
    category: string;
    to: number;
    from: number;
    bandwidth: number;
    paired: Spectrum;
    friendlyName: string;
}

/**
 * @param {HTMLCollectionOf<HTMLTableRowElement>} rows
 * @returns {Spectrum[]}
 */
function mapHtml(spectrum: Spectrum) {
    const data = spectrum
        .filter(x => x != null)
        .sort((a, b) => a.from - b.from)
        .filter(x => x.frequency != null)
        .map(mapSpectrum)
        .map(findChilds)
        .filter(
            (x, i, array) => {
                const isPaired = array.some(s => s.paired === x);
                return !isPaired
            });


    return pairFragmentedBlocks(data)
        .filter((x, i, array) => {
            const bIsPaired = array.some(s => s.paired === x);
            return !bIsPaired
        });
}

/**
 * @typedef  categories
 */