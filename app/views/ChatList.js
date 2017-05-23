/**
 * Created by slako on 17/5/19.
 */
import React, { Component ,PropTypes} from 'react';
import {
    TouchableOpacity,
    View,
    Text,
    StyleSheet,
    SegmentedControlIOS,
    ListView,
    ScrollView,
    TextInput,
    Image
} from "react-native";
import {Actions} from "react-native-router-flux";
import Button from 'apsl-react-native-button'
import GlobleStyles from '../styles/GlobleStyles';
import { GiftedChat } from 'react-native-gifted-chat';
import Icon from 'react-native-vector-icons/Ionicons';

import DataStore from '../util/DataStore';

const styles = StyleSheet.create({
    container: {
        marginLeft:10,
        marginRight:10,
        marginBottom:6
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
        marginBottom:4,

    },
    buttoncontainer:{
        width:60,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    sendbutton:{
        width:48,height:28,
        backgroundColor: '#00FF7F',
    },
    msgitem:{
        marginTop:4,
        borderColor: '#0000FF',
        borderWidth: 1,
    },
    bottomInputViewContainer:{
        padding:4,
        flexDirection:'row',
        height: 42,
        alignItems: 'center',
    },
    chatinput:{
        flex:1,
        fontSize:16,
        borderColor: 'gray',
        borderWidth: 2,
        paddingLeft:10,
        paddingRight:10
    },
    msgcontent:{
        fontSize:18,
    },
    msgtime:{
        fontSize:12,
    },
    msgleft:{
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'flex-start',
        marginLeft: 8,
        marginRight: 0,
    },
    msgRight:{
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        marginLeft: 0,
        marginRight: 8,
    },scrlist:{

    },cvscontainer:{
        justifyContent: 'flex-end',
        marginBottom:24,
    },
    IconItem:{
        justifyContent: 'center',
        alignItems: 'center',
        width: 40,
    }

});


var peoplelistUrl = "https://slako.applinzi.com/index.php?m=question&c=index&a=peoplelist";

var sendMsgUrl = "https://slako.applinzi.com/index.php?m=question&c=personal&a=sendmsg";

var checkMsgListUrl = "https://slako.applinzi.com/index.php?m=question&c=personal&a=checkmsglist";

var httpsBaseUrl = "https://slako.applinzi.com/";

class ChatList extends Component {

    constructor(props) {

        super(props);

        this.state = {
            netresult:'no',
            people_list_data_source: null,
            selectedIndex:0,
            messageslist: null,
            inputtextstring:""
        };
        this._onChange = this.onChange.bind(this);
        this._peoplelist = this.peoplelist.bind(this);
        this.onSend = this.onSend.bind(this);
        this._doOnPress = this.doOnPress.bind(this);


    }

    dofetch_sendmsg(){
        if(this.state.inputtextstring === ""){
            return;
        }
        let formData = new FormData();
        formData.append("auth",global.auth);
        formData.append("userid",global.userid);
        formData.append("chattoid",this.props.chattoid);
        formData.append("msgtext",this.state.inputtextstring);
        var opts = {
            method:"POST",
            body:formData
        }
        fetch(sendMsgUrl,opts)
            .then((response) => response.json())
            .then((responseData) => {
                if(responseData.code == 100){
                    this.dofetch_checkmsglist()
                }else{
                    alert(responseData.message);
                }

            })
            .catch((error) => {
                alert(error)
            })
    }

    dofetch_checkmsglist(){
        let formData = new FormData();
        formData.append("auth",global.auth);
        formData.append("userid",global.userid);
        formData.append("chattoid",this.props.chattoid);

        var opts = {
            method:"POST",
            body:formData
        }
        fetch(checkMsgListUrl,opts)
            .then((response) => response.json())
            .then((responseData) => {
                if(responseData.code == 100){
                    this.setState({
                        messageslist:responseData.data,
                    });
                    this.refs.scrview.scrollToEnd();
                }else{
                    alert(responseData.message);
                }

            })
            .catch((error) => {
                alert(error)
            })
    }

    peoplelist(){
        let formData = new FormData();
        formData.append("api","true");
        var opts = {
            method:"POST",
            body:formData
        }
        fetch(peoplelistUrl,opts)
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
            <View style={[GlobleStyles.withoutTitleContainer,styles.container]}>
                <View>
                    <SegmentedControlIOS
                        values={['全部','照片','推荐']}
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

            if(this.state.messageslist){

                return (this.renderIntroduceView())
            }else{
                this.dofetch_checkmsglist();
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

    doOnPress(userid){
        Actions.homepage({userid});
    }

    onSend(messages = []) {
        this.dofetch_sendmsg(messages[0]);
        this.setState((previousState) => {
            return {
                messageslist: GiftedChat.append(previousState.messageslist, messages),
            };
        });
    }

    /*
    renderSendButton(){
        return(
            <View style={styles.buttoncontainer}>
                <Button style={styles.sendtoButton} textStyle={{fontSize: 16}} onPress={this.onSend()} >发送</Button>
            </View>
        )
    }
    */

    renderComposer(){
        return(
            <Text>

            </Text>
        )
    }

    renderMsgItem(rowData){
        var d = new Date();
        d.setTime(rowData.message_time);
        var msglr = styles.msgleft ;
        if(rowData.send_from_userid == global.userid){
            msglr = styles.msgRight ;
        }

        return(
            <View style={[styles.msgitem,msglr]}>
                <View>
                    <Text style={styles.msgcontent}>{rowData.content}</Text>
                    <Text style={styles.msgtime}>{d.toDateString()}</Text>
                </View>

            </View>
        )
    }

    renderIntroduceView(){
        return (
            <View style={styles.cvscontainer}>
                <ScrollView

                    style={styles.scrlist}>
                    <ListView
                        ref="scrview"
                        style={styles.list}
                        dataSource={DataStore.cloneWithRows(this.state.messageslist)}
                        renderRow={this.renderMsgItem}
                        enableEmptySections = {true}
                    />
                </ScrollView>
                <View style={styles.bottomInputViewContainer}>

                    <View style={styles.IconItem}>
                        <Icon name={"md-add-circle"} size={28} color={"#FF0000"}/>
                    </View>
                    <TextInput
                        style={styles.chatinput}
                        onChangeText={(text) => this.setState({inputtextstring:text})}
                        value={this.state.inputtextstring}
                        placeholder={""}
                        maxLength={60}
                        multiline={true}
                    />
                    <Button style={styles.sendbutton} textStyle={{fontSize: 20}} onPress={() => this.dofetch_sendmsg()} >发送</Button>
                </View>
            </View>
        )
    }
}

ChatList.PropTypes = {
    chattoid:PropTypes.number,
};

module.exports = ChatList;