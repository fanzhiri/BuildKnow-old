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

class LoadingData extends Component {

    render() {
        return (
            <View style={styles.container}>
                <Text style={{fontSize:18}}>数据加载中...</Text>
            </View>
        );
    }

}



export default LoadingData;