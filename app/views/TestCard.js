/**
 * Created by slako on 17/05/28.
 */
import React, { Component ,PropTypes} from 'react';
import {View, Text, StyleSheet,ListView} from "react-native";
import {Actions} from "react-native-router-flux";
import Button from 'apsl-react-native-button'
import GlobleStyles from '../styles/GlobleStyles';

import GridView from 'react-native-grid-view'
import DataStore from '../util/DataStore';

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
    },circle:{
        borderRadius:16,
        height:32,
        width:32,
        margin:4,
        backgroundColor: '#F50000',
        justifyContent: 'center',
        alignItems: 'center',
    },circletext:{
        fontSize:24,
    },
    listView: {
        paddingTop: 10,
        backgroundColor: '#FFC0CB',

    },
});

class TestCard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            answeritem:[{"id":0,"status":1},{"id":1,"status":1},{"id":2,"status":1},{"id":3,"status":1},
                        {"id":4,"status":1},{"id":5,"status":1},{"id":6,"status":1},{"id":7,"status":1},
                {"id":0,"status":1},{"id":1,"status":1},{"id":2,"status":1},{"id":3,"status":1},
                {"id":4,"status":1},{"id":5,"status":1},{"id":6,"status":1},{"id":7,"status":1},],
        };
        this._renderarrstatus = this.renderarrstatus.bind(this);
    }


    renderarrstatus(rowData, sectionID, rowID){
        return(
            <View style={styles.circle}>
                <Text>{rowData.id}</Text>
            </View>
        )
    }


    getresult(){
        Actions.pop({popNum:2});
    }

    render(){
        const {idNumber} = this.props;
        return (
            <View style={[GlobleStyles.withoutTitleContainer,styles.flexendcontainer]}>
                <Text>开始时间：  结束时间：  耗时：</Text>
                <Text>已答：  未答：</Text>
                <GridView
                    items={this.state.answeritem}
                    itemsPerRow={8}
                    renderItem={this._renderarrstatus}
                    style={styles.listView}
                />
                <Button style={styles.submitbutton} textStyle={{fontSize: 16}} onPress={() => this.getresult()} >提交并查看结果</Button>
            </View>
        );
    }
}

TestCard.PropTypes = {
    answerarr:PropTypes.object
};

module.exports = TestCard;
