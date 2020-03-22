import React from 'react';
import { StyleSheet, AsyncStorage } from 'react-native';
import Ionicons from 'react-native-vector-icons/FontAwesome5';
import { getActiveChildNavigationOptions } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import ProcuScreen from './fragments/procu/ProcuScreen';
import ProcuDetailScreen from './fragments/procu/ProcuDetail/ProcuDetailScreen';
import ChangearoundScreen from './fragments/changearound/ChangearoundScreen';
import ChangearoundDetailScreen from './fragments/changearound/ChangearoundDetail/ChangearoundDetailScreen';
import ProductScreen from './fragments/product/ProductScreen';
import ProductDetailScreen from './fragments/product/ProductDetail/ProductDetailScreen';
import SaleScreen from './fragments/sale/SaleScreen';
import SaleDetailScreen from './fragments/sale/SaleDetail/SaleDetailScreen';
import MaterialDetailScreen from './fragments/public/MaterialDetailScreen';
import CAMaterialDetailScreen from './fragments/public/CAMaterialDetailScreen';
import PIMaterialDetailScreen from './fragments/public/PIMaterialDetailScreen';
import SOMaterialDetailScreen from './fragments/public/SOMaterialDetailScreen';
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
const ChangearoundDetailStack = createStackNavigator(
  {
    Home: ChangearoundDetailScreen,
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
    // initialRouteName: '杭摩PDA',
    defaultNavigationOptions: {
      headerShown: false,
    },
  }
);

// 采购入库物料明细
const MaterialDetailStack = createStackNavigator(
  {
    Home: MaterialDetailScreen,
  },
  {
    defaultNavigationOptions: {
      headerShown: false,
    },
  }
);

// 转库物料明细
const CAMaterialDetailStack = createStackNavigator(
  {
    Home: CAMaterialDetailScreen,
  },
  {
    defaultNavigationOptions: {
      headerShown: false,
    },
  }
);

// 产成品入库物料明细
const PIMaterialDetailStack = createStackNavigator(
  {
    Home: PIMaterialDetailScreen,
  },
  {
    defaultNavigationOptions: {
      headerShown: false,
    },
  }
);

// 销售出库物料明细
const SOMaterialDetailStack = createStackNavigator(
  {
    Home: SOMaterialDetailScreen,
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
    "转库": ChangearoundScreen,
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
    转库单: ChangearoundDetailStack,
    产成品入库单: ProductDetailStack,
    销售出库单: SaleDetailStack,

    采购入库物料明细: MaterialDetailStack,
    转库物料明细: CAMaterialDetailStack,
    产成品入库物料明细: PIMaterialDetailStack,
    销售出库物料明细: SOMaterialDetailStack,
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