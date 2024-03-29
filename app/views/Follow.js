/**
 * Created by slako on 17/2/18.
 */
import React, { Component } from 'react';
import {
    TouchableOpacity,
    View,
    Text,
    StyleSheet,
    SegmentedControlIOS,
    RefreshControl,
    ListView,Image
} from "react-native";
import {Actions} from "react-native-router-flux";
import Button from "react-native-button";
import GlobleStyles from '../styles/GlobleStyles';
import DataStore from '../util/DataStore';

import EmptyData from '../component/EmptyData';
import LoadingData from '../component/LoadingData';

const styles = StyleSheet.create({
    container: {

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
        marginBottom:80
    },
    segmented:{
        margin:4,
    },
});

var peoplelistUrl = "https://slako.applinzi.com/index.php?m=question&c=index&a=peoplelist";

var getFollowUrl = "https://slako.applinzi.com/index.php?m=question&c=personal&a=getfollowperson";

var getFrieldUrl = "https://slako.applinzi.com/index.php?m=question&c=personal&a=getfriendlist";



import {PicBaseUrl} from '../util/Attributes';

class Follow extends Component {


    constructor(props) {

        super(props);

        this.state = {
            netresult:'no',
            people_list_data_source: null,
            friend_list_data_source: null,
            selectedIndex:0,
            gorefreshing:false,
            get_people_data:null,
            get_friend_data:null,
        };
        this._onChange = this.onChange.bind(this);
        this._peoplelist = this.peoplelist.bind(this);
        this._renderPeople = this.renderPeople.bind(this);
        this._doOnPress = this.doOnPress.bind(this);

    }

    fetchfriendlist(){

        let formData = new FormData();
        formData.append("auth",global.auth);
        formData.append("userid",global.userid);
        var opts = {
            method:"POST",
            body:formData
        }
        fetch(getFrieldUrl,opts)
            .then((response) => response.json())
            .then((responseData) => {
                if(responseData.code == 100){
                    this.setState({
                        friend_list_data_source:responseData.data,
                        gorefreshing:false,
                        get_friend_data:1
                    })

                }else{
                    this.setState({
                        netresult:responseData.code,
                        get_friend_data:2
                    })
                }

            })
            .catch((error) => {
                alert(error)
            })
    }

    peoplelist(){

        let formData = new FormData();
        formData.append("auth",global.auth);
        formData.append("userid",global.userid);
        var opts = {
            method:"POST",
            body:formData
        }
        fetch(getFollowUrl,opts)
            .then((response) => response.json())
            .then((responseData) => {
                if(responseData.code == 100){
                    this.setState({
                        people_list_data_source:responseData.data,
                        gorefreshing:false,
                        get_people_data:1,
                    })

                }else{
                    this.setState({
                        get_people_data:2,
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
                        values={['好友','个人','组织','公司']}
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
        if (this.state.selectedIndex === 1) {

            if(this.state.people_list_data_source){
                return (this.renderIntroduceView())
            }else{
                if(this.state.get_people_data == null ){
                    this._peoplelist();
                    return (this.renderLoading())
                }else{
                    return (this.rendernodata())
                }
            }

        } else if (this.state.selectedIndex === 0) {
            if(this.state.friend_list_data_source){
                return (this.renderFriendView())
            }else{
                if(this.state.get_friend_data == null ){
                    this.fetchfriendlist();
                    return (this.renderLoading())
                }else{
                    return (this.rendernodata())
                }
            }
        } else if (this.state.selectedIndex === 2) {
            return (
                <EmptyData/>
            )
        } else if (this.state.selectedIndex === 3) {
            return (
                <EmptyData/>
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

    renderPeople(rowData,sectionID, rowID){
        var userId = (rowData.userid);
        return (

            <TouchableOpacity onPress={() => Actions.homepage({userId:userId,title:rowData.nickname,peopledata:rowData})}>
                <View style={styles.peopleItem}>
                    <Image source={{uri:`${PicBaseUrl}${rowData.head}`}} style={styles.leftImgStyle}/>
                    <View>
                        <Text style={styles.topTitleStyle}>
                            {rowData.nickname}
                        </Text>
                        <Text >
                            粉丝:{rowData.follow}  在建:{rowData.buildingshare}  发布:{rowData.releaseshare}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
/*
    refreshControl={
<RefreshControl
refreshing={this.state.gorefreshing}
onRefresh={this._peoplelist()}
/>
}
*/
    rankList(){

    }

    renderFriendView(){
        return (
            <View>
                <ListView
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.gorefreshing}
                            onRefresh={() => this.fetchfriendlist()}
                        />
                    }
                    style={styles.list}
                    dataSource={DataStore.cloneWithRows(this.state.friend_list_data_source)}
                    renderRow={(rowData) => this._renderPeople(rowData)}
                    enableEmptySections = {true}
                />
            </View>

        )
    }

    renderIntroduceView(){
        return (
            <View>

                <ListView
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.gorefreshing}
                            onRefresh={() => this._peoplelist()}
                        />
                    }
                    style={styles.list}
                    dataSource={DataStore.cloneWithRows(this.state.people_list_data_source)}
                    renderRow={this._renderPeople}
                    enableEmptySections = {true}
                />
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

module.exports = Follow;