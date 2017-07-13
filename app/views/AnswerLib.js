/**
 * Created by slako on 17/2/18.
 */
import React, { Component } from 'react';
import {View, Text, StyleSheet,TouchableOpacity,SegmentedControlIOS,ListView,RefreshControl} from "react-native";
import {Actions} from "react-native-router-flux";
import GlobleStyles from '../styles/GlobleStyles';
import DataStore from '../util/DataStore';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    listItem: {
        flex: 1,
        height: 48,
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 25,
        paddingRight: 25,
        borderBottomColor: '#c4c4c4',
        borderBottomWidth: 1
    },

});

var checkAnswerListUrl = "https://slako.applinzi.com/index.php?m=question&c=personal&a=checkanswerlist";

class AnswerLib extends Component {

    constructor(props) {

        super(props);

        this.state = {

            myanswerlib_list_data_source: null,
            marketanswerlib_list_data_source: null,
            selectedIndex:0,
            gorefreshing:false,
        };
        this._onChange = this.onChange.bind(this);

        this._renderItem = this.renderItem.bind(this)  //该函数是在listview里面使用，必须是bind过的，不然item中的onpress就接受不了函数了
    }

    onChange(event) {
        this.setState({
            selectedIndex: event.nativeEvent.selectedSegmentIndex,
        });
    }


    fetchAnswerLibList(where){

        let formData = new FormData();
        formData.append("auth",global.auth);
        formData.append("userid",global.userid);
        formData.append("where",where);
        var opts = {
            method:"POST",
            body:formData
        }
        fetch(checkAnswerListUrl,opts)
            .then((response) => response.json())
            .then((responseData) => {
                if(responseData.code == 100){
                    if(where == 0){
                        //alert(responseData.message);
                        this.setState({
                            myanswerlib_list_data_source:responseData.data,
                        })
                    }else if(where == 1){
                        this.setState({
                            marketanswerlib_list_data_source:responseData.data,
                        })
                    }

                }else{
                }
            })
            .catch((error) => {
                alert(error)
            })
    }

    onItemClickIt(rowData){
        Actions.answerlibedit({answerlibdata:rowData});
    }

    renderItem(rowData){
        return(
            <TouchableOpacity
                onPress={() => (this.onItemClickIt(rowData))}
                activeOpacity={0.8}
            >
                <View style={styles.listItem}>
                    <Text style={{color:"#0000FF", fontSize: 14}}>{rowData.name}</Text>
                    <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end', alignItems:'center'}}>
                        <Text style={{color: "#ccc"}}>个数：{rowData.num}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    renderAnswerLibView(where){

        var datasource = null;

        if(where == 0){
            datasource=this.state.myanswerlib_list_data_source;
        }else if(where == 1){
            datasource=this.state.marketanswerlib_list_data_source;
        }

        return(
            <ListView
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.gorefreshing}
                        onRefresh={() => this.fetchAnswerLibList(where)}
                    />
                }
                style={styles.list}
                dataSource={DataStore.cloneWithRows(datasource)}
                renderRow={this._renderItem}
                enableEmptySections = {true}
            />
        )
    }

    renderSelectView(){

        if (this.state.selectedIndex == 0) {
            if(this.state.myanswerlib_list_data_source){
                return (this.renderAnswerLibView(0))
            }else{
                this.fetchAnswerLibList(0);
                return (this.renderLoading())
            }

        } else if (this.state.selectedIndex == 1) {
            if(this.state.marketanswerlib_list_data_source){
                return (this.renderAnswerLibView(1))
            }else{
                this.fetchAnswerLibList(1);
                return (this.renderLoading())
            }
        }

    }

    render(){
        return (
            <View style={GlobleStyles.withoutTitleContainer}>
                <View>
                    <SegmentedControlIOS
                        values={['自己','市场']}
                        selectedIndex={this.state.selectedIndex}
                        style={styles.segmented}
                        onChange={this._onChange}
                    />
                </View>
                {this.renderSelectView()}
            </View>
        );
    }

    renderLoading(){
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>

        )
    }
}

module.exports = AnswerLib;