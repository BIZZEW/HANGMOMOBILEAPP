import React from 'react';
import { ScrollView, Text, View, TouchableOpacity, FlatList, AsyncStorage } from 'react-native';
import { Button, List, Provider, Icon, Tabs, Toast } from '@ant-design/react-native';
import axios from '../../../axios/index';
import styles from '../../../res/styles';
import qs from 'qs';
const Item = List.Item;

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

class TransferDetailScreen extends React.Component {
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
            if (!this.state.submiting) {
                if (this.state.editedFlag) {
                    this.setState({ submiting: true });

                    let oldList = this.state.detail.bitems;
                    let newDetail = JSON.parse(JSON.stringify(this.state.detail));
                    let newList = [];

                    for await (let i of oldList) {
                        if (("incargdoc" in i) && ("outcargdoc" in i) && ("num" in i)) {
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

                    axios.submitOrder(this, "/addwhstr", qs.stringify(params));
                } else {
                    Toast.info('您未操作任何一条物料，无法提交', 1);
                }
            } else
                Toast.info("提交中，请稍后", 1);
        }
    }

    componentWillMount() {
        let originDetail = this.props.navigation.state.params.item;
        let detail = JSON.parse(JSON.stringify(originDetail));
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
                            style={styles.tabWrapper}
                        >
                            {tabProps.tabs.map((tab, i) => (
                                <TouchableOpacity
                                    activeOpacity={0.9}
                                    key={tab.key || i}
                                    style={styles.tabComp}
                                    onPress={() => {
                                        const { goToTab, onTabClick } = tabProps;
                                        onTabClick && onTabClick(tabs[i], i);
                                        goToTab && goToTab(i);
                                    }}
                                >
                                    <Text
                                        style={{
                                            ...styles.tabText,
                                            color: tabProps.activeTab === i ? '#1270CC' : '#B0B0B0',
                                            backgroundColor: tabProps.activeTab === i ? "#fff" : "#DFDFDF",
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
                            style={styles.detailScrollView}
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
                            style={{
                                ...styles.confirmBtn,
                                backgroundColor: this.state.submiting ? "#B0B0B0" : "#1270CC",
                            }}>
                            <Icon name="check" size="sm" color="#fff" style={styles.btnIcon} />
                            <Text style={styles.btnText}> 转库</Text>
                        </Button>
                    </View>

                    <View style={styles.tabsContent}>
                        <ScrollView
                            automaticallyAdjustContentInsets={false}
                            showsHorizontalScrollIndicator={false}
                            showsVerticalScrollIndicator={false}
                            style={styles.detailScrollView}
                        >
                            <FlatList
                                style={styles.FlatList}
                                data={this.state.detail.bitems}
                                renderItem={({ item, index }) => (
                                    <TouchableOpacity activeOpacity={1} onPress={() => { this.props.navigation.navigate('转库物料明细', { showListVisible: true, item: item, index: index, editConfirmed: this.editConfirmed }) }}>
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

export default TransferDetailScreen;
