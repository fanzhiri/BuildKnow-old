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
    Dimensions
} from 'react-native';

const windowWidth = Dimensions.get('window').width;

var httpsBaseUrl = "https://slako.applinzi.com/";

const styles = StyleSheet.create({
    image: {
        width: 80,
        height: 80,
    },
    bottomTextContainer: {

        height: 80,
        justifyContent: 'space-around',
        marginLeft: 10,
        width:window.width-90,
    },
    titleText: {
        fontSize: 20,
        justifyContent: 'center',
    },
    bottomText: {
        fontSize: 12,
        justifyContent: 'center',
        width:window.width-100,
    },
    bottomImage: {
        height: 20,
        width: 80
    },
    listItem:{

        padding:10,
        backgroundColor:'white',
        borderBottomWidth:0.5,
        borderBottomColor:'#e8e8e8',

        //主轴方向
        flexDirection:'row',
    },
});

class TestingItem extends Component {
    constructor(props) {
        super(props);
        this.renderBottomText = this.renderBottomText.bind(this);
    }

    render() {
        const { bookid, cover} = this.props;

        return (
            <TouchableOpacity  onPress={()=>(Actions.buildingbook({bookid}))} >
                <View style={styles.listItem}>
                    <Image style={[styles.image, this.props.imageStyle]} resizeMode="cover" source={{uri:`${httpsBaseUrl}${cover}`}}/>
                    {this.renderBottomText()}
                </View>
            </TouchableOpacity>
        );
    }

    renderBottomText() {
        const {name,bookbrief,questionsnumber,follow} = this.props;
        if (name) {
            return (
                <View style={styles.bottomTextContainer}>
                    <Text style={styles.titleText}>{name}</Text>
                    <Text style={styles.bottomText}>简介：{bookbrief}</Text>
                    <Text style={styles.bottomText}>题数：{questionsnumber}     关注：{follow}</Text>
                    {/*<Image resizeMode="cover" style={styles.bottomImage} source={require('../image/score_line.png')}/>*/}
                </View>
            );
        } else {
            return null;
        }
    }
}

TestingItem.PropTypes = {
    bookid:PropTypes.menubar,
    name: PropTypes.string.isRequired,
    cover: PropTypes.string.isRequired,
    bookbrief: PropTypes.string.isRequired,
    questionsnumber:PropTypes.string.isRequired,
    follow:PropTypes.string.isRequired,
};

export default TestingItem;