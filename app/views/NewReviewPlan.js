/**
 * Created by slako on 17/06/07.
 */
import React, { Component } from 'react';
import {View, Text, StyleSheet,Image,TouchableOpacity,TextInput,ScrollView,ListView} from "react-native";
import {Actions} from "react-native-router-flux";
import Button from 'apsl-react-native-button'
import GlobleStyles from '../styles/GlobleStyles';

import ImagePicker from "react-native-image-picker";
import TcombForm from "tcomb-form-native";
import DataStore from '../util/DataStore';

var Tform = TcombForm.form.Form;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#BCEE68',
        margin:10
    },
    nameinput:{
        fontSize:16,
        marginTop:10,
        height: 32,
        borderColor: 'gray',
        borderWidth: 2,
        paddingLeft:10,
        paddingRight:10
    },
    briefinput:{
        fontSize:16,
        marginTop:10,
        height: 64,
        borderColor: 'gray',
        borderWidth: 2,
        paddingLeft:10,
        paddingRight:10
    },
    descriptioninput:{
        fontSize:16,
        marginTop:10,
        height: 128,
        borderColor: 'gray',
        borderWidth: 2,
        paddingLeft:10,
        paddingRight:10
    },
    titlecontainer:{

        margin:10,
        justifyContent: 'space-around',
        flexDirection:'row',
    },
    addbutton:{
        marginTop:10,
        height:48,
        backgroundColor: '#FFEE00'
    },
    leftImgStyle:{
        width:80,
        height:80,

    },
    rightImgStyle:{
        width:180,
        height:80,

    },
});

var doCommitNewBookPostUrl = "https://slako.applinzi.com/index.php?m=question&c=personal&a=addbook";

var doCommitPicPostUrl = "https://slako.applinzi.com/index.php?m=attachment&c=attachment&a=upload";

class NewReviewPlan extends Component {

    constructor() {

        super();
        let addcoveruri ={uri:"https://slako.applinzi.com/statics/images/question/util/addcover.png", width: 80, height: 80 };
        let aibinhaoshi=[
            1,24,24,24*2,24*3,24*5,24*8,24*15,
            24*30,24*30*2,24*30*4,24*30*6,24*30*8,24*30*10,24*30*12,
            24*30*14,24*30*16,24*30*18,24*30*20,24*30*22,
            24*30*24,24*30*24,24*30*24,24*30*24,24*30*24,24*30*24
        ];
        var sum=0;
        for(var i=0;i<aibinhaoshi.length;i++){
            sum+=aibinhaoshi[i];
        }
        this.state = {
            plan_data_source:aibinhaoshi,
            datesum:sum
        };

        this._renderPlanItem = this.renderPlanItem.bind(this)
    }



    docommit(){

        let formData = new FormData();
        let file = {uri: this.state.coverSource, type: 'multipart/form-data', name: 'bookcover8080.jpg'};
        formData.append("auth",global.auth);
        formData.append("userid",global.userid);
        formData.append("bookname",this.state.name);
        formData.append("bookbrief",this.state.brief);
        formData.append("bookdescription",this.state.description);
        formData.append("bookcover8080",file);
        var opts = {
            method:"POST",
            headers:{
                'Content-Type':'multipart/form-data',
            },
            body:formData
        }
        fetch(doCommitNewBookPostUrl,opts)
            .then((response) => response.json())
            .then((responseData) => {
                if(responseData.code == 100){

                    Actions.pop();
                }else{
                    alert(global.auth);
                    alert(responseData.message)
                }

            })
            .catch((error) => {
                alert(error)
            })
    }
    renderPlanItem(rowData, sectionID, rowID){
        let time = 0;
        let timestring=null;
        if(rowData >= (24*30*12)){
            time=Math.floor(rowData/(24*30*12));
            timestring="年";
        }else if(rowData >= (24*30)){
            time=Math.floor(rowData/(24*30));
            timestring="月";
        }else if(rowData >= (24)){
            time=Math.floor(rowData/24);
            timestring="日";
        }else{
            time=rowData;
            timestring="时";
        }
        return(
            <View style={styles.titlecontainer}>
                <Text>{parseInt(rowID)+1}</Text>
                <Text>{time} {timestring}</Text>
            </View>
        )
    }

    render(){
        return (
            <View style={[GlobleStyles.withoutTitleContainer,styles.container]}>
                <View style={styles.titlecontainer}>
                    <Text>次数</Text>
                    <Text>离上次时间</Text>
                </View>
                <ScrollView>
                    <ListView
                        style={styles.list}
                        dataSource={DataStore.cloneWithRows(this.state.plan_data_source)}
                        renderRow={this._renderPlanItem}
                        enableEmptySections = {true}
                    />
                </ScrollView>
                <View style={styles.titlecontainer}>
                    <Text>次数</Text>
                    <Text>持续 {Math.floor(this.state.datesum/24)} 天</Text>
                </View>
            </View>
        );
    }
}

module.exports = NewReviewPlan;