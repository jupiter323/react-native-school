import React from 'react';
import { StyleSheet, Text, View, Image, ActivityIndicator, TouchableOpacity, AsyncStorage, TextInput } from 'react-native';
import Metrics from '../Themes/Metrics';
import Functions from '../Themes/Functions';
import Colors from '../Themes/Colors';
import Images from '../Themes/Images';
import { Card, ListItem, Button, Slider, CheckBox, SearchBar, Avatar } from 'react-native-elements'
import firebase from 'firebase';
import Modal from 'react-native-modal';

/*

  start at
  load more
*/
export default class UpcomingBlock extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            profileId: '',
            profileImage: '',
            startTime: '',
            endTime: '',
            profileName: '',
            summary: '',
            userId: '',
            portal: '',
            appointmentId:''
        }

        console.log(JSON.stringify("questionblock props " + JSON.stringify(props)));
    }

    componentWillMount = async () => {
        //get consultant price with id
        await this.setState({ portal: this.props.portal });
        await this.setState({appointmentId:this.props.upcoming.appointmentId});
        if (this.state.portal == 'student') {
            await this.setState({ profileId: this.props.upcoming.consultantID })
        } else await this.setState({ profileId: this.props.upcoming.studentID });

        var that = this;
        firebase.database().ref('users').child(this.state.profileId).on('value', function (snapshot) {
            var childKey = snapshot.key;
            var childData = snapshot.val();
            childData.key = childKey;
            if (childData.profilePicture) that.setState({ profileImage: childData.profilePicture });
            that.setState({ profileName: childData.name });
            
        });

    }

    imageButton() {
        if (this.state.profileImage) {
            return (
                <Avatar
                    size="large"
                    source={{ uri: this.state.profileImage }}
                    activeOpacity={0.7}
                    rounded
                />
            );
        } else {
            return (
                <Avatar
                    size="large"
                    source={Images.profile}
                    activeOpacity={0.7}
                    rounded
                />
            )
        }
    }

    payout() {
        // this.state.release();
        this.props.navigation.navigate('InputCreditCard', { totalPrice: this.props.upcoming.price, consultantId: this.state.profileId, appointmentId:this.state.appointmentId });
        // Functions.createTransfer(this.props.upcoming.price, this.state.profileId);

        console.log("payout done.");
    }
    async requestFund() {
        //push notification to student for the release
        //https://docs.expo.io/versions/latest/guides/push-notifications
        await Functions.sendPushnotification(this.props.upcoming.studentID);
        console.log("payout done.");
        alert("The student will be notified of the completed appointment");
    }
    paymentButton() {
        if (this.state.portal == 'student') {
            return (
                <Button
                    titleStyle={{ color: 'white', fontWeight: '700', fontSize: 25 }}
                    buttonStyle={{ width: 70, borderRadius: 20, margin: 5, borderWidth: 1, borderColor: '#FFF', backgroundColor: '#c77ce8' }}
                    title={"Pay"}
                    onPress={() => this.payout()}
                />

            );
        } else {
            return (
                <Button
                    titleStyle={{ color: 'white', fontWeight: '700', fontSize: 25 }}
                    buttonStyle={{ width: 70, borderRadius: 20, margin: 5, marginBottom: 5, borderWidth: 1, borderColor: '#FFF', backgroundColor: '#c77ce8' }}
                    title={"Request"}
                    onPress={() => this.requestFund()}
                ></Button>
            );
        }
    }

    render() {

        return (
            <View style={styles.cardView}>
                <Card>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'row' }}>
                            {this.imageButton()}
                            <View style={{ flexDirection: 'column' }}>
                                <Text style={{ fontSize: 15, marginLeft: 20, fontWeight: '200' }}>{this.state.profileName}</Text>
                                <Text style={{ fontSize: 13, marginLeft: 20, color: '#999' }}>{this.props.upcoming.startTime} -</Text>
                                <Text style={{ fontSize: 13, marginLeft: 20, color: '#999' }}>{this.props.upcoming.endTime}</Text>
                                <Text style={{ fontSize: 15, marginLeft: 20, color: '#999' }}>{this.props.upcoming.price}</Text>
                            </View>
                        </View>
                        {this.paymentButton()}

                    </View>
                </Card>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    cardView: {
        width: Metrics.screenWidth,
        borderRadius: Metrics.buttonRadius,
    },
})
