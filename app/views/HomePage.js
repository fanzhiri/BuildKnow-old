/**
 * Created by slako on 17/2/18.
 */

import React, { Component ,PropTypes} from 'react';
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
    constructor(props) {
        super(props);

    }

    render(){
        const {userId} = this.props;
        return (
            <View style={GlobleStyles.withoutTitleContainer}>
                <ParallaxScrollView
                    backgroundColor="blue"
                    contentBackgroundColor="pink"
                    parallaxHeaderHeight={200}
                    renderForeground={() => (
                    <View style={{ height: 200, flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <Text>Hello World!</Text>
                    </View>
                    )}>
                    <View style={{ height: 500 }}>
                        <Text>Scroll me</Text>
                        <Text>{userId}</Text>
                        <Text>abc</Text>
                    </View>
                </ParallaxScrollView>
            </View>

        );
    }
}

HomePage.PropTypes = {
    userId: PropTypes.string,
};


module.exports = HomePage;