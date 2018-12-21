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
export default class Transaction extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            profileId: '',
            profileImage: '',
            profileName: '',
            amount: '',
            way: '',
            status: 'pending',
            uid: '',
            portal: ''
        }

        console.log(JSON.stringify("questionblock props " + JSON.stringify(props)));
    }

    componentWillMount = async () => {
        try {
            //get consultant price with id
            this.setState({ portal: this.props.portal });
            console.log("portal3 : " + this.state.portal);
            var profileId;
            if (this.props.portal === 'student') {
                profileId = this.props.transaction.target
                this.setState({ profileId })
            } else {
                profileId = this.props.transaction.origin
                this.setState({ profileId });
            }

            this.setState({ amount: this.props.transaction.amount });
            this.setState({ way: this.props.transaction.way });

            var that = this;

            firebase.database().ref('users').child(profileId).on('value', function (snapshot) {
                var childKey = snapshot.key;
                var childData = snapshot.val();
                childData.key = childKey;
                if (childData.profilePicture) that.setState({ profileImage: childData.profilePicture });
                that.setState({ profileName: `${childData.firstName}  ${childData.lastName}` });
            });
        } catch (error) {
            // alert(error)        
            throw (error)
        }


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
    render() {

        return (
            <View style={styles.cardView}>
                <Card>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'row' }}>
                            {this.imageButton()}
                            <View style={{ flexDirection: 'column' }}>
                                <Text style={{ fontSize: 15, marginLeft: 20, fontWeight: '200' }}>{this.state.profileName}</Text>
                                <Text style={{ fontSize: 13, marginLeft: 20, color: '#999' }}>$ {this.state.amount}</Text>
                                <Text style={{ fontSize: 13, marginLeft: 20, color: '#999' }}>{this.state.way}</Text>
                                <Text style={{ fontSize: 15, marginLeft: 20, color: '#999' }}>{this.state.status}</Text>
                            </View>
                        </View>

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
