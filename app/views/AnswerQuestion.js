/**
 * Created by slako on 17/2/18.
 */
import React, { Component,PropTypes } from 'react';
import {View, Text, StyleSheet, Image, Dimensions,ScrollView,TouchableOpacity,ListView,SegmentedControlIOS} from "react-native";
import {Actions} from "react-native-router-flux";
import Button from 'apsl-react-native-button'
import GlobleStyles from '../styles/GlobleStyles';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import Icon from 'react-native-vector-icons/Ionicons';
import DataStore from '../util/DataStore';
const styles = StyleSheet.create({
    container: {

        backgroundColor: '#F5FCFF',
    },
    question:{
        fontSize:20
    },
    answerfont:{
        fontSize:20
    },
    nextperbuttoncontainer:{
        flexDirection:'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    nextperbutton:{
        width:80,
        height:30,

        backgroundColor: '#00EE00'
    },
    topButtoncontainer:{
        flexDirection:'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        height:60,
    },
    topButtonitemcontainer:{
        width:40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    IconItem:{
        justifyContent: 'center',
        alignItems: 'center',
        width: 40,
    },listItem: {
        flex: 1,
        height: 48,
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 16,
        paddingRight: 25,
        borderBottomColor: '#c4c4c4',
        borderBottomWidth: 1
    },circle:{
        borderRadius:16,
        height:32,
        width:32,
        margin:4,
        backgroundColor: '#F2FF50',
        justifyContent: 'center',
        alignItems: 'center',
    }
});

const window = Dimensions.get('window');

var doanswerquestionpostUrl = "https://slako.applinzi.com/index.php?m=question&c=index&a=getquestion";
var doGetQuestionGetBaseUrl = "https://slako.applinzi.com/api/1/question/";
var httpsBaseUrl = "https://slako.applinzi.com";




class AnswerQuestion extends Component {
    constructor(props) {
        super(props);

        let t_questiondataarr = null;
        let choose_arr = null;
        if(this.props.intype == 0){
            t_questiondataarr = this.props.buildingbookdata;
        }else if(this.props.intype == 1){
            t_questiondataarr = JSON.parse(this.props.publicbookdata.qidtext);
        }else if(this.props.intype == 2){
            t_questiondataarr = this.props.readyquestion_arr;
        }
        //choose_arr = new Array([t_questiondataarr.length]); 这是错误的写法
        choose_arr = new Array(t_questiondataarr.length);

        if(this.props.asktype == 1){
            t_questiondataarr=t_questiondataarr.reverse();
        }

        for(let i=0;i<t_questiondataarr.length;i++){
            choose_arr[i] = -1;
        }

        this._timer=null;

        this.state = {
            count:0,
            fetchresult:null,
            questiondata:null,
            ask:null,
            selectone:-1,
            answer:null,
            questionidx:-1,//当前题目的指向
            rightidx:-1,
            allcount:t_questiondataarr.length,
            questiondataarr:t_questiondataarr,
            readyquestionarr:this.props.readyquestion_arr,
            choose:choose_arr,

            card:0,//1为查看题卡,
            counttime:props.counttime?props.counttime:60,
            up_min:0,
            up_second:0,

            tabSelectedIndex:0

        };

        this._dofetchquestion = this.dofetchquestion.bind(this);
        this._renderloading = this.renderloading.bind(this);
        this._renderquestion = this.renderquestion.bind(this);
        this._showquestion = this.showquestion.bind(this);
        this._renderCardItem = this.renderCardItem.bind(this);
        this._onCardChange = this.onCardChange.bind(this);
    }

    changeTimeCount(){
        let downtime = this.state.counttime - 1 ;
        let t_second = this.state.up_second + 1 ;
        let t_min = this.state.up_min;
        if(t_second >= 60){
            t_second = 0;
            t_min = t_min + 1;
        }



        if(downtime == -1){
            this._timer && clearInterval(this._timer);
            return;
        }
        this.setState({
            counttime:downtime,
            second:t_second,
            up_min:t_min,
            up_second:t_second
        })

    }

    componentWillMount(){

        this.anotherquestion(1);
        this._timer=setInterval(()=>this.changeTimeCount(),1000);
    }

    componentWillUnmount(){
        this._timer && clearInterval(this._timer);
    }

    renderwrongright(idx){
        var iconname=null;
        var iconColor=null;
        if(this.props.answermode != 0){
            iconColor ="#15FFF5";
            iconname="md-checkmark-circle";
            if(this.state.choose[this.state.questionidx] == idx){
                return(
                    <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end'}}>
                        <View style={styles.IconItem}>
                            <Icon name={iconname} size={22} color={iconColor}/>
                        </View>
                    </View>
                )
            }
        }else{
            if(idx == this.state.rightidx){
                iconColor ="#00FF00";
                iconname="md-checkmark-circle";
            }else{
                iconColor ="#FF0000";
                iconname="md-close-circle";
            }
        }

        if(this.state.selectone == idx){
            return(
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end'}}>
                    <View style={styles.IconItem}>
                        <Icon name={iconname} size={22} color={iconColor}/>
                    </View>
                </View>
            )
        }

    }

    onSelectAnswer(idx){
        let t_choose=this.state.choose;
        t_choose[this.state.questionidx]=idx;
        this.setState({
            selectone:idx,
            choose:t_choose
        })
    }




    showAnswerItem(text,idx){

        return(
            <TouchableOpacity onPress={() => this.onSelectAnswer(idx)} activeOpacity={0.8}>
                <View style={styles.listItem}>
                    <View style={styles.circle}>
                        <Text>{idx}</Text>
                    </View>
                    <Text style={styles.answerfont}> {text} </Text>
                    {this.renderwrongright(idx)}
                </View>
            </TouchableOpacity>
        );
    }

    dofetchquestion(questionid){
        let url = `${doGetQuestionGetBaseUrl}${questionid}`;
        var opts = {
            method:"GET"
        }
        fetch(url,opts)
            .then((response) => response.json())
            .then((responseData) => {

                if(responseData.code == 100){
                    let rightindex = Math.floor(Math.random() * 4);
                    //let answer=Array.of(responseData.data.wrong_answer_1,responseData.data.wrong_answer_2,responseData.data.wrong_answer_3);
                    let answer=JSON.parse(responseData.data.wrong_answer);
                    let rightanswer=responseData.data.right_answer;
                    answer.splice(rightindex,0,rightanswer);
                    //找出正确答案的位置

                    this.setState({
                        questiondata:responseData.data,
                        fetchresult:"ok",
                        ask:responseData.data.ask,
                        radio:radio_props
                    })

                }else{

                }

            })
            .catch((error) => {
                alert(error)
            })
    }

    anotherquestion(what){
        let t_questionidx=0;
        if(what == 0){
            t_questionidx=this.state.questionidx-1;
            if(t_questionidx == -1){
                t_questionidx = this.state.allcount-1;
            }
        }else if(what == 1){
            t_questionidx=this.state.questionidx+1;

            if(t_questionidx == this.state.allcount){
                t_questionidx = 0;
            }
        }

        let t_questiondata = this.state.questiondataarr[parseInt(t_questionidx)];

        let rightindex = null;
        let answerarr = null;

        if(this.props.intype == 2){
            answerarr=this.props.answer_arr[parseInt(t_questionidx)].randomanswer;
        }else{
            rightindex = Math.floor(Math.random() * 4);
            answerarr=JSON.parse(t_questiondata.wrong_answer);
            let rightanswer=t_questiondata.right_answer;
            answerarr.splice(rightindex,0,rightanswer);
        }


        this.setState({
            questiondata:t_questiondata,
            rightidx:rightindex,
            answer:answerarr,
            questionidx:t_questionidx,
            selectone:-1
        })
    }

    renderquestion(){
        if(this.state.questiondata == null){

            //var qid=global.bookqids.shift();

            //this._dofetchquestion(qid);

            return this._renderloading();
        }else{
            return this._showquestion();
        }
    }

    onPressNext(){
        this.anotherquestion(1);
    }

    onPressPre(){
        this.anotherquestion(0);
    }

    rendertopbutton(iconname,name,onpressfunc){
        var iconColor="#FF0000";
        return(
            <TouchableOpacity onPress={onpressfunc} activeOpacity={0.8}>
                <View style={styles.topButtonitemcontainer}>
                    <View style={styles.IconItem}>
                        <Icon name={iconname} size={22} color={iconColor}/>
                    </View>
                    <Text>{name}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    invote(idx){
        switch (idx){
            case 0:
                Actions.answersetting();
                break;
            case 1:
                break;
            case 2:
                break;
            case 3:
                break;
            case 4:
                break;
            case 5:
                this.setState({card:1})
                break;
            case 6:
                break;
            case 7:
                break;
        }
    }

    renderqtype(qtype){
        var questiontype=null;
        switch(parseInt(qtype)){
            case 0:questiontype="单选";
                break;
            case 1:questiontype="多选";
                break;
            case 2:questiontype="对错";
                break;
            case 3:questiontype="顺序";
                break;
            case 4:questiontype="填空";
                break;
            default:questiontype=qtype;
        }

        return(
            <Text style={styles.question}>题目类型：{questiontype}</Text>
        )
    }

    showquestion(){

        return (
            <View style={styles.container}>



                <View style={styles.topButtoncontainer}>

                    {this.rendertopbutton("md-grid",    "题卡",   () => this.invote(5))}
                    {this.rendertopbutton("md-alarm",   "时间",   () => this.invote(7))}
                    {this.rendertopbutton("md-cafe",    "评论",   () => this.invote(6))}
                    {this.rendertopbutton("md-thumbs-up","赞",    () => this.invote(4))}
                    {this.rendertopbutton("md-star",    "收藏",   () => this.invote(3))}
                    {this.rendertopbutton("md-share",   "分享",   () => this.invote(2))}
                    {this.rendertopbutton("md-stats",   "统计",   () => this.invote(1))}
                    {this.rendertopbutton("md-settings","设置",   () => this.invote(0))}
                </View>
                <Text style={styles.question}>完成进度 {this.state.count+1}:{this.state.allcount}</Text>
                <Text style={styles.question}>题号: {this.state.questionidx+1}</Text>
                {
                    this.state.questiondata.img?
                        <Image resizeMode="cover" source={{uri:`${httpsBaseUrl}${this.state.questiondata.img}`, width: window.width, height: 200 }} ></Image>
                        :
                        null
                }
                {this.renderqtype(this.state.questiondata.qtype)}
                <Text style={styles.question}>{this.state.questiondata.ask}</Text>

                <ScrollView>
                    {this.showAnswerItem(this.state.answer[0],0)}
                    {this.showAnswerItem(this.state.answer[1],1)}
                    {this.showAnswerItem(this.state.answer[2],2)}
                    {this.showAnswerItem(this.state.answer[3],3)}
                </ScrollView>

                <View style={styles.nextperbuttoncontainer}>
                    <Button style={styles.nextperbutton} textStyle={{fontSize: 16}} onPress={() => this.onPressPre() }>上个</Button>
                    <Button style={styles.nextperbutton} textStyle={{fontSize: 16}} onPress={() => this.onPressNext()}>下个</Button>
                    <Button style={styles.nextperbutton} textStyle={{fontSize: 16}} onPress={() => this.onPressNext()}>不懂</Button>

                </View>

            </View>
        )
    }

    renderloading(){
        return (
            <View style={styles.container}>
                <Text>Loading ...</Text>
            </View>
        )
    }

    goToSelectQst(){
        this.setState({
            card:0,

        })
    }

    renderCardItem(rowData, sectionID, rowID){

        let notDoneColor = "#FFFFFF"
        if(this.state.choose[rowID] != -1){
            notDoneColor = "#A0FFA0"
        }
        if(this.state.tabSelectedIndex == 1){
            if(this.state.choose[rowID] == -1){
                return null;
            }
        }else if(this.state.tabSelectedIndex == 2){
            if(this.state.choose[rowID] != -1){
                return null;
            }
        }
        return(
            <TouchableOpacity onPress={()=> this.goToSelectQst(rowID)} activeOpacity={0.8}>
                <View style={{
                    height:32,
                    backgroundColor:notDoneColor,
                    borderBottomWidth:1,
                    borderBottomColor:'#08e8e8',
                    alignItems:"center",
                    flexDirection:"row",
                    paddingLeft:10
                }}>
                    <Text>{parseInt(rowID)+1}</Text>
                </View>
            </TouchableOpacity>
        )
    }
    onBackPressFunc(){
        this.setState({
            card:0
        })
    }

    renderBackButton(){
        var iconColor="#0808FF";
        return(
            <TouchableOpacity onPress={()=> this.onBackPressFunc()} activeOpacity={0.8}>
                <View style={styles.IconItem}>
                    <Icon name={"ios-arrow-back"} size={32} color={iconColor}/>
                </View>
            </TouchableOpacity>
        )
    }

    onEndPressFunc(){
        Actions.pop();
    }

    renderEndButton(){
        var iconColor="#00FF00";
        return(
            <TouchableOpacity onPress={()=> this.onEndPressFunc()} activeOpacity={0.8}>
                <View style={styles.IconItem}>
                    <Icon name={"ios-arrow-forward"} size={32} color={iconColor}/>
                </View>
            </TouchableOpacity>
        )
    }

    renderBackBar(){
        return(
            <View style={{height:32,flexDirection:"row",alignItems:"center"}}>
                {this.renderBackButton()}
                <Text>继续答题</Text>
                <View style={{height:32,flexDirection:"row",alignItems:"center",flex:1,justifyContent:"flex-end"}}>
                    <Text>结束答题</Text>
                    {this.renderEndButton()}
                </View>
            </View>
        )
    }

    onCardChange(event){
        this.setState({
            tabSelectedIndex: event.nativeEvent.selectedSegmentIndex,
        });
    }

    renderStatistics(){

        let done =0;
        for(let i=0;i<this.state.allcount;i++){
            if(this.state.choose[i] != -1){
                done+=1;
            }
        }

        let allcountText ="总题:"+this.state.allcount;
        let doneText = "已答:"+done;
        let waitText = "未答:"+ (this.state.allcount - done);

        return(
                <Text>耗费时间：{this.state.up_min}:{this.state.up_second}</Text>
                <Text>剩余时间：{this.state.counttime}</Text>
                <View>
                    <SegmentedControlIOS
                        values={[allcountText,doneText,waitText]}
                        selectedIndex={this.state.tabSelectedIndex}
                        style={styles.segmented}
                        onChange={this._onCardChange}
                    />
                </View>
            </View>
        )
    }

    renderCard(){
        return(
            <View>
                {this.renderBackBar()}
                {this.renderStatistics()}
                <ListView
                    style={styles.list}
                    dataSource={DataStore.cloneWithRows(this.state.choose)}
                    renderRow={this._renderCardItem}
                    enableEmptySections = {true}
                />
            </View>

        )
    }

    renderFragment(){
        if(this.state.card == 1){
            return this.renderCard();
        }else{
            return this._renderquestion();
        }
    }

    render(){
        return (
            <View style={GlobleStyles.withoutTitleContainer}>
                {this.renderFragment()}
            </View>
        )
    }
}

AnswerQuestion.PropTypes = {
    intype:PropTypes.number,          //0正在建的题本测试 1已经发布的 2已经整理好的题目
    asktype:PropTypes.number,          //0顺序 1随机
    questiontype: PropTypes.string.isRequired,//random随机；order顺序
    questioncount:PropTypes.number,
    answermode:PropTypes.number,//0看题，1随便考 2真考
    // qids:PropTypes.array.isRequired,
    publicbookdata:PropTypes.object,
    buildingbookdata:PropTypes.object,
    readyquestion_arr:PropTypes.object,
    answer_arr:PropTypes.object,
    counttime:PropTypes.number,
};

module.exports = AnswerQuestion;