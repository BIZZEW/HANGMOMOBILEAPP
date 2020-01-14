import React from 'react';
import { Text, View, Button, DeviceEventEmitter } from 'react-native';
import ScanModule from "../../../nativeCall/ScanModule";

class procureDetailScreen extends React.Component {

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
                    title="扫码"
                    onPress={() => ScanModule.openScanner()}
                />
            </View>
        );
    }
}

export default procureDetailScreen;