/**
 * Created by fanzhiri on 2017/3/23.
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
        width: 80,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bottomText: {

        fontSize: 16,
        justifyContent: 'center',
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

class BookItem extends Component {
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
        const {name} = this.props;
        if (name) {
            return (
                <View style={styles.bottomTextContainer}>
                    <Text style={styles.bottomText}>{name}</Text>
                    {/*<Image resizeMode="cover" style={styles.bottomImage} source={require('../image/score_line.png')}/>*/}
                </View>
            );
        } else {
            return null;
        }
    }
}

BookItem.PropTypes = {
    bookid:PropTypes.number,
    name: PropTypes.string.isRequired,
    cover: PropTypes.string.isRequired,
    bookbrief: PropTypes.string.isRequired,

};

export default BookItem;