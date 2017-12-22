/**
 * Created by fanzhiri on 2017/10/28.
 */
import React, {Component, PropTypes} from 'react';
import {Actions} from "react-native-router-flux";
import {
    TouchableOpacity,
    View,
    Text,
    Image,
    StyleSheet,
    Dimensions
} from 'react-native';

const styles = StyleSheet.create({
    container:{
        justifyContent: 'center',
        alignItems: 'center',
        flex:1,
        backgroundColor:"#FFFFFF"
    }
});

class EmptyData extends Component {

    render() {
        return (
            <View style={styles.container}>
                <Text style={{fontSize:18}}>这里空荡荡的</Text>
            </View>
        );
    }

}



export default EmptyData;