/**
 * Created by slako on 17/12/08.
 */
import React, { Component ,PropTypes} from 'react';
import {View, Text, StyleSheet,Image,TouchableOpacity,TextInput,ScrollView,Alert,ListView} from "react-native";
import {Actions} from "react-native-router-flux";
import Button from 'apsl-react-native-button'
import GlobleStyles from '../styles/GlobleStyles';
import DataStore from '../util/DataStore';
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
        paddingRight:10,
        borderRadius:8,
    },
    briefinput:{
        fontSize:16,
        marginTop:10,
        height: 64,
        borderColor: 'gray',
        borderWidth: 1,
        paddingLeft:10,
        paddingRight:10,
        borderRadius:8
    },
    descriptioninput:{
        fontSize:16,
        marginTop:10,
        height: 128,
        borderColor: 'gray',
        borderWidth: 1,
        paddingLeft:10,
        paddingRight:10,
        borderRadius:8
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

let doCommitNewJobPostUrl = "https://slako.applinzi.com/index.php?m=question&c=organize&a=addjob";

var doCommitPicPostUrl = "https://slako.applinzi.com/index.php?m=attachment&c=attachment&a=upload";

let educationtext=['不限','大专','本科','研究生','博士','博士后'];

let salarytext=['2000以下','2000 - 3000','3000 - 4500','4500 - 6000','6000 - 8000','8000 - 10000','10000 - 15000','15000 - 20000','20000 - 30000','30000 - 40000','40000 - 50000','50000 - 60000'];

const MAX_BOOKITEM = 12 ;

class NewJob extends Component {

    constructor() {

        super();
        let t_book_item_list = new Array();
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
            book_item_list : t_book_item_list,
            select_jobbook_idx:0,//给跳转页面返回值用
            salary:0,//0：2000以下 1：3000 2：4500 3：6000 4：8000 5：10000 6：15000 7：20000 8：30000 9：40000 10：50000 11：60000

            uploading:0,
            bookcover8080_size:0,
            bookcover18080_size:0,
            bookcover8080_filename:null,
            poster_filename:null

        };

        this._onSelectCoverPress = this.onSelectCoverPress.bind(this);
        this._renderJobBookItem = this.renderJobBookItem.bind(this);
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.bookdata == null){
            return;
        }
        let t_book_item_list=this.state.book_item_list;

        t_book_item_list[this.state.select_jobbook_idx].name = nextProps.bookdata.bookname;
        t_book_item_list[this.state.select_jobbook_idx].bookid = nextProps.bookdata.reviewid;
        t_book_item_list[this.state.select_jobbook_idx].cover = nextProps.bookdata.cover;
        t_book_item_list[this.state.select_jobbook_idx].poster = nextProps.bookdata.poster;

        this.setState({
            book_item_list:t_book_item_list
        })
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
        formData.append("orgid",this.props.orgdata.id);
        formData.append("name",this.state.name);
        formData.append("jobyearlow",parseInt(this.state.jobyearlow));
        formData.append("jobyearhigh",parseInt(this.state.jobyearhigh));
        formData.append("workplace",this.state.workplace);
        formData.append("duty",this.state.duty);
        formData.append("description",this.state.description);
        formData.append("offernum",parseInt(this.state.offernum));
        formData.append("education",parseInt(this.state.education));
        formData.append("book_item_list",JSON.stringify(this.state.book_item_list));
        formData.append("salary",parseInt(this.state.salary));

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

    newjobcheck(){
        if(this.state.name ===""){
            alert("需填写岗位名字");
            return;
        }
        if(this.state.workplace ===""){
            alert("需填写工作地点");
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
            onPickerConfirm: (pickedValue,pickedIndex ) => {
                if(this.state.jobyearhigh < parseInt(pickedIndex)){
                    this.setState({
                        jobyearhigh:parseInt(pickedIndex),
                        jobyearlow:parseInt(pickedIndex),
                    })
                }else{
                    this.setState({
                        jobyearlow:parseInt(pickedIndex),
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
            onPickerConfirm: (pickedValue,pickedIndex) => {
                //alert(pickedValue);
                this.setState({
                    jobyearhigh:parseInt(pickedValue),
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
            onPickerConfirm: (pickedValue,pickedIndex )=> {
                this.setState({
                    offernum:parseInt(pickedValue),
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

        let selectedValue = [educationtext[this.state.education]];
        //let selectedValue = 2;
        Picker.init({
            pickerData:educationtext,
            selectedValue:selectedValue,
            pickerTitleText: '选择学历等级',
            pickerConfirmBtnText:'确定',
            pickerCancelBtnText:'取消',
            onPickerConfirm: (pickedValue,pickedIndex )=> {
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

    changesalary(){

        let selectedValue = [salarytext[this.state.salary]];
        //let selectedValue = 2;
        Picker.init({
            pickerData:salarytext,
            selectedValue:selectedValue,
            pickerTitleText: '选择薪酬范围',
            pickerConfirmBtnText:'确定',
            pickerCancelBtnText:'取消',
            onPickerConfirm: (pickedValue,pickedIndex )=> {
                this.setState({
                    salary:pickedIndex,
                })
            },
            onPickerCancel: pickedValue => {

            },
            onPickerSelect: pickedValue => {

            }
        });
        Picker.show();
    }

    addSubItemButton(rowData, rowID){
        if(rowData.bookid != 0){
            Actions.bookcover({bookpublicid:rowData.bookid})
            return;
        }
        this.setState({
            select_jobbook_idx:rowID
        });

        Actions.mycollectlist({intype:1,processprop:1,inmode:1});
    }

    change_subitem(rowData, rowID){

        this.setState({
            select_jobbook_idx:rowID
        });

        Actions.mycollectlist({intype:1,processprop:1,inmode:1});
    }

    del_subitem(rowID){

        let t_book_item_list=this.state.book_item_list;

        t_book_item_list.splice(rowID,1);

        this.setState({
            book_item_list:t_book_item_list
        })
    }

    proficientChange(rowID,text){
        let t_book_item_list=this.state.book_item_list;
        t_book_item_list[rowID].proficient = text;
        this.setState({
            book_item_list:t_book_item_list
        });

    }

    renderAddDellBtn(rowData, rowID){
        if(rowData.name == "点击添加"){
            return;
        }
        return(
            <View style={{flexDirection:"row",height:24,width:200,alignItems:"center"}}>
                <TextInput
                    style={{height:24,width:80,fontSize:14,borderColor:"#0000FF",borderWidth: 1,padding:2,marginLeft:4,backgroundColor:"#FFFFFF",borderRadius:6}}
                    onChangeText={(text) => this.proficientChange(rowID,text)}
                    value={rowData.proficient}
                    placeholder={"熟练度"}
                    maxLength={10}
                    multiline={false}
                />
                <TouchableOpacity style={{flex:1}} onPress={() => this.change_subitem(rowData, rowID)}>
                    <View style={{borderRadius:4,margin:2,padding:2,flexDirection:"row",backgroundColor:"#ADD8E6",justifyContent:"center",alignItems:"center"}}>
                        <Text>修改</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={{flex:1}} onPress={() => this.del_subitem(rowID)}>
                    <View style={{borderRadius:4,margin:2,padding:2,flexDirection:"row",backgroundColor:"#ADD8E6",justifyContent:"center",alignItems:"center"}}>
                        <Text>删除</Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    renderJobBookItem(rowData,sectionID,rowID) {
        return(
            <View style={{flexDirection:"row",height:24,alignItems:"center",margin:4}}>
                <TouchableOpacity style={{flex:1}} onPress={() => this.addSubItemButton(rowData, rowID)}>
                    <View style={{borderRadius:6,borderColor:"#0000FF",borderWidth: 1,margin:2,padding:2,flexDirection:"row",backgroundColor:"#ADD8E6"}}>
                        <Text>{rowID} </Text>
                        <Text style={{marginLeft:6}}>{rowData.name}</Text>
                    </View>
                </TouchableOpacity>
                {this.renderAddDellBtn(rowData, rowID)}
            </View>

        )
    }

    renderBookItemListView(){

        if(this.state.book_item_list.length == 0){
            return;
        }
        return(
            <ListView
                style={{margin:6}}
                dataSource={DataStore.cloneWithRows(this.state.book_item_list)}
                renderRow={this._renderJobBookItem}
                enableEmptySections = {true}
            />
        )
    }

    addSubItem(){

        let t_book_item_list = this.state.book_item_list;
        let remainadd = MAX_BOOKITEM - t_book_item_list.length;

        let sub_item_one={
            bookid:0,
            name:"点击添加",
            cover:null,
            poster:null,
            url:null,
            sortnum:MAX_BOOKITEM - remainadd + 1,
            proficient:'1000'
        };

        t_book_item_list.push(sub_item_one);
        this.setState({
            book_item_list:t_book_item_list
        })
    }

    renderKnowBook(){
        let remainadd = 10 - this.state.book_item_list.length;
        return(
            <View style={{borderWidth: 1,borderRadius:8,marginTop:8,padding:4}}>
                <Text>
                   添加熟悉题本
                </Text>
                {this.renderBookItemListView()}
                <TouchableOpacity onPress={() => this.addSubItem()}>
                    <View
                        style={{justifyContent:"center",alignItems:"center",margin:4,height:32,borderRadius:8,backgroundColor:"#CD69C9"}}>
                        <Text>添加项,还可以添加{remainadd}个</Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
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
                        <Text style={{fontSize:16}}>学历等级: </Text>
                        <TouchableOpacity style={{width:68,padding:2,margin:4,borderRadius:8,height:32,
                        backgroundColor:"#0FFBF0",justifyContent:"center",alignItems:"center"}} onPress={() => this.changeeducation()} >
                            <Text style={{fontSize: 14}}>{educationtext[this.state.education]}</Text>
                        </TouchableOpacity>

                    </View>
                    <View style={{flexDirection:"row",alignItems:"center"}}>
                        <Text style={{fontSize:16}}>薪资范围: </Text>
                        <TouchableOpacity style={{width:128,padding:2,margin:4,borderRadius:8,height:32,
                        backgroundColor:"#0FFBF0",justifyContent:"center",alignItems:"center"}} onPress={() => this.changesalary()} >
                            <Text style={{fontSize: 14}}>{salarytext[this.state.salary]}</Text>
                        </TouchableOpacity>

                    </View>
                    <TextInput
                        style={styles.briefinput}
                        onChangeText={(text) => this.setState({workplace:text})}
                        value={this.state.workplace}
                        placeholder={"工作地点：请添写最多60字"}
                        maxLength={60}
                        multiline={true}
                        returnKeyType={'done'}
                    />
                    <TextInput
                        style={styles.briefinput}
                        onChangeText={(text) => this.setState({duty:text})}
                        value={this.state.duty}
                        placeholder={"职责：请添写最多250字"}
                        maxLength={250}
                        multiline={true}
                        returnKeyType={'done'}
                    />

                    <TextInput
                        style={styles.descriptioninput}
                        onChangeText={(text) => this.setState({description:text})}
                        value={this.state.description}
                        placeholder={"任职要求：请添写最多250字"}
                        maxLength={250}
                        multiline={true}
                        returnKeyType={'done'}
                    />
                    <TextInput
                        style={styles.descriptioninput}
                        onChangeText={(text) => this.setState({extrapoint:text})}
                        value={this.state.extrapoint}
                        placeholder={"加分项：请添写最多250字"}
                        maxLength={250}
                        multiline={true}
                        returnKeyType={'done'}
                    />
                    {this.renderKnowBook()}
                    <View style={{flex:1,justifyContent:"flex-end"}}>
                        <TouchableOpacity style={{margin:2,borderRadius:8,height:32,
                        backgroundColor:"#0FFBF0",justifyContent:"center",alignItems:"center"}} onPress={() => this.newjobcheck()} >
                            <Text style={{fontSize: 18}}>{buttontext}</Text>
                        </TouchableOpacity>
                    </View>

                </ScrollView>




            </View>
        );
    }
}

NewJob.PropTypes = {
    orgdata:PropTypes.object,
    bookdata:PropTypes.object
};

module.exports = NewJob;