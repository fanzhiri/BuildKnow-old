/**
 * Created by slako on 18/01/08.
 */

import React, { Component ,PropTypes} from 'react';
import {View, Text, StyleSheet,Image,ListView,ScrollView,TouchableOpacity} from "react-native";
import {Actions} from "react-native-router-flux";
import Button from "react-native-button";
import GlobleStyles from '../styles/GlobleStyles';
import {checkerrorcode } from '../util/CheckNetError'
import DataStore from '../util/DataStore';

import codePush from 'react-native-code-push'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },

});


let doGetVersionUrl = "https://slako.applinzi.com/index.php?m=question&c=index&a=versioncheck";

class SoftwareUpdate extends Component {

    constructor(props) {
        super(props);
        this.state = {
            local_mainversion: 0,
            local_subversion: 0,
            net_mainversion:0,
            net_subversion:0
        };

    }



    componentDidMount(){
        this.dofetchUpdate();
    }

    dofetchUpdate(){

        let formData = new FormData();
        formData.append("auth",global.auth);

        let opts = {
            method:"POST",
            body:formData
        };
        fetch(doGetVersionUrl,opts)
            .then((response) => response.json())
            .then((responseData) => {
                if(responseData.code == 100){
                    this.setState({
                        net_mainversion:responseData.data.mainversion,
                        net_subversion:responseData.data.subversion,
                    })

                }else{
                    checkerrorcode(responseData);
                }

            })
            .catch((error) => {
                alert(error)
            })
    }

    updateapp(update){
        if(!update){
            alert("已经是最新了");
        }else{
            alert("有更新");
        }
    }


    gocheckupdate(){
        try{
            codePush.sync(
                {
                    installMode: codePush.InstallMode.IMMEDIATE,
                    updateDialog: true
                },
                (status) => {
                    switch (status) {
                        case codePush.SyncStatus.CHECKING_FOR_UPDATE:
                            //alert('CHECKING_FOR_UPDATE');
                            console.log('codePush.SyncStatus.CHECKING_FOR_UPDATE');
                            break;
                        case codePush.SyncStatus.AWAITING_USER_ACTION:
                            //alert('AWAITING_USER_ACTION');
                            console.log('codePush.SyncStatus.AWAITING_USER_ACTION');
                            break;
                        case codePush.SyncStatus.DOWNLOADING_PACKAGE:
                            console.log('codePush.SyncStatus.DOWNLOADING_PACKAGE');
                            break;
                        case codePush.SyncStatus.INSTALLING_UPDATE:
                            console.log('codePush.SyncStatus.INSTALLING_UPDATE');
                            break;
                        case codePush.SyncStatus.UP_TO_DATE:
                            console.log('codePush.SyncStatus.UP_TO_DATE');
                            break;
                        case codePush.SyncStatus.UPDATE_IGNORED:
                            console.log('codePush.SyncStatus.UPDATE_IGNORED');
                            break;
                        case codePush.SyncStatus.UPDATE_INSTALLED:
                            console.log('codePush.SyncStatus.UPDATE_INSTALLED');
                            break;
                        case codePush.SyncStatus.SYNC_IN_PROGRESS:
                            console.log('codePush.SyncStatus.SYNC_IN_PROGRESS');
                            break;
                        case codePush.SyncStatus.UNKNOWN_ERROR:
                            console.log('codePush.SyncStatus.UNKNOWN_ERROR');
                            break;
                    }
                });
        }catch(error){
            alert(error)
        }

        // codePush.sync({
        //     updateDialog: {
        //         appendReleaseDescription:true,
        //         descriptionPrefix:'更新内容:',
        //         mandatoryContinueButtonLabel:'更新',
        //         mandatoryUpdateMessage:'有新版本了，请您及时更新',
        //         optionalInstallButtonLabel: '立即更新',
        //         optionalIgnoreButtonLabel: '稍后',
        //         optionalUpdateMessage:'有新版本了，是否更新？',
        //         title: '提示'
        //     },
        //     installMode: codePush.InstallMode.IMMEDIATE
        // });
        //codePush.checkForUpdate().then((update) => this.updateapp());
        //console.log("gocheckupdate");
    }

    renderNeedUpdataNot(){
        if(this.state.netversion == 0){
            return(
                <Text>检查中</Text>
            )
        }else{
            if(this.state.local_mainversion == this.state.net_mainversion && this.state.local_subversion == this.state.net_subversion){
                return(
                    <Text>已经是最新版本</Text>
                )
            }else{
                return(
                    <View>
                        <Text>最新版本为:{this.state.net_mainversion}.{this.state.net_subversion}</Text>

                        <TouchableOpacity  onPress={()=>(this.gocheckupdate())} >
                            <View style={{margin:12,height:38,width:100,justifyContent: 'center',alignItems: 'center',borderRadius:6,backgroundColor:"#205FF0"}}>
                                <Text>更新</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                )
            }
        }
    }

    render(){
        const {idNumber} = this.props;
        return (
            <View style={GlobleStyles.withoutTitleContainer}>
                <View  style={{alignItems:"center"}}>
                    <Text style={{fontSize:18,margin:12}}>现在版本:{this.state.local_mainversion}.{this.state.local_subversion}</Text>
                    {this.renderNeedUpdataNot()}
                </View>
            </View>

        );
    }
}

SoftwareUpdate.PropTypes = {
    idnumber:PropTypes.number,
};

module.exports = SoftwareUpdate;
