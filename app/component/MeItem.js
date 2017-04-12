/**
 * Created by fanzhiri on 2017/2/27.
 */
import React, {Component, PropTypes} from 'react';
import {Actions} from "react-native-router-flux";
import {
    TouchableOpacity,
    View,
    Text,
    Image,
    StyleSheet,
    Dimensions,
    Switch,
    Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
const windowWidth = Dimensions.get('window').width;

var httpsBaseUrl = "https://slako.applinzi.com/";

const styles = StyleSheet.create({

    listItem: {
        flex: 1,
        height: 48,
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 25,
        paddingRight: 25,
        borderBottomColor: '#c4c4c4',
        borderBottomWidth: 1
    },
});

class MeItem extends Component{


    static defaultProps = {
        iconColor: 'gray'
    }

    render(){
        const {icon, iconColor, text, subText, onPress} = this.props;

        if(Platform.OS === 'android'){
            return(
                <TouchableNativeFeedback onPress={onPress}>
                    <View style={styles.listItem}>
                        {/*<Icon name={icon} size={22} color={iconColor}/>*/}
                        <Text style={{color: 'black', fontSize: 14, marginLeft: 20}}>{text}</Text>
                        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end'}}>
                            <Text style={{color: "#ccc"}}>{subText}</Text>
                        </View>
                    </View>
                </TouchableNativeFeedback>
            );
        }else if(Platform.OS === 'ios'){
            return(
                <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
                    <View style={styles.listItem}>
                        <Icon name={icon} size={22} color={iconColor}/>
                        <Text style={{color: 'black', fontSize: 14, marginLeft: 20}}>{text}</Text>
                        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end'}}>
                            <Text style={{color: "#ccc"}}>{subText}</Text>
                        </View>

                    </View>
                </TouchableOpacity>
            );
        }
    }
}

MeItem.PropTypes = {
    icon: PropTypes.string.isRequired,
    iconColor: PropTypes.string,
    text: PropTypes.string.isRequired,
    subText: PropTypes.string,
    onPress: PropTypes.func
};

export default MeItem;