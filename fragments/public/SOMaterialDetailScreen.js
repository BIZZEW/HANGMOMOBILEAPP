import React from 'react';
import { ScrollView, Text, View, DeviceEventEmitter, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Button, Drawer, List, WhiteSpace, Picker, Provider, InputItem, Icon, Modal, Tabs } from '@ant-design/react-native';
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

class SOMaterialDetailScreen extends React.Component {
    constructor() {
        super(...arguments);

        this.state = {
            detail: {},
            index: "",
            noutnum: "",
            pk_checkcarg: "",
        };

        this.materialConfirm = () => {
            if (this.state.noutnum.trim() === "" || this.state.pk_checkcarg.trim() === "")
                Toast.fail('需要填选的项为必输', 1);
            // else if (this.state.detail.pk_cargdoc != this.state.pk_checkcarg)
            //     Toast.fail('货位不符，请检查扫的条形码是否正确', 3);
            else {
                const { navigation } = this.props;
                navigation.navigate("销售出库单");
                navigation.state.params.editConfirmed(this.state);
            }
        };
    }

    componentWillMount() {
        let _this = this;
        //通过使用DeviceEventEmitter模块来监听事件
        DeviceEventEmitter.addListener('iDataScan', function (Event) {
            // alert("扫码结果为： " + Event.ScanResult);
            _this.setState({
                pk_checkcarg: Event.ScanResult
            })
        });

        let detail = this.props.navigation.state.params.item;
        let index = this.props.navigation.state.params.index;
        let pk_checkcarg = detail.pk_checkcarg ? detail.pk_checkcarg : "";
        let noutnum = detail.noutnum ? detail.noutnum : "";
        this.setState({
            detail, index, pk_checkcarg, noutnum
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
                                value={this.state.pk_checkcarg}
                                placeholder="请扫码获取库位"
                                editable={false}
                            >
                                货位
                            </InputItem>

                            <InputItem
                                clear
                                type="number"
                                value={this.state.noutnum}
                                onChange={noutnum => {
                                    this.setState({ noutnum });
                                }}
                                placeholder="请输入实际入库数量"
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

export default SOMaterialDetailScreen;