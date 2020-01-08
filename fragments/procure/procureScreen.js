import React from 'react';
import { Text, View, Button } from 'react-native';
// import Ionicons from 'react-native-vector-icons/FontAwesome5';
// import { createAppContainer } from 'react-navigation';
// import { createSwitchNavigator } from 'react-navigation';
// import { createStackNavigator } from 'react-navigation-stack';
// import { createBottomTabNavigator } from 'react-navigation-tabs';

class procureScreen extends React.Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: "杭摩PDA / 采购入库",
            headerStyle: {
                backgroundColor: 'black',
            },
            headerTintColor: 'white',
            headerTitleStyle: {
                fontWeight: 'bold',
            },
        }
    };
    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                {/* other code from before here */}
                <Button
                    title="前往采购入库详情"
                    onPress={() => this.props.navigation.navigate('Details')}
                />
            </View>
        );
    }
}

export default procureScreen;