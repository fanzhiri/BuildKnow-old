
/**
 * Created by slako on 17/3/16.
 */
import {
    AsyncStorage
} from 'react-native';

import Storage from 'react-native-storage'

const storage = new Storage({
    // maximum capacity, default 1000
    size: 1000,

    // expire time, default 1 day(1000 * 3600 * 24 secs)
    defaultExpires: 1000 * 3600 * 24 * 30, //30 days

    enableCache: true,

    // if data was not found in storage or expired,
    // the corresponding sync method will be invoked and return
    // the latest data.
    sync: {

    }
})
export default storage;