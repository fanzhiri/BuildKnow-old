/**
 * Created by slako on 17/4/28.
 */
import React, { Component,PropTypes } from 'react';
import {View, Text, StyleSheet, ScrollView,ListView,TouchableOpacity,TextInput} from "react-native";
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
});

var dologoutpostUrl = "https://slako.applinzi.com/index.php?m=question&c=index&a=getcatalogue";
var doaddclassUrl = "https://slako.applinzi.com/index.php?m=question&c=personal&a=addclassify";


class ClassCatalogue extends Component {

    constructor(props) {
        super(props);

        this.state = {
            cataloguedata:null,
            code:0,
            addclass:false,
            classtext:""
        };

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
                    alert("ok");
                    this.setState({
                        addclass:false
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

    adminaddclass(edit){

        this.setState({
            addclass:edit
        })
    }



    renderAdmin(){
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
                    renderRow={this.renderClassifyItem}
                    enableEmptySections = {true}
                />
                {this.renderAdmin()}

            </ScrollView>

        );
    }

    renderClassifyItem(rowData, sectionID, rowID){
        return (
            <SettingItem text={rowData.name} subText={rowData.num} onPress={() => Actions.classcatalogue({classifyid:rowData.id,title:rowData.name})}/>
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
};

module.exports = ClassCatalogue;