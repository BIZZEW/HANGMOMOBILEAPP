import React, { Component } from 'react';
import { Text, View, ActivityIndicator, Dimensions } from 'react-native';
import styles from '../../res/styles'

_this = null;
class Loading extends Component {
    constructor(props) {
        super(props);
        _this = this;
        this.state = {
            show: false
        };
    }
    static show = () => {
        _this.setState({ show: true })
    };
    static hide = () => {
        _this.setState({ show: false })
    };
    render() {
        if (this.state.show) {
            return (
                <View style={styles.LoadingPage}>
                    <View style={{
                        width: 100,
                        height: 100,
                        backgroundColor: "rgba(0,0,0,0.6)",
                        opacity: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 7
                    }}>
                        <ActivityIndicator size="large" color="#FFF" />
                        <Text style={{ marginLeft: 10, color: "#FFF", marginTop: 10 }}>正在加载...</Text>
                    </View>
                </View>
            );
        } else {
            return <View />
        }
    }
}
export default Loading;