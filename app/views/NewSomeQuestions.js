/**
 * Created by slako on 17/2/18.
 */
import React, { Component } from 'react';
import {View, Text, StyleSheet, TextInput,SegmentedControlIOS,Image,ScrollView} from "react-native";
import {Actions} from "react-native-router-flux";
import Button from "react-native-button";
import GlobleStyles from '../styles/GlobleStyles';

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F5FCFF',
        margin:16,
    },
    typeContainer: {
        alignItems:'center',
        flexDirection:'row',
        height: 40,
    },
    addwayContainer: {
        marginTop:10,
        justifyContent: 'center',
        height: 32,
    },
    segmentedcontrolcontainer: {
        width:200,
    },
    answertypecontainer: {
        height: 40,
        justifyContent: 'center',

        width:240,
    },
    descriptioninput:{
        fontSize:16,
        marginTop:10,
        height: 140,
        borderColor: 'gray',
        borderWidth: 2,
        paddingLeft:10,
        paddingRight:10
    },
    answerinput:{
        fontSize:16,
        marginTop:10,
        height: 60,
        borderColor: 'gray',
        borderWidth: 2,
        paddingLeft:10,
        paddingRight:10
    },
    explaininput:{
        fontSize:16,
        marginTop:10,
        height: 100,
        borderColor: 'gray',
        borderWidth: 2,
        paddingLeft:10,
        paddingRight:10
    },
    typetext:{
        fontSize:16,
    },
    addQuestionContainer:{
        height: 600,
    }
});

var addimguri ={uri:"https://slako.applinzi.com/statics/images/question/util/addimg.jpg", width: 80, height: 80 };
var addvideouri ={uri:"https://slako.applinzi.com/statics/images/question/util/addimg.jpg", width: 100, height: 68 };

class NewSomeQuestions extends Component {

    constructor(props) {
        super(props);

        this.state = {
            imgSource: addimguri,
            questiontext:"问题",
            answertext:"答案",
            explaintext:"解释",
            addwayIndex:0,
            sgmctlselectedIndex:0,
            questiontypeIndex:0,
            attachmentIndex:0,
            //rightanswertext:"",
            //rightexplaintext:"",
            answertext:["","","","","","","",""],
            explaintext:["","","","","","","",""],
            wronganswertext2:"",
            wrongexplaintext2:"",
            wronganswertext3:"",
            wrongexplaintext3:"",
            wronganswertext4:"",
            wrongexplaintext4:"",
            wronganswertext5:"",
            wrongexplaintext6:"",
            textabc:["","","","",""],
            fillingtext:""
        };

    }

    onSCChange(event) {
        this.setState({
            sgmctlselectedIndex: event.nativeEvent.selectedSegmentIndex,
        });
    }
    onQTChange(event) {
        this.setState({
            questiontypeIndex: event.nativeEvent.selectedSegmentIndex,
        });
    }
    onATChange(event) {
        this.setState({
            attachmentIndex: event.nativeEvent.selectedSegmentIndex,
        });
    }

    onAddwayChange(event) {
        this.setState({
            addwayIndex: event.nativeEvent.selectedSegmentIndex,
        });
    }

    answertextchange(text) {
        var alltext = this.state.answertext;
        alltext[this.state.sgmctlselectedIndex] = text;
        this.setState({
            answertext: alltext,
        });
    }

    explaintextchange(text) {
        var alltext = this.state.explaintext;
        alltext[this.state.sgmctlselectedIndex] = text;
        this.setState({
            explaintext: alltext,
        });
    }

    renderAnswerView(){
        var astext=this.state.answertext[this.state.sgmctlselectedIndex];
        var extext=this.state.explaintext[this.state.sgmctlselectedIndex];
        return(
        <View>
            <TextInput
                onChangeText={(text) => {this.answertextchange(text)}}
                style={styles.answerinput}
                value={astext}
                placeholder={"答案：请添写，最多20字"}
                maxLength={20}
                multiline={true}
            />
            <TextInput
                style={styles.explaininput}
                onChangeText={(text) => {this.explaintextchange(text)}}
                value={extext}
                placeholder={"解释：请添写10个字以上，最多160字"}
                maxLength={160}
                multiline={true}
            />
        </View>


        );
    }

    renderAttachmentView(){
        return(
            <Image source={this.state.imgSource}  />
        );
    }

    renderAnswerTypeView(){

    }

    renderOneSelectView() {
        return (
            <View>
                <View style={styles.typeContainer}>
                    <Text style={styles.typetext}>答案类型：</Text>
                    <View style={styles.answertypecontainer}>
                        <SegmentedControlIOS
                            values={['正答', '误1', '误2', '误3', '误4', '误5']}
                            selectedIndex={this.state.sgmctlselectedIndex}
                            style={styles.segmented}
                            onChange={(event) => {
                                this.onSCChange(event)
                            }}
                        />
                    </View>
                </View>
                {this.renderAnswerView()}
            </View>
        );
    }

    renderFillingView(){
        return(
            <TextInput
                style={styles.descriptioninput}
                onChangeText={(text) => this.setState({fillingtext:text})}
                value={this.state.fillingtext}
                placeholder={"答案：请添写最多10字"}
                maxLength={10}
                multiline={true}
            />
        );
    }

    renderQuestionTypeView(){
        switch (this.state.questiontypeIndex){
            case 0:
                return(this.renderOneSelectView())
                break;
            case 4:
                return(this.renderFillingView())
                break;
            default:
                break;
        }
    }

    renderAddOneView(){
        return(
            <View >
                <View style={styles.typeContainer}>
                    <Text style={styles.typetext}>问题类型：</Text>
                    <View style={styles.segmentedcontrolcontainer}>
                        <SegmentedControlIOS
                            values={['单选','多选','对错','顺序','填空']}
                            selectedIndex={this.state.questiontypeIndex}
                            style={styles.segmented}

                            onChange={(event) => {this.onQTChange(event)}}
                        />
                    </View>
                </View>
                <TextInput
                    style={styles.descriptioninput}
                    onChangeText={(text) => this.setState({questiontext:text})}
                    value={this.state.questiontext}
                    placeholder={"题目：请添写10个字以上来描述问题，最多60字"}
                    maxLength={60}
                    multiline={true}
                />
                <View style={styles.typeContainer}>
                    <Text style={styles.typetext}>附件类型：</Text>
                    <View style={styles.segmentedcontrolcontainer}>
                        <SegmentedControlIOS
                            values={['图片','视频','音频','录音']}
                            selectedIndex={this.state.attachmentIndex}
                            style={styles.segmented}

                            onChange={(event) => {this.onATChange(event)}}
                        />
                    </View>
                </View>
                {this.renderAttachmentView()}
                {this.renderQuestionTypeView()}
            </View>
        )
    }

    renderAddMultView(){
        return(
            <ScrollView>
                <Text>未开发</Text>
            </ScrollView>
        );
    }

    renderOneOrMultView(){
        if(this.state.addwayIndex == 0){
            return (this.renderAddOneView());
        }else if(this.state.addwayIndex == 1){
            return (this.renderAddMultView());
        }
    }

    render(){
        return (
            <View style={[GlobleStyles.withoutTitleContainer,styles.container]}>
                <View style={styles.addwayContainer}>
                    <SegmentedControlIOS
                        values={['单一添加','批量添加']}
                        selectedIndex={this.state.addwayIndex}
                        style={styles.segmented}

                        onChange={(event) => {this.onAddwayChange(event)}}
                    />

                </View>
                {this.renderOneOrMultView()}
            </View>
        );
    }
}

module.exports = NewSomeQuestions;