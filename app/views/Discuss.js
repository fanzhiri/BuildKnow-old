/**
 * Created by slako on 17/9/18.
 */
import React, { Component ,PropTypes} from 'react';
import {View, Text, StyleSheet, ListView, Image,TouchableOpacity,RefreshControl} from "react-native";
import {Actions} from "react-native-router-flux";
import Button from "react-native-button";
import GlobleStyles from '../styles/GlobleStyles';
import Icon from 'react-native-vector-icons/Ionicons';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    headimage: {
        width: 24,
        height: 24,
    },
});

var doGetDiscussUrl = "https://slako.applinzi.com/index.php?m=question&c=personal&a=getdiscuss";

import DataStore from '../util/DataStore';


class Disscuss extends Component {

    constructor(props) {
        super(props);
        this.state = {
            discuss_data_source: null,
            get_disscuss_data:0,
            gorefreshing:false,
        };
        this._renderDiscussItem = this.renderDiscussItem.bind(this)
    }

    dofetch_discuss(){

        let formData = new FormData();
        formData.append("auth",global.auth);
        formData.append("userid",global.userid);
        formData.append("discusstype",this.props.intype);
        if(this.props.intype == 2){
            formData.append("discussid",this.props.qst_id);
        }

        var opts = {
            method:"POST",
            body:formData
        }
        fetch(doGetDiscussUrl,opts)
            .then((response) => response.json())
            .then((responseData) => {
                if(responseData.code == 100){
                    this.setState({
                        discuss_data_source:responseData.data,
                        get_disscuss_data:1
                    })
                }else{
                    alert(responseData.message);
                    this.setState({
                        get_disscuss_data:2
                    })
                }

            })
            .catch((error) => {
                alert(error)
            })
    }

    renderDiscussItem(rowData, sectionID, rowID){
        let imgUri=rowData.head;
        let iconColor = "#FF0000";
        return(
            <View>
                <View style={{height:24,flexDirection:"row",alignItems:"center"}}>
                    <Image style={styles.headimage} resizeMode="cover" source={{uri:imgUri}}></Image>
                    <Text>{rowData.nickname}</Text>
                    <View style={{flexDirection:"row",justifyContent:"flex-end",alignItems:"center"}}>
                        <Icon name="ios-flame" size={22} color={iconColor}/>
                    </View>
                </View>
                <View>
                    <Text>
                        {rowData.content}
                    </Text>
                </View>
            </View>
        )
    }

    renderDiscuss(){
        return(
            <ListView
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.gorefreshing}
                        onRefresh={() => this.dofetch_disscuss()}
                    />
                }
                style={styles.list}
                dataSource={DataStore.cloneWithRows(this.state.discuss_data_source)}
                renderRow={this._renderDiscussItem}
                enableEmptySections = {true}
            />
        )
    }

    renderPage(){
        if(this.state.get_disscuss_data == 0){
            this.dofetch_discuss();
            return (this.renderLoading());
        }else{
            if(this.state.discuss_data_source != null){
                return(this.renderDiscuss())
            }else{
                return (this.rendernodata())
            }

        }
    }

    writeComment(){
        Actions.comment({intype:this.props.intype,commentid:this.props.qst_id});
    }

    render(){

        return (
            <View style={GlobleStyles.withoutTitleContainer}>
                {this.renderPage()}
                <View style={{flex:1,justifyContent:"flex-end"}}>

                    <TouchableOpacity onPress={ () =>this.writeComment()} activeOpacity={0.8}>
                        <View style={{flexDirection:'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height:32,
                        backgroundColor: '#00EE00'}}  >
                            <Text style={{fontSize: 18}}>
                                写评论
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
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

    rendernodata(){
        return (
            <View style={styles.container}>
                <Text>没有数据</Text>
            </View>
        )
    }
}

Disscuss.PropTypes = {
    intype:PropTypes.number,//0发布的书目、1未发布的书目、2题目
    qst_id:PropTypes.number,
};

module.exports = Disscuss;
