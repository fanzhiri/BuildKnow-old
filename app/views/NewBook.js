/**
 * Created by slako on 17/2/18.
 */
import React, { Component } from 'react';
import {View, Text, StyleSheet,Image,TouchableOpacity} from "react-native";
import {Actions} from "react-native-router-flux";
import Button from "react-native-button";
import GlobleStyles from '../styles/GlobleStyles';

import ImagePicker from "react-native-image-picker";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },

});





class NewBook extends Component {

    constructor() {

        super();
        let addcoveruri ={uri:"https://slako.applinzi.com/statics/images/question/util/addcover.png", width: 80, height: 80 };
        this.state = {
            coverSource: addcoveruri,
        };

        this._onSelectCoverPress = this.onSelectCoverPress.bind(this)
    }

    onSelectCoverPress(){
        var options = {
            title: 'Select Cover',
            customButtons: [
                {name: 'fb', title: 'Choose Photo for Cover'},
            ],
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


    render(){
        return (
            <View style={GlobleStyles.withoutTitleContainer}>
                {/*<Image source={{uri:"https://slako.applinzi.com/statics/images/question/util/addcover.png"}}  />*/}
                {/*<Image source={{uri:'https://slako.applinzi.com/statics/images/question/util/addcover.png', width: 80, height: 80 }} />*/}

                <TouchableOpacity onPress={()=>this._onSelectCoverPress()} >
                    <Image source={this.state.coverSource}  />
                </TouchableOpacity>
            </View>
        );
    }
}

module.exports = NewBook;