/**
 * Created by slako on 17/12/07.
 */
import React, { Component,PropTypes } from 'react';
import {View, Text, StyleSheet, ListView, Image,TouchableOpacity,RefreshControl} from "react-native";
import {Actions} from "react-native-router-flux";
import Button from "react-native-button";
import GlobleStyles from '../styles/GlobleStyles';
import BookItem from '../component/BookItem';
import DataStore from '../util/DataStore';
import {storageSave,storeageGet} from '../util/NativeStore';
import {PicBaseUrl} from '../util/Attributes';
import {checkerrorcode } from '../util/CheckNetError'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    list:{
        marginBottom:0
    },
    listItem:{

        padding:10,
        backgroundColor:'white',
        borderBottomWidth:1,
        borderBottomColor:'#e8e8e8',
        //主轴方向
        flexDirection:'row',
        alignItems: 'center',
        marginRight:2
    },
    rightViewStyle:{
        //主轴对齐方式
        justifyContent:'center'

    },
    leftImgStyle:{
        width:60,
        height:60,
        marginRight:15
    },
    topTitleStyle: {
        fontSize:16,
        marginBottom:10
    },statusText: {
        fontSize: 14,
        justifyContent: 'center',
        color: 'red',
    },
    numText: {
        width:24,
        fontSize: 20,
        marginRight:10,
        justifyContent: 'center',
        color: 'red',
    },
});

let doGetOrganizesUrl = "https://slako.applinzi.com/index.php?m=question&c=organize&a=getorgs";
var httpsBaseUrl = "https://slako.applinzi.com/";

class OrganizeList extends Component {

    constructor(props) {

        super(props);

        this.state = {
            orgs_data_source: null,
            gorefreshing:false,
        };

        this._renderOrgItem = this.renderOrgItem.bind(this);
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.gorefresh == null){
            return;
        }
        this.dofetchOrganizes();
    }

    componentDidMount() {
        this.dofetchOrganizes()
    }

    dofetchOrganizes(){

        let formData = new FormData();
        formData.append("auth",global.auth);
        formData.append("userid",global.userid);
        var opts = {
            method:"POST",
            body:formData
        }
        fetch(doGetOrganizesUrl,opts)
            .then((response) => response.json())
            .then((responseData) => {
                if(responseData.code == 100){
                    this.setState({
                        orgs_data_source:responseData.data
                    })

                }else{
                    checkerrorcode(responseData);
                }

            })
            .catch((error) => {
                alert(error)
            })
    }



    renderOrgsView(){
        if(this.state.orgs_data_source ==null){
            return (this.renderLoading())
        }else{
            return (this.renderOrgs())
        }
    }


    onItemPress(rowData){
        Actions.organization({title:rowData.name,orgid:rowData.id});
    }

    renderOrgItem(rowData, sectionID, rowID){

        return (
            <TouchableOpacity onPress={() => this.onItemPress(rowData)}>
                <View style={styles.listItem}>
                    <Text style={styles.numText}>{parseInt(rowID)+1}</Text>
                    <View style={{marginRight:6}}>
                        <Text style={styles.topTitleStyle}>
                            {rowData.name}
                        </Text>
                        <Text >
                            {rowData.brief}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    renderOrgs(){
        return (
            <ListView
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.gorefreshing}
                        onRefresh={() => this.dofetchOrganizes()}
                    />
                }
                style={styles.list}
                dataSource={DataStore.cloneWithRows(this.state.orgs_data_source)}
                renderRow={this._renderOrgItem}
                enableEmptySections = {true}
            />
        )
    }

    render(){
        return (
            <View style={GlobleStyles.withoutTitleContainer}>
                {this.renderOrgsView()}
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

OrganizeList.PropTypes = {
    inmode: PropTypes.number,//0查看，1选择
}

module.exports = OrganizeList;