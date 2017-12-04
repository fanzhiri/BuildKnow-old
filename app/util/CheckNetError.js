/**
 * Created by fanzhiri on 2017/12/4.
 */
import {Actions} from "react-native-router-flux";
import {Alert} from "react-native";

export function checkerrorcode(object) {
    switch (object.code){
        case 998:
            break;
        case 999:
            Alert.alert(object.message);
            Actions.login();
            break;
        default:

            Alert.alert(object.code+' '+object.message);
            break;
    }
}