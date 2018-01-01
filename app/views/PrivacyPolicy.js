/**
 * Created by slako on 17/12/18.
 */
import React, { Component ,PropTypes} from 'react';
import {View, Text, StyleSheet,ScrollView} from "react-native";
import {Actions} from "react-native-router-flux";
import Button from "react-native-button";
import GlobleStyles from '../styles/GlobleStyles';
import SettingItem from '../component/SettingItem';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    textHead: {
        fontSize:18,
        margin:2,
        color:"#0000FF"
    },
    textBody: {
        fontSize:14,
        margin:6
    }
});

class PrivacyPolicy extends Component {

    constructor(props) {
        super(props);
    }

    render(){
        const {idNumber} = this.props;
        return (
            <View style={[GlobleStyles.withoutTitleContainer,{margin:6}]}>
                <ScrollView>
                    <Text style={styles.textHead}>欢迎您来到建识</Text>
                    <Text style={styles.textBody}>「建识」非常重视对您的个人隐私保护，有时候我们需要某些信息才能为您提供您请求的服务，本隐私声明解释了这些情况下的数据收集和使用情况。
本隐私声明适用于「建识」的所有相关服务，随着「建识」服务范围的扩大，隐私声明的内容可由「建识」随时更新，且毋须另行通知。更新后的隐私声明一旦在网页上公布即有效代替原来的隐私声明。
我们收集哪些信息
通常，您能在匿名的状态下访问「建识」并获取信息。当我们需要能识别您的个人信息或者可以与您联系的信息时，我们会征求您的同意。通常，在您注册「建识」或申请开通新的功能时，我们可能收集这些信息：姓名，Email地址，住址和电话号码，并征求您的确认。
关于您的个人信息
「建识」严格保护您个人信息的安全。我们使用各种安全技术和程序来保护您的个人信息不被未经授权的访问、使用或泄漏。
「建识」会在法律要求或符合「建识」的相关服务条款、软件许可使用协议约定的情况下透露您的个人信息，或者有充分理由相信必须这样做才能：
满足法律或行政法规的明文规定，或者符合「建识」网站适用的法律程序；
符合「建识」相关服务条款、软件许可使用协议的约定；
保护「建识」的权利或财产，以及
在紧急情况下保护「建识」产品或服务的用户或大众的个人安全。
「建识」不会未经您的允许将这些信息与第三方共享，本声明已经列出的上述情况除外。
关于免责说明
就下列相关事宜的发生，「建识」不承担任何法律责任：
由于您将用户密码告知他人或与他人共享注册帐户，由此导致的任何个人信息的泄漏，或其他非因「建识」原因导致的个人信息的泄漏；
「建识」根据法律规定或政府相关政策要求提供您的个人信息；
任何第三方根据「建识」各服务条款及声明中所列明的情况使用您的个人信息，由此所产生的纠纷；
任何由于黑客攻击、电脑病毒侵入或政府管制而造成的暂时性网站关闭；
因不可抗力导致的任何后果；
「建识」在各服务条款及声明中列明的使用方式或免责情形。</Text>
                </ScrollView>
            </View>
        );
    }
}

PrivacyPolicy.PropTypes = {
    idnumber:PropTypes.number,
};

module.exports = PrivacyPolicy;
