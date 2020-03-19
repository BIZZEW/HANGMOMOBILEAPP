import React from 'react';
import { ScrollView, Text, View, DeviceEventEmitter, StyleSheet, Keyboard } from 'react-native';
import { Button, List, Provider, InputItem, Icon } from '@ant-design/react-native';
import ScanModule from "../../nativeCall/ScanModule";
import { Toast } from '@ant-design/react-native';
const Item = List.Item;

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
        backgroundColor: "#1270CC",
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
        zIndex: 100,
        bottom: 10,
        borderColor: "#fff",
        borderWidth: 1,
        borderRadius: 10,
        backgroundColor: "#1270CC",
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
        backgroundColor: '#1270CC',
    },
    FlatList: {
        flex: 1,
        backgroundColor: '#1270CC',
        paddingBottom: 60,
    },
    ListItem: {
        backgroundColor: "#fff",
        marginBottom: 10,
        borderRadius: 10,
        padding: 20,
    },
    ScrollView: {
        flex: 1,
        backgroundColor: "#1270CC",
        width: "100%",
        paddingHorizontal: 10,
        paddingTop: 10,
    }
});

class PIMaterialDetailScreen extends React.Component {
    constructor() {
        super(...arguments);

        this._keyboardDidShow = () => {
            this.setState({
                keyboardShown: true,
            })
        }

        this._keyboardDidHide = () => {
            this.setState({
                keyboardShown: false,
            })
        }

        this.state = {
            detail: {},
            index: "",
            ninnum: "",
            ninnumLock: true,
            pk_cargdoc: "",
            keyboardShown: false,
        };

        this.materialConfirm = () => {
            if (this.state.ninnum.trim() === "" || this.state.pk_cargdoc.trim() === "")
                Toast.fail('需要填选的项为必输', 1);
            else {
                const { navigation } = this.props;
                navigation.navigate("产成品入库单");
                navigation.state.params.editConfirmed(this.state);
            }
        };
    }

    componentDidMount() {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
    }

    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    componentWillMount() {
        let _this = this;
        //通过使用DeviceEventEmitter模块来监听事件
        DeviceEventEmitter.addListener('iDataScan', function (Event) {
            // alert("扫码结果为： " + Event.ScanResult);
            _this.setState({
                pk_cargdoc: Event.ScanResult
            })
            if (_this.inputRef)
                _this.inputRef.focus();
        });

        let detail = this.props.navigation.state.params.item;
        let index = this.props.navigation.state.params.index;
        let pk_cargdoc = detail.pk_cargdoc ? detail.pk_cargdoc : "";
        let ninnum = detail.ninnum ? detail.ninnum : "";
        this.setState({
            detail, index, pk_cargdoc, ninnum
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
                        <List renderHeader={'请填选'}>
                            <InputItem
                                clear
                                type="text"
                                value={this.state.pk_cargdoc}
                                placeholder="请扫码获取库位"
                                editable={false}
                                style={{ fontSize: 16 }}
                            >
                                货位
                            </InputItem>

                            <InputItem
                                clear
                                type="number"
                                value={this.state.ninnum}
                                onChange={ninnum => {
                                    if (!this.state.ninnumLock)
                                        this.setState({ ninnum });
                                }}
                                onFocus={() => {
                                    this.setState({ ninnumLock: false });
                                }}
                                onBlur={() => {
                                    this.setState({ ninnumLock: true });
                                }}
                                placeholder="请输入实际入库数量"
                                style={{ fontSize: 16 }}
                                ref={el => (this.inputRef = el)}
                            >
                                入库数量
                            </InputItem>
                        </List>

                        <List style={styles.detailList} renderHeader={'请查看'}>
                            <Item
                                extra={
                                    <Text>
                                        {this.state.detail.csname}
                                    </Text>
                                }
                                multipleLine
                            >
                                货位名称
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
                                        {this.state.detail.cbaseid_type}
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
                                        {this.state.detail.vbatchcode}
                                    </Text>
                                }
                                multipleLine
                            >
                                批次号
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
                        onPress={() => this.materialConfirm()}
                        style={{ ...styles.confirmBtn, display: this.state.keyboardShown ? "none" : "flex", position: this.state.keyboardShown ? "relative" : "absolute" }}
                    >
                        <Icon name="check" size="sm" color="#fff" style={styles.btnIcon} />
                        <Text style={styles.btnText}> 确定</Text>
                    </Button>
                </View>
            </Provider >
        );
    }
}

export default PIMaterialDetailScreen;