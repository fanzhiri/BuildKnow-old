/**
 * Created by slako on 17/5/10.
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
import Button from "apsl-react-native-button";
import GlobleStyles from '../styles/GlobleStyles';


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
        width:68,
        height:68,
        marginRight:15
    },
    topTitleStyle:{
        fontSize:15,
        marginBottom:10
    },
    bottomTitleStyle:{
        color:'blue'
    },
    list:{
        marginBottom:48
    },
    passbutton:{
        width:48,
        height:24,
        backgroundColor: '#00EE00'
    },
    rejectbutton:{
        width:48,
        height:24,
        backgroundColor: '#FF0000'
    },leftbuttonContainer1:{
        flex:1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginLeft:4,
        alignItems: 'center',
    },leftbuttonContainer2:{
        justifyContent: 'space-around',
        alignItems: 'center',
    }

});


var peoplelistUrl = "https://slako.applinzi.com/index.php?m=question&c=index&a=peoplelist";
var doverifyregisterListUrl = "https://slako.applinzi.com/index.php?m=question&c=personal&a=reviewregisterlist";
var httpsBaseUrl = "https://slako.applinzi.com/";


var doPassRegisterUrl = "https://slako.applinzi.com/index.php?m=member&c=member_verify&a=pass";
var doRejectRegisterUrl = "https://slako.applinzi.com/index.php?m=member&c=member_verify&a=reject";

class RegisterVerify extends Component {

    constructor(props) {

        super(props);

        this.state = {
            netresult:'no',
            people_list_data_source: null,
            selectedIndex:0,

        };
        this._onChange = this.onChange.bind(this);
        this._peoplelist = this.peoplelist.bind(this);
        this._renderPeople = this.renderPeople.bind(this);

    }

    peoplelist(){
        let formData = new FormData();
        formData.append("api","true");
        formData.append("auth",global.auth);
        formData.append("userid",global.userid);
        formData.append("adminid",global.adminid);
        var opts = {
            method:"POST",
            body:formData
        }
        fetch(doverifyregisterListUrl,opts)
            .then((response) => response.json())
            .then((responseData) => {
                if(responseData.code == 100){
                    this.setState({
                        people_list_data_source:responseData.data
                    })
                }else{
                    this.setState({
                        netresult:responseData.code
                    })
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
                        values={['等待','审核中','审完']}
                        selectedIndex={this.state.selectedIndex}
                        style={styles.segmented}
                        onChange={this._onChange}
                    />
                </View>
                {this.renderSegmentedView()}
            </View>
        );
    }

    renderSegmentedView() {
        if (this.state.selectedIndex === 0) {

            if(this.state.people_list_data_source){

                return (this.renderIntroduceView())
            }else{
                this._peoplelist();
                return (this.renderLoading())
            }

        } else if (this.state.selectedIndex === 1) {
            return (
                this.renderLoading()
            )
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

    fetchpass(verifyid){
        this.fetchgroup(verifyid, doPassRegisterUrl);
    }

    fetchreject(verifyid){
        this.fetchgroup(verifyid, doRejectRegisterUrl);
    }

    fetchgroup(verifyid,url){
        let formData = new FormData();
        formData.append("auth",global.auth);
        formData.append("adminid",global.adminid);
        formData.append("userid",verifyid);
        formData.append("api","true");

        var opts = {
            method:"POST",
            body:formData
        }
        fetch(url,opts)
            .then((response) => response.json())
            .then((responseData) => {
                if(responseData.code == 100){
                    this._peoplelist();
                }else{

                }

            })
            .catch((error) => {
                alert(error)
            })
    }

    renderControlButton(verifyid){

        return(
            <View style={styles.leftbuttonContainer1}>
                <View style={styles.leftbuttonContainer2}>
                    <Button style={styles.passbutton} textStyle={{fontSize: 12}} onPress={() => this.fetchpass(verifyid) }>通过</Button>

                    <Button style={styles.rejectbutton} textStyle={{fontSize: 12}} onPress={() => this.fetchpass(verifyid) }>拒绝</Button>
                </View>

            </View>
        )


    }

    renderPeople(people){

        return (


            <View style={styles.peopleItem}>
                <Image source={{uri:`${httpsBaseUrl}${people.head}`}} style={styles.leftImgStyle}/>
                <View>
                    <Text style={styles.topTitleStyle}>
                        {people.username}
                    </Text>
                    <Text >
                        邮件:{people.email}
                    </Text>
                </View>
                {this.renderControlButton(people.userid)}
            </View>

        )
    }

    renderIntroduceView(){
        return (
            <ListView
                style={styles.list}
                dataSource={DataStore.cloneWithRows(this.state.people_list_data_source)}
                renderRow={(rowData) => this._renderPeople(rowData)}
                enableEmptySections = {true}
            />
        )
    }
}

module.exports = RegisterVerify;