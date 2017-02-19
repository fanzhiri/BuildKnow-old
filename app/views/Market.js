/**
 * Created by slako on 17/2/18.
 */
import React, { Component } from 'react';
import {View, Text, StyleSheet, ListView, ScrollView} from "react-native";
import {Actions} from "react-native-router-flux";
import Button from "react-native-button";
import Swiper from 'react-native-swiper'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    slide: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#9DD6EB',
    },
});

class Market extends Component {
    constructor(props) {
        super(props);
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            dataSource: ds.cloneWithRows([
                'John', 'Joel', 'James', 'Jimmy', 'Jackson', 'Jillian', 'Julie', 'John', 'Joel', 'James', 'Jimmy', 'Jackson', 'Jillian', 'Julie', 'Devin'
            ])
        };
    }
    render(){
        return (
            <View style={styles.container}>
                <ScrollView marginTop={64}>
                <Swiper height={240} loop={true} autoplay={true}>
                    <View style={styles.slide}>
                        <Text> abc </Text>
                    </View>
                    <View style={styles.slide}>
                        <Text> def </Text>
                    </View>
                    <View style={styles.slide}>
                        <Text> ghi </Text>
                    </View>
                </Swiper>

                <Text>本周排行</Text>

                <ListView
                    horizontal={true}
                    dataSource={this.state.dataSource}
                    renderRow={(rowData) => <Text>{rowData}</Text>} />
                <Text>本月排行</Text>

                <ListView
                    horizontal={true}
                    dataSource={this.state.dataSource}
                    renderRow={(rowData) => <Text>{rowData}</Text>} />
                <Text>年度排行</Text>

                <ListView
                    horizontal={true}
                    dataSource={this.state.dataSource}
                    renderRow={(rowData) => <Text>{rowData}</Text>} />
                <Text>收费排行</Text>

                <ListView
                    horizontal={true}
                    dataSource={this.state.dataSource}
                    renderRow={(rowData) => <Text>{rowData}</Text>} />
                <Text>热门推荐</Text>

                <ListView
                    horizontal={true}
                    dataSource={this.state.dataSource}
                    renderRow={(rowData) => <Text>{rowData}</Text>} />
                </ScrollView>
            </View>
        );
    }
}

module.exports = Market;