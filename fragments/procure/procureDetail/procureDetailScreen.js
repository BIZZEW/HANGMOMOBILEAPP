import React from 'react';
import { ScrollView, Text, View, DeviceEventEmitter, StyleSheet } from 'react-native';
import { Button, Drawer, List, WhiteSpace, Picker, Provider, InputItem, Icon, Modal } from '@ant-design/react-native';
import ScanModule from "../../../nativeCall/ScanModule";

const styles = StyleSheet.create({
    scanBtn: {
        height: 45,
        position: "absolute",
        zIndex: 100,
        left: 20,
        bottom: 20,
        borderColor: "#fff",
        borderWidth: 1,
        borderRadius: 10,
        backgroundColor: "#1C86EE",
        // width: "44%",
    },
    btnText: {
        color: "#fff",
        // width:100,
        // backgroundColor: "#000",
        fontSize: 20,
    },
    btnIcon: {
        marginRight: 10,
        // backgroundColor: "#aaa",
        fontSize: 15,
    },
    confirmBtn: {
        height: 45,
        position: "absolute",
        zIndex: 100,
        right: 20,
        bottom: 20,
        borderColor: "#fff",
        borderWidth: 1,
        borderRadius: 10,
        backgroundColor: "#1C86EE",
        // width: "44%",
    },
    detailList: {
        marginBottom: 80,
        borderRadius: 10,
    },
});

class ProcureDetailScreen extends React.Component {
    constructor() {
        super(...arguments);

        this.state = {
            data: [],
            value: [],
        };
    }

    componentWillMount() {
        //通过使用DeviceEventEmitter模块来监听事件
        DeviceEventEmitter.addListener('iDataScan', function (Event) {
            alert(Event.ScanResult);
        });
    }

