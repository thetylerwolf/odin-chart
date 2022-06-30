import Parse from 'parse';

import config from '../config.json';

Parse.initialize(config.APP_ID);
Parse.serverURL = process.env.SERVER_URL;
// Parse.User.enableUnsafeCurrentUser();

export default Parse
