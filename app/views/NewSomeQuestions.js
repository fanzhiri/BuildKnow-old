/**
 * Created by slako on 17/2/18.
 */
import React, { Component ,PropTypes} from 'react';
import {View, Text, StyleSheet, TextInput,SegmentedControlIOS,Image,ScrollView,TouchableOpacity,Alert} from "react-native";
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
        height: 32,
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
        backgroundColor: '#00EE00'
    },bottomcontainer: {
        marginTop:10,
        backgroundColor: '#F5FCFF',
        alignItems:'center',
        flexDirection:'row',
        height:32,
    },buttoncontainer:{
        height:32,
        flex:1,
        alignItems:'center',
        justifyContent: 'center',
    },
    clearbutton:{
        backgroundColor: '#FF1011'
    }
});

var addimguri ={uri:"https://slako.applinzi.com/statics/images/question/util/addimg.jpg", width: 80, height: 80 };
var addvideouri ={uri:"https://slako.applinzi.com/statics/images/question/util/addimg.jpg", width: 100, height: 68 };

var docommitpostUrl = "https://slako.applinzi.com/index.php?m=question&c=personal&a=addquestion";
//var docommitpostUrl = "https://slako.applinzi.com/index.php?m=question&c=index&a=testquestion";



class NewSomeQuestions extends Component {

    constructor(props) {
        super(props);
        let t_questiontext = "";
        let t_questiontypeIndex = 0;
        let t_answertext = ['','','','','','','',''];
        let t_questiondata =null;
        if(props.qstlist != null && props.index != null){
            t_questiondata = props.qstlist[parseInt(props.index)];
            t_questiontext = t_questiondata.ask;
            t_questiontypeIndex = parseInt(t_questiondata.qtype);

            t_answertext[0] = t_questiondata.right_answer;
            let  t_wrong_answer = JSON.parse(t_questiondata.wrong_answer);
            for(let i=1;i<8;i++){
                t_answertext[i] = t_wrong_answer[i-1];
            }
        }

        this.state = {
            intype:props.intype,
            imgSource: addimguri,
            questiontext:t_questiontext, //问题

            addwayIndex:0,
            sgmctlselectedIndex:0,//如果答案是的附件中，选中的就是正确答案
            questiontypeIndex:t_questiontypeIndex,  //题目类型
            attachmentIndex:0,
            answertext:t_answertext,
            explaintext:['','','','','','','',''],

            textabc:["","","","",""],
            fillingtext:"",
            rightwrongselectedIndex:0,//对或错选择标志
            fillorselect:0, //0:fill 1:select

            //下面是查看的
            qstlist:props.qstlist,
            qidx:props.index,
            allcount:props.qstlist.length,
            questiondata:t_questiondata
        };

    }

    onSCChange(event) {
        this.setState({
            sgmctlselectedIndex: event.nativeEvent.selectedSegmentIndex,
        });
    }
    onQTChange(event) {
        if(this.state.intype != 0){
            return;
        }
        this.setState({
            questiontypeIndex: event.nativeEvent.selectedSegmentIndex,
        });
    }
    onATChange(event) {
        if(this.state.intype != 0){
            return;
        }
        this.setState({
            attachmentIndex: event.nativeEvent.selectedSegmentIndex,
        });
    }