    render() {
        return (
            <Provider>
                <View style={{ flex: 1, padding: 10, backgroundColor: '#1C86EE' }}>
                    <ScrollView
                        style={{ flex: 1, backgroundColor: "#1C86EE" }}
                        automaticallyAdjustContentInsets={false}
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                    >
                        <List style={styles.detailList}>
                            <Picker
                                data={this.state.data}
                                cols={1}
                                value={this.state.value}
                                onChange={this.onChange}
                            >
                                <List.Item arrow="horizontal" onPress={this.onPress}>
                                    物料
                            </List.Item>
                            </Picker>
                            <InputItem
                                clear
                                error
                                value={this.state.material}
                                onChange={value => {
                                    this.setState({
                                        material: value,
                                    });
                                }}
                                // extra="元"
                                placeholder="请输入物料编码"
                            >
                                编码
                        </InputItem>
                            <InputItem
                                clear
                                error
                                value={this.state.unit}
                                onChange={value => {
                                    this.setState({
                                        unit: value,
                                    });
                                }}
                                // extra="元"
                                placeholder="请输入规格"
                            >
                                规格
                        </InputItem>
                            <Picker
                                data={this.state.data}
                                cols={1}
                                value={this.state.value}
                                onChange={this.onChange}
                            >
                                <List.Item arrow="horizontal" onPress={this.onPress}>
                                    物料
                            </List.Item>
                            </Picker>
                            <InputItem
                                clear
                                error
                                value={this.state.material}
                                onChange={value => {
                                    this.setState({
                                        material: value,
                                    });
                                }}
                                // extra="元"
                                placeholder="请输入物料编码"
                            >
                                编码
                        </InputItem>
                            <InputItem
                                clear
                                error
                                value={this.state.unit}
                                onChange={value => {
                                    this.setState({
                                        unit: value,
                                    });
                                }}
                                // extra="元"
                                placeholder="请输入规格"
                            >
                                规格
                        </InputItem>
                            <Picker
                                data={this.state.data}
                                cols={1}
                                value={this.state.value}
                                onChange={this.onChange}
                            >
                                <List.Item arrow="horizontal" onPress={this.onPress}>
                                    物料
                            </List.Item>
                            </Picker>
                            <InputItem
                                clear
                                error
                                value={this.state.material}
                                onChange={value => {
                                    this.setState({
                                        material: value,
                                    });
                                }}
                                // extra="元"
                                placeholder="请输入物料编码"
                            >
                                编码
                        </InputItem>
                            <InputItem
                                clear
                                error
                                value={this.state.unit}
                                onChange={value => {
                                    this.setState({
                                        unit: value,
                                    });
                                }}
                                // extra="元"
                                placeholder="请输入规格"
                            >
                                规格
                        </InputItem>
                            <Picker
                                data={this.state.data}
                                cols={1}
                                value={this.state.value}
                                onChange={this.onChange}
                            >
                                <List.Item arrow="horizontal" onPress={this.onPress}>
                                    物料
                            </List.Item>
                            </Picker>
                            <InputItem
                                clear
                                error
                                value={this.state.material}
                                onChange={value => {
                                    this.setState({
                                        material: value,
                                    });
                                }}
                                // extra="元"
                                placeholder="请输入物料编码"
                            >
                                编码
                        </InputItem>
                            <InputItem
                                clear
                                error
                                value={this.state.unit}
                                onChange={value => {
                                    this.setState({
                                        unit: value,
                                    });
                                }}
                                // extra="元"
                                placeholder="请输入规格"
                            >
                                规格
                        </InputItem>
                            <Picker
                                data={this.state.data}
                                cols={1}
                                value={this.state.value}
                                onChange={this.onChange}
                            >
                                <List.Item arrow="horizontal" onPress={this.onPress}>
                                    物料
                            </List.Item>
                            </Picker>
                            <InputItem
                                clear
                                error
                                value={this.state.material}
                                onChange={value => {
                                    this.setState({
                                        material: value,
                                    });
                                }}
                                // extra="元"
                                placeholder="请输入物料编码"
                            >
                                编码
                        </InputItem>
                            <InputItem
                                clear
                                error
                                value={this.state.unit}
                                onChange={value => {
                                    this.setState({
                                        unit: value,
                                    });
                                }}
                                // extra="元"
                                placeholder="请输入规格"
                            >
                                规格
                        </InputItem>
                            <Picker
                                data={this.state.data}
                                cols={1}
                                value={this.state.value}
                                onChange={this.onChange}
                            >
                                <List.Item arrow="horizontal" onPress={this.onPress}>
                                    物料
                            </List.Item>
                            </Picker>
                            <InputItem
                                clear
                                error
                                value={this.state.material}
                                onChange={value => {
                                    this.setState({
                                        material: value,
                                    });
                                }}
                                // extra="元"
                                placeholder="请输入物料编码"
                            >
                                编码
                        </InputItem>
                            <InputItem
                                clear
                                error
                                value={this.state.unit}
                                onChange={value => {
                                    this.setState({
                                        unit: value,
                                    });
                                }}
                                // extra="元"
                                placeholder="请输入规格"
                            >
                                规格
                        </InputItem>
                            <Picker
                                data={this.state.data}
                                cols={1}
                                value={this.state.value}
                                onChange={this.onChange}
                            >
                                <List.Item arrow="horizontal" onPress={this.onPress}>
                                    物料
                            </List.Item>
                            </Picker>
                            <InputItem
                                clear
                                error
                                value={this.state.material}
                                onChange={value => {
                                    this.setState({
                                        material: value,
                                    });
                                }}
                                // extra="元"
                                placeholder="请输入物料编码"
                            >
                                编码
                        </InputItem>
                        </List>
                    </ScrollView>
                    <Button
                        onPress={() => ScanModule.openScanner()}
                        style={styles.scanBtn}>
                        <Icon name="scan" size="sm" color="#fff" style={styles.btnIcon} />
                        <Text style={styles.btnText}> 扫码</Text>
                    </Button>
                    <Button
                        onPress={() => ScanModule.openScanner()}
                        style={styles.confirmBtn}>
                        <Icon name="check" size="sm" color="#fff" style={styles.btnIcon} />
                        <Text style={styles.btnText}> 确认</Text>
                    </Button>
                </View>
            </Provider>
        );
    }
}

export default ProcureDetailScreen;