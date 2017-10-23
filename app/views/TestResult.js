/**
 * Created by slako on 17/4/30.
 */
import React, { Component,PropTypes } from 'react';
import {View, Text, StyleSheet,ListView,TouchableOpacity,RefreshControl} from "react-native";
import {Actions} from "react-native-router-flux";
import Button from 'apsl-react-native-button'
import GlobleStyles from '../styles/GlobleStyles';
import DataStore from '../util/DataStore';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },beginButton:{
        width:window.width,
        backgroundColor: '#00EE00'
    },
    textdesc:{
        fontSize:24,
        marginTop:12
    },
    buttonContainer:{
        flex: 1,
        justifyContent: 'flex-end',
    },
    saveContainer:{
        flexDirection:'row',
        justifyContent: 'space-around',
    },
    saveButton:{
        width:100,
        backgroundColor: '#00EE00'
    },

});

var doGetBookTestRecordUrl = "https://slako.applinzi.com/index.php?m=question&c=personal&a=getbooktestrecord";

class TestResult extends Component {

    constructor(props) {
        super(props);

        this.state = {

            testrecord_data_source:null,
            getdata:0,
            gorefreshing:false
        };
        this._renderRecordItem = this.renderRecordItem.bind(this);

    }

    doFetchBookTestRecord(){
        let formData = new FormData();
        formData.append("auth",global.auth);
        formData.append("userid",global.userid);
        formData.append("bookid",this.props.bookid);

        var opts = {
            method:"POST",
            body:formData
        }
        fetch(doGetBookTestRecordUrl,opts)
            .then((response) => response.json())
            .then((responseData) => {
                if(responseData.code == 100){

                    this.setState({
                        testrecord_data_source:responseData.data,
                        getdata:1
                    })

                }else{
                    alert(responseData.message)
                    this.setState({
                        getdata:1
                    })
                }

            })
            .catch((error) => {
                alert(error)
            })
    }

    renderRecordItem(rowData,sectionID, rowID){
        let time_o = new Date();
        time_o.setMilliseconds(rowData.begintime);
        let time_t = time_o.toLocaleString();
        return(
            <View style={{
                height:32,
                borderBottomWidth:1,
                borderBottomColor:'#e464e4',
                flexDirection:"row",
                alignItems:"center"
                }}>
                <Text>得分:{rowData.score}  </Text>
                <Text>题数:{rowData.qstnum}  </Text>
                <Text>开始:{time_t}  </Text>
                <Text>耗时:{rowData.taketime}  </Text>
            </View>
        )
    }

    renderPage(){
        if(this.state.getdata == 0){
            this.doFetchBookTestRecord();
            return(this.renderLoading())
        }else{
            if(this.state.testrecord_data_source == null){
                return(this.rendernodata())
            }else{
                return(this.renderRecordList())
            }
        }
    }

    render(){
        return (
            <View style={GlobleStyles.withoutTitleContainer}>
                {this.renderPage()}
            </View>
        )
    }

    renderRecordList(){
        return (
            <ListView
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.gorefreshing}
                        onRefresh={() => this.doFetchBookTestRecord()}
                    />
                }
                style={{flex:1}}
                dataSource={DataStore.cloneWithRows(this.state.testrecord_data_source)}
                renderRow={this._renderRecordItem}
                enableEmptySections = {true}
            />

        );
    }

    renderLoading(){
        return (
            <Text>Loading ...</Text>
        )
    }

    rendernodata(){
        return (
            <Text>没有数据</Text>
        )
    }
}

TestResult.PropTypes = {
    bookid: PropTypes.number,
};

module.exports = TestResult;