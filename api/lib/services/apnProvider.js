import apn from 'apn';
import fs from 'fs';
import path from 'path';

const apnProvider = new apn.Provider({
  token: {
    key: fs.readFileSync(path.resolve(__dirname, `./AuthKey_${process.env.APN_KEY_ID}.p8`)),
    keyId: process.env.APN_KEY_ID,
    teamId: process.env.TEAM_ID,
  },
  production: process.env.NODE_ENV === 'production',
});

export default apnProvider;
