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
    Image,
    Keyboard,
    Dimensions
} from "react-native";
import {Actions} from "react-native-router-flux";
import Button from 'apsl-react-native-button'
import GlobleStyles from '../styles/GlobleStyles';
import { GiftedChat } from 'react-native-gifted-chat';
import Icon from 'react-native-vector-icons/Ionicons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import DataStore from '../util/DataStore';
import EmptyData from '../component/EmptyData';
import LoadingData from '../component/LoadingData';
import {PicBaseUrl} from '../util/Attributes';

const styles = StyleSheet.create({
    thiscontainer: {
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
        backgroundColor:"#FFFFFF"
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
        flex:1
    },cvscontainer:{
        justifyContent: 'flex-end',
        flex:1
    },
    IconItem:{
        justifyContent: 'center',
        alignItems: 'center',
        width: 40,
    },segmented:{
        margin:4,
    },

});


var peoplelistUrl = "https://slako.applinzi.com/index.php?m=question&c=index&a=peoplelist";

var sendMsgUrl = "https://slako.applinzi.com/index.php?m=question&c=personal&a=sendmsg";

var checkMsgListUrl = "https://slako.applinzi.com/index.php?m=question&c=personal&a=checkmsglist";



let  windowheight = Dimensions.get('window').height - 64;

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
            cvstid:props.cvstid,
            withoutkeyboardheight:windowheight,
        };
        this._onChange = this.onChange.bind(this);
        this._peoplelist = this.peoplelist.bind(this);
        this.onSend = this.onSend.bind(this);
        this._doOnPress = this.doOnPress.bind(this);
        this._detial=this.detial.bind(this);
        this._renderMsgItem=this.renderMsgItem.bind(this);
        this._renderMsgContent=this.renderMsgContent.bind(this);
        this._changeheight=this.changeheight.bind(this);
        this._keyboardDidShow=this.keyboardDidShow.bind(this);
        this._keyboardDidHide=this.keyboardDidHide.bind(this);
        this._keyboardWillShow=this.keyboardWillShow.bind(this);
        this._keyboardWillHide=this.keyboardWillHide.bind(this);
        this.timer_to_refresh=null;//延时滚屏
    }



    componentWillUnmount () {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    changeheight(hh){
        this.setState({
            withoutkeyboardheight:hh
        });
    }

    keyboardDidShow() {
        this.refs.scrview.scrollToEnd();
    }

    scrollviewtoend(){
        this.timer_to_refresh && clearInterval(this.timer_to_refresh);
        this.refs.scrview.scrollToEnd();
    }

    keyboardDidHide() {
        this.refs.scrview.scrollToEnd();
    }

    keyboardWillShow() {

        this.setState({
            showattach:false,
            withoutkeyboardheight:windowheight-258
        });

    }

    keyboardWillHide() {
        this.changeheight(windowheight);

    }

    detial(){
        Actions.chatsetting({chat_id:this.props.cvstid});
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.gorefresh == null){
            return;
        }
        this.dofetch_checkmsglist();
    }

    componentWillMount(){
        Actions.refresh({rightTitle: "详情",onRight: this._detial});
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
        this.keyboardDidShowListener = Keyboard.addListener('keyboardWillShow', this._keyboardWillShow);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardWillHide', this._keyboardWillHide);
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
                    this.timer_to_jump=setTimeout(()=>this.scrollviewtoend(),10);

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
            <View style={[styles.thiscontainer,{height:this.state.withoutkeyboardheight,marginTop:64,}]}>
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
                <EmptyData/>
            )
        } else if (this.state.selectedIndex === 2) {
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
                <Image style={[{width: 80,height: 80,}, this.props.imageStyle]} resizeMode="cover" source={{uri:`${PicBaseUrl}${head}`}} />
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

    onQstPress(t_questiondata){
        let answer_arr = new Array();
        let rightindex = Math.floor(Math.random() * 4);
        let answerarr=JSON.parse(t_questiondata.wrong_answer);
        let rightanswer=t_questiondata.right_answer;
        answerarr.splice(rightindex,0,rightanswer);
        answer_arr.push({ri:rightindex,randomanswer:answerarr});
        let qst_arr = new Array();
        qst_arr.push(t_questiondata);
        Actions.answerquestion({intype:2,answermode:3,readyquestion_arr:qst_arr,answer_arr:answer_arr})
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
            <TouchableOpacity onPress={() => this.onQstPress(questioninfo)}>
                <View style={{width:200}}>
                    <Text >{qtype_text}</Text>
                    <Text >{ask}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    renderBookCard(rowData){
        let bookinfo= JSON.parse(rowData.content);
        let bookname  =bookinfo.bookname;
        let cover     =bookinfo.cover;
        let bookbrief =bookinfo.bookbrief;

        return(
            <TouchableOpacity onPress={() => Actions.bookcover({bookpublicid:bookinfo.reviewid})}>
                <View style={{width:200}}>
                    <View style={{flexDirection:"row"}}>
                        <Image style={[{width: 80,height: 80,}, this.props.imageStyle]} resizeMode="cover" source={{uri:`${PicBaseUrl}${cover}`}} />
                        <Text style={{color:"#FF0000",fontSize:20,marginLeft:6}}>{bookname}</Text>
                    </View>
                    <Text style={{marginLeft:6,marginTop:4}}>简介: {bookbrief}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    clickRedPacket(rowData,id){
        if(rowData.send_from_userid == global.userid){
            Actions.redpacket({idnumber:id,intype:0});
        }else{
            Actions.redpacket({idnumber:id,intype:1});
        }
    }

    renderRedPacket(rowData){
        let redpacketinfo= JSON.parse(rowData.content);
        let words  =redpacketinfo.words;
        let split  =redpacketinfo.split;
        let take  =redpacketinfo.take;
        let status = "领取红包";
        if(redpacketinfo.userid == global.userid){
            status = "未被领完";
        }
        if(split == take){
            status = "红包已被领完";
        }
        return(
            <TouchableOpacity onPress={() => this.clickRedPacket(rowData,redpacketinfo.id)}>
                <View style={{width:240,height:62,flexDirection:"row",alignItems:"center",backgroundColor:"#FF4500",borderRadius:6,padding:4}}>
                    <View style={{justifyContent:"center",alignItems:"center",width:46,height:46,borderWidth:1,borderRadius:6}}>
                        <Icon name={"md-mail"} size={42} color={"#11FF00"}/>
                    </View>
                    <View>
                        <Text style={{marginLeft:6,marginTop:2,fontSize:16}}>{words}</Text>
                        <Text style={{marginLeft:6,marginTop:4,fontSize:12}}>{status}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    renderMsgType(rowData){

        switch (parseInt(rowData.msg_type)){
            case 0 : return(this.renderMsgContent(rowData));break;
            case 1 : return(this.renderPeopleCard(rowData));break;
            case 2 : return(this.renderQstCard(rowData));break;
            case 3 : return(this.renderBookCard(rowData));break;
            case 4 : return(this.renderRedPacket(rowData));break;
        }
    }

    renderMsgItem(rowData,sectionID, rowID){
        var d = new Date(rowData.message_time * 1000);
        //d.setTime(rowData.message_time);
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
                    <Image style={{borderRadius:4,height:36,width:36}} resizeMode="cover" source={{uri:`${PicBaseUrl}${global.userhead}`}}/>
                </View>
            );
        }else{
            return(
                <View style={[styles.msgitem,msglr]}>
                    <View style={{borderWidth:1,backgroundColor:"#FFFF00",
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
            case 4:Actions.handoutvc({cvst_id:this.props.cvstid});break;

        }
    }

    renderAttachButton(icon,name,func){
        return(
            <TouchableOpacity onPress={() => this.invote(func)}>
                <View style={{alignItems:"center"}}>
                    <View style={{justifyContent:"center",alignItems:"center",width:54,height:54,borderWidth:1,borderRadius:6}}>
                        <Icon name={icon} size={36} color={"#11FF00"}/>
                    </View>
                    <Text style={{fontSize:14,marginTop:4}}>{name}</Text>
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
                    {this.renderAttachButton("md-paper","考卷",3)}
                    {this.renderAttachButton("md-mail","红包",4)}
                </View>
            );
        }
    }

    changeshowattach(now){

        if(now == false){
            Keyboard.dismiss();
        }
        this.setState({
            showattach:now ? false:true,
        });
        this.timer_to_jump=setTimeout(()=>this.scrollviewtoend(),10);
    }

    renderIntroduceView(){
        return (

                <View style={{flex:1,justifyContent:"flex-end"}}>


                        <ListView
                            ref="scrview"
                            style={styles.list}
                            dataSource={DataStore.cloneWithRows(this.state.messageslist)}
                            renderRow={this._renderMsgItem}
                            enableEmptySections = {true}
                        />


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
    gorefresh: PropTypes.number,
};

module.exports = ChatList;