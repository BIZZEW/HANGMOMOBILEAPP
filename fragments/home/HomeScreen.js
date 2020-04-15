import React from 'react';
import { AsyncStorage } from 'react-native';
import Ionicons from 'react-native-vector-icons/FontAwesome5';
import { getActiveChildNavigationOptions } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import ProcuScreen from '../procu/ProcuScreen';
import ProcuDetailScreen from '../procu/ProcuDetail/ProcuDetailScreen';
import ProcuMaterialDetailScreen from '../procu/ProcuMaterialDetail/ProcuMaterialDetailScreen';

import TransferScreen from '../transfer/TransferScreen';
import TransferDetailScreen from '../transfer/TransferDetail/TransferDetailScreen';
import TransferMaterialDetailScreen from '../transfer/TransferMaterialDetail/TransferMaterialDetailScreen';

import ProductScreen from '../product/ProductScreen';
import ProductDetailScreen from '../product/ProductDetail/ProductDetailScreen';
import ProductMaterialDetailScreen from '../product/ProductMaterialDetail/ProductMaterialDetailScreen';
import ProductScanListScreen from '../product/ProductScan/ProductScanListScreen';

import SaleScreen from '../sale/SaleScreen';
import SaleDetailScreen from '../sale/SaleDetail/SaleDetailScreen';
import SaleMaterialDetailScreen from '../sale/SaleMaterialDetail/SaleMaterialDetailScreen';
import styles from '../../res/styles';
import { Icon, Modal } from '@ant-design/react-native';

// 采购入库堆
const ProcuDetailStack = createStackNavigator(
    {
        Home: ProcuDetailScreen,
    },
    {
        defaultNavigationOptions: {
            headerShown: false,
        },
    }
);

// 转库堆
const TransferDetailStack = createStackNavigator(
    {
        Home: TransferDetailScreen,
    },
    {
        defaultNavigationOptions: {
            headerShown: false,
        },
    }
);

// 产成品入库堆
const ProductDetailStack = createStackNavigator(
    {
        Home: ProductDetailScreen,
    },
    {
        defaultNavigationOptions: {
            headerShown: false,
        },
    }
);

// 销售出库堆
const SaleDetailStack = createStackNavigator(
    {
        Home: SaleDetailScreen,
    },
    {
        defaultNavigationOptions: {
            headerShown: false,
        },
    }
);

// 采购入库物料明细
const ProcuMaterialDetailStack = createStackNavigator(
    {
        Home: ProcuMaterialDetailScreen,
    },
    {
        defaultNavigationOptions: {
            headerShown: false,
        },
    }
);

// 转库物料明细
const TransferMaterialDetailStack = createStackNavigator(
    {
        Home: TransferMaterialDetailScreen,
    },
    {
        defaultNavigationOptions: {
            headerShown: false,
        },
    }
);

// 产成品入库物料明细
const ProductMaterialDetailStack = createStackNavigator(
    {
        Home: ProductMaterialDetailScreen,
    },
    {
        defaultNavigationOptions: {
            headerShown: false,
        },
    }
);

// 销售出库物料明细
const SaleMaterialDetailStack = createStackNavigator(
    {
        Home: SaleMaterialDetailScreen,
    },
    {
        defaultNavigationOptions: {
            headerShown: false,
        },
    }
);

// 产成品入库记录列表
const ProductScanListStack = createStackNavigator(
    {
        Home: ProductScanListScreen,
    },
    {
        defaultNavigationOptions: {
            headerShown: false,
        },
    }
);

// 标签栏导航
const TabNavigator = createBottomTabNavigator(
    {
        "采购入库": ProcuScreen,
        "转库": TransferScreen,
        "产成品入库": ProductScreen,
        "销售出库": SaleScreen,
    },
    {
        defaultNavigationOptions: ({ navigation }) => ({
            tabBarIcon: ({ focused, horizontal, tintColor }) => {
                const { routeName } = navigation.state;
                let IconComponent = Ionicons;
                let iconName;
                if (routeName === '采购入库')
                    iconName = `cart-plus`;
                else if (routeName === '转库')
                    iconName = `cart-arrow-down`;
                else if (routeName === '产成品入库')
                    iconName = `sign-in-alt`;
                else if (routeName === '销售出库')
                    iconName = `sign-out-alt`;

                return <IconComponent name={iconName} size={14} color={tintColor} />;
            },
            tabBarOnPress: (tab) => {
                if (global.logoutshow == 0)
                    tab.navigation.navigate(tab.navigation.state.key);
            }
        }),
        tabBarOptions: {
            activeTintColor: '#1270CC',
            inactiveTintColor: '#999999',
            activeBackgroundColor: '#DFDFDF',
            style: { height: 55, padding: 4, },
            labelStyle: { fontSize: 11, fontWeight: "bold", margin: 0, padding: 0, letterSpacing: 1 },
            tabStyle: { borderRadius: 5, padding: 3, borderColor: '#FBFBFB' }
        },
    },
);

class BackImage extends React.Component { //创建一个返回按钮的组件
    render() {
        return (
            <Icon name="caret-left" size={25} color={"#1270CC"} />
        );
    }
}

// 应用内堆
const HomeStack = createStackNavigator(
    {
        // 一级单据查询界面
        主页: TabNavigator,
        // 二级单据详情界面
        采购入库单: ProcuDetailStack,
        转库单: TransferDetailStack,
        产成品入库单: ProductDetailStack,
        销售出库单: SaleDetailStack,
        // 三级物料明细界面
        采购入库物料明细: ProcuMaterialDetailStack,
        转库物料明细: TransferMaterialDetailStack,
        产成品入库物料明细: ProductMaterialDetailStack,
        销售出库物料明细: SaleMaterialDetailStack,
        // 四级库位列表界面
        产成品入库记录列表: ProductScanListStack,
    },
    {
        initialRouteName: '主页',
        defaultNavigationOptions: ({ navigation, screenProps }) => {
            global.logoutshow = 0;
            let tabState = getActiveChildNavigationOptions(navigation, screenProps);

            return {
                title: tabState.title,
                headerTintColor: "#1270CC",
                headerStyle: { height: 36, },
                headerTitleStyle: { fontSize: 18, color: "#1065B8", fontWeight: "bold", letterSpacing: 2, },
                headerBackImage: <BackImage />,
                headerRight: () => {
                    if (tabState.title) {
                        return <Icon name="logout" style={styles.logoutIcon} onPress={() => {
                            if (global.logoutshow == 0) {
                                global.logoutshow = 1;
                                Modal.alert('提示', "确认退出当前账户？", [
                                    {
                                        text: '取消',
                                        onPress: async () => {
                                            global.logoutshow = 0;
                                        },
                                        style: 'cancel',
                                    },
                                    {
                                        text: '确定',
                                        onPress: async () => {
                                            global.logoutshow = 0;
                                            AsyncStorage.clear();
                                            navigation.navigate('Auth');
                                        }
                                    },
                                ],
                                    onBackHandler = () => { return false; }
                                );
                            }
                        }} />
                    }
                    else
                        return <></>
                }
            }
        }
    }
);

export default HomeStack;