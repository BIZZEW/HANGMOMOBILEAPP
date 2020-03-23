import React from 'react';
import { ScrollView, Text, View, TouchableOpacity, FlatList, AsyncStorage } from 'react-native';
import { Button, List, Provider, Icon, Tabs, Toast } from '@ant-design/react-native';
import DialogModal from '../../common/DialogModal'
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

class ProductDetailScreen extends React.Component {
    constructor() {
        super(...arguments);

        this.state = {
            data: [],
            value: [],
            detail: {},
            editedFlag: false,
            submiting: false,
            isShowDialog: false,
            confirmText: "",
        };

        this.editConfirmed = data => {
            let newDetail = this.state.detail;
            let newSubDetail = data.detail;

            newSubDetail.ninnum = data.ninnum;
            newSubDetail.pk_cargdoc = data.pk_cargdoc;
            newDetail.bitems[data.index] = newSubDetail;

            this.setState({
                detail: newDetail,
                editedFlag: true,
            })
        }

        this.submitConfirmed = async (ischeck) => {
            if (!this.state.submiting) {
                if (this.state.editedFlag) {
                    this.setState({ submiting: true });

                    let oldList = this.state.detail.bitems;
                    let newDetail = this.state.detail;
                    let newList = [];

                    for await (i of oldList) {
                        if (("pk_cargdoc" in i) && ("ninnum" in i)) {
                            newList.push(i);
                        }
                    }

                    newDetail.bitems = newList;

                    let coperatorid = await AsyncStorage.getItem('coperatorid');
                    let org = await AsyncStorage.getItem('pk_org');

                    let origin = {
                        ...newDetail, pk_org: org, coperatorid: coperatorid, dbilldate: formatTime(new Date()), ischeck
                    }

                    let params = {
                        params: JSON.stringify(origin)
                    }

                    axios.submitOrder(this, "/updprodin", qs.stringify(params));
                } else {
                    Toast.fail('您未操作任何一条物料，无法提交', 1);
                }
            } else
                Toast.info("提交中，请稍后", 1);
        }

        // 确认
        this.ensureDialog = () => {
            this.submitConfirmed('N');
            this.setState({ isShowDialog: false });
        }

        //取消
        this.cancelDialog = () => {
            this.setState({ isShowDialog: false });
        }

        // 是否继续
        this.continueConfirm = (confirmText) => {
            this.setState({
                confirmText: confirmText + "，是否继续？",
                isShowDialog: true
            })
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
            { title: '产成品入库单信息' },
            { title: '产成品入库单明细' },
        ];

        return (
            <Provider>
                <DialogModal
                    title={"提示"}
                    content={this.state.confirmText}
                    confirm={this.ensureDialog}
                    cancel={this.cancelDialog}
                    visible={this.state.isShowDialog}
                />
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
                                            {this.state.detail.cstoreorganization_name}
                                        </Text>
                                    }
                                    multipleLine
                                >
                                    库存组织
                                    </Item>
                                <Item
                                    extra={
                                        <Text>
                                            {this.state.detail.ctransmodeid_name}
                                        </Text>
                                    }
                                    multipleLine
                                >
                                    发运
                                    </Item>
                                <Item
                                    extra={
                                        <Text>
                                            {this.state.detail.cemployeeid_name}
                                        </Text>
                                    }
                                    multipleLine
                                >
                                    人员
                                    </Item>
                                <Item
                                    extra={
                                        <Text>
                                            {this.state.detail.cdeptid_name}
                                        </Text>
                                    }
                                    multipleLine
                                >
                                    部门
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
                            onPress={() => this.submitConfirmed('Y')}
                            style={{
                                ...styles.confirmBtn,
                                backgroundColor: this.state.submiting ? "#B0B0B0" : "#1270CC",
                            }}>
                            <Icon name="check" size="sm" color="#fff" style={styles.btnIcon} />
                            <Text style={styles.btnText}> 入库</Text>
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
                                    <TouchableOpacity activeOpacity={1} onPress={() => { this.props.navigation.navigate('产成品入库物料明细', { item: item, index: index, editConfirmed: this.editConfirmed }) }}>
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
            <Text>{"批次号：" + itemInfo.vbatchcode}</Text>
            <Text>{"货位：" + itemInfo.csname}</Text>
            <Text>{"规格：" + itemInfo.cbaseid_spec}</Text>
            <Text>{"型号：" + itemInfo.cbaseid_type}</Text>
            <Text>{"单位：" + itemInfo.measname}</Text>
            <Text>{"行号：" + itemInfo.crowno}</Text>
        </View>
    }
}

export default ProductDetailScreen;
