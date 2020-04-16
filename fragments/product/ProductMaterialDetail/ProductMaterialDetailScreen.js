import React from 'react';
import { ScrollView, Text, View, DeviceEventEmitter, Keyboard } from 'react-native';
import { Button, List, Provider, InputItem, Icon } from '@ant-design/react-native';
import { Toast } from '@ant-design/react-native';
import styles from '../../../res/styles'
const Item = List.Item;

class ProductMaterialDetailScreen extends React.Component {
    constructor() {
        super(...arguments);

        this._keyboardDidShow = () => {
            this.setState({
                keyboardShown: true,
            })
        }

        this._keyboardDidHide = () => {
            this.setState({
                keyboardShown: false,
            })
        }

        this.state = {
            detail: {},
            index: "",
            // ninnum: "",
            // ninnumLock: true,
            pk_cargdoc: [],
            keyboardShown: false,
            currentScanInfo: 0,
        };

        this.materialConfirm = () => {
            if (this.state.pk_cargdoc && this.state.pk_cargdoc.length >= 0) {
                const { navigation } = this.props;
                navigation.navigate("产成品入库单");
                navigation.state.params.editConfirmed(this.state);
            }
            else
                Toast.info('请录入至少一条入库记录', 1);
        };

        this.scanConfirmed = pk_cargdoc => {
            let currentScanInfo, ninnum = 0;
            if (pk_cargdoc) {
                currentScanInfo = pk_cargdoc.length

                for (let i of pk_cargdoc)
                    ninnum += parseInt(i.sl);
            }

            let detail = this.state.detail;
            detail.pk_cargdoc = pk_cargdoc;
            detail.ninnum = ninnum;

            this.setState({
                detail, pk_cargdoc, currentScanInfo
            })
        }
    }

    componentDidMount() {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
    }

    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    componentWillMount() {
        let detail = JSON.parse(JSON.stringify(this.props.navigation.state.params.item));
        let index = this.props.navigation.state.params.index;
        let pk_cargdoc = detail.pk_cargdoc || [];
        let currentScanInfo = 0;
        if (pk_cargdoc)
            currentScanInfo = pk_cargdoc.length
        this.setState({
            detail, index, pk_cargdoc, currentScanInfo
        })
    }

    render() {
        return (
            <Provider>
                <View style={styles.tabsContent}>
                    <ScrollView
                        style={styles.materialScrollView}
                        automaticallyAdjustContentInsets={false}
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                    >
                        <List renderHeader={'请编辑'}>
                            <Button
                                onPress={() => { this.props.navigation.navigate('产成品入库记录列表', { scanInfoList: JSON.stringify(this.state.pk_cargdoc), scanConfirmed: this.scanConfirmed }) }}
                                style={{ ...styles.scanInfoBtn }}
                            >
                                <Icon name="edit" size="sm" color="#fff" style={styles.btnIcon} />
                                <Text style={styles.btnText}>  当前 {this.state.currentScanInfo} 条入库记录</Text>
                            </Button>
                        </List>

                        <List style={styles.detailList} renderHeader={'请查看'}>
                            <Item
                                extra={
                                    <Text>
                                        {this.state.detail.csname}
                                    </Text>
                                }
                                multipleLine
                            >
                                货位名称
                                    </Item>
                            <Item
                                extra={
                                    <Text>
                                        {this.state.detail.ninnum}
                                    </Text>
                                }
                                multipleLine
                            >
                                数量
                                    </Item>
                            <Item
                                extra={
                                    <Text>
                                        {this.state.detail.cbaseid_code}
                                    </Text>
                                }
                                multipleLine
                            >
                                物料编码
                                    </Item>
                            <Item
                                extra={
                                    <Text>
                                        {this.state.detail.cbaseid_name}
                                    </Text>
                                }
                                multipleLine
                            >
                                物料名称
                                    </Item>
                            <Item
                                extra={
                                    <Text>
                                        {this.state.detail.cbaseid_spec}
                                    </Text>
                                }
                                multipleLine
                            >
                                规格
                                    </Item>
                            <Item
                                extra={
                                    <Text>
                                        {this.state.detail.cbaseid_type}
                                    </Text>
                                }
                                multipleLine
                            >
                                型号
                                    </Item>
                            <Item
                                extra={
                                    <Text>
                                        {this.state.detail.measname}
                                    </Text>
                                }
                                multipleLine
                            >
                                单位
                                    </Item>
                            <Item
                                extra={
                                    <Text>
                                        {this.state.detail.vbatchcode}
                                    </Text>
                                }
                                multipleLine
                            >
                                批次号
                                    </Item>
                            <Item
                                extra={
                                    <Text>
                                        {this.state.detail.crowno}
                                    </Text>
                                }
                                multipleLine
                            >
                                行号
                                    </Item>
                        </List>
                    </ScrollView>
                    <Button
                        onPress={() => this.materialConfirm()}
                        style={{ ...styles.materialConfirmBtn, display: this.state.keyboardShown ? "none" : "flex", position: this.state.keyboardShown ? "relative" : "absolute" }}
                    >
                        <Icon name="check" size="sm" color="#fff" style={styles.btnIcon} />
                        <Text style={styles.btnText}> 确定</Text>
                    </Button>
                </View>
            </Provider >
        );
    }
}

export default ProductMaterialDetailScreen;