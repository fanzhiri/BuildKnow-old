/**
 * Created by slako on 18/01/08.
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
let doGetGuangGaoUrl = "https://fanzhiri.gitbooks.io/buildquestionbook/content/guang-gao-he-zuo.html";
class GitbookShow extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading:0,
        }
    }

    componentWillMount(){
        let updatetitle =null;
        switch (this.props.shownumber){
            case 1 :
                updatetitle = "了解建识币";
                break;
            case 2 :
                updatetitle = "广告合作";
                break;
        }
        Actions.refresh({title:updatetitle})
    }

    changeLoading(what){
        this.setState({
            loading:what
        });
    }

    renderWebView(){
        let showuri = null;
        switch (this.props.shownumber){
            case 1 :
                showuri = doGetUnderstandVCUrl;
                break;
            case 2 :
                showuri = doGetGuangGaoUrl;
                break;
        }
        return(
            <WebView
                source={{
                    width:width,height:height,
                    uri: showuri,
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

GitbookShow.PropTypes = {
    shownumber:PropTypes.number,
};

module.exports = GitbookShow;
