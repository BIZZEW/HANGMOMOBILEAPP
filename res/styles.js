import { StyleSheet, Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create(
    {
        // 主页面
        logoutIcon: {
            fontSize: 25,
            color: "#1270CC",
            marginRight: 10
        },
        // 对话框
        container: {
            flex: 1,
            backgroundColor: 'white',
            justifyContent: 'center',
            alignItems: 'center',
        },
        dialogContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.6)'
        },
        innerContainer: {
            borderRadius: 10,
            alignItems: 'center',
            backgroundColor: '#fff',
            padding: 20,
        },
        contentTitle: {
            marginBottom: 10,
        },
        titleTextStyle: {
            fontSize: 20,
            letterSpacing: 20,
        },
        contentContainer: {
            width: "80%",
            borderTopColor: '#cccccc',
            margin: 10
        },
        dialogContentTextStyle: {
            fontSize: 15,
            color: '#000',
        },
        btnContainer: {
            width: "80%",
            height: 40,
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 15,
        },
        dialogConfirmButton: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            height: 40,
            marginLeft: 20,
            backgroundColor: "#1270CC",
            borderRadius: 8,
        },
        dialogCancelButton: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            height: 40,
            backgroundColor: "#1270CC",
            borderRadius: 8,
        },
        hidemodalTxt: {
            textAlign: 'center',
            fontSize: 16,
            color: '#fff'
        },
        // 加载动画
        LoadingPage: {
            position: "absolute",
            left: 0,
            top: 0,
            backgroundColor: "rgba(0,0,0,0)",
            width: width,
            height: height,
            justifyContent: "center",
            alignItems: "center",
        },
        // 弹出框
        PopupPage: {
            position: "absolute",
            left: 0,
            top: 0,
            backgroundColor: "rgba(0,0,0,0.4)",
            width: width,
            height: height,
            justifyContent: "center",
            alignItems: "center",
        },
        // 根视图
        rootContainer: {
            flex: 1,
            position: 'relative',
        },
        // 登录
        ScrollView: {
            flex: 1
        },
        logo: {
            width: 60,
            height: 60,
            alignSelf: "center"
        },
        loginBtn: {
            backgroundColor: "#1270CC",
            borderColor: "#1270CC",
        },
        //一级单据查询界面
        ListItem: {
            backgroundColor: "#fff",
            marginBottom: 10,
            borderRadius: 10,
            padding: 20,
        },
        searchBtn: {
            height: 40,
            position: "absolute",
            zIndex: 100,
            right: 20,
            bottom: 20,
            borderColor: "#fff",
            borderWidth: 1,
            borderRadius: 10,
            backgroundColor: "#1270CC"
        },
        searchBtnIcon: {
            fontSize: 20,
        },
        emptyIcon: {
            fontSize: 100,
            color: "#51A0EE",
        },
        emptyView: {
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
        },
        emptyHint: {
            fontSize: 15,
            color: "#fff"
        },
        FlatList: {
            flex: 1,
            backgroundColor: '#1270CC',
            paddingBottom: 60,
        },
        confirmSearchBtn: {
            width: "35%",
            left: "10%",
            borderWidth: 0,
            borderColor: "#1270CC",
            bottom: 30,
            backgroundColor: "#1270CC",
        },
        cancelSearchBtn: {
            width: "35%",
            right: "10%",
            borderWidth: 0,
            borderColor: "#1270CC",
            bottom: 30,
            backgroundColor: "#1270CC",
        },
        searchWrapper: {
            flex: 1,
            padding: 10,
            backgroundColor: '#1270CC'
        },
        specialEntrance: {
            height: 40,
            position: "absolute",
            zIndex: 100,
            left: 20,
            bottom: 20,
            borderColor: "#fff",
            borderWidth: 1,
            borderRadius: 10,
            backgroundColor: "#1270CC",
            color: "#000"
        },
        btnText: {
            color: "#fff",
            fontSize: 15,
        },
    });

module.exports = styles;