    onAddwayChange(event) {
        if(this.state.intype != 0){
            return;
        }
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
        let paceholder_answer = null;
        let paceholder_explain = null;
        if(this.state.intype == 0){
            paceholder_answer = "答案：请添写，最多20字";
            paceholder_explain = "解释：请添写10个字以上，最多160字";
        }else if(this.state.intype == 1){
            paceholder_answer  = "答案：这里是空的";
            paceholder_explain = "解释：这里是空的";
        }

        return(
            <View>
                {this.state.fillorselect == 0 ?
                    <TextInput
                        onChangeText={(text) => {this.answertextchange(text)}}
                        style={styles.answerinput}
                        value={astext}
                        placeholder={paceholder_answer}
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
                    placeholder={paceholder_explain}
                    maxLength={160}
                    multiline={true}
                />
            </View>
        );
    }

    renderAttachmentView(){
        if(this.state.intype !=0 ){
            return;
        }
        return(
            <Image source={this.state.imgSource}  />
        );
    }

    renderAnswerTypeView(){

    }


    docommit(){
        if(this.state.addwayIndex == 1){
            //批量添加，未开发
            Alert.alert('未开发','等通知',[
                {text:'知了'}
            ]);
            return;
        }
        if(this.state.questiontext === "" ){
            Alert.alert('必需填的没填完','请填入问题',[
                {text:'知了'}
            ]);
            return;
        }

        let formData = new FormData();
        let file = {uri: this.state.imgSource, type: 'multipart/form-data', name: 'pic.jpg'};
        formData.append("auth",global.auth);
        formData.append("userid",global.userid);
        formData.append("bookid",this.props.bookid);
        formData.append("qtype",this.state.questiontypeIndex);
        formData.append("ask",this.state.questiontext);
        formData.append("answerinattach",this.state.fillorselect);
        formData.append("answer",JSON.stringify(this.state.answertext));
        formData.append("explain",JSON.stringify(this.state.explaintext));
        formData.append("answerwhere",JSON.stringify(this.state.sgmctlselectedIndex));//答案在附件中时，标志哪个是正确答案

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

                    //Actions.pop();
                }else{
                    //alert(global.auth);
                    alert(responseData.message)
                }

            })
            .catch((error) => {
                alert(error)
            })
    }

    renderselectright(){
        if(this.state.fillorselect == 1){
            return(
                <Text style={styles.typetext}>如下选中项为正确答案</Text>
            )
        }

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
                SegmentedControlValues=['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
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
                {this.renderselectright()}
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
        if(this.state.intype !=0 ){
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

    renderQstType(){
        if(this.state.intype == 0){
            return(
                <View style={styles.segmentedcontrolcontainer}>
                    <SegmentedControlIOS
                        values={['单选','多选','对错','顺序','填空']}
                        selectedIndex={this.state.questiontypeIndex}
                        style={styles.segmented}

                        onChange={(event) => {this.onQTChange(event)}}
                    />
                </View>
            )
        }else{
            let qsalltype=['单选','多选','对错','顺序','填空'];
            return(
                <View>
                    <Text style={{color: '#FF0000',fontSize:16}}>
                        {qsalltype[this.state.questiontypeIndex]}
                    </Text>
                </View>
            )
        }

    }

    renderAttachmentViewSelect(){
        if(this.state.intype !=0 ){
            return;
        }
        return(
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
        )
    }

    jumpToAuthor(){
        Actions.homepage({userId:this.state.questiondata.userid});
    }

    renderAuthorName(){
        return(
            <View style={styles.typeContainer}>
                <Text style={styles.typetext}>作者：</Text>
                <TouchableOpacity  onPress={() => this.jumpToAuthor()} >
                    <Text style={styles.typetext}>{this.state.questiondata.authorname}</Text>
                </TouchableOpacity>
            </View>
        )
    }

    renderCommitTime(){
        let date = new Date();
        let time = date.setMilliseconds(this.state.questiondata.inputtime);
        let date_str = date.toLocaleString();
        return(
            <View style={styles.typeContainer}>
                <Text style={styles.typetext}>时间：{date_str}</Text>
            </View>
        )
    }

    renderAddOneView(){
        return(
            <View >
                {this.renderAuthorName()}
                {this.renderCommitTime()}
                <View style={styles.typeContainer}>
                    <Text style={styles.typetext}>问题类型：</Text>
                    {this.renderQstType()}
                </View>
                <TextInput
                    style={styles.descriptioninput}
                    onChangeText={(text) => this.setState({questiontext:text})}
                    value={this.state.questiontext}
                    placeholder={"题目：请添写10个字以上来描述问题，最多60字"}
                    maxLength={60}
                    multiline={true}
                />
                {this.renderAttachmentViewSelect()}
                {this.renderAttachmentView()}
                {this.renderFillAnswerView()}
                {this.renderQuestionTypeView()}
            </View>
        )
    }

    renderAddMultView(){
        return(
            <ScrollView>
                <Text style={{color: '#FF0000',fontSize:16}}>未开发</Text>
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

    clearall(){
        this.setState({
            imgSource: addimguri,
            questiontext:"考试时间",
            addwayIndex:0,
            sgmctlselectedIndex:0,
            questiontypeIndex:0,
            attachmentIndex:0,
            //rightanswertext:"",
            //rightexplaintext:"",
            answertext:["0601","0602","0603","0604","0605","0606","0607","0608"],
            explaintext:["a","b","c","d","e","f","g","h"],
            textabc:["","","","",""],
            fillingtext:"",
            rightwrongselectedIndex:0,//对或错选择标志
            fillorselect:0 //0:fill 1:select
        })
    }

    renderOneOrMultViewSelect(){
        if(this.state.intype == 0){
            return(
                <View style={styles.addwayContainer}>
                    <SegmentedControlIOS
                        values={['单一添加','批量添加']}
                        selectedIndex={this.state.addwayIndex}
                        style={styles.segmented}
                        onChange={(event) => {this.onAddwayChange(event)}}
                    />
                </View>
            )
        }

    }

    nextqst(step){

        let t_qidx = this.state.qidx+step;

        if(t_qidx >= this.state.allcount){
            t_qidx = 0;
        }else if(t_qidx <= -1){
            t_qidx = this.state.allcount -1;
        }

        let t_questiontext = "";
        let t_questiontypeIndex = 0;
        let t_answertext = ['','','','','','','',''];

        let t_questiondata = this.state.qstlist[t_qidx];
        t_questiontext = t_questiondata.ask;
        t_questiontypeIndex = parseInt(t_questiondata.qtype);

        t_answertext[0] = t_questiondata.right_answer;
        let  t_wrong_answer = JSON.parse(t_questiondata.wrong_answer);
        for(let i=1;i<8;i++){
            t_answertext[i] = t_wrong_answer[i-1];
        }

        this.setState({
            questiondata:t_questiondata,
            qidx: t_qidx,
            questiontext:t_questiontext, //问题
            addwayIndex:0,
            sgmctlselectedIndex:0,//如果答案是的附件中，选中的就是正确答案
            questiontypeIndex:t_questiontypeIndex,  //题目类型
            attachmentIndex:0,
            answertext:t_answertext,
            explaintext:['','','','','','','',''],
        });
    }

    renderNextstep(){
        if(this.state.intype == 0){
            return(
                <View style={styles.bottomcontainer}>
                    <TouchableOpacity style={[styles.buttoncontainer,styles.clearbutton]}  onPress={() => this.clearall()} >
                        <View >
                            <Text style={{fontSize: 16}}>清除</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.buttoncontainer,styles.submitbutton]} onPress={() => this.submitquestion()} >
                        <View >
                            <Text style={{fontSize: 16}}>提交</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            )
        }else if(this.state.intype == 1){
            return(
                <View style={styles.bottomcontainer}>
                    <TouchableOpacity style={[styles.buttoncontainer,styles.clearbutton]}  onPress={() => this.nextqst(-1)} >
                        <View >
                            <Text style={{fontSize: 16}}>上题</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.buttoncontainer,styles.submitbutton]} onPress={() => this.nextqst(1)} >
                        <View >
                            <Text style={{fontSize: 16}}>下题</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            )
        }

    }

    render(){
        return (
            <View style={[GlobleStyles.withoutTitleContainer,styles.container]}>
                {this.renderOneOrMultViewSelect()}
                {this.renderOneOrMultView()}
                {this.renderNextstep()}
            </View>
        );
    }
}


NewSomeQuestions.PropTypes = {
    intype: PropTypes.number, //0新建 1查看
    qstlist: PropTypes.object,  //[查看]进入界面时 传进来的question list
    index:  PropTypes.number, //[查看]进入界面时 传进来的index
    bookid: PropTypes.number,
};
module.exports = NewSomeQuestions;