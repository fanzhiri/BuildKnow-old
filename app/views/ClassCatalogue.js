/**
 * Created by slako on 17/4/28.
 */
import React, { Component } from 'react';
import {View, Text, StyleSheet, ScrollView} from "react-native";
import {Actions} from "react-native-router-flux";
import Button from "react-native-button";
import GlobleStyles from '../styles/GlobleStyles';
import {storageSave,storeageGet} from '../util/NativeStore';
import SettingItem from '../component/SettingItem'

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

});
var dologoutpostUrl = "https://slako.applinzi.com/index.php?m=question&c=index&a=getcatalogue";

class ClassCatalogue extends Component {

    constructor(props) {
        super(props);

        this.state = {
            cataloguedata:null,
            code:0
        };
        this._doGetCatalogueData = this.doGetCatalogueData.bind(this);
    }

    doGetCatalogueData(name,passwd){

        let formData = new FormData();

        var opts = {
            method:"POST",
            body:formData
        }
        fetch(dologoutpostUrl,opts)
            .then((response) => response.json())
            .then((responseData) => {
                this.setState({
                    code:responseData.code
                })
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

    render(){
        return (
            <View style={GlobleStyles.withoutTitleContainer}>
                <ScrollView>

                    <View style={styles.list}>

                        <SettingItem text={"生活"} subText={"200"} onPress={() => (this.__doGetCatalogueData())}/>
                        <SettingItem text={"工作"} subText={"300"} onPress={() => (this.__doGetCatalogueData())}/>
                        <SettingItem text={"学习"} subText={"400"} onPress={() => (this.__doGetCatalogueData())}/>
                        <SettingItem text={"旅游"} subText={"300"} onPress={() => (this.__doGetCatalogueData())}/>
                        <SettingItem text={"年龄"} subText={"200"} onPress={() => (this.__doGetCatalogueData())}/>
                        <SettingItem text={"政务"} subText={"100"} onPress={() => (this.__doGetCatalogueData())}/>
                    </View>


                </ScrollView>

            </View>
        );
    }
}

module.exports = ClassCatalogue;