import React from 'react';
import { ScrollView, Text, View, StyleSheet, TouchableOpacity, FlatList, AsyncStorage } from 'react-native';
import { Button, List, Provider, Icon, Tabs, Toast } from '@ant-design/react-native';
import axios from '../../../axios/index';
import qs from 'qs';
const Item = List.Item;

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
        position: "absolute",
        zIndex: 100,
        bottom: 20,
        borderColor: "#fff",
        borderWidth: 1,
        borderRadius: 10,
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
        paddingHorizontal: 10
    }
});

const formatTime = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()

    return [year, month, day].map(formatNumber).join('-')
}

const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
}

class SaleoutDetailScreen extends React.Component {
    constructor() {
        super(...arguments);

        this.state = {
            data: [],
            value: [],
            detail: {},
            editedFlag: false,
            submiting: false,
        };

        this.editConfirmed = data => {
            let newDetail = this.state.detail;
            let newSubDetail = data.detail;

            newSubDetail.noutnum = data.noutnum;
            newSubDetail.pk_checkcarg = data.pk_checkcarg;
            newDetail.bitems[data.index] = newSubDetail;

            this.setState({
                detail: newDetail,
                editedFlag: true,
            })
        }

        this.submitConfirmed = async () => {
            if (!this.state.submiting) {
                if (this.state.editedFlag) {
                    this.setState({ submiting: true });

                    let oldList = this.state.detail.bitems;
                    let newDetail = this.state.detail;
                    let newList = [];

                    for await (i of oldList) {
                        if (("pk_checkcarg" in i) && ("noutnum" in i)) {
                            newList.push(i);
                        }
                    }

                    newDetail.bitems = newList;

                    let coperatorid = await AsyncStorage.getItem('coperatorid');
                    let org = await AsyncStorage.getItem('pk_org');

                    let origin = {
                        ...newDetail, pk_org: org, coperatorid: coperatorid, dbilldate: formatTime(new Date())
                    }

                    let params = {
                        params: JSON.stringify(origin)
                    }

                    axios.submitOrder(this, "/signsaleout", qs.stringify(params));
                } else {
                    Toast.fail('您未操作任何一条物料，无法提交', 1);
                }
            } else
                Toast.info("提交中，请稍后", 1);
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
            { title: '销售出库单信息' },
            { title: '销售出库单明细' },
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
                                backgroundColor: "#1270CC",
                            }}
                        >
                            {tabProps.tabs.map((tab, i) => (
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
                                        onTabClick && onTabClick(tabs[i], i);
                                        goToTab && goToTab(i);
                                    }}
                                >
                                    <Text
                                        style={{
                                            color: tabProps.activeTab === i ? '#1270CC' : '#B0B0B0',
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
                                            {this.state.detail.cemployeeid_name}
                                        </Text>
                                    }
                                    multipleLine
                                >
                                    申请人
                                    </Item>
                                <Item
                                    extra={
                                        <Text>
                                            {this.state.detail.cdeptid_name}
                                        </Text>
                                    }
                                    multipleLine
                                >
                                    申请部门
                                    </Item>
                                <Item
                                    extra={
                                        <Text>
                                            {this.state.detail.ctransmodeid_name}
                                        </Text>
                                    }
                                    multipleLine
                                >
                                    运输方式
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
                            style={{
                                ...styles.confirmBtn,
                                backgroundColor: this.state.submiting ? "#B0B0B0" : "#1270CC",
                            }}>
                            <Icon name="check" size="sm" color="#fff" style={styles.btnIcon} />
                            <Text style={styles.btnText}> 出库</Text>
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
                                    <TouchableOpacity activeOpacity={1} onPress={() => { this.props.navigation.navigate('销售出库物料明细', { item: item, index: index, editConfirmed: this.editConfirmed }) }}>
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
            <Text>{"含税金额：" + itemInfo.ntaxmny}</Text>
            <Text>{"批次号：" + itemInfo.vbatchcode}</Text>
            <Text>{"型号：" + itemInfo.cbaseid_type}</Text>
            <Text>{"规格：" + itemInfo.cbaseid_spec}</Text>
            <Text>{"单位：" + itemInfo.measname}</Text>
        </View>
    }
}

export default SaleoutDetailScreen;
