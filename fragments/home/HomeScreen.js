import React from 'react';
import { StyleSheet, AsyncStorage } from 'react-native';
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

import SaleScreen from '../sale/SaleScreen';
import SaleDetailScreen from '../sale/SaleDetail/SaleDetailScreen';
import SaleMaterialDetailScreen from '../sale/SaleMaterialDetail/SaleMaterialDetailScreen';

import { Icon, Modal } from '@ant-design/react-native';

const styles = StyleSheet.create({
    logoutIcon: {
        fontSize: 25,
        color: "#1270CC",
        marginRight: 10
    }
});

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

                return <IconComponent name={iconName} size={15} color={tintColor} />;
            },
            tabBarOnPress: (tab) => {
                AsyncStorage.getItem('logoutshow').then
                    ((logoutshow) => {
                        if (logoutshow == "0")
                            tab.navigation.navigate(tab.navigation.state.key);
                    })
            }
        }),
        tabBarOptions: {
            activeTintColor: '#1270CC',
            inactiveTintColor: '#999999',
        },
    },
);

// 应用内堆
const HomeStack = createStackNavigator(
    {
        杭摩PDA: TabNavigator,

        采购入库单: ProcuDetailStack,
        转库单: TransferDetailStack,
        产成品入库单: ProductDetailStack,
        销售出库单: SaleDetailStack,

        采购入库物料明细: ProcuMaterialDetailStack,
        转库物料明细: TransferMaterialDetailStack,
        产成品入库物料明细: ProductMaterialDetailStack,
        销售出库物料明细: SaleMaterialDetailStack,
    },
    {
        initialRouteName: '杭摩PDA',
        defaultNavigationOptions: ({ navigation, screenProps }) => {
            let tabState = getActiveChildNavigationOptions(navigation, screenProps);

            AsyncStorage.setItem("logoutshow", "0", async e => {
                if (e) {
                    Toast.fail("登录失败，请重试", 1);
                    await AsyncStorage.clear();
                    navigation.navigate('Auth');
                }
            });

            return {
                title: tabState.title,
                headerTintColor: "#1270CC",
                headerStyle: { height: 40, },
                headerTitleStyle: { fontSize: 18, color: "#1065B8" },
                headerRight: () => (
                    <Icon name="logout" style={styles.logoutIcon} onPress={() => {
                        AsyncStorage.getItem('logoutshow').then
                            (async (logoutshow) => {
                                if (logoutshow == "0") {
                                    await AsyncStorage.setItem('logoutshow', "1");
                                    Modal.alert('提示', "确认退出当前账户？", [
                                        {
                                            text: '取消',
                                            onPress: async () => {
                                                await AsyncStorage.setItem('logoutshow', "0");
                                                console.log('cancel');
                                            },
                                            style: 'cancel',
                                        },
                                        {
                                            text: '确定',
                                            onPress: async () => {
                                                AsyncStorage.clear();
                                                navigation.navigate('Auth');
                                            }
                                        },
                                    ],
                                        onBackHandler = () => { return false; });
                                }
                            })
                    }} />
                )
            }
        }
    }
);

export default HomeStack;