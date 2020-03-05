import React from 'react';
import { ScrollView, Text, View, DeviceEventEmitter, StyleSheet, TouchableOpacity } from 'react-native';
import { Button, Drawer, List, WhiteSpace, Picker, Provider, InputItem, Icon, Modal, Tabs } from '@ant-design/react-native';
import ScanModule from "../../../nativeCall/ScanModule";
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
    }
});

class ProcureDetailScreen extends React.Component {
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
    }

    componentDidMount() {
        let detail = this.props.navigation.state.params.item;
        alert(JSON.stringify(detail));
        // alert(typeof (detail));
        this.setState({
            detail: JSON.parse(detail)
        })
    }

    render() {
        const tabs = [
            { title: '采购订单信息' },
            { title: '采购订单明细' },
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
                        <View style={{
                            flex: 1,
                            padding: 10,
                            paddingTop: 0,
                            backgroundColor: '#1C86EE',
                            width: "100%"
                        }}>
                            <ScrollView
                                style={{ flex: 1, backgroundColor: "#1C86EE", width: "100%" }}
                                automaticallyAdjustContentInsets={false}
                                showsHorizontalScrollIndicator={false}
                                showsVerticalScrollIndicator={false}
                            >
                                <List style={styles.detailList}>
                                    <Item
                                        extra={
                                            <View>
                                                {this.state.detail.varrordercode}
                                            </View>
                                        }
                                        multipleLine
                                    >
                                        单据号
                                    </Item>
                                    <Item
                                        extra={
                                            <View>
                                                {this.state.detail.dreceivedate}
                                            </View>
                                        }
                                        multipleLine
                                    >
                                        到货日期
                                    </Item>
                                    <Item
                                        extra={
                                            <View>
                                                {this.state.detail.cstoreorganization_name}
                                            </View>
                                        }
                                        multipleLine
                                    >
                                        库存组织
                                    </Item>
                                    <Item
                                        extra={
                                            <View>
                                                {this.state.detail.cbiztype_name}
                                            </View>
                                        }
                                        multipleLine
                                    >
                                        业务流程
                                    </Item>
                                    <Item
                                        extra={
                                            <View>
                                                {this.state.detail.cemployeeid_name}
                                            </View>
                                        }
                                        multipleLine
                                    >
                                        业务员
                                    </Item>
                                    <Item
                                        extra={
                                            <View>
                                                {this.state.detail.cdeptid_name}
                                            </View>
                                        }
                                        multipleLine
                                    >
                                        部门
                                    </Item>
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
                    </View>

                    <View style={styles.tabsContent}>
                        <Text>Content of Second TabContent of Second TabContent of Second TabContent of Second TabContent of Second Tab</Text>
                    </View>
                </Tabs>
            </Provider >
        );
    }
}

export default ProcureDetailScreen;
