/**
 * Created by slako on 17/5/2.
 */
import React, { Component } from 'react';
import {
    TouchableOpacity,
    View,
    Text,
    StyleSheet,
    SegmentedControlIOS,
    ListView,Image
} from "react-native";
import {Actions} from "react-native-router-flux";
import Button from "react-native-button";
import GlobleStyles from '../styles/GlobleStyles';
import {PicBaseUrl} from '../util/Attributes';

import DataStore from '../util/DataStore';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    peopleItem:{

        padding:10,
        backgroundColor:'white',
        borderBottomWidth:0.5,
        borderBottomColor:'#e8e8e8',
        //主轴方向
        flexDirection:'row',
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
    topTitleStyle:{
        fontSize:16,
        marginBottom:4
    },
    bottomTitleStyle:{
        color:'blue'
    },
    list:{
        marginBottom:0
    },
    lastcontent:{
        fontSize:14,
    },
    msgtime:{
        marginTop:8,
        fontSize:10,
    },
    listItem:{

        padding:10,
        backgroundColor:'white',
        borderBottomWidth:1,
        borderBottomColor:'#e8e8e8',
        //主轴方向
        flexDirection:'row',
        alignItems: 'center',
    },
    numText: {
        fontSize: 20,
        marginRight:10,
        justifyContent: 'center',
        color: 'red',
    },segmented:{
        margin:4,
    },
});


var peoplelistUrl = "https://slako.applinzi.com/index.php?m=question&c=index&a=peoplelist";

var httpsBaseUrl = "https://slako.applinzi.com/";

var cvstlistUrl = "https://slako.applinzi.com/index.php?m=question&c=personal&a=checkconversationlist";

var pklistUrl = "https://slako.applinzi.com/index.php?m=question&c=personal&a=mypklist";

class MessageList extends Component {

    constructor(props) {

        super(props);

        this.state = {
            netresult:'no',
            people_list_data_source: null,
            selectedIndex:0,
            cvst_list_data_source: null,//会话列表
            pk_list_data_source: null,//pk列表
            get_pk_list:0

        };
        this._onChange = this.onChange.bind(this);

        this._renderPeople = this.renderPeople.bind(this);
        this._renderPkItem = this.renderPkItem.bind(this);

    }

    fetch_cvstlist(){
        let formData = new FormData();
        formData.append("auth",global.auth);
        formData.append("userid",global.userid);
        var opts = {
            method:"POST",
            body:formData
        }
        fetch(cvstlistUrl,opts)
            .then((response) => response.json())
            .then((responseData) => {
                if(responseData.code == 100){
                    this.setState({
                        cvst_list_data_source:responseData.data
                    })
                }else{
                    alert(responseData.message)
                }

            })
            .catch((error) => {
                alert(error)
            })
    }

    fetch_pklist(){
        let formData = new FormData();
        formData.append("auth",global.auth);
        formData.append("userid",global.userid);
        var opts = {
            method:"POST",
            body:formData
        }
        fetch(pklistUrl,opts)
            .then((response) => response.json())
            .then((responseData) => {
                if(responseData.code == 100){
                    this.setState({
                        pk_list_data_source:responseData.data,
                        get_pk_list:1
                    })
                }else{
                    alert(responseData.message)
                }

            })
            .catch((error) => {
                alert(error)
            })
    }

    onChange(event) {
        this.setState({
            selectedIndex: event.nativeEvent.selectedSegmentIndex,
        });
    }

    render(){
        return (
            <View style={GlobleStyles.withoutTitleContainer}>
                <View>
                    <SegmentedControlIOS
                        values={['会话','做题邀请','需求']}
                        selectedIndex={this.state.selectedIndex}
                        style={styles.segmented}
                        onChange={this._onChange}
                    />
                </View>
                {this.renderSegmentedView()}
            </View>
        );
    }



    renderPkItem(rowData, sectionID, rowID){
        let pkpeople = JSON.parse(rowData.people);
        return(
            <TouchableOpacity onPress={() => Actions.begintest({pkdata:rowData,intype:1})}>
                <View style={styles.listItem}>
                    <Text style={styles.numText}>{parseInt(rowID)+1}</Text>
                    <Image source={{uri:`${httpsBaseUrl}${rowData.cover}`}} style={styles.leftImgStyle}/>
                    <View>
                        <Text style={styles.topTitleStyle}>
                            {rowData.bookname}
                        </Text>

                        <Text >
                            邀请人:{rowData.inviter} 参与人数:{pkpeople.length}
                        </Text>
                        <Text >
                            创建时间:{rowData.time} 题目数量:{rowData.testnum}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    renderpklist(){
        return (
            <ListView
                style={styles.list}
                dataSource={DataStore.cloneWithRows(this.state.pk_list_data_source)}
                renderRow={this._renderPkItem}
                enableEmptySections = {true}
            />
        )
    }

    renderSegmentedView() {
        if (this.state.selectedIndex === 0) {

            if(this.state.cvst_list_data_source){

                return (this.renderIntroduceView())
            }else{
                this.fetch_cvstlist();
                return (this.renderLoading())
            }

        } else if (this.state.selectedIndex === 1) {
            if(this.state.get_pk_list == 0){
                this.fetch_pklist()
                return (this.renderLoading())
            }else{
                if(this.state.pk_list_data_source){
                    return(this.renderpklist())
                }else{
                    return(this.rendernodata())
                }
            }

        } else if (this.state.selectedIndex === 2) {
            return (
                this.renderLoading()
            )
        }
    }

    renderLoading(){
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>

        )
    }

    doOnPress(userid){
        Actions.homepage({userid});
    }



    renderPeople(rowData, sectionID, rowID){
        var dt = new Date(rowData.lastmsgtime * 1000);
        //dt.setTime(rowData.lastmsgtime);
        let cvstName=rowData.nickname;
        if(rowData.peoplenum >= 3){
            cvstName=rowData.name;
        }
        return (

            <TouchableOpacity onPress={() => Actions.chatlist({cvstid:rowData.id,title:cvstName})}>
                <View style={styles.peopleItem}>
                    <Image source={{uri:`${PicBaseUrl}${rowData.head}`}} style={styles.leftImgStyle}/>
                    <View>
                        <Text style={styles.topTitleStyle}>
                            {cvstName}
                        </Text>
                        <Text style={styles.lastcontent}>
                            {rowData.lastmsgcontent}
                        </Text>
                        <Text style={styles.msgtime}>
                            {dt.toDateString()}
                        </Text>

                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    renderIntroduceView(){
        return (
            <ListView
                style={styles.list}
                dataSource={DataStore.cloneWithRows(this.state.cvst_list_data_source)}
                renderRow={this._renderPeople}
                enableEmptySections = {true}
            />
        )
    }

    rendernodata(){
        return (
            <View style={styles.container}>
                <Text>没有朋友</Text>
            </View>
        )
    }
}

module.exports = MessageList;