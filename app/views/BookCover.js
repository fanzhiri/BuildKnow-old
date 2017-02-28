/**
 * Created by slako on 17/2/18.
 */
import React, { Component ,PropTypes} from 'react';
import {View, Text, Image, StyleSheet, SegmentedControlIOS} from "react-native";

import Button from "react-native-button";
import {
    Scene,
    Reducer,
    Router,
    Switch,
    Modal,
    Actions,
    ActionConst,
} from 'react-native-router-flux';

import BookIntroduce from './BookIntroduce'
import BookDiscuss from './BookDiscuss'
import BookHistory from './BookHistory'

import GlobleStyles from '../styles/GlobleStyles';


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    container1: {
        marginTop:10,
        marginLeft:10,
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
    segmented:{
        marginTop:10,
        width:240,
        alignSelf:'center'
    }
});

class BookCover extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedIndex:0
        };
        this._onChange = this._onChange.bind(this)
        this._handlePress = this._handlePress.bind(this)
    }

    _onChange(event) {
        this.setState({
            selectedIndex: event.nativeEvent.selectedSegmentIndex,
        });
    }
    _handlePress(event) {

    }

    render(){
        const {rowID} = this.props;
        return (
            <View style={GlobleStyles.withoutTitleContainer}>
                <View marginTop={10} style={styles.container1}>
                    <View>
                        <Image style={styles.image} source={require('../image/market/carousel/1.jpg')}/>
                    </View>
                    <View style={styles.container2}>
                        <Text>历史人物</Text>
                        <Text>{rowID}</Text>
                        <Text>100个国家400位领导人</Text>
                        <Button style={{fontSize: 16,color: 'green' ,width:38,height:24, overflow:'hidden', borderRadius:4, backgroundColor: 'red'}} onPress={() => this._handlePress()}>获取</Button>
                    </View>
                </View>
                <View>
                    <SegmentedControlIOS
                        values={['介绍','评论','历史']}
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
            <Text>IntroduceView</Text>
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

BookCover.PropTypes = {
    rowID: PropTypes.number,
};

module.exports = BookCover;