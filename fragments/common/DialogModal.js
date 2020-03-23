import React, { Component } from 'react';
import { Text, View, Modal, TouchableOpacity } from 'react-native';
import styles from '../../res/styles'

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