/**
 * Created by slako on 17/2/18.
 */
import React, { Component ,PropTypes} from 'react';
import {View, Text, StyleSheet, TextInput,SegmentedControlIOS,Image,ScrollView} from "react-native";
import {Actions} from "react-native-router-flux";
import Button from 'apsl-react-native-button'
import GlobleStyles from '../styles/GlobleStyles';

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F5FCFF',
        margin:6,
    },
    typeContainer: {
        alignItems:'center',
        flexDirection:'row',
        height: 40,
    },
    addwayContainer: {
        marginTop:6,
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
    answerinattcontainer: {
        height: 40,
        justifyContent: 'center',

        width:160,
    },
    descriptioninput:{
        fontSize:16,
        marginTop:6,
        height: 100,
        borderColor: 'gray',
        borderWidth: 2,
        paddingLeft:10,
        paddingRight:10
    },
    answerinput:{
        fontSize:16,
        marginTop:6,
        height: 60,
        borderColor: 'gray',
        borderWidth: 2,
        paddingLeft:10,
        paddingRight:10
    },
    explaininput:{
        fontSize:16,
        marginTop:6,
        height: 80,
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
    },
    submitbutton:{
        marginTop:12,
        height:32,
        backgroundColor: '#00EE00'
    }
});

var addimguri ={uri:"https://slako.applinzi.com/statics/images/question/util/addimg.jpg", width: 80, height: 80 };
var addvideouri ={uri:"https://slako.applinzi.com/statics/images/question/util/addimg.jpg", width: 100, height: 68 };

var docommitpostUrl = "https://slako.applinzi.com/index.php?m=question&c=personal&a=addquestion";

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
            fillingtext:"",
            rightwrongselectedIndex:0,//对或错选择标志
            fillorselect:0 //0:fill 1:select
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

    onRightWrongChange(event) {
        this.setState({
            rightwrongselectedIndex: event.nativeEvent.selectedSegmentIndex,
        });
    }

    onFillNotChange(event) {
        this.setState({
            fillorselect: event.nativeEvent.selectedSegmentIndex,
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
            {this.state.fillorselect == 0 ?
                <TextInput
                    onChangeText={(text) => {this.answertextchange(text)}}
                    style={styles.answerinput}
                    value={astext}
                    placeholder={"答案：请添写，最多20字"}
                    maxLength={20}
                    multiline={true}
                />
                :
                null
            }

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


    docommit(){

        let formData = new FormData();
        let file = {uri: this.state.imgSource, type: 'multipart/form-data', name: 'pic.jpg'};
        formData.append("auth",global.auth);
        formData.append("userid",global.userid);
        formData.append("bookid",this.props.bookid);
        formData.append("ask",newquestion.ask);
        formData.append("right_answer",newquestion.rightanswer);
        formData.append("wrong_answer_1",newquestion.wronganswier1);
        formData.append("wrong_answer_2",newquestion.wronganswier2);
        formData.append("wrong_answer_3",newquestion.wronganswier3);
        var opts =null;
        if(this.state.imgSource == addimguri){
            //formData.append("pic320240",file);
            opts = {
                method:"POST",
                body:formData
            }
        }else{
            formData.append("pic320240",file);
            opts = {
                method:"POST",
                headers:{
                    'Content-Type':'multipart/form-data',
                },
                body:formData
            }
        }

        fetch(docommitpostUrl,opts)
            .then((response) => response.json())
            .then((responseData) => {
                if(responseData.code == 100){

                    Actions.pop();
                }else{
                    alert(global.auth);
                    alert(responseData.message)
                }

            })
            .catch((error) => {
                alert(error)
            })
    }

    renderOneSelectView(which) {
        var enumString = null;
        var SegmentedControlValues=null;


        enumString = "答案枚举：";
        if(which == 0){
            //单选题
            if(this.state.fillorselect == 0){
                SegmentedControlValues=['正', '误1', '误2', '误3', '误4', '误5', '误6', '误7'];
            }else{
                enumString = "答案枚举：";
                SegmentedControlValues=['A', 'B', 'C', 'D'];
            }
        }else if(which == 1){
            //多选题
            SegmentedControlValues=['正1', '正2', '正3', '正4', '误1', '误2', '误3', '误4'];
        }else if(which == 3){
            //顺序题
            SegmentedControlValues=['答1', '答2', '答3', '答4', '答5', '答6', '答7', '答8'];
        }




        return (
            <View>
                <View style={styles.typeContainer}>
                    <Text style={styles.typetext}>{enumString}</Text>
                    <View style={styles.answertypecontainer}>
                        <SegmentedControlIOS
                            values={SegmentedControlValues}
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

    renderFillAnswerView(){
        if(this.state.questiontypeIndex != 0){
            return;
        }
        return(
            <View style={styles.typeContainer}>
                <Text style={styles.typetext}>答案在附件中？：</Text>
                <View style={styles.answerinattcontainer}>
                    <SegmentedControlIOS
                        values={['否', '是']}
                        selectedIndex={this.state.fillorselect}
                        style={styles.segmented}
                        onChange={(event) => {
                            this.onFillNotChange(event)
                        }}
                    />
                </View>
            </View>
        )
    }

    renderRightWrongView(){
        return(
            <View style={styles.typeContainer}>
                <Text style={styles.typetext}>答案对错：</Text>
                <View style={styles.answertypecontainer}>
                    <SegmentedControlIOS
                        values={['对', '错']}
                        selectedIndex={this.state.rightwrongselectedIndex}
                        style={styles.segmented}
                        onChange={(event) => {
                                this.onRightWrongChange(event)
                            }}
                    />
                </View>
            </View>
        )
    }

    renderQuestionTypeView(){
        switch (this.state.questiontypeIndex){
            case 0:
                return(this.renderOneSelectView(0))
                break;
            case 1:
                return(this.renderOneSelectView(1))
                break;
            case 2:
                return(this.renderRightWrongView())
                break;
            case 3:
                return(this.renderOneSelectView(3))
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
                {this.renderFillAnswerView()}
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

    submitquestion(){
        this.docommit();
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
                <Button style={styles.submitbutton} textStyle={{fontSize: 16}} onPress={() => this.submitquestion()}>提交</Button>
            </View>
        );
    }
}


NewSomeQuestions.PropTypes = {
    bookid: PropTypes.number,
};
module.exports = NewSomeQuestions;