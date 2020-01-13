import React from 'react';
import { Text, View, Button, DeviceEventEmitter } from 'react-native';
import ScanModule from "../../../nativeCall/ScanModule";

class materialoutDetailScreen extends React.Component {
    // static navigationOptions = ({ navigation }) => {
    //     return {
    //         headerTitle: "杭摩PDA / 采购入库",
    //         headerStyle: {
    //             backgroundColor: 'black',
    //         },
    //         headerTintColor: 'white',
    //         headerTitleStyle: {
    //             fontWeight: 'bold',
    //         },
    //         headerLeft: () => (
    //             <Button
    //                 onPress={() => navigation.navigate('Tabs')}
    //                 title="返回"
    //                 color="#000"
    //             />
    //         ),
    //     }
    // };

    componentWillMount() {
        //通过使用DeviceEventEmitter模块来监听事件
        DeviceEventEmitter.addListener('iDataScan', function (Event) {
            alert(Event.ScanResult);
        });
    }

    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                {/* other code from before here */}
                <Button
                    title="前往采购入库详情"
                    onPress={() => ScanModule.openScanner()}
                />
            </View>
        );
    }
}

export default materialoutDetailScreen;