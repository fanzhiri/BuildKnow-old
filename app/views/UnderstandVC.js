/**
 * Created by slako on 17/12/31.
 */
import React, { Component ,PropTypes} from 'react';
import {View, Text, StyleSheet,WebView,Dimensions} from "react-native";
import {Actions} from "react-native-router-flux";
import Button from "react-native-button";
import GlobleStyles from '../styles/GlobleStyles';
import SettingItem from '../component/SettingItem';
import EmptyData from '../component/EmptyData';
import LoadingData from '../component/LoadingData';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },

});

const {width, height} = Dimensions.get('window');

let doGetUnderstandVCUrl = "https://fanzhiri.gitbooks.io/buildquestionbook/content/le-jie-jian-shi-bi.html";

class UnderstandVC extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading:0,
        }
    }

    changeLoading(what){
        this.setState({
            loading:what
        });
    }

    renderWebView(){
        return(
            <WebView
                source={{
                    width:width,height:height,
                    uri: doGetUnderstandVCUrl,
                    method: 'GET'
                }}
                onLoadStart={() => this.changeLoading(1)}
                onLoadEnd={() => this.changeLoading(0)}
                domStorageEnabled={true}
                scalesPageToFit={false}
                javaScriptEnabled={true}
            />
        )
    }
    renderLoading(){
        if(this.state.loading == 0){
            return;
        }
        return(
            <LoadingData/>
        )
    }

    render(){

        return (
            <View style={GlobleStyles.withoutTitleContainer}>
                {this.renderLoading()}
                {this.renderWebView()}
            </View>
        );
    }
}

UnderstandVC.PropTypes = {
    idnumber:PropTypes.number,
};

module.exports = UnderstandVC;
