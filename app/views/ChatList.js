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
        marginLeft:2,
        marginRight:2,
        marginBottom:2
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
        marginTop:6,
        marginBottom:6
    },
    bottomInputViewContainer:{
        padding:4,

        flexDirection:'row',
        height: 42,
        alignItems: 'center',
        borderTopWidth:1,
        borderBottomWidth:1
    },
    bottomAttachmentViewContainer:{
        paddingTop:8,
        paddingBottom:8,
        flexDirection:'row',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    chatinput:{
        flex:1,
        fontSize:16,
        borderColor: 'gray',
        borderWidth: 1,
        paddingLeft:10,
        paddingRight:10,
        marginRight:6,
        borderRadius:4
    },
    msgcontent:{
        fontSize:18,
    },
    msgtime:{
        fontSize:12,
    },
    msgleft:{
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        marginLeft: 8,
        marginRight: 0,
    },
    msgRight:{
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'flex-end',
        marginLeft: 0,
        marginRight: 8,
    },scrlist:{

    },cvscontainer:{
        justifyContent: 'flex-end',
        marginBottom:6,
        flex:1
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
            inputtextstring:"",
            showattach:false,
            chattoid:props.chattoid,
            cvstid:props.cvstid
        };
        this._onChange = this.onChange.bind(this);
        this._peoplelist = this.peoplelist.bind(this);
        this.onSend = this.onSend.bind(this);
        this._doOnPress = this.doOnPress.bind(this);
        this._detial=this.detial.bind(this);
        this._renderMsgItem=this.renderMsgItem.bind(this);
        this._renderMsgContent=this.renderMsgContent.bind(this);
    }

    detial(){
        Actions.chatsetting({chat_id:this.props.cvstid});
    }

    componentWillMount(){
        Actions.refresh({rightTitle: "详情",onRight: this._detial})
    }

    dofetch_sendmsg(){
        if(this.state.inputtextstring === ""){
            return;
        }
        let formData = new FormData();
        formData.append("auth",global.auth);
        formData.append("userid",global.userid);
        formData.append("chattoid",this.state.chattoid);
        formData.append("msgtext",this.state.inputtextstring);
        formData.append("conversationid",this.state.cvstid);
        formData.append("msg_type",0);
        var opts = {
            method:"POST",
            body:formData
        }
        fetch(sendMsgUrl,opts)
            .then((response) => response.json())
            .then((responseData) => {
                if(responseData.code == 100){
                    this.setState({
                        inputtextstring:"",
                    });
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
        formData.append("cvstid",this.state.cvstid);
        formData.append("chattoid",this.state.chattoid);

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

    renderPeopleCard(rowData){
        let peopleinfo= JSON.parse(rowData.content);
        let head=peopleinfo.head;
        let nickname=peopleinfo.nickname;

        return(
            <TouchableOpacity onPress={() => Actions.homepage({userId:peopleinfo.userid,title:nickname})}>
            <View>
                <Image style={[{width: 80,height: 80,}, this.props.imageStyle]} resizeMode="cover" source={{uri:`${httpsBaseUrl}${head}`}} />
                <Text>{nickname}</Text>
            </View>
            </TouchableOpacity>
        )
    }

    renderMsgContent(rowData){
        return(
            <Text style={styles.msgcontent}>{rowData.content}</Text>
        )
    }

    renderQstCard(rowData){
        let questioninfo= JSON.parse(rowData.content);
        let ask =questioninfo.ask;
        let qtype =questioninfo.qtype;
        let qtype_text ;
        switch (parseInt(qtype)){
            case 0:qtype_text="[单选]:";break;
            case 1:qtype_text="[多选]:";break;
        }
        return(
            <View style={{width:200}}>
                <Text >{qtype_text}</Text>
                <Text >{ask}</Text>
            </View>
        )
    }

    renderMsgType(rowData){

        switch (parseInt(rowData.msg_type)){
            case 0 : return(this.renderMsgContent(rowData));break;
            case 1 : return(this.renderPeopleCard(rowData));break;
            case 2 : return(this.renderQstCard(rowData));break;
        }
    }

    renderMsgItem(rowData,sectionID, rowID){
        var d = new Date();
        d.setTime(rowData.message_time);
        var msglr = styles.msgleft ;
        if(rowData.send_from_userid == global.userid){
            msglr = styles.msgRight ;
            return(
                <View style={[styles.msgitem,msglr]}>
                    <View style={{borderWidth:1,backgroundColor:"#00FF00",
                        borderRadius:8,
                        paddingLeft:8,paddingRight:8,
                        paddingTop:6,paddingBottom:6,
                        marginRight:8}}>
                        {this.renderMsgType(rowData)}
                        <Text style={styles.msgtime}>{d.toDateString()}</Text>
                    </View>
                    <Image style={{borderRadius:4,height:36,width:36}} resizeMode="cover" source={{uri:`${httpsBaseUrl}${global.userhead}`}}/>
                </View>
            );
        }else{
            return(
                <View style={[styles.msgitem,msglr]}>
                    <View style={{borderWidth:1,backgroundColor:"#FFFF0",
                        borderRadius:8,
                        paddingLeft:8,paddingRight:8,
                        paddingTop:6,paddingBottom:6,
                        marginRight:8}}>
                        {this.renderMsgType(rowData)}
                        <Text style={styles.msgtime}>{d.toDateString()}</Text>
                    </View>

                </View>
            );
        }
    }

    invote(func){
        switch (func){
            case 1:Actions.friendlist({inmode:1,intype:1,cvst_id:this.props.cvstid,chattoid:this.state.chattoid});break;
            case 2:Actions.mycollectlist({intype:1,cvst_id:this.props.cvstid});break;
            case 3:break;

        }
    }

    renderAttachButton(icon,name,func){
        return(
            <TouchableOpacity onPress={() => this.invote(func)}>
                <View style={{alignItems:"center"}}>
                    <View style={{justifyContent:"center",alignItems:"center",width:54,height:54,borderWidth:1,borderRadius:6}}>
                        <Icon name={icon} size={36} color={"#11FF00"}/>
                    </View>
                    <Text style={{fontSize:12,marginTop:8}}>{name}</Text>
                </View>
            </TouchableOpacity>

        )
    }

    renderAttachView() {
        if(this.state.showattach){
            return (
                <View style={styles.bottomAttachmentViewContainer}>
                    {this.renderAttachButton("md-contact","名片",1)}
                    {this.renderAttachButton("md-bookmarks","收藏",2)}
                    {this.renderAttachButton("md-paper","题目",3)}
                </View>
            );
        }

    }

    changeshowattach(now){
        this.setState({
            showattach:now ? false:true,
        })

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
                        renderRow={this._renderMsgItem}
                        enableEmptySections = {true}
                    />
                </ScrollView>
                <View style={styles.bottomInputViewContainer}>
                    <TouchableOpacity onPress={()=>this.changeshowattach(this.state.showattach)} >
                        <View style={styles.IconItem}>
                            <Icon name={"md-add-circle"} size={32} color={"#11FF00"}/>
                        </View>
                    </TouchableOpacity>
                    <TextInput
                        style={styles.chatinput}
                        onChangeText={(text) => this.setState({inputtextstring:text})}
                        value={this.state.inputtextstring}
                        placeholder={""}
                        maxLength={60}
                        multiline={true}
                    />

                    <TouchableOpacity onPress={()=> this.dofetch_sendmsg()} >
                        <View style={{
                            borderWidth:1,backgroundColor:"#00FF00",
                            justifyContent:"center",alignItems:"center",
                            borderRadius:4,paddingLeft:8,paddingRight:8,paddingTop:6,paddingBottom:6}}>
                            <Text style={{fontSize:16}}>发送</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                {this.renderAttachView()}
            </View>
        )
    }
}

ChatList.PropTypes = {
    chattoid:PropTypes.number,
    cvstid:PropTypes.number,
};

module.exports = ChatList;