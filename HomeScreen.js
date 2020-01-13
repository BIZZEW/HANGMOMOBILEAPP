import React from 'react';
import { Text, View, Button } from 'react-native';
import Ionicons from 'react-native-vector-icons/FontAwesome5';
import { createAppContainer } from 'react-navigation';
// import { createSwitchNavigator } from 'react-navigation';
// import { createStackNavigator } from '@react-navigation/stack';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import procureScreen from './fragments/procure/procureScreen';
import materialoutScreen from './fragments/materialout/materialoutScreen';
import materialoutDetailScreen from './fragments/materialout/materialoutDetail/materialoutDetailScreen';
import productinScreen from './fragments/productin/productinScreen';
import saleoutScreen from './fragments/saleout/saleoutScreen';

// 采购入库堆
const procureStack = createStackNavigator(
  {
    Home: procureScreen,
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
    "采购入库": procureScreen,
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

        return <IconComponent name={iconName} size={20} color={tintColor} />;
      },
    }),
    tabBarOptions: {
      activeTintColor: 'black',
      inactiveTintColor: 'gray',
    },
  }
);

// 应用内堆
const HomeStack = createStackNavigator(
  {
    杭摩PDA: TabNavigator,
    详情: materialoutDetailStack,
  },
  {
    initialRouteName: '杭摩PDA',
    // defaultNavigationOptions: {
    //   headerShown: false,
    // },
  }
);

export default HomeStack;

// // 总导航
// const AppNavigator = createSwitchNavigator({
//   Home: HomeStack,
// });

// export default createAppContainer(HomeStack);