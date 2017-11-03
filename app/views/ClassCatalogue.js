/**
 * Created by slako on 17/4/28.
 */
import React, { Component,PropTypes } from 'react';
import {Alert,View, Text, StyleSheet, ScrollView,ListView,TouchableOpacity,TextInput} from "react-native";
import {Actions} from "react-native-router-flux";
import Button from 'apsl-react-native-button'
import GlobleStyles from '../styles/GlobleStyles';
import {storageSave,storeageGet} from '../util/NativeStore';
import SettingItem from '../component/SettingItem'
import DataStore from '../util/DataStore';
import MeItem from '../component/MeItem'

const styles = StyleSheet.create({
    list:{
        borderTopWidth: 1,
        borderTopColor: '#e4e4e4',

    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    descriptioninput:{
        height: 32,
        width:180,
        borderColor: 'gray',
        borderWidth: 1
    },
    adminItem: {
        flex: 1,
        height: 48,
        backgroundColor: 'white',
        flexDirection: 'row',

        alignItems: 'center',
        paddingLeft: 16,
        paddingTop: 6,
        paddingRight: 6,
        borderBottomColor: '#c4c4c4',
        borderBottomWidth: 1
    },
    saveButton:{
        marginRight:10,
        width:38,height:24,
        backgroundColor: '#00FF7F',
    },
    listItem: {
        flex: 1,
        height: 48,
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 25,
        paddingRight: 25,
        borderBottomColor: '#c4c4c4',
        borderBottomWidth: 1
    },
    button:{
        width:80,
        height:30,

        backgroundColor: '#00EE00'
    }
});

var dologoutpostUrl = "https://slako.applinzi.com/index.php?m=question&c=index&a=getcatalogue";
var doaddclassUrl = "https://slako.applinzi.com/index.php?m=question&c=personal&a=addclassify";

var setClassifyUrl = "https://slako.applinzi.com/index.php?m=question&c=personal&a=setbookclassify";

class ClassCatalogue extends Component {

    constructor(props) {
        super(props);

        this.state = {
            cataloguedata:null,
            code:0,
            addclass:false,
            classtext:""
        };
        this._renderClassifyItem = this.renderClassifyItem.bind(this);

    }

    dofetch_cataloguedata(childclassify){

        let formData = new FormData();
        formData.append("auth",global.auth);
        formData.append("userid",global.userid);

        formData.append("childclassify",childclassify);
        var opts = {
            method:"POST",
            body:formData
        }
        fetch(dologoutpostUrl,opts)
            .then((response) => response.json())
            .then((responseData) => {
                if(responseData.code == 100){
                    this.setState({
                        cataloguedata:responseData.data
                    })

                }else if(responseData.code == 101){


                }else{

                    alert(responseData.code)
                }

            })
            .catch((error) => {
                alert(error)
            })
    }

    dofetch_addclass(){

        let formData = new FormData();
        formData.append("auth",global.auth);
        formData.append("userid",global.userid);
        formData.append("adminid",global.adminid);
        formData.append("classtext",this.state.classtext);
        formData.append("parentid",this.props.classifyid);
        var opts = {
            method:"POST",
            body:formData
        }
        fetch(doaddclassUrl,opts)
            .then((response) => response.json())
            .then((responseData) => {
                if(responseData.code == 100){
                    //alert("ok");
                    this.setState({
                        addclass:false,
                        classtext:""
                    })
                    this.dofetch_cataloguedata(this.props.classifyid);
                }else{

                    alert(responseData.code)
                }

            })
            .catch((error) => {
                alert(error)
            })
    }

    dofetch_setClassify(selectclassify){

        let formData = new FormData();
        formData.append("auth",global.auth);
        formData.append("userid",global.userid);
        formData.append("bookid",this.props.bookid);
        formData.append("classify",selectclassify);
        var opts = {
            method:"POST",
            body:formData
        }
        fetch(setClassifyUrl,opts)
            .then((response) => response.json())
            .then((responseData) => {
                if(responseData.code == 100){
                    Actions.pop({popNum:this.props.deep})

                }else{

                    alert(responseData.message)
                }

            })
            .catch((error) => {
                alert(error)
            })
    }

    adminaddclass(edit){

        this.setState({
            addclass:edit
        })
    }



    renderAdmin(){
        if(this.props.intype == 1){
            return;
        }
        if(global.adminid != 0){
            if(this.state.addclass){
                return(

                        <View style={styles.adminItem}>
                            <TextInput
                                style={styles.descriptioninput}
                                onChangeText={(text) => this.setState({classtext:text})}
                                value={this.state.classtext}
                                placeholder={"描述"}
                            />


                            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end',alignItems: 'center'}}>
                                <Button style={styles.saveButton} textStyle={{fontSize: 12}}  onPress={() => this.adminaddclass(false)} >取消</Button>
                                <Button style={styles.saveButton} textStyle={{fontSize: 12}}  onPress={() => this.dofetch_addclass()}>保存</Button>
                            </View>

                        </View>

                )
            }else{
                return (
                    <MeItem icon={"md-add-circle"} text={"添加"} iconColor="#008B00" onPress={() => this.adminaddclass(true)} />
                )
            }

        }
    }

    renderclassifyView(){
        if(this.state.cataloguedata ==null){
            this.dofetch_cataloguedata(this.props.classifyid);
            return (this.renderLoading())
        }else{
            return (this.renderclassify())
        }
    }

    renderclassify(){
        return(
            <ScrollView>

                <ListView
                    style={styles.list}
                    dataSource={DataStore.cloneWithRows(this.state.cataloguedata)}
                    renderRow={this._renderClassifyItem}
                    enableEmptySections = {true}
                />
                {this.renderAdmin()}

            </ScrollView>

        );
    }

    confirmSelect(idx){
        this.dofetch_setClassify(idx);

    }


    onItemClickIt(rowData){
        if(rowData.num == 0){
            if(this.props.intype == 1){
                Alert.alert('类型选定',rowData.name,[
                    {text:'是的',onPress:()=> this.confirmSelect(rowData.id)},
                    {text:'不了'}
                ]);
                return;
            }else{

            }
        }
        if(rowData.num == 0){
            Actions.booklist({inmode:0,classifyid:rowData.id});
            return;
        }

        let deepnum = this.props.deep + 1;
        Actions.classcatalogue({classifyid:rowData.id,title:rowData.name,intype:this.props.intype,deep:deepnum,bookid:this.props.bookid});
    }


    renderClassifyItem(rowData, sectionID, rowID){
        return (

            <TouchableOpacity
                onPress={() => (this.onItemClickIt(rowData))}
                activeOpacity={0.8}
                >
                <View style={styles.listItem}>
                    <Text style={{color:"#0000FF", fontSize: 14}}>{rowData.name}</Text>
                    <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end', alignItems:'center'}}>
                        <Text style={{color: "#ccc"}}>子类数量：{rowData.num}   题本累计：{rowData.booknum }</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    render(){
        return (
            <View style={GlobleStyles.withoutTitleContainer}>
                {this.renderclassifyView()}

            </View>
        );
    }

    renderLoading(){
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>

        )
    }
}

ClassCatalogue.PropTypes = {
    classifyid: PropTypes.number.isRequired,
    intype:PropTypes.number,//0从分类进入 1选题本类型
    deep:PropTypes.number.isRequired,
    bookid:PropTypes.number,
};

module.exports = ClassCatalogue;