/**
 * Created by slako on 17/10/26.
 */
import React, { Component ,PropTypes} from 'react';
import {View, Text, Image,StyleSheet,TouchableOpacity,Alert} from "react-native";
import {Actions} from "react-native-router-flux";
import Button from "react-native-button";
import GlobleStyles from '../styles/GlobleStyles';
import ImagePicker from 'react-native-image-crop-picker';
import TcombForm from "tcomb-form-native";
var Tform = TcombForm.form.Form;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    image: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 380,
        height: 200,
    },
});

var docommitpostUrl = "https://slako.applinzi.com/index.php?m=question&c=personal&a=homepagepic";
var bookposterchangeUrl = "https://slako.applinzi.com/index.php?m=question&c=personal&a=mediaupload";




class UploadPic extends Component {

    constructor(props) {
        super(props);

        let t_url=null;
        let t_pic_width=200;
        let t_pic_height=200;
        switch (this.props.uploadtype){
            case 1:
                t_url=bookposterchangeUrl;
                t_pic_width=380;
                t_pic_height=200;break;
            case 2:break;
            case 3:break;
        }

        this.state = {
            imgSource: null,
            img_size:0,
            filename:null,
            pic_width:t_pic_width,
            pic_height:t_pic_height,
            url:t_url,

        };

        this._onSelectImgPress = this.onSelectImgPress.bind(this)
    }

    docommit(){

        let formData = new FormData();
        let file = {uri: this.state.imgSource, type: 'multipart/form-data', name: this.state.filename};
        formData.append("auth",global.auth);
        formData.append("userid",global.userid);

        var opts =null;
        formData.append("uploadtype",this.props.uploadtype);
        formData.append("upload",file);
        formData.append("bookid",this.props.bookid);
        opts = {
            method:"POST",
            headers:{
                'Content-Type':'multipart/form-data',
            },
            body:formData
        }

        if(this.state.url == null){
            return;
        }

        fetch(this.state.url,opts)
            .then((response) => response.json())
            .then((responseData) => {
                if(responseData.code == 100){
                    Alert.alert('上传提示','上传成功',[
                        {text:'好的'}
                    ]);

                }else{
                    //alert(global.auth);
                    alert(responseData.code)
                }

            })
            .catch((error) => {
                alert(error)
            })
    }

    onSelectImgPress(){

        ImagePicker.openPicker({
            width: this.state.pic_width,
            height: this.state.pic_height,
            cropping: true
        }).then(image => {

            console.log(image.size);

            let source = { uri: image.path , width: this.state.pic_width, height: this.state.pic_height };
            this.setState({
                imgSource: source,
                img_size:Math.ceil(image.size/1024),
                filename:image.filename
            });

        });
    }

    onPress(){
        if(this.state.img_size == 0){
            return;
        }
        this.docommit();

    }

    render(){
        if(this.state.imgSource == null){
            this._onSelectImgPress();
        }
        let addimguri ={uri:"https://slako.applinzi.com/statics/images/question/util/addimg.jpg" , width:this.state.pic_width, height:this.state.pic_height};
        return (
            <View style={GlobleStyles.withoutTitleContainer}>


                <TouchableOpacity style={styles.container} onPress={() => this._onSelectImgPress()}>
                    {this.state.imgSource?
                        <Image style={styles.image} resizeMode="cover"
                               source={this.state.imgSource}
                               ></Image>
                        :
                        <Image style={styles.image} resizeMode="cover"
                               source={{justifyContent: 'center',
                                   alignItems: 'center',
                                   width: this.state.pic_width,
                                   height: this.state.pic_height,}}
                               ></Image>
                    }

                </TouchableOpacity>

                <Text>图片大小：{this.state.img_size}k</Text>
                <TouchableOpacity style={{margin:4,borderRadius:8,height:32,
                    backgroundColor:"#0FFBF0",justifyContent:"center",alignItems:"center"}} onPress={() => this.onPress()} >
                    <Text style={{fontSize: 18}}>上传</Text>
                </TouchableOpacity>
            </View>
        );
    }
}
UploadPic.PropTypes = {
    uploadtype: PropTypes.number,
    bookid: PropTypes.number,//uploadtype == 1
    pic: PropTypes.number,

};
module.exports = UploadPic;