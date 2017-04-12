/**
 * Created by fanzhiri on 2017/4/12.
 */
import React, {Component, PropTypes} from 'react';
import {Actions} from "react-native-router-flux";
import {
    TouchableOpacity,
    TouchableNativeFeedback,
    View,
    Text,
    Image,
    StyleSheet,
    Dimensions,
    Switch,
    Platform
} from 'react-native';

const windowWidth = Dimensions.get('window').width;


class SettingItem extends Component{
    constructor(props){
        super(props);
        this.state = {
            switchIsOn: this.props.switcherValue
        };
    }



    static defaultProps = {
        textColor: '#000',
        switcherValue: false
    }

    render(){
        const {text, textColor, subText, onPress, isHasSwitcher, switcherValue} = this.props;

        if(Platform.OS === 'android'){
            return(
                <TouchableNativeFeedback onPress={onPress}>
                    <View style={styles.listItem}>
                        <Text style={{color: textColor, fontSize: 14}}>{text}</Text>
                        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end', alignItems:'center'}}>
                            <Text style={{color: "#ccc"}}>{subText}</Text>
                            { isHasSwitcher ?
                                <Switch
                                    onValueChange={(value) => this.setState({switchIsOn: value})}
                                    style={{marginLeft: 4}}
                                    value={this.state.switchIsOn}/>
                                :
                                null
                            }
                        </View>
                    </View>
                </TouchableNativeFeedback>
            );
        }else if(Platform.OS === 'ios'){
            return(
                <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
                    <View style={styles.listItem}>
                        <Text style={{color: textColor, fontSize: 14}}>{text}</Text>
                        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end', alignItems:'center'}}>
                            <Text style={{color: "#ccc"}}>{subText}</Text>
                            { isHasSwitcher ?
                                <Switch
                                    onValueChange={(value) => this.setState({switchIsOn: value})}
                                    style={{marginLeft: 4}}
                                    value={this.state.switchIsOn}/>
                                :
                                null
                            }
                        </View>
                    </View>
                </TouchableOpacity>
            );
        }
    }
}

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

SettingItem.propTypes = {
    text: PropTypes.string.isRequired,
    textColor: PropTypes.string,
    subText: PropTypes.string,
    onPress: PropTypes.func,
    isHasSwitcher: PropTypes.bool,
    switcherValue: PropTypes.bool
}

export default SettingItem;