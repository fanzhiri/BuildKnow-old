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
        fontSize:15,
        marginBottom:10
    },
    bottomTitleStyle:{
        color:'blue'
    },
    list:{
        marginBottom:48
    },
    leftbutton:{
        justifyContent:'space-around',
        marginRight:10,
        alignItems: 'center',
    }

});


var getnotificationlistUrl = "https://slako.applinzi.com/index.php?m=question&c=personal&a=getnotificationlist";

var getiaskfriendlistUrl = "https://slako.applinzi.com/index.php?m=question&c=personal&a=getiaskfriendlist";
//接受
var acceptfriendUrl = "https://slako.applinzi.com/index.php?m=question&c=personal&a=acceptfriend";
//拒绝
var rejectfriendUrl = "https://slako.applinzi.com/index.php?m=question&c=personal&a=rejectfriend";

var httpsBaseUrl = "https://slako.applinzi.com/";

class NotificationList extends Component {

    constructor(props) {

        super(props);

        this.state = {
            netresult:'no',
            notifi_list_data_source: null,
            iask_list_data_source: null,
            selectedIndex:0,

        };
        this._onChange = this.onChange.bind(this);

    }

    fetchnotificationlist(){
        let formData = new FormData();

        formData.append("auth",global.auth);
        formData.append("userid",global.userid);
        var opts = {
            method:"POST",
            body:formData
        }
        fetch(getnotificationlistUrl,opts)
            .then((response) => response.json())
            .then((responseData) => {
                if(responseData.code == 100){
                    this.setState({
                        notifi_list_data_source:responseData.data
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

    fetchiaskfriendlist(){
        let formData = new FormData();

        formData.append("auth",global.auth);
        formData.append("userid",global.userid);
        var opts = {
            method:"POST",
            body:formData
        }
        fetch(getiaskfriendlistUrl,opts)
            .then((response) => response.json())
            .then((responseData) => {
                if(responseData.code == 100){
                    this.setState({
                        iask_list_data_source:responseData.data
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

    fetchacceptfriend(askmsgid){
        let formData = new FormData();

        formData.append("auth",global.auth);
        formData.append("userid",global.userid);
        formData.append("askmsgid",askmsgid);
        var opts = {
            method:"POST",
            body:formData
        }
        fetch(acceptfriendUrl,opts)
            .then((response) => response.json())
            .then((responseData) => {
                if(responseData.code == 100){
                    alert("accept ok");

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

    fetchrejectfriend(askmsgid){
        let formData = new FormData();

        formData.append("auth",global.auth);
        formData.append("userid",global.userid);
        formData.append("askmsgid",askmsgid);
        var opts = {
            method:"POST",
            body:formData
        }
        fetch(rejectfriendUrl,opts)
            .then((response) => response.json())
            .then((responseData) => {
                if(responseData.code == 100){
                    alert("reject ok");

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
                        values={['交友','系统','申请']}
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

            if(this.state.notifi_list_data_source){

                return (this.renderIntroduceView())
            }else{
                this.fetchnotificationlist();
                return (this.renderLoading())
            }

        } else if (this.state.selectedIndex === 1) {
            return (
                this.renderLoading()
            )
        } else if (this.state.selectedIndex === 2) {

            if(this.state.iask_list_data_source){
                return (this.renderIAskView())
            }else{
                this.fetchiaskfriendlist();
                return (this.renderLoading())
            }
        }
    }

    renderLoading(){
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>

        )
    }



    wearefriend(userid){

    }


    renderAskFriend(people){
        var userId = (people.userid);
        var askId = (people.askid);
        return (

            <TouchableOpacity onPress={() => this.wearefriend({userId})}>
                <View style={styles.peopleItem}>
                    <Image source={{uri:`${httpsBaseUrl}${people.head}`}} style={styles.leftImgStyle}/>

                    <View style={styles.leftbutton}>
                        <TouchableOpacity onPress={() => this.fetchacceptfriend(askId)}>
                            <Text >
                                接受{askId}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.fetchrejectfriend(askId)}>
                            <Text >
                                拒绝{askId}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View>
                        <Text style={styles.topTitleStyle}>
                            {people.username}
                        </Text>
                        <Text >
                            请求:{people.content}
                        </Text>
                    </View>
                </View>

            </TouchableOpacity>
        )
    }

    renderIAskView(){
        return (
            <ListView
                style={styles.list}
                dataSource={DataStore.cloneWithRows(this.state.iask_list_data_source)}
                renderRow={(rowData) => this.renderAskFriend(rowData)}
                enableEmptySections = {true}
            />
        )
    }

    renderIntroduceView(){
        return (
            <ListView
                style={styles.list}
                dataSource={DataStore.cloneWithRows(this.state.notifi_list_data_source)}
                renderRow={(rowData) => this.renderAskFriend(rowData)}
                enableEmptySections = {true}
            />
        )
    }
}

module.exports = NotificationList;