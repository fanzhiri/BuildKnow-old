/**
 * Created by slako on 17/06/13.
 */
import React, { Component,PropTypes } from 'react';
import {View, Text, StyleSheet,Image,TouchableOpacity,TextInput,ScrollView,ListView} from "react-native";
import {Actions} from "react-native-router-flux";

import GlobleStyles from '../styles/GlobleStyles';
import DataStore from '../util/DataStore';
import Icon from 'react-native-vector-icons/Ionicons';


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
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
    imgcontainer:{
        width:360,
        marginTop:10,
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

    },listItem: {
        flex: 1,
        height: 48,
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 16,
        paddingRight: 25,
        borderBottomColor: '#c4c4c4',
        borderBottomWidth: 1
    },
    peopleItem:{

        padding:10,
        backgroundColor:'white',
        borderBottomWidth:0.5,
        borderBottomColor:'#e8e8e8',
        //主轴方向
        flexDirection:'row',
        alignItems: 'center',
    },okbutton:{

        height:30,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#AEE00E'
    },twobutton:{
        flex:1
    },
    selectbutton:{
        flex:1,
        flexDirection:'row',
        justifyContent: 'flex-end',
    },
    submitbutton:{

        height:30,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#AEE00E'
    },
});

var doCommitNewBookPostUrl = "https://slako.applinzi.com/index.php?m=question&c=personal&a=addbook";

var doNewPkUrl = "https://slako.applinzi.com/index.php?m=question&c=personal&a=newpk";

var getFriendUrl = "https://slako.applinzi.com/index.php?m=question&c=personal&a=getfriendlist";

var httpsBaseUrl = "https://slako.applinzi.com/";

class NewCompetition extends Component {

    constructor() {

        super();

        this.state = {
            competitionpeople_data_source: null,
            friend_data_source: null,
            selectpeople:0,
            whoinselect:null,
            getdata:0,
            friendsize:0
        };

        this._renderPeopleItem = this.renderPeopleItem.bind(this)
    }



    fetchfriendlist(){

        let formData = new FormData();
        formData.append("auth",global.auth);
        formData.append("userid",global.userid);
        var opts = {
            method:"POST",
            body:formData
        }
        fetch(getFriendUrl,opts)
            .then((response) => response.json())
            .then((responseData) => {
                if(responseData.code == 100){
                    let whoinselect_arr = null;
                    if(responseData.data == null){

                    }else{
                        whoinselect_arr= new Array([responseData.data.length]);
                    }

                    this.setState({
                        friend_data_source:responseData.data,
                        getdata:1,
                        whoinselect:whoinselect_arr,
                        friendsize:responseData.data.length
                    })
                }else{
                    alert(responseData.message)
                }

            })
            .catch((error) => {
                alert(error)
            })
    }


    rendertake(where){
        if(this.state.selectpeople == 1){
            if(this.state.whoinselect[where] == 1){
                return(
                    <Icon name={"md-checkbox-outline"}  size={22} color="#008B00"/>
                )
            }else{
                return(
                    <Icon name={"md-expand"}            size={22} color="#008B00"/>
                )
            }
        }


    }

    changeselect(where){
        let t_whoinselect = this.state.whoinselect;
        t_whoinselect[where] = (t_whoinselect[where] == 1)?0:1;
        this.setState({
            whoinselect:t_whoinselect,
        })
    }

    renderPeopleItem(rowData, sectionID, rowID){
        return(
            <View style={styles.peopleItem} >
                <Image source={{uri:`${httpsBaseUrl}${rowData.head}`}} style={styles.leftImgStyle}/>
                <View>
                    <Text style={styles.topTitleStyle}>
                        {rowData.nickname}
                    </Text>
                </View>
                <TouchableOpacity style={styles.selectbutton} onPress={() => this.changeselect(rowID)}>
                    {this.rendertake(rowID)}
                </TouchableOpacity>

            </View>
        )
    }

