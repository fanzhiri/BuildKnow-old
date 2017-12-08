/**
 * Created by slako on 17/12/08.
 */
import React, { Component ,PropTypes} from 'react';
import {View, Text, StyleSheet,Image,TouchableOpacity,TextInput,ScrollView,Alert} from "react-native";
import {Actions} from "react-native-router-flux";
import Button from 'apsl-react-native-button'
import GlobleStyles from '../styles/GlobleStyles';

import Picker from 'react-native-picker';
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

let doCommitNewJobPostUrl = "https://slako.applinzi.com/index.php?m=question&c=personal&a=addjob";

var doCommitPicPostUrl = "https://slako.applinzi.com/index.php?m=attachment&c=attachment&a=upload";

let educationtext=['不限','大专','本科','研究生','博士','博士后'];

class NewJob extends Component {

    constructor() {

        super();
        let addcoveruri ={uri:"https://slako.applinzi.com/statics/images/question/util/addcover.png", width: 80, height: 80 };
        this.state = {
            name:"",//职位名字
            jobyearlow:0,//工作年限低
            jobyearhigh:0,//工作年限高
            workplace:'',//工作地址
            duty:"",//岗位职责
            description:"",//职位描述，任职要求
            extrapoint:'',//加分项
            offernum:0,//招聘人数
            education:0,//学历等级 0 不限 1大专 2本科 3研究生 4博士 5博士后

            coverSource8080: addcoveruri,
            coverSource18080: addcoveruri,

            bookcover8080_id:null,
            bookcover18080_id:null,
            uploading:0,
            bookcover8080_size:0,
            bookcover18080_size:0,
            bookcover8080_filename:null,
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

        formData.append("auth",global.auth);
        formData.append("userid",global.userid);
        formData.append("name",this.state.name);
        formData.append("jobyearlow",this.state.jobyearlow);
        formData.append("jobyearhigh",this.state.jobyearhigh);
        formData.append("workplace",this.state.workplace);
        formData.append("duty",this.state.duty);
        formData.append("description",this.state.description);
        formData.append("extrapoint",this.state.extrapoint);

        var opts = {
            method:"POST",
            headers:{
                'Content-Type':'multipart/form-data',
            },
            body:formData
        }
        fetch(doCommitNewJobPostUrl,opts)
            .then((response) => response.json())
            .then((responseData) => {
                if(responseData.code == 100){

                    Actions.pop({refresh:{gorefresh:1}});
                    Alert.alert('操作提示','新建成功');
                }else{
                    alert(global.auth);
                    alert(responseData.message)
                }

            })
            .catch((error) => {
                alert(error)
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
                    bookcover8080_size:Math.ceil(image.size/1024),
                    bookcover8080_filename:image.filename
                });
            }else{
                let source = { uri: image.path , width: 180, height: 80 };
                this.setState({
                    coverSource18080: source,
                    bookcover18080_size:Math.ceil(image.size/1024),
                    poster_filename:image.filename
                });
            }
        });
    }

    newbook(){
        if(this.state.name ===""){
            alert("需填写岗位名字");
            return;
        }
        if(this.state.duty ===""){
            alert("需填写职责");
            return;
        }
        if(this.state.description ===""){
            alert("需填写描述");
            return;
        }
        this.docommit();

    }

    changejobyearlow(){
        let low = [];
        for(let i=0;i<16;i++){
            low.push(i);
        }

        let selectedValue = [this.state.jobyearlow];
        Picker.init({
            pickerData:low,
            selectedValue:selectedValue,
            pickerTitleText: '选择最低年限',
            pickerConfirmBtnText:'确定',
            pickerCancelBtnText:'取消',
            onPickerConfirm: pickedValue => {
                if(this.state.jobyearhigh < this.state.jobyearlow){
                    this.setState({
                        jobyearhigh:pickedValue,
                        jobyearlow:pickedValue,
                    })
                }else{
                    this.setState({
                        jobyearlow:pickedValue,
                    })
                }

            },
            onPickerCancel: pickedValue => {

            },
            onPickerSelect: pickedValue => {

            }
        });
        Picker.show();
    }

    changejobyearhigh(){
        let high = [];
        for(let i= this.state.jobyearlow;i<17;i++){
            high.push(i);
        }

        let selectedValue = [this.state.jobyearhigh];
        Picker.init({
            pickerData:high,
            selectedValue:selectedValue,
            pickerTitleText: '选择最高年限',
            pickerConfirmBtnText:'确定',
            pickerCancelBtnText:'取消',
            onPickerConfirm: pickedValue => {
                this.setState({
                    jobyearhigh:pickedValue,
                })
            },
            onPickerCancel: pickedValue => {

            },
            onPickerSelect: pickedValue => {

            }
        });
        Picker.show();
    }

    changeoffernum(){
        let offer = [];
        for(let i= 1;i<11;i++){
            offer.push(i);
        }

        let selectedValue = [this.state.offernum];
        Picker.init({
            pickerData:offer,
            selectedValue:selectedValue,
            pickerTitleText: '选择招聘人数',
            pickerConfirmBtnText:'确定',
            pickerCancelBtnText:'取消',
            onPickerConfirm: pickedValue => {
                this.setState({
                    offernum:pickedValue,
                })
            },
            onPickerCancel: pickedValue => {

            },
            onPickerSelect: pickedValue => {

            }
        });
        Picker.show();
    }

    changeeducation(){

        let selectedValue = educationtext[this.state.offernum];
        Picker.init({
            pickerData:educationtext,
            selectedValue:selectedValue,
            pickerTitleText: '选择学历等级',
            pickerConfirmBtnText:'确定',
            pickerCancelBtnText:'取消',
            onPickerConfirm: pickedIndex => {
                this.setState({
                    education:pickedIndex,
                })
            },
            onPickerCancel: pickedValue => {

            },
            onPickerSelect: pickedValue => {

            }
        });
        Picker.show();
    }

    render(){
        let buttontext = this.state.uploading ==0 ?"添加职位":"添加中";
        return (
            <View style={[GlobleStyles.withoutTitleContainer,styles.container]}>
                <ScrollView>
                    <TextInput
                        style={styles.nameinput}
                        onChangeText={(text) => this.setState({name:text})}
                        value={this.state.name}
                        placeholder={"职位名字：请添写最多12字"}
                        maxLength={12}
                        multiline={false}
                        returnKeyType={'done'}
                    />
                    <View style={{flexDirection:"row",alignItems:"center"}}>
                        <Text style={{fontSize:16}}>招聘人数: </Text>
                        <TouchableOpacity style={{width:38,padding:2,margin:4,borderRadius:8,height:32,
                        backgroundColor:"#0FFBF0",justifyContent:"center",alignItems:"center"}} onPress={() => this.changeoffernum()} >
                            <Text style={{fontSize: 14}}>{this.state.offernum}</Text>
                        </TouchableOpacity>

                    </View>
                    <View style={{flexDirection:"row",alignItems:"center"}}>
                        <Text style={{fontSize:16}}>工作年限: </Text>
                        <TouchableOpacity style={{width:38,padding:2,margin:4,borderRadius:8,height:32,
                        backgroundColor:"#0FFBF0",justifyContent:"center",alignItems:"center"}} onPress={() => this.changejobyearlow()} >
                            <Text style={{fontSize: 14}}>{this.state.jobyearlow}</Text>
                        </TouchableOpacity>
                        <Text style={{fontSize:16}}> - </Text>
                        <TouchableOpacity style={{width:38,padding:2,margin:4,borderRadius:8,height:32,
                        backgroundColor:"#0FFBF0",justifyContent:"center",alignItems:"center"}} onPress={() => this.changejobyearhigh()} >
                            <Text style={{fontSize: 14}}>{this.state.jobyearhigh}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{flexDirection:"row",alignItems:"center"}}>
                        <Text style={{fontSize:16}}>学   历: </Text>
                        <TouchableOpacity style={{width:68,padding:2,margin:4,borderRadius:8,height:32,
                        backgroundColor:"#0FFBF0",justifyContent:"center",alignItems:"center"}} onPress={() => this.changeeducation()} >
                            <Text style={{fontSize: 14}}>{educationtext[this.state.education]}</Text>
                        </TouchableOpacity>

                    </View>
                    <TextInput
                        style={styles.briefinput}
                        onChangeText={(text) => this.setState({workplace:text})}
                        value={this.state.workplace}
                        placeholder={"工作地点：请添写最多64字"}
                        maxLength={64}
                        multiline={true}
                        returnKeyType={'done'}
                    />
                    <TextInput
                        style={styles.briefinput}
                        onChangeText={(text) => this.setState({duty:text})}
                        value={this.state.duty}
                        placeholder={"职责：请添写最多120字"}
                        maxLength={120}
                        multiline={true}
                        returnKeyType={'done'}
                    />

                    <TextInput
                        style={styles.descriptioninput}
                        onChangeText={(text) => this.setState({description:text})}
                        value={this.state.description}
                        placeholder={"任职要求：请添写最多100字"}
                        maxLength={100}
                        multiline={true}
                        returnKeyType={'done'}
                    />
                    <TextInput
                        style={styles.descriptioninput}
                        onChangeText={(text) => this.setState({extrapoint:text})}
                        value={this.state.extrapoint}
                        placeholder={"加分项：请添写最多100字"}
                        maxLength={100}
                        multiline={true}
                        returnKeyType={'done'}
                    />

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

NewJob.PropTypes = {
    orgdata:PropTypes.object,
};

module.exports = NewJob;