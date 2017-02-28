/**
 * Created by slako on 17/2/18.
 */
import React, { Component } from 'react';
import {View, Text, Image, StyleSheet, ListView, ScrollView} from "react-native";
import {Actions} from "react-native-router-flux";
import Button from "react-native-button";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#c0FCFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop:64,
    },
    container1: {

        flexDirection:'row',
        height:80,
    },
    container2: {
        flex: 3,
    },

    image:{
        flex:1,
        width:80,

        borderRadius:16,
    },
});

class BookIntroduce extends Component {

    constructor(props) {
        super(props);
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {

            dataSource: ds.cloneWithRows(Marketlistdata)
        };
        this.renderRow = this.renderRow.bind(this);

    }

    renderRow(rowData, sectionID, rowID) {
        return (
            <MarketListItem rowID={rowID}  cover={rowData.cover} name={rowData.name} />
        );
    }

    render(){
        return (
            <View style={styles.container}>
                <ScrollView>
                    <Listview
                        horizontal={true}
                        dataSource={this.state.dataSource}
                        renderRow={this.renderRow}
                    />
                </ScrollView>
            </View>
        );
    }
}

module.exports = BookIntroduce;