import React from 'react';
import { ScrollView, Text, View, DeviceEventEmitter, StyleSheet, TouchableOpacity, FlatList, AsyncStorage } from 'react-native';
import { Button, Drawer, List, WhiteSpace, Picker, Provider, InputItem, Icon, Modal, Tabs, Toast } from '@ant-design/react-native';
// import ScanModule from "../../../nativeCall/ScanModule";
import axios from '../../../axios/index';
import qs from 'qs';
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
        // right: 20,
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
        paddingHorizontal: 10
    }
});

const formatTime = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return [year, month, day].map(formatNumber).join('-')
}

const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
}

class ChangearoundDetailScreen extends React.Component {
    constructor() {
        super(...arguments);

        this.state = {
            data: [],
            value: [],
            detail: {},
            editedFlag: false,
        };

        this.editConfirmed = data => {
            let newDetail = this.state.detail;
            let newSubDetail = data.detail;

            newSubDetail.num = data.num;
            newSubDetail.incargdoc = data.incargdoc;
            newSubDetail.outcargdoc = data.outcargdoc;
            newDetail.bitems[data.index] = newSubDetail;

            this.setState({
                detail: newDetail,
                editedFlag: true,
            })
        }

        this.submitConfirmed = async () => {
            if (this.state.editedFlag) {
                let oldList = this.state.detail.bitems;
                let newDetail = this.state.detail;
                let newList = [];

                for await (i of oldList) {
                    if (("incargdoc" in i) && ("outcargdoc" in i) && ("num" in i)) {
                        newList.push(i);
                    }
                }

                newDetail.bitems = newList;

                let username = await AsyncStorage.getItem('username');
                let org = await AsyncStorage.getItem('pk_org');

                let origin = {
                    ...newDetail, pk_org: org, coperatorid: username, dbilldate: formatTime(new Date())
                }

                let params = {
                    params: JSON.stringify(origin)
                }

                axios.submitOrder(this, "/addwhstr", qs.stringify(params));
            } else {
                Toast.fail('您未操作任何一条物料，无法提交', 1);
            }
        }
    }

    componentWillMount() {
        let detail = this.props.navigation.state.params.item;
        this.setState({
            detail
        })
    }

    render() {
        const tabs = [
            { title: '转库单信息' },
            { title: '转库单明细' },
        ];

        return (
            <Provider>
                <Tabs
                    tabs={tabs}
                    renderUnderline={() => null}
                    styles={{
                        topTabBarSplitLine: {
                            borderBottomWidth: 0,
                        },
                    }}
                    renderTabBar={tabProps => (
                        <View
                            style={{
                                paddingHorizontal: 10,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-evenly',
                                height: 50,
                                backgroundColor: "#1C86EE",
                            }}
                        >
                            {tabProps.tabs.map((tab, i) => (
                                // change the style to fit your needs
                                <TouchableOpacity
                                    activeOpacity={0.9}
                                    key={tab.key || i}
                                    style={{
                                        width: '50%',
                                        padding: 0,
                                        margin: 0,
                                    }}
                                    onPress={() => {
                                        const { goToTab, onTabClick } = tabProps;
                                        // tslint:disable-next-line:no-unused-expression
                                        onTabClick && onTabClick(tabs[i], i);
                                        // tslint:disable-next-line:no-unused-expression
                                        goToTab && goToTab(i);
                                    }}
                                >
                                    <Text
                                        style={{
                                            color: tabProps.activeTab === i ? '#1C86EE' : '#B0B0B0',
                                            backgroundColor: tabProps.activeTab === i ? "#fff" : "#DFDFDF",
                                            paddingVertical: 5,
                                            textAlign: "center",
                                            width: "100%",
                                            fontSize: 15,
                                        }}
                                    >
                                        {tab.title}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                >
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
                                            {this.state.detail.vbillcode}
                                        </Text>
                                    }
                                    multipleLine
                                >
                                    单据号
                                    </Item>
                                <Item
                                    extra={
                                        <Text>
                                            {this.state.detail.dbilldate}
                                        </Text>
                                    }
                                    multipleLine
                                >
                                    单据日期
                                    </Item>
                                <Item
                                    extra={
                                        <Text>
                                            {this.state.detail.vshldarrivedate}
                                        </Text>
                                    }
                                    multipleLine
                                >
                                    应到货日期
                                    </Item>
                                <Item
                                    extra={
                                        <Text>
                                            {this.state.detail.cshlddiliverdate}
                                        </Text>
                                    }
                                    multipleLine
                                >
                                    应发货日期
                                    </Item>
                                <Item
                                    extra={
                                        <Text>
                                            {this.state.detail.outstorname}
                                        </Text>
                                    }
                                    multipleLine
                                >
                                    出库仓库名称
                                    </Item>
                                <Item
                                    extra={
                                        <Text>
                                            {this.state.detail.instorname}
                                        </Text>
                                    }
                                    multipleLine
                                >
                                    入库仓库名称
                                    </Item>
                                <Item
                                    extra={
                                        <Text>
                                            {this.state.detail.vnote}
                                        </Text>
                                    }
                                    multipleLine
                                >
                                    备注
                                    </Item>
                            </List>
                        </ScrollView>
                        <Button
                            onPress={() => this.submitConfirmed()}
                            style={styles.confirmBtn}>
                            <Icon name="check" size="sm" color="#fff" style={styles.btnIcon} />
                            <Text style={styles.btnText}> 转库</Text>
                        </Button>
                    </View>

                    <View style={styles.tabsContent}>
                        <ScrollView
                            automaticallyAdjustContentInsets={false}
                            showsHorizontalScrollIndicator={false}
                            showsVerticalScrollIndicator={false}
                            style={styles.ScrollView}
                        >
                            <FlatList
                                style={styles.FlatList}
                                data={this.state.detail.bitems}
                                renderItem={({ item, index }) => (
                                    <TouchableOpacity activeOpacity={1} onPress={() => { this.props.navigation.navigate('转库物料明细', { item: item, index: index, editConfirmed: this.editConfirmed }) }}>
                                        <ListItem itemInfo={item} />
                                    </TouchableOpacity>
                                )}
                            />
                        </ScrollView>
                    </View>
                </Tabs>
            </Provider >
        );
    }
}

class ListItem extends React.Component {
    render() {
        let itemInfo = this.props.itemInfo;
        return <View style={styles.ListItem}>
            <Text>{"物料编码：" + itemInfo.cbaseid_code}</Text>
            <Text>{"物料名称：" + itemInfo.cbaseid_name}</Text>
            <Text>{"主单位：" + itemInfo.measname}</Text>
            <Text>{"应转数量：" + itemInfo.dshldtransnum}</Text>
            <Text>{"规格：" + itemInfo.cbaseid_spec}</Text>
            <Text>{"批次号：" + itemInfo.vbatchcode}</Text>
        </View>
    }
}

export default ChangearoundDetailScreen;