    renderAllPeoples(){
        if(this.state.competitionpeople_data_source){
            return (
                <ListView
                    style={styles.list}
                    dataSource={DataStore.cloneWithRows(this.state.competitionpeople_data_source)}
                    renderRow={this._renderPeopleItem}
                    enableEmptySections = {true}
                />
            )
        }

    }

    addPeople(){
        this.setState({
            selectpeople:1,
        })
    }

    endSelectPeople(what){
        if(what == 2){
            let t_selectfriend = new Array();
            for(let i=0;i<this.state.friendsize;i++){
                if(this.state.whoinselect[i]== 1){
                    t_selectfriend.push(this.state.friend_data_source[i]);
                }
            }
            this.setState({
                competitionpeople_data_source:t_selectfriend,
                selectpeople:0,
            })
        }else (
            this.setState({
                selectpeople:0,
            })
        )

    }

    renderselectpeople(){
        return(
            <View>
                <View style={{flexDirection:'row',height:32,justifyContent: 'center',}}>
                    <Text>添加对战人员</Text>
                </View>
                <View style={{flexDirection:'row',height:32,justifyContent: 'space-around',}}>
                    <TouchableOpacity onPress={() => this.endSelectPeople(1)} activeOpacity={0.8}>
                        <View  style={[styles.okbutton,styles.twobutton]}>
                            <Text>取消</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.endSelectPeople(2)} activeOpacity={0.8}>
                        <View  style={[styles.okbutton,styles.twobutton]}>
                            <Text>确定</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <ListView
                    style={styles.list}
                    dataSource={DataStore.cloneWithRows(this.state.friend_data_source)}
                    renderRow={this._renderPeopleItem}
                    enableEmptySections = {true}
                />
            </View>
        )
    }

    renderinpos(){
        return(
            <ScrollView>
                {this.renderAllPeoples()}
                <TouchableOpacity style={styles.listItem} onPress={() => this.addPeople()} activeOpacity={0.8}>
                        <Icon name={"md-add-circle"} size={22} color="#008B00"/>
                        <Text>添加</Text>
                </TouchableOpacity>
            </ScrollView>
        )
    }

    renderinselect(){
        if(this.state.selectpeople == 0){
            return(this.renderinpos())
        }else{
            if(this.state.getdata == 0){
                this.fetchfriendlist()
                return(this.renderLoading())
            }else{
                if(this.state.friend_data_source == null){
                    return(this.rendernodata())
                }else{
                    return(this.renderselectpeople())
                }
            }

        }
    }

    applypk(){
        let formData = new FormData();
        formData.append("auth",global.auth);
        formData.append("userid",global.userid);
        formData.append("bookid",this.props.bookid);
        var opts = {
            method:"POST",
            body:formData
        }
        fetch(doNewPkUrl,opts)
            .then((response) => response.json())
            .then((responseData) => {
                if(responseData.code == 100){
                    alert("ok")
                }else{
                    alert(responseData.message)
                }

            })
            .catch((error) => {
                alert(error)
            })
    }

    renderpkbutton(){
        if(this.state.selectpeople == 1){

        }else{
            return(
                <TouchableOpacity onPress={() => this.applypk()} activeOpacity={0.8}>
                    <View  style={styles.submitbutton}>
                        <Text>申请pk</Text>
                    </View>
                </TouchableOpacity>
            )
        }
    }

    render(){
        return (
            <View style={GlobleStyles.withoutTitleContainer}>
                {this.renderinselect()}
                <View style={{justifyContent: 'flex-end'}}>
                    {this.renderpkbutton()}
                </View>
            </View>
        );
    }

    renderLoading(){
        return (
            <View style={styles.container}>
                <Text>加载中...</Text>
            </View>

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

NewCompetition.PropTypes = {
    bookid:PropTypes.number,
};

module.exports = NewCompetition;