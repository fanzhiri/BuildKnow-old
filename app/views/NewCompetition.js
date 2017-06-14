/**
 * Created by slako on 17/06/13.
 */
import React, { Component } from 'react';
import {View, Text, StyleSheet,Image,TouchableOpacity,TextInput,ScrollView} from "react-native";
import {Actions} from "react-native-router-flux";

import GlobleStyles from '../styles/GlobleStyles';
import DataStore from '../util/DataStore';
import Icon from 'react-native-vector-icons/Ionicons';


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#BCEE68',
        margin:10
    },
    nameinput:{
        fontSize:16,
        marginTop:10,
        height: 32,
        borderColor: 'gray',
        borderWidth: 2,
        paddingLeft:10,
        paddingRight:10
    },
    briefinput:{
        fontSize:16,
        marginTop:10,
        height: 64,
        borderColor: 'gray',
        borderWidth: 2,
        paddingLeft:10,
        paddingRight:10
    },
    descriptioninput:{
        fontSize:16,
        marginTop:10,
        height: 128,
        borderColor: 'gray',
        borderWidth: 2,
        paddingLeft:10,
        paddingRight:10
    },
    imgcontainer:{
        width:360,
        marginTop:10,
        justifyContent: 'space-around',
        flexDirection:'row',
    },
    addbutton:{
        marginTop:10,
        height:48,
        backgroundColor: '#FFEE00'
    },
    leftImgStyle:{
        width:80,
        height:80,

    },
    rightImgStyle:{
        width:180,
        height:80,

    },listItem: {
        flex: 1,
        height: 48,
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 16,
        paddingRight: 25,
        borderBottomColor: '#c4c4c4',
        borderBottomWidth: 1
    },
    peopleItem:{

        padding:10,
        backgroundColor:'white',
        borderBottomWidth:0.5,
        borderBottomColor:'#e8e8e8',
        //主轴方向
        flexDirection:'row',
    },
});

var doCommitNewBookPostUrl = "https://slako.applinzi.com/index.php?m=question&c=personal&a=addbook";

var doCommitPicPostUrl = "https://slako.applinzi.com/index.php?m=attachment&c=attachment&a=upload";

class NewCompetition extends Component {

    constructor() {

        super();
        let addcoveruri ={uri:"https://slako.applinzi.com/statics/images/question/util/addcover.png", width: 80, height: 80 };
        this.state = {
            competitionpeople_data_source: null,
        };

        this._renderPeopleItem = this.renderPeopleItem.bind(this)
    }



    docommit(){

        let formData = new FormData();
        let file = {uri: this.state.coverSource, type: 'multipart/form-data', name: 'bookcover8080.jpg'};
        formData.append("auth",global.auth);
        formData.append("userid",global.userid);
        formData.append("bookname",this.state.name);
        formData.append("bookbrief",this.state.brief);
        formData.append("bookdescription",this.state.description);
        formData.append("bookcover8080",file);
        var opts = {
            method:"POST",
            headers:{
                'Content-Type':'multipart/form-data',
            },
            body:formData
        }
        fetch(doCommitNewBookPostUrl,opts)
            .then((response) => response.json())
            .then((responseData) => {
                if(responseData.code == 100){

                    Actions.pop();
                }else{
                    alert(global.auth);
                    alert(responseData.message)
                }

            })
            .catch((error) => {
                alert(error)
            })
    }

    onSelectCoverPress(){
        var options = {
            title: 'Select Cover',

            storageOptions: {
                skipBackup: true,
                path: 'images'
            }
        };

        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled image picker');
            }
            else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            }
            else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            }
            else {
                let source = { uri: response.uri , width: 80, height: 80 };
                //alert(response.uri);
                // You can also display the image using data:
                // let source = { uri: 'data:image/jpeg;base64,' + response.data };

                this.setState({
                    coverSource: source
                });
            }
        });

    }

    onPress(){
        if(this.state.name ===""){
            return;
        }
        if(this.state.brief ===""){
            return;
        }
        if(this.state.descriptioninput ===""){
            return;
        }
        this.docommit();

    }

    renderPeopleItem(rowData, sectionID, rowID){
        return(
            <View style={styles.peopleItem}>
                <Image source={{uri:`${httpsBaseUrl}${rowData.head}`}} style={styles.leftImgStyle}/>
                <View>
                    <Text style={styles.topTitleStyle}>
                        {rowData.nickname}
                    </Text>
                </View>
            </View>
        )
    }

    renderAllPeoples(){
        if(this.state.competitionpeople_data_source){
            return (
                <ListView
                    style={styles.list}
                    dataSource={DataStore.cloneWithRows(this.state.competitionpeople_data_source)}
                    renderRow={this._renderPeopleItem}
                    enableEmptySections = {true}
                />
            )
        }

    }

    addPeople(){
        Actions.friendlist();
    }

    render(){
        return (
            <View style={[GlobleStyles.withoutTitleContainer,styles.container]}>
                {this.renderAllPeoples()}
                <TouchableOpacity style={styles.listItem} onPress={() => this.addPeople()} activeOpacity={0.8}>
                    <View >
                        <Icon name={"md-add-circle"} size={22} color="#008B00"/>
                        <Text>添加</Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
}

module.exports = NewCompetition;