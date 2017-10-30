const Dotenv = require('dotenv').config();
const HomeyAPI = require('athom-api').HomeyAPI;
const fs = require('fs');
const os = require('os');

const DATA_FILENAME = process.argv[2] || 'data.txt';
const FREQ = parseInt(process.argv[3]) || 433;
const INTERVAL = parseInt(process.argv[4]) || 5;

const opts = {
   "_id": process.env.HOMEY_ID,
   "name": process.env.HOMEY_NAME,
   "language":"en",
   "localUrl":"http://"+ process.env.HOMEY_LOCAL_IP +":80",
   "remoteUrl":"https://"+ process.env.HOMEY_ID +".homey.athom.com",
   "token": process.env.HOMEY_TOKEN,
   "role":"owner"
};

async function getRecord() {

    const Homey = await HomeyAPI.forHomeyObject(opts);
    const rf = await Homey.rf;
    
    console.log("start recording....");
    return record = await rf.record({ timeout: INTERVAL, frequency: FREQ });
}

function getMostSimilar(record) {
    var recordingLengths = record.reduce((lengths, recordEntry) => Object.assign(lengths, { [recordEntry.length]: (lengths[recordEntry.length] || 0) + 1 }), {});

    var max = 0;
    var idx;
    for (var recordingLength in recordingLengths)  {

        if(recordingLengths[recordingLength] > max) {
            idx = parseInt(recordingLength);
            max = recordingLengths[recordingLength];
        }
    }

    if(idx) {
        return record.filter(recordEntry => recordEntry.length === idx);
    }
}

async function run() {
    let records = await getRecord();
    // filter out noise to get interesting signal
    let mostSimilar = getMostSimilar(records);
    if(mostSimilar && mostSimilar.length > 1) {
        console.log("Found frequently repeating signal.", mostSimilar.length, "samples.");
        // create file and write records to file
        fs.writeFileSync('./'+DATA_FILENAME, '');
        fs.open('./'+DATA_FILENAME, 'a', 666, (e, id) => {
            mostSimilar.forEach((record) => {
                fs.writeSync( id, record + os.EOL, 'utf8');
            });
            fs.close(id, () => {
               console.log("succesfully wrote data to file"); 
                });
        });
    } else {
        console.log("Couldn't find relevant signal");
    }
}

if(process.argv[2] === '-h') {
    console.error("usage: node "+process.argv[1]+" <filename> <433|868|ir> <duration>");
    process.exit(1);
}

run();
