import {createHostedZone, createZoneRecords} from "./src/dns";

const zone = createHostedZone();

createZoneRecords(zone);
