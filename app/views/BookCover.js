/**
 * Created by slako on 17/2/18.
 */
import React, { Component } from 'react';
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
    getInitialState() {
        return {
            selectedIndex: 0,
        };
    }
    _onChange(event) {
        this.setState({
            selectedIndex: event.nativeEvent.selectedSegmentIndex,
        });
    }
    render(){
        return (
            <View style={GlobleStyles.withoutTitleContainer}>
                <View marginTop={10} style={styles.container1}>
                    <View>
                        <Image style={styles.image} source={require('../image/carousel/1.jpg')}/>
                    </View>
                    <View style={styles.container2}>
                        <Text>历史人物</Text>
                        <Text>100个国家400位领导人</Text>
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
                <View>
                    {/*<Router>*/}
                        {/*<Scene key="bookintroduce"component={BookIntroduce} duration={0} initial={true}/>*/}
                        {/*<Scene key="bookdiscuss"  component={BookDiscuss} duration={0} />*/}
                        {/*<Scene key="bookhistory"  component={BookHistory} duration={0} />*/}
                    {/*</Router>*/}
                </View>

            </View>
        );
    }
}

module.exports = BookCover;