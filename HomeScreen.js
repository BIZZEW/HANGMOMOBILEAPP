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
import materialoutScreen from './fragments/materialout/MaterialoutScreen';
import materialoutDetailScreen from './fragments/materialout/materialoutDetail/materialoutDetailScreen';
import productinScreen from './fragments/productin/productinScreen';
import saleoutScreen from './fragments/saleout/saleoutScreen';
import { Icon, Modal } from '@ant-design/react-native';

const styles = StyleSheet.create({
  logoutIcon: {
    fontSize: 25,
    color: "#1C86EE",
    marginRight: 10
  }
});

// 采购入库堆
const procureStack = createStackNavigator(
  {
    Home: ProcureScreen,
  },
  {
    initialRouteName: 'Home',
    /* The header config from HomeScreen is now here */
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: 'white',
      },
      headerTintColor: 'black',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    },
  }
);

// 材料出库堆
const materialoutStack = createStackNavigator(
  {
    Home: materialoutScreen,
    // Details: materialoutDetailScreen,
  },
  // {
  //   initialRouteName: 'Home',
  //   /* The header config from HomeScreen is now here */
  //   defaultNavigationOptions: {
  //     headerStyle: {
  //       backgroundColor: 'white',
  //     },
  //     headerTintColor: 'black',
  //     headerTitleStyle: {
  //       fontWeight: 'bold',
  //     },
  //   }
  // }
);

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
  // {
  //   initialRouteName: 'Home',
  //   /* The header config from HomeScreen is now here */
  //   defaultNavigationOptions: {
  //     headerStyle: {
  //       backgroundColor: 'white',
  //     },
  //     headerTintColor: 'black',
  //     headerTitleStyle: {
  //       fontWeight: 'bold',
  //     },
  //   }
  // }
);

// 材料出库堆
const materialoutDetailStack = createStackNavigator(
  {
    Home: materialoutDetailScreen,
    // Details: materialoutDetailScreen,
  },
  {
    // initialRouteName: '杭摩PDA',
    defaultNavigationOptions: {
      headerShown: false,
    },
  }
  // {
  //   initialRouteName: 'Home',
  //   /* The header config from HomeScreen is now here */
  //   defaultNavigationOptions: {
  //     headerStyle: {
  //       backgroundColor: 'white',
  //     },
  //     headerTintColor: 'black',
  //     headerTitleStyle: {
  //       fontWeight: 'bold',
  //     },
  //   }
  // }
);

// 标签栏导航
const TabNavigator = createBottomTabNavigator(
  {
    "采购入库": ProcureScreen,
    "材料出库": materialoutScreen,
    "产成品入库": productinScreen,
    "销售出库": saleoutScreen,
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
    // tabBarOptions: ({ navigation }) => ({
    //   // activeTintColor: () => {
    //   //   const { routeName } = navigation.state;
    //   //   let iconColor;
    //   //   if (routeName === '采购入库')
    //   //     iconColor = `#1C86EE`;
    //   //   else if (routeName === '材料出库')
    //   //     iconColor = `#1C8600`;
    //   //   else if (routeName === '产成品入库')
    //   //     iconColor = `#1C8600`;
    //   //   else if (routeName === '销售出库')
    //   //     iconColor = `#1C8600`;
    //   //   return iconColor;
    //   // },
    //   // inactiveTintColor: '#999999',
    // }),
  }
);

// 应用内堆
const HomeStack = createStackNavigator(
  {
    杭摩PDA: TabNavigator,
    采购订单: ProcureDetailStack,
    材料出库详情: materialoutDetailStack,
  },
  {
    initialRouteName: '杭摩PDA',
    defaultNavigationOptions: ({ navigation, screenProps }) => {
      let tabState = getActiveChildNavigationOptions(navigation, screenProps);
      return {
        title: tabState.title,
        headerTintColor: "#1C86EE",
        headerStyle: { height: 42 },
        // ...tabState,
        // headerShown: false,
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

// // 总导航
// const AppNavigator = createSwitchNavigator({
//   Home: HomeStack,
// });

// export default createAppContainer(HomeStack);