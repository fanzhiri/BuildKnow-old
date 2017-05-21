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
    ListView,Image
} from "react-native";
import {Actions} from "react-native-router-flux";
import Button from 'apsl-react-native-button'
import GlobleStyles from '../styles/GlobleStyles';
import { GiftedChat } from 'react-native-gifted-chat';

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
    buttoncontainer:{
        width:60,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    sendtoButton:{
        width:48,height:28,
        backgroundColor: '#00FF7F',
    },

});


var peoplelistUrl = "https://slako.applinzi.com/index.php?m=question&c=index&a=peoplelist";

var httpsBaseUrl = "https://slako.applinzi.com/";

class ChatList extends Component {

    constructor(props) {

        super(props);

        this.state = {
            netresult:'no',
            people_list_data_source: null,
            selectedIndex:0,
            messageslist: []
        };
        this._onChange = this.onChange.bind(this);
        this._peoplelist = this.peoplelist.bind(this);
        this.onSend = this.onSend.bind(this);
        this._doOnPress = this.doOnPress.bind(this);


    }

    componentWillMount() {
        this.setState({
            messageslist: [
                {
                    _id: 1,
                    text: '你的软件做得不错呀',
                    //createdAt: new Date(Date.UTC(2017, 5, 19, 17, 20, 5)),
                    createdAt: new Date(),
                    user: {
                        _id: 2,
                        name: 'React Native',
                        avatar: 'https://facebook.github.io/react/img/logo_og.png',
                    },
                },
            ],
        });
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
            <View style={GlobleStyles.withoutTitleContainer}>
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

            //if(this.state.people_list_data_source){

                return (this.renderIntroduceView())
            //}else{
            //    this._peoplelist();
             //   return (this.renderLoading())
            //}

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
        this.setState((previousState) => {
            return {
                messageslist: GiftedChat.append(previousState.messageslist, messages),
            };
        });
    }

    renderSendButton(){
        return(
            <View style={styles.buttoncontainer}>
                <Button style={styles.sendtoButton} textStyle={{fontSize: 16}} >发送</Button>
            </View>
        )
    }

    renderComposer(){
        return(
            <Text>

            </Text>
        )
    }

    renderIntroduceView(){
        return (
            <GiftedChat
                messages={this.state.messageslist}
                onSend={this.onSend}

                renderSend={this.renderSendButton}
                user={{
                    _id: 1,
                }}
            />
        )
    }
}

ChatList.PropTypes = {
    chattoid:PropTypes.number,
};

module.exports = ChatList;