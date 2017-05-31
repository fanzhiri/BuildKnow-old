/**
 * Created by slako on 17/05/31.
 */
import React, { Component,PropTypes } from 'react';
import {View, Text, StyleSheet,ScrollView,SegmentedControlIOS} from "react-native";
import {Actions} from "react-native-router-flux";
import Button from "react-native-button";
import GlobleStyles from '../styles/GlobleStyles';

import MeItem from '../component/MeItem'
import SettingItem from '../component/SettingItem'

import Icon from 'react-native-vector-icons/Ionicons';

import {storageSave,storeageGet} from '../util/NativeStore';

import ImagePicker from "react-native-image-picker";

var httpsBaseUrl = "https://slako.applinzi.com/";

const styles = StyleSheet.create({
    list:{
        borderTopWidth: 1,
        borderTopColor: '#e4e4e4',
        marginTop: 12
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',

    },
    itemcontainer: {
        flexDirection:'row',
        alignItems: 'center',
        height: 40,
        backgroundColor: '#F5FCFF',
        paddingLeft:8,
        paddingRight:8,
        marginTop:4
    },
    segmentcontainer: {
        flex:1,
        flexDirection:'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        height: 40,
    },
    segmented:{
        width:160,
    },typetext:{

    }
});

class AnswerSetting extends Component {

    constructor(props) {
        super(props);

        this.state = {
            qafontsizeselect:0,
            backgroudselect:0,
            autonextselect:0,
            autoexplanselect:0,
            timetoexplanselect:0,
        };

    }


    onSelectSegmentChange(event,changeindex) {
        switch (changeindex){
            case 1:
                this.setState({
                    qafontsizeselect: event.nativeEvent.selectedSegmentIndex,
                });
                break;
            case 2:
                this.setState({
                    backgroudselect: event.nativeEvent.selectedSegmentIndex,
                });
                break;
            case 3:
                this.setState({
                    qafontsizeselect: event.nativeEvent.selectedSegmentIndex,
                });
                break;
            case 4:
                this.setState({
                    autoexplanselect: event.nativeEvent.selectedSegmentIndex,
                });
                break;
            case 5:
                this.setState({
                    timetoexplanselect: event.nativeEvent.selectedSegmentIndex,
                });
                break;

        }

    }

    renderSelectSegmentView(name,values,selectindex,stateindex,changeindex){
        return(
            <View style={styles.itemcontainer}>
                <Text style={styles.typetext}>{name}</Text>
                <View style={styles.segmentcontainer}>
                    <SegmentedControlIOS
                        values={values}
                        selectedIndex={selectindex}
                        style={styles.segmented}
                        onChange={(event) => {
                            this.onSelectSegmentChange(event,changeindex)
                        }}
                    />
                </View>
            </View>
        )
    }

    render(){

        return (
            <View style={GlobleStyles.withoutTitleContainer}>
                <ScrollView>
                    <View style={styles.list}>
                        {this.renderSelectSegmentView("字体大小",['偏小', '小', '大', '偏大'],this.state.qafontsizeselect,1)}
                        {this.renderSelectSegmentView("背景颜色",['黑', '灰', '白'],this.state.backgroudselect,2)}
                        {this.renderSelectSegmentView("自动跳",['立即', '5秒', '否'],this.state.backgroudselect,3)}
                        {this.renderSelectSegmentView("自动弹出解析",['否','是'],this.state.autoexplanselect,4)}
                        {this.renderSelectSegmentView("选错几次显示答案",['1','2'],this.state.timetoexplanselect,5)}
                    </View>
                </ScrollView>

            </View>
        );
    }
}

AnswerSetting.PropTypes = {
    answertype: PropTypes.number,
};

module.exports = AnswerSetting;