import { Facebook } from 'fb';

export default new Facebook({
  appId: process.env.FB_CLIENT_ID,
  appSecret: process.env.FB_CLIENT_SECRET,
});
