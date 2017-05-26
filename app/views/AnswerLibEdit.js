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
        fontSize:14,
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
    },
    listItem: {
        flex: 1,
        height: 36,
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 25,
        paddingRight: 25,
        borderBottomColor: '#c4c4c4',
        borderBottomWidth: 1
    },

});




var addAnswerUrl = "https://slako.applinzi.com/index.php?m=question&c=personal&a=addanswer";

var checkAnswerItemListUrl = "https://slako.applinzi.com/index.php?m=question&c=personal&a=checkansweritemlist";

var httpsBaseUrl = "https://slako.applinzi.com/";

class AnswerLibEdit extends Component {

    constructor(props) {

        super(props);

        this.state = {
            answerlib_subject_list: null,
            inputtextstring:"",
            fetchtime:0
        };

        this._renderAnswerItem = this.renderAnswerItem.bind(this);

    }

    dofetch_addanswer(){
        if(this.state.inputtextstring === ""){
            return;
        }
        let formData = new FormData();
        formData.append("auth",global.auth);
        formData.append("userid",global.userid);
        formData.append("answerlibid",this.props.answerlibid);
        formData.append("answertext",this.state.inputtextstring);
        var opts = {
            method:"POST",
            body:formData
        }
        fetch(addAnswerUrl,opts)
            .then((response) => response.json())
            .then((responseData) => {
                if(responseData.code == 100){
                    this.setState({
                        answerlib_subject_list:responseData.data,
                        fetchtime:1
                    });
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
                    this.setState({
                       answerlib_subject_list:responseData.data,
                       fetchtime:1
                    });
                    //alert(responseData.message);
                }else{
                    alert(responseData.message);
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
        if((this.state.answerlib_subject_list != null) || (this.state.fetchtime != 0)){
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

    renderNodata(){
        return (
            <View style={styles.container}>
                <Text>Nodata...</Text>
            </View>

        )
    }

    renderAnswerItem(rowData){
        return(
            <View style={styles.listItem}>
                <Text style={styles.itemcontent}>{rowData}</Text>
            </View>
        )
    }

    renderDataList(){
        if(this.state.answerlib_subject_list){
            return(
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
            )
        }else{
            return(
                (this.renderNodata())
            )
        }

    }

    renderEditListView(){
        return (
            <View style={styles.cvscontainer}>
                {this.renderDataList()}
                <View style={styles.bottomInputViewContainer}>
                    <TextInput
                        style={styles.chatinput}
                        onChangeText={(text) => this.setState({inputtextstring:text})}
                        value={this.state.inputtextstring}
                        placeholder={""}
                        maxLength={20}
                        multiline={true}
                    />
                    <Button style={styles.sendbutton} textStyle={{fontSize: 16}} onPress={() => this.dofetch_addanswer()} >添加</Button>
                </View>
            </View>
        )
    }
}

AnswerLibEdit.PropTypes = {
    answerlibid:PropTypes.number,
};

module.exports = AnswerLibEdit;