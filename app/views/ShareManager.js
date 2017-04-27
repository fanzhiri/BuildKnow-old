/**
 * Created by slako on 17/4/27.
 */
import React, { Component } from 'react';
import {View, Text, StyleSheet} from "react-native";
import {Actions} from "react-native-router-flux";
import Button from "react-native-button";
import GlobleStyles from '../styles/GlobleStyles';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    shareWayItem:{

        padding:10,
        backgroundColor:'white',
        borderBottomWidth:0.5,
        borderBottomColor:'#e8e8e8',
        //主轴方向
        flexDirection:'row',
    },
});

class ShareManager extends Component {
    constructor(props) {

        super(props);

        this.state = {
            netresult:'no',
            share_list_data_source: null,

        };
        //this._onChange = this.onChange.bind(this);
        //this._peoplelist = this.peoplelist.bind(this);
        this._renderShareWay = this.renderShareWay.bind(this);
        //this._doOnPress = this.doOnPress.bind(this);

    }

    renderShareWay(way){

        return (
            <View style={styles.shareWayItem}>
                <View>
                    <Text >
                        {way.name}
                    </Text>
                    <Text >
                        {way.passwd}
                    </Text>
                </View>
            </View>
        )
    }

    render(){
        return (
            <View style={GlobleStyles.withoutTitleContainer}>
                <ListView

                    dataSource={DataStore.cloneWithRows(this.state.share_list_data_source)}
                    renderRow={(rowData) => this._renderShareWay(rowData)}
                    enableEmptySections = {true}
                />
            </View>
        );
    }
}

module.exports = ShareManager;