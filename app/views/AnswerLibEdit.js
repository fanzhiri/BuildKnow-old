/**
 * Created by slako on 17/5/26.
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
        padding:0,
        flexDirection:'row',
        height: 38,
        alignItems: 'center',
    },
    bottomAttachmentViewContainer:{
        padding:0,
        flexDirection:'row',
        height: 80,
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    chatinput:{
        flex:1,
        fontSize:16,
        borderColor: 'gray',
        borderWidth: 2,
        paddingLeft:10,
        paddingRight:10,
        marginRight:6
    },
    itemcontent:{
        fontSize:16,
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

var checkAnswerItemListUrl = "https://slako.applinzi.com/index.php?m=question&c=personal&a=checkansweritemlist";

var httpsBaseUrl = "https://slako.applinzi.com/";

class AnswerLibEdit extends Component {

    constructor(props) {

        super(props);

        this.state = {
            answerlib_subject_list: null,
            inputtextstring:"",
        };

        this._renderAnswerItem = this.renderAnswerItem.bind(this);

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

    dofetch_checksubjectlist(){
        let formData = new FormData();
        formData.append("auth",global.auth);
        formData.append("userid",global.userid);
        formData.append("answerlibid",this.props.answerlibid);

        var opts = {
            method:"POST",
            body:formData
        }
        fetch(checkAnswerItemListUrl,opts)
            .then((response) => response.json())
            .then((responseData) => {
                if(responseData.code == 100){
                    //this.setState({
                    //   answerlib_subject_list:responseData.data,
                    //});
                    alert(responseData.message);
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

    render(){
        return (
            <View style={[GlobleStyles.withoutTitleContainer,styles.container]}>

                {this.renderSubjectView()}
            </View>
        );
    }

    renderSubjectView() {
        if(this.state.messageslist){
            return (this.renderEditListView())
        }else{
            this.dofetch_checksubjectlist();
            return (this.renderLoading())
        }

    }

    renderLoading(){
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>

        )
    }

    renderAnswerItem(rowData){
        return(
            <View>
                <Text style={styles.itemcontent}>{rowData}</Text>
            </View>
        )
    }


    renderEditListView(){
        return (
            <View style={styles.cvscontainer}>
                <ScrollView
                    style={styles.scrlist}>
                    <ListView
                        ref="scrview"
                        style={styles.list}
                        dataSource={DataStore.cloneWithRows(this.state.answerlib_subject_list)}
                        renderRow={this._renderAnswerItem}
                        enableEmptySections = {true}
                    />
                </ScrollView>
                <View style={styles.bottomInputViewContainer}>
                    <TextInput
                        style={styles.chatinput}
                        onChangeText={(text) => this.setState({inputtextstring:text})}
                        value={this.state.inputtextstring}
                        placeholder={""}
                        maxLength={16}
                        multiline={true}
                    />
                    <Button style={styles.sendbutton} textStyle={{fontSize: 16}} onPress={() => this.dofetch_sendmsg()} >添加</Button>
                </View>
            </View>
        )
    }
}

AnswerLibEdit.PropTypes = {
    answerlibid:PropTypes.number,
};

module.exports = AnswerLibEdit;