import React from 'react';
import { ScrollView, Text, View, DeviceEventEmitter, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Button, Drawer, List, WhiteSpace, Picker, Provider, InputItem, Icon, Modal, Tabs } from '@ant-design/react-native';
import ScanModule from "../../nativeCall/ScanModule";
const Item = List.Item;
const Brief = Item.Brief;

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
    },
    btnText: {
        color: "#fff",
        fontSize: 20,
    },
    btnIcon: {
        marginRight: 10,
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
    },
    detailList: {
        marginBottom: 80,
        borderRadius: 10,
    },
    tabsContent: {
        alignItems: 'center',
        justifyContent: 'center',
        height: "100%",
        width: "100%",
        backgroundColor: '#1C86EE',
    },
    FlatList: {
        flex: 1,
        backgroundColor: '#1C86EE',
        paddingBottom: 60,
    },
    ListItem: {
        backgroundColor: "#fff",
        marginBottom: 10,
        borderRadius: 10,
        // height: 200,
        padding: 20,
    },
    ScrollView: {
        flex: 1,
        backgroundColor: "#1C86EE",
        width: "100%",
        paddingHorizontal: 10,
        paddingTop: 10,
    }
});

class MaterialDetailScreen extends React.Component {
    constructor() {
        super(...arguments);

        this.state = {
            data: [],
            value: [],
            detail: {},
        };
    }

    componentWillMount() {
        //通过使用DeviceEventEmitter模块来监听事件
        DeviceEventEmitter.addListener('iDataScan', function (Event) {
            alert(Event.ScanResult);
        });

        let detail = this.props.navigation.state.params.item;
        this.setState({
            detail
        })
    }

    render() {
        return (
            <Provider>
                <View style={styles.tabsContent}>
                    <ScrollView
                        style={styles.ScrollView}
                        automaticallyAdjustContentInsets={false}
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                    >
                        <List style={styles.detailList}>
                            <Item
                                extra={
                                    <Text>
                                        {this.state.detail.cbaseid}
                                    </Text>
                                }
                                multipleLine
                            >
                                物料主键
                                    </Item>
                            <Item
                                extra={
                                    <Text>
                                        {this.state.detail.cbaseid_code}
                                    </Text>
                                }
                                multipleLine
                            >
                                物料编码
                                    </Item>
                            <Item
                                extra={
                                    <Text>
                                        {this.state.detail.cbaseid_name}
                                    </Text>
                                }
                                multipleLine
                            >
                                物料名称
                                    </Item>
                            <Item
                                extra={
                                    <Text>
                                        {this.state.detail.cbaseid_spec}
                                    </Text>
                                }
                                multipleLine
                            >
                                规格
                                    </Item>
                            <Item
                                extra={
                                    <Text>
                                        {this.state.detail.baseid_type}
                                    </Text>
                                }
                                multipleLine
                            >
                                型号
                                    </Item>
                            <Item
                                extra={
                                    <Text>
                                        {this.state.detail.measname}
                                    </Text>
                                }
                                multipleLine
                            >
                                主单位
                                    </Item>
                            <Item
                                extra={
                                    <Text>
                                        {this.state.detail.narrvnum}
                                    </Text>
                                }
                                multipleLine
                            >
                                到货数量
                                    </Item>
                            <Item
                                extra={
                                    <Text>
                                        {this.state.detail.nprice}
                                    </Text>
                                }
                                multipleLine
                            >
                                本币单价
                                    </Item>
                            <Item
                                extra={
                                    <Text>
                                        {this.state.detail.nmoney}
                                    </Text>
                                }
                                multipleLine
                            >
                                本币金额
                                    </Item>
                            <Item
                                extra={
                                    <Text>
                                        {this.state.detail.crowno}
                                    </Text>
                                }
                                multipleLine
                            >
                                行号
                                    </Item>
                        </List>
                    </ScrollView>
                    <Button
                        onPress={() => ScanModule.openScanner()}
                        style={styles.confirmBtn}>
                        <Icon name="check" size="sm" color="#fff" style={styles.btnIcon} />
                        <Text style={styles.btnText}> 确定</Text>
                    </Button>
                    <Button
                        onPress={() => ScanModule.openScanner()}
                        style={styles.scanBtn}>
                        <Icon name="scan" size="sm" color="#fff" style={styles.btnIcon} />
                        <Text style={styles.btnText}> 扫码</Text>
                    </Button>
                </View>
            </Provider >
        );
    }
}

export default MaterialDetailScreen;