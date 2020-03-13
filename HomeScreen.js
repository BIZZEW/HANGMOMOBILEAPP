import React from 'react';
import { Text, View, Button, StyleSheet, AsyncStorage } from 'react-native';
import Ionicons from 'react-native-vector-icons/FontAwesome5';
import { createAppContainer, getActiveChildNavigationOptions } from 'react-navigation';
// import { createSwitchNavigator } from 'react-navigation';
// import { createStackNavigator } from '@react-navigation/stack';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import ProcureScreen from './fragments/procure/ProcureScreen';
import ProcureDetailScreen from './fragments/procure/ProcureDetail/ProcureDetailScreen';
import MaterialoutScreen from './fragments/materialout/MaterialoutScreen';
import MaterialoutDetailScreen from './fragments/materialout/materialoutDetail/MaterialoutDetailScreen';
import ProductinScreen from './fragments/productin/ProductinScreen';
import SaleoutScreen from './fragments/saleout/SaleoutScreen';
import SaleoutDetailScreen from './fragments/saleout/SaleoutDetail/SaleoutDetailScreen';
import MaterialDetailScreen from './fragments/public/MaterialDetailScreen';
import { Icon, Modal } from '@ant-design/react-native';

const styles = StyleSheet.create({
  logoutIcon: {
    fontSize: 25,
    color: "#1C86EE",
    marginRight: 10
  }
});

// 采购入库堆
const ProcureDetailStack = createStackNavigator(
  {
    Home: ProcureDetailScreen,
  },
  {
    // initialRouteName: '杭摩PDA',
    defaultNavigationOptions: {
      headerShown: false,
    },
  }
);

// 销售出库堆
const SaleoutDetailStack = createStackNavigator(
  {
    Home: SaleoutDetailScreen,
  },
  {
    // initialRouteName: '杭摩PDA',
    defaultNavigationOptions: {
      headerShown: false,
    },
  }
);

// 物料明细
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

// 材料出库堆
const MaterialoutDetailStack = createStackNavigator(
  {
    Home: MaterialoutDetailScreen,
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
    "采购入库": ProcureScreen,
    "材料出库": MaterialoutScreen,
    "产成品入库": ProductinScreen,
    "销售出库": SaleoutScreen,
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state;
        let IconComponent = Ionicons;
        let iconName;
        if (routeName === '采购入库')
          iconName = `cart-plus`;
        else if (routeName === '材料出库')
          iconName = `cart-arrow-down`;
        else if (routeName === '产成品入库')
          iconName = `sign-in-alt`;
        else if (routeName === '销售出库')
          iconName = `sign-out-alt`;

        return <IconComponent name={iconName} size={15} color={tintColor} />;
      },
    }),
    tabBarOptions: {
      activeTintColor: '#1C86EE',
      inactiveTintColor: '#999999',
    },
  }
);

// 应用内堆
const HomeStack = createStackNavigator(
  {
    杭摩PDA: TabNavigator,
    采购订单: ProcureDetailStack,
    预出库单: SaleoutDetailStack,
    材料出库详情: MaterialoutDetailStack,
    物料明细: MaterialDetailStack,
  },
  {
    initialRouteName: '杭摩PDA',
    defaultNavigationOptions: ({ navigation, screenProps }) => {
      let tabState = getActiveChildNavigationOptions(navigation, screenProps);
      return {
        title: tabState.title,
        headerTintColor: "#1C86EE",
        headerStyle: { height: 40 },
        headerRight: () => (
          <Icon name="logout" style={styles.logoutIcon} onPress={() => {
            Modal.alert('提示', "确认退出当前账户？", [
              {
                text: '取消',
                onPress: () => console.log('cancel'),
                style: 'cancel',
              },
              {
                text: '确定', onPress: () => {
                  AsyncStorage.clear();
                  navigation.navigate('Auth');
                }
              },
            ]);
          }} />
        )
      }
    }
  }
);

export default HomeStack;