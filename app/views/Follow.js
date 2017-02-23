/**
 * Created by slako on 17/2/18.
 */
import React, { Component } from 'react';
import {View, Text, StyleSheet, SegmentedControlIOS, ListView} from "react-native";
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

});

class Follow extends Component {
    constructor(props) {
        super(props);
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            dataSource: ds.cloneWithRows(['row 1', 'row 2','row 3', 'row 4']),
            selectedIndex:0
        };
        this._onChange = this._onChange.bind(this)
    }

    _onChange(event) {
        this.setState({
            selectedIndex: event.nativeEvent.selectedSegmentIndex,
        });
    }
    render(){
        return (
            <View style={GlobleStyles.withoutTitleContainer}>
                <View>
                    <SegmentedControlIOS
                        values={['个人','组织','公司']}
                        selectedIndex={this.state.selectedIndex}
                        style={styles.segmented}
                        onChange={this._onChange}
                    />
                </View>
                {this.renderSegmentedView()}
            </View>
        );
    }
    renderSegmentedView() {
        if (this.state.selectedIndex === 0) {
            return (
                this.renderIntroduceView()
            )
        } else if (this.state.selectedIndex === 1) {
            return (
                this.renderDiscussView()
            )
        } else if (this.state.selectedIndex === 2) {
            return (
                this.renderHistoryView()
            )
        }
    }

    renderIntroduceView(){
        return (
            <ListView
                dataSource={this.state.dataSource}
                renderRow={(rowData) => <Text>{rowData}</Text>}
            />
        )
    }

    renderDiscussView(){
        return (
            <Text>Discuss</Text>
        )
    }

    renderHistoryView(){
        return (
            <Text>History</Text>
        )
    }
}

module.exports = Follow;