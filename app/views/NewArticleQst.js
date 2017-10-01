/**
 * Created by slako on 17/10/01.
 */
import React, { Component ,PropTypes} from 'react';
import {View, Text, StyleSheet, TextInput,SegmentedControlIOS,Image,ScrollView,TouchableOpacity,Alert} from "react-native";
import {Actions} from "react-native-router-flux";
import Button from 'apsl-react-native-button'
import GlobleStyles from '../styles/GlobleStyles';

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F5FCFF',
        margin:6,
    },
    typeContainer: {
        alignItems:'center',
        flexDirection:'row',
        height: 32,
    },
    addwayContainer: {
        marginTop:6,
        justifyContent: 'center',
        height: 32,
    },
    segmentedcontrolcontainer: {
        width:200,
    },
    answertypecontainer: {
        height: 40,
        justifyContent: 'center',

        width:240,
    },
    answerinattcontainer: {
        height: 40,
        justifyContent: 'center',

        width:160,
    },
    descriptioninput:{
        fontSize:16,
        marginTop:6,
        height: 100,
        borderColor: 'gray',
        borderWidth: 2,
        paddingLeft:10,
        paddingRight:10
    },
    answerinput:{
        fontSize:16,
        marginTop:6,
        height: 60,
        borderColor: 'gray',
        borderWidth: 2,
        paddingLeft:10,
        paddingRight:10
    },
    explaininput:{
        fontSize:16,
        marginTop:6,
        height: 80,
        borderColor: 'gray',
        borderWidth: 2,
        paddingLeft:10,
        paddingRight:10
    },
    typetext:{
        fontSize:16,
    },
    addQuestionContainer:{
        height: 600,
    },
    submitbutton:{
        backgroundColor: '#00EE00'
    },bottomcontainer: {
        marginTop:10,
        backgroundColor: '#F5FCFF',
        alignItems:'center',
        flexDirection:'row',
        height:32,
    },buttoncontainer:{
        height:32,
        flex:1,
        alignItems:'center',
        justifyContent: 'center',
    },
    clearbutton:{
        backgroundColor: '#FF1011'
    }
});

var addimguri ={uri:"https://slako.applinzi.com/statics/images/question/util/addimg.jpg", width: 80, height: 80 };
var addvideouri ={uri:"https://slako.applinzi.com/statics/images/question/util/addimg.jpg", width: 100, height: 68 };

var docommitpostUrl = "https://slako.applinzi.com/index.php?m=question&c=personal&a=addquestion";
//var docommitpostUrl = "https://slako.applinzi.com/index.php?m=question&c=index&a=testquestion";



class NewArticleQst extends Component {

    constructor(props) {
        super(props);
        let articlelink = "";


        this.state = {
            intype:props.intype,
            articlelink_shadow:"",
            articlelink:"",
        };

    }

    articleLinkTextChange(){
        this.setState({
            books_data_source:responseData.data
        })
    }

    render(){
        return (
            <View style={[GlobleStyles.withoutTitleContainer,styles.container]}>
                <View>
                    <Text>文章链接</Text>
                    <TextInput
                        onChangeText={(text) => {this.articleLinkTextChange(text)}}
                        style={styles.answerinput}
                        value={this.state.articlelink_shadow}
                        placeholder={"请拷贝进来"}
                        maxLength={20}
                        multiline={true}
                    />
                </View>
                <View style={{height:300}}>

                </View>
            </View>
        );
    }
}


NewArticleQst.PropTypes = {
    intype: PropTypes.number, //0新建 1查看
    qstlist: PropTypes.object,  //[查看]进入界面时 传进来的question list
    index:  PropTypes.number, //[查看]进入界面时 传进来的index
    bookid: PropTypes.number,
};
module.exports = NewArticleQst;