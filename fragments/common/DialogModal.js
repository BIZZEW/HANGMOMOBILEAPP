import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Modal,
    TouchableOpacity
} from 'react-native';


export default class DialogModal extends Component {

    render() {
        return (
            <Modal style={styles.container}
                transparent={true}
                visible={this.props.visible}
                onRequestClose={() => {
                    this.props.cancel()
                }}>
                <TouchableOpacity style={{ flex: 1 }} onPress={() => {
                    this.props.cancel()
                }}>
                    <View style={styles.dialogContainer}>
                        <View style={styles.innerContainer}>
                            <View style={styles.contentTitle}>
                                <Text style={styles.titleTextStyle}>{this.props.title}</Text>
                            </View>
                            <View style={styles.contentContainer}>
                                <Text style={styles.dialogContentTextStyle}>{this.props.content}</Text>
                            </View>
                            <View style={styles.btnContainer}>
                                <TouchableOpacity
                                    style={styles.dialogCancelButton}
                                    onPress={() => {
                                        this.props.cancel()
                                    }}>
                                    <Text style={styles.hidemodalTxt}>取消</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.dialogConfirmButton}
                                    onPress={() => {
                                        this.props.confirm()
                                    }}>
                                    <Text style={styles.hidemodalTxt}>确定</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dialogContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)'
    },
    innerContainer: {
        borderRadius: 10,
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 20,
    },
    contentTitle: {
        marginBottom: 10,
    },
    titleTextStyle: {
        fontSize: 20,
        letterSpacing: 20,
    },
    contentContainer: {
        width: "80%",
        borderTopColor: '#cccccc',
        margin: 10
    },
    dialogContentTextStyle: {
        fontSize: 15,
        color: '#000',
    },
    btnContainer: {
        width: "80%",
        height: 40,
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 15,
    },
    dialogConfirmButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: 40,
        marginLeft: 20,
        backgroundColor: "#1270CC",
        borderRadius: 8,
    },
    dialogCancelButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: 40,
        backgroundColor: "#1270CC",
        borderRadius: 8,
    },
    hidemodalTxt: {
        textAlign: 'center',
        fontSize: 16,
        color: '#fff'
    },
});