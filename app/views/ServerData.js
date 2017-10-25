/**
 * Created by slako on 17/10/25.
 */
import React, { Component } from 'react';
import {View, Text, StyleSheet,WebView,ProgressViewIOS} from "react-native";
import {Actions} from "react-native-router-flux";
import Button from "react-native-button";
import GlobleStyles from '../styles/GlobleStyles';
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',

    },
    progressView: {
        marginTop: 4,
        marginLeft:10,
        marginRight:10,
        marginTop: 4,
        backgroundColor:"#B0FFB0"
    }

});

class ServerData extends Component {

    constructor(props) {
        super(props);

        this.state = {
            loading:true,
        };

    }

    webviewloadend(){
        this.setState({
            loading: false,
        });
    }

    renderProgressView(){
        if(this.state.loading == false){
            return;
        }
        return(
            <ProgressViewIOS style={styles.progressView} progress={0.3}/>
        )
    }


    render(){
        return (
            <View style={GlobleStyles.withoutTitleContainer}>
                {this.renderProgressView()}
                <WebView
                    source={require('../util/echarts/tpl.html')}
                    //source={require('../util/echarts/hello.html')}
                    //style={{height: 600,width:300}}
                    style={{flex:1}}
                    domStorageEnabled={true}
                    scalesPageToFit={false}
                    javaScriptEnabled={true}
                    onLoadEnd={()=> this.webviewloadend()}
                />
            </View>
        );
    }
}

module.exports = ServerData;