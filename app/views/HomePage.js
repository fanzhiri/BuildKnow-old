/**
 * Created by slako on 17/2/18.
 */
import React, { Component } from 'react';
import {View, Text, StyleSheet} from "react-native";
import {Actions} from "react-native-router-flux";
import Button from "react-native-button";
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import GlobleStyles from '../styles/GlobleStyles';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },

});

class HomePage extends Component {
    render(){
        return (
            <View style={GlobleStyles.withoutTitleContainer}>
                <ParallaxScrollView
                    backgroundColor="blue"
                    contentBackgroundColor="pink"
                    parallaxHeaderHeight={300}
                    renderForeground={() => (
                    <View style={{ height: 300, flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <Text>Hello World!</Text>
                    </View>
                    )}>
                    <View style={{ height: 500 }}>
                        <Text>Scroll me</Text>
                    </View>
                </ParallaxScrollView>
            </View>

        );
    }
}

module.exports = HomePage;