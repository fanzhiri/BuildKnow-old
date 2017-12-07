/**
 * Created by slako on 17/12/05.
 */
import React, { Component } from 'react';
import {View, Text, StyleSheet,Image,TouchableOpacity,TextInput,ScrollView,Alert} from "react-native";
import {Actions} from "react-native-router-flux";
import Button from 'apsl-react-native-button'
import GlobleStyles from '../styles/GlobleStyles';

//import ImagePicker from "react-native-image-picker";
import TcombForm from "tcomb-form-native";
import ImagePicker from 'react-native-image-crop-picker';
var Tform = TcombForm.form.Form;

const styles = StyleSheet.create({
    container: {
        flex: 1,

        margin:6
    },
    nameinput:{

        fontSize:16,
        marginTop:6,
        height: 32,
        borderColor: 'gray',
        borderWidth: 1,
        paddingLeft:10,
        paddingRight:10
    },
    briefinput:{
        fontSize:16,
        marginTop:10,
        height: 64,
        borderColor: 'gray',
        borderWidth: 1,
        paddingLeft:10,
        paddingRight:10
    },
    descriptioninput:{
        fontSize:16,
        marginTop:10,
        height: 128,
        borderColor: 'gray',
        borderWidth: 1,
        paddingLeft:10,
        paddingRight:10
    },
    imgcontainer:{
        flex:1,
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
        marginTop:10,
        marginLeft:10,
        width:80,
        height:80,

    },
    rightImgStyle:{
        marginTop:10,
        marginLeft:10,
        width:180,
        height:80,

    },
});

var doCommitNewEnterprisePostUrl = "https://slako.applinzi.com/index.php?m=question&c=personal&a=addenterprise";

class EnterpriseEnter extends Component {

    constructor() {

        super();
        let addcoveruri ={uri:"https://slako.applinzi.com/statics/images/question/util/addcover.png", width: 80, height: 80 };
        this.state = {
            coverSource8080: addcoveruri,
            coverSource18080: addcoveruri,
            name:"",
            brief:"",
            description:"",
            uploading:0,
            cover8080_size:0,
            cover18080_size:0,
            cover8080_filename:null,
            poster_filename:null

        };

        this._onSelectCoverPress = this.onSelectCoverPress.bind(this)
    }

    docommit(){
        if(this.state.uploading == 1){
            return;
        }
        this.setState({
            uploading:1,
        });
        let formData = new FormData();
        let imgfile=new Array(2);
        imgfile[0] = {uri: this.state.coverSource8080, type: 'multipart/form-data', name:this.state.cover8080_filename};
        //imgfile[1] = {uri: this.state.coverSource18080, type: 'multipart/form-data', name:this.state.poster_filename};

        formData.append("auth",global.auth);
        formData.append("userid",global.userid);
        formData.append("name",this.state.name);
        formData.append("brief",this.state.brief);
        formData.append("description",this.state.description);
        formData.append("upload[]",imgfile[0]);
        //formData.append("upload[]",imgfile[1]);
        var opts = {
            method:"POST",
            headers:{
                'Content-Type':'multipart/form-data',
            },
            body:formData
        }
        fetch(doCommitNewEnterprisePostUrl,opts)
            .then((response) => response.json())
            .then((responseData) => {
                if(responseData.code == 100){
                    this.setState({
                        uploading:0,
                    });
                    Actions.pop({refresh:{gorefresh:1}});
                    Alert.alert('操作提示','添加成功',[
                        {text:'ok'}
                    ]);
                }else{
                    alert(global.auth);
                    alert(responseData.message)
                    this.setState({
                        uploading:0,
                    });
                }

            })
            .catch((error) => {
                alert(error);
                this.setState({
                    uploading:0,
                });
            })
    }

    onSelectCoverPress(what){
        let img_width =80;
        if(what == 2){
            img_width =180;
        }
        ImagePicker.openPicker({
            width: img_width,
            height: 80,
            cropping: true
        }).then(image => {
            //alert(image.sourceURL);
            console.log(image.size);
            if(what == 1 ){
                let source = { uri: image.path , width: 80, height: 80 };
                this.setState({
                    coverSource8080: source,
                    cover8080_size:Math.ceil(image.size/1024),
                    cover8080_filename:image.filename
                });
            }else{
                let source = { uri: image.path , width: 180, height: 80 };
                this.setState({
                    coverSource18080: source,
                    cover18080_size:Math.ceil(image.size/1024),
                    poster_filename:image.filename
                });
            }
        });
    }

    newbook(){
        if(this.state.name ===""){
            alert("需填写名字");
            return;
        }
        if(this.state.brief ===""){
            alert("需填写简介");
            return;
        }
        if(this.state.descriptioninput ===""){
            alert("需填写描述");
            return;
        }
        this.docommit();

    }

    render(){
        let buttontext = this.state.uploading ==0 ?"添加企业":"添加中";
        return (
            <View style={[GlobleStyles.withoutTitleContainer,styles.container]}>
                <ScrollView>
                    <TextInput
                        style={styles.nameinput}
                        onChangeText={(text) => this.setState({name:text})}
                        value={this.state.name}
                        placeholder={"名字：请添写最多12字"}
                        maxLength={12}
                        multiline={false}
                        returnKeyType={'done'}
                    />
                    <TextInput
                        style={styles.briefinput}
                        onChangeText={(text) => this.setState({brief:text})}
                        value={this.state.brief}
                        placeholder={"简介：请添写最多32字"}
                        maxLength={32}
                        multiline={true}
                        returnKeyType={'done'}
                    />
                    <TextInput
                        style={styles.descriptioninput}
                        onChangeText={(text) => this.setState({description:text})}
                        value={this.state.description}
                        placeholder={"描述：请添写最多100字"}
                        maxLength={100}
                        multiline={true}
                        returnKeyType={'done'}
                    />
                    <Text style={{marginTop:10}}>图标：图片大小 {this.state.cover8080_size} k</Text>
                    <TouchableOpacity onPress={()=>this._onSelectCoverPress(1)} >
                        <Image source={this.state.coverSource8080} style={styles.leftImgStyle} />
                    </TouchableOpacity>

                    {/*<Text style={{marginTop:10}}>海报：图片大小 {this.state.cover18080_size} k</Text>*/}
                    {/*<TouchableOpacity onPress={()=>this._onSelectCoverPress(2)} >*/}
                        {/*<Image source={this.state.coverSource18080} style={styles.rightImgStyle} />*/}
                    {/*</TouchableOpacity>*/}

                </ScrollView>


                <View style={{flex:1,justifyContent:"flex-end"}}>
                    <TouchableOpacity style={{margin:4,borderRadius:8,height:32,
                        backgroundColor:"#0FFBF0",justifyContent:"center",alignItems:"center"}} onPress={() => this.newbook()} >
                        <Text style={{fontSize: 18}}>{buttontext}</Text>
                    </TouchableOpacity>
                </View>

            </View>
        );
    }
}

module.exports = EnterpriseEnter;