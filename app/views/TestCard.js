/**
 * Created by slako on 17/05/28.
 */
import React, { Component ,PropTypes} from 'react';
import {View, Text, StyleSheet} from "react-native";
import {Actions} from "react-native-router-flux";
import Button from 'apsl-react-native-button'
import GlobleStyles from '../styles/GlobleStyles';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    flexendcontainer:{
        justifyContent: 'flex-end',
        marginBottom:6,
        flex:1
    },submitbutton:{
        height:28,
        backgroundColor: '#00FF7F',
    }
});

class TestCard extends Component {

    constructor(props) {
        super(props);
    }

    render(){
        const {idNumber} = this.props;
        return (
            <View style={[GlobleStyles.withoutTitleContainer,styles.flexendcontainer]}>
                <Button style={styles.submitbutton} textStyle={{fontSize: 16}} onPress={() => this.getresult()} >提交并查看结果</Button>
            </View>
        );
    }
}

TestCard.PropTypes = {

};

module.exports = TestCard;
