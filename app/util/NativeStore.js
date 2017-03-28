
/**
 * Created by slako on 17/3/16.
 */
import {
    AsyncStorage
} from 'react-native';

import store from 'react-native-simple-store';

export function storageSave(key,auth){
    store.save(key, auth);
}

export function storeageGet(key){
    return store.get(key);
    /*
    return store.get(key).then(value => {
        if (value) {
            return value;
        } else {
            return null;

        }
    });*/
}

