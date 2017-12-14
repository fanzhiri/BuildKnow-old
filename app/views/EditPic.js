/**
 * Created by slako on 17/12/14.
 */
import React, { Component ,PropTypes} from 'react';
import {View, Text, StyleSheet,Image,TouchableOpacity,TextInput,ScrollView,Alert,ListView} from "react-native";
import {Actions} from "react-native-router-flux";
import Button from 'apsl-react-native-button'
import GlobleStyles from '../styles/GlobleStyles';
import DataStore from '../util/DataStore';

import ImagePicker from 'react-native-image-crop-picker';

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

    rightImgStyle:{
        marginTop:10,
        marginLeft:10,
        width:180,
        height:80,

    },listItem:{
        margin:4,
        borderWidth:1,
        borderRadius:8,

        height: 160,
    },image: {
        //flexDirection:'row',
        height: 160,
        width:360,
        borderRadius:8,
        flex:1
    },
});

var doCommitOrgPicPostUrl = "https://slako.applinzi.com/index.php?m=question&c=organize&a=addorgpic";

var doCommitPicPostUrl = "https://slako.applinzi.com/index.php?m=attachment&c=attachment&a=upload";

let httpsPicBaseUrl = "http://slako-buildqst.stor.sinaapp.com/";

let MAX_PICS = 20;

class EditPic extends Component {

    constructor() {

        super();
        let addcoveruri ={uri:"https://slako.applinzi.com/statics/images/question/util/addcover.png", width: 80, height: 80 };
        let t_pictures = new Array();
        this.state = {

            pictures:t_pictures,
            uploading:0,
            /*
            coverSource8080: addcoveruri,
            coverSource18080: addcoveruri,
            name:"",
            brief:"",
            description:"",
            bookcover8080_id:null,
            bookcover18080_id:null,
            uploading:0,
            bookcover8080_size:0,
            bookcover18080_size:0,
            bookcover8080_filename:null,
            poster_filename:null
*/
        };


        this._renderPicItem = this.renderPicItem.bind(this);
    }

    docommit(){
        if(this.state.uploading == 1){
            return;
        }
        this.setState({
            uploading:1,
        });
        let formData = new FormData();
        let imgfile=new Array();
        let localnum =0;
        for(let i=0;i < this.state.pictures.length ;i++){
            if(this.state.pictures[i].pic_net == null){
                let uploadimgfile = {
                    uri:this.state.pictures[i].pic_local,
                    type:'multipart/form-data',
                    name:this.state.pictures[i].filename
                }
                imgfile.push(uploadimgfile);
                formData.append("upload[]",uploadimgfile);
                localnum=localnum+1;
            }
        }

        alert(localnum);
        formData.append("auth",global.auth);
        formData.append("userid",global.userid);
        formData.append("orgid",this.props.orgdata.id);
        formData.append("uploadnum",localnum);
        var opts = {
            method:"POST",
            headers:{
                'Content-Type':'multipart/form-data',
            },
            body:formData
        }
        fetch(doCommitOrgPicPostUrl,opts)
            .then((response) => response.json())
            .then((responseData) => {
                if(responseData.code == 100){

                    Actions.pop({refresh:{gorefresh:1}});
                    Alert.alert('操作提示','上传成功');
                }else{
                    alert(global.auth);
                    alert(responseData.message)
                }
                this.setState({
                    uploading:0,
                });
            })
            .catch((error) => {
                alert(error);
                this.setState({
                    uploading:0,
                });
            })
    }

    addpic(){

        ImagePicker.openPicker({
            width: 200,
            height: 80,
            cropping: true
        }).then(image => {
            //alert(image.sourceURL);
            console.log(image.size);

            let source = { uri: image.path , width: 200, height: 80 };
            let newpic={
                pic_net:null,
                pic_local: source,
                size:Math.ceil(image.size/1024),
                filename:image.filename
            };
            let t_pictures = this.state.pictures;
            t_pictures.push(newpic);
            this.setState({
                pictures:t_pictures
            });

        });
    }

    onItemPress(){

    }

    renderPicItem(rowData, sectionID, rowID){
        let picsource=null;
        if(rowData.pic_net == null){
            picsource = rowData.pic_local;
        }else{
            picsource={uri:`${httpsPicBaseUrl}${rowData.pic_net}`};
        }
        //
        return (
            <TouchableOpacity onPress={() => this.onItemPress(rowData)}>
                <View style={styles.listItem}>
                    <Image style={styles.image} resizeMode="cover" source={picsource} />
                </View>
            </TouchableOpacity>
        )
    }

    renderAllPics() {
        if(this.state.pictures.length == 0){
            return;
        }

        return (
            <ListView
                style={styles.list}
                dataSource={DataStore.cloneWithRows(this.state.pictures)}
                renderRow={this._renderPicItem}
                enableEmptySections={true}
            />
        )
    }

    render(){
        let remain = MAX_PICS - this.state.pictures.length;
        let buttontext = this.state.uploading ==0 ?"还可加"+remain+"张图":"添加中";
        return (
            <View style={[GlobleStyles.withoutTitleContainer,styles.container]}>

                <ScrollView>
                {this.renderAllPics()}
                </ScrollView>
                <View style={{flex:1,justifyContent:"flex-end"}}>
                    <View style={{margin:4,flexDirection:"row",height:32}}>
                        <TouchableOpacity style={{margin:4,borderRadius:8,height:32,flex:1,flexDirection:"row",
                        backgroundColor:"#0FFBF0",justifyContent:"center",alignItems:"center"}} onPress={() => this.addpic()} >
                            <Text style={{fontSize: 18}}>{buttontext}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{margin:4,borderRadius:8,height:32,width:80,
                        backgroundColor:"#0FFBF0",justifyContent:"center",alignItems:"center"}} onPress={() => this.docommit()} >
                            <Text style={{fontSize: 18}}>提交</Text>
                        </TouchableOpacity>
                    </View>

                </View>

            </View>
        );
    }
}

EditPic.PropTypes = {
    orgdata:PropTypes.object,

};
module.exports = EditPic;