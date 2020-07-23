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

class SaleDetailScreen extends React.Component {
    constructor() {
        super(...arguments);

        this.state = {
            data: [],
            value: [],
            detail: {},
            editedFlag: false,
            submiting: false,
            // 暂存标志
            stage: 'N',
        };

        this.editConfirmed = data => {
            let newDetail = this.state.detail;
            let newSubDetail = data.detail;

            newSubDetail.noutnum = data.noutnum;
            newSubDetail.pk_checkcarg = data.pk_checkcarg;
            newSubDetail.vfree10 = "Y";
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
                        if (("pk_checkcarg" in i) && ("noutnum" in i)) {
                            newList.push(i);
                        }
                    }

                    newDetail.bitems = newList;

                    let coperatorid = await AsyncStorage.getItem('coperatorid');
                    let org = await AsyncStorage.getItem('pk_org');

                    let origin = {
                        ...newDetail, pk_org: org, coperatorid: coperatorid, dbilldate: formatTime(new Date()), zancun: this.state.stage
                    }

                    let params = {
                        params: JSON.stringify(origin)
                    }

                    axios.submitOrder(this, "/signsaleout", qs.stringify(params));
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
                                            {this.state.detail.custname}
                                        </Text>
                                    }
                                    multipleLine
                                >
                                    客户名称
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
                            onPress={() => { this.submitConfirmed(); this.setState({ stage: 'N' }) }}
                            style={{
                                ...styles.confirmBtnRt,
                                backgroundColor: this.state.submiting ? "#B0B0B0" : "#1270CC",
                            }}>
                            <Icon name="check" size="sm" color="#fff" style={styles.btnIcon} />
                            <Text style={styles.btnText}> 出库</Text>
                        </Button>
                        <Button
                            onPress={() => { this.submitConfirmed(); this.setState({ stage: 'Y' }) }}
                            style={{
                                ...styles.saveBtn,
                                backgroundColor: this.state.submiting ? "#B0B0B0" : "#1270CC",
                            }}>
                            <Icon name="save" size="sm" color="#fff" style={styles.btnIcon} />
                            <Text style={styles.btnText}> 暂存</Text>
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
                                    <TouchableOpacity activeOpacity={1} onPress={() => { this.props.navigation.navigate('销售出库物料明细', { item: item, index: index, allItems: this.state.detail.bitems, editConfirmed: this.editConfirmed }) }}>
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
        let colorStyle = { color: itemInfo.vfree10 === "Y" ? '#B0B0B0' : '#000' }
        return <View style={{
            ...styles.ListItem,
            backgroundColor: itemInfo.vfree10 === "Y" ? '#DFDFDF' : '#FFF'
        }}>
            <Text style={colorStyle}>{`物料编码：${itemInfo.cbaseid_code ? itemInfo.cbaseid_code : ""}`}</Text>
            <Text style={colorStyle}>{`物料名称：${itemInfo.cbaseid_name ? itemInfo.cbaseid_name : ""}`}</Text>
            <Text style={colorStyle}>{`含税金额：${itemInfo.ntaxmny ? itemInfo.ntaxmny : ""}`}</Text>
            <Text style={colorStyle}>{`批次号：${itemInfo.vbatchcode ? itemInfo.vbatchcode : ""}`}</Text>
            <Text style={colorStyle}>{`型号：${itemInfo.cbaseid_type ? itemInfo.cbaseid_type : ""}`}</Text>
            <Text style={colorStyle}>{`规格：${itemInfo.cbaseid_spec ? itemInfo.cbaseid_spec : ""}`}</Text>
            <Text style={colorStyle}>{`单位：${itemInfo.measname ? itemInfo.measname : ""}`}</Text>
        </View>
    }
}

export default SaleDetailScreen;
