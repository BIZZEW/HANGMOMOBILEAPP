import React from 'react';
import { ScrollView, Text, View, DeviceEventEmitter, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Button, Drawer, List, WhiteSpace, Picker, Provider, InputItem, Icon, Modal, Tabs, SegmentedControl } from '@ant-design/react-native';
import ScanModule from "../../nativeCall/ScanModule";
import { Toast, Portal } from '@ant-design/react-native';
const Item = List.Item;
const Brief = Item.Brief;

const styles = StyleSheet.create({
    scanBtn: {
        height: 45,
        position: "absolute",
        zIndex: 100,
        left: 20,
        bottom: 10,
        borderColor: "#fff",
        borderWidth: 1,
        borderRadius: 10,
        backgroundColor: "#1C86EE",
    },
    scanSwitch: {
        height: 30,
        fontSize: 20,
        marginTop: 10,
        marginHorizontal: 15,
        tintColor: "#1C86EE"
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
        // right: 20,
        bottom: 10,
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

class CAMaterialDetailScreen extends React.Component {
    constructor() {
        super(...arguments);

        this.state = {
            detail: {},
            index: "",
            num: "",
            incargdoc: "",
            outcargdoc: "",
            scanIndicator: true,
            showListVisible: false,
        };

        this.materialConfirm = () => {
            if (this.state.num.trim() === "" || this.state.incargdoc.trim() === "" || this.state.outcargdoc.trim() === "")
                Toast.fail('需要填选的项为必输', 1);
            else {
                const { navigation } = this.props;
                navigation.navigate("转库单");
                navigation.state.params.editConfirmed(this.state);
            }
        };

        this.onSegmentChange = e => {
            this.setState({
                scanIndicator: e.nativeEvent.selectedSegmentIndex == 0,
            })
        }

        this.onSegmentValueChange = value => {
            // this.setState({
            //     scanIndicator: value == "入库货位",
            // })
        }
    }

    componentWillMount() {
        let _this = this;
        //通过使用DeviceEventEmitter模块来监听事件
        DeviceEventEmitter.addListener('iDataScan', function (Event) {
            // alert("扫码结果为： " + Event.ScanResult);
            if (_this.state.scanIndicator)
                _this.setState({
                    incargdoc: Event.ScanResult
                })
            else
                _this.setState({
                    outcargdoc: Event.ScanResult
                })
        });

        let showListVisible = this.props.navigation.state.params.showListVisible;

        if (showListVisible) {
            let detail = this.props.navigation.state.params.item;
            let index = this.props.navigation.state.params.index;
            let incargdoc = detail.incargdoc ? detail.incargdoc : "";
            let outcargdoc = detail.outcargdoc ? detail.outcargdoc : "";
            let num = detail.num ? detail.num : "";
            this.setState({
                showListVisible, detail, index, incargdoc, outcargdoc, num
            })
        }
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
                        <List renderHeader={'请填选'}>
                            <SegmentedControl
                                values={['扫入库货位条形码', '扫出库货位条形码']}
                                onChange={this.onSegmentChange}
                                onValueChange={this.onSegmentValueChange}
                                style={styles.scanSwitch}
                            />
                            <View
                                style={{ display: this.state.scanIndicator ? "flex" : "none" }}>
                                <InputItem
                                    clear
                                    type="text"
                                    value={this.state.incargdoc}
                                    placeholder="请扫码获取入库货位"
                                    editable={false}
                                >
                                    入库货位
                            </InputItem>
                            </View>

                            <View
                                style={{ display: this.state.scanIndicator ? "none" : "flex" }}>
                                <InputItem
                                    clear
                                    type="text"
                                    value={this.state.outcargdoc}
                                    placeholder="请扫码获取出库货位"
                                    editable={false}
                                >
                                    出库货位
                            </InputItem>
                            </View>

                            <InputItem
                                clear
                                type="number"
                                value={this.state.num}
                                onChange={num => {
                                    this.setState({ num });
                                }}
                                placeholder="请输入实际转库数量"
                            >
                                转库数量
                            </InputItem>
                        </List>

                        <List style={styles.detailList, { display: this.state.showListVisible ? "flex" : "none" }} renderHeader={'请查看'}>
                            <Item
                                extra={
                                    <Text>
                                        {this.state.detail.shen}
                                    </Text>
                                }
                                multipleLine
                            >
                                剩余数量
                                    </Item>
                            <Item
                                extra={
                                    <Text>
                                        {this.state.detail.nadjustnum}
                                    </Text>
                                }
                                multipleLine
                            >
                                已调整数量
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
                                单位
                                    </Item>
                            <Item
                                extra={
                                    <Text>
                                        {this.state.detail.dshldtransnum}
                                    </Text>
                                }
                                multipleLine
                            >
                                应转数量
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
                            <Item
                                extra={
                                    <Text>
                                        {this.state.detail.vrownote}
                                    </Text>
                                }
                                multipleLine
                            >
                                备注
                                    </Item>
                            <Item
                                extra={
                                    <Text>
                                        {this.state.detail.vbatchcode}
                                    </Text>
                                }
                                multipleLine
                            >
                                批次号
                                    </Item>
                        </List>
                    </ScrollView>
                    <Button
                        onPress={() => this.materialConfirm()}
                        style={styles.confirmBtn}>
                        <Icon name="check" size="sm" color="#fff" style={styles.btnIcon} />
                        <Text style={styles.btnText}> 确定</Text>
                    </Button>
                </View>
            </Provider >
        );
    }
}

export default CAMaterialDetailScreen;