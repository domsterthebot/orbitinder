import React from 'react';
import _ from 'lodash';
import {
    ScrollView,
    StyleSheet,
    Alert,
    KeyboardAvoidingView,
    Platform,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    Layout,
    Text,
    IndexPath,
    Select,
    SelectItem,
    Input,
    Avatar,
    Button
} from '@ui-kitten/components';
import { useDispatch, useSelector } from 'react-redux';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

import {
    TitleHeader,
    FloatingSave,
    Toast,
    UserAvatar
} from '../../components/index';
import {
    yearData,
    commitmentData,
    idea,
    achievementData,
    sweExperience,
    gameDevData,
    webDevData,
    mobileDevData,
    dbData,
    mlData,
    interestsData
} from '../../constants/profleCreationData';
import * as userActions from '../../redux/actions/user';

const EditProfileScreen = ({ navigation }) => {
    const dispatch = useDispatch();

    const [imagePath, setImagePath] = React.useState('');
    const [newImagePath, setNewImagePath] = React.useState('');
    const [showChangePhoto, setShowChangePhoto] = React.useState(false);
    const [showAlert, setShowAlert] = React.useState(false);
    const [alertMessage, setAlertMessage] = React.useState('');
    const [alertStatus, setAlertStatus] = React.useState('');
    const [error, setError] = React.useState(null);

    const maxLengthBio = 260;

    React.useEffect(() => {
        if (error) {
            Alert.alert('Error Occured', error, [{ text: 'Close' }]);
        }
    }, [error]);

    const userData = useSelector(state => state.user.userData);
    const background = userData.background;
    delete background.telegram;
    const [bgData, setBgData] = React.useState(background);

    React.useEffect(() => {
        if (userData.imagePath !== undefined) {
            setImagePath(userData.imagePath);
        }
    }, [userData]);

    const navProps = {
        title: 'Edit Profile',
        navigation: navigation,
        needBackNav: true,
        needMenuNav: false
    };

    const initialState = {
        bioValue: background.biography,
        githubValue:
            background.github.length > 0
                ? background.github.split('/')[3]
                : background.github,
        linkedinValue:
            background.linkedin.length > 0
                ? background.linkedin.split('/')[4]
                : background.linkedin,
        yearValue: background.year,
        degreeValue: background.degree,
        ideaValue: background.idea,
        commitmentValue: background.commitment,
        interestsValue: background.interests,
        achievementValue: background.achievement,
        sweValue: background.sweExperience,
        gamedevValue: background.technologyExperience.game,
        webValue: background.technologyExperience.web,
        mobileValue: background.technologyExperience.mobile,
        dbValue: background.technologyExperience.database,
        mlValue: background.technologyExperience.machineLearning,
        yearIndex: new IndexPath(yearData.indexOf(background.year)),
        ideaIndex: new IndexPath(idea.indexOf(background.idea)),
        interestsIndex: background.interests.map(index => {
            return new IndexPath(interestsData.indexOf(index));
        }),
        commitmentIndex: new IndexPath(
            commitmentData.indexOf(background.commitment)
        ),
        achievementIndex: new IndexPath(
            achievementData.indexOf(background.achievement)
        ),
        sweIndex: new IndexPath(
            sweExperience.indexOf(background.sweExperience)
        ),
        gamedevIndex: background.technologyExperience.game.map(index => {
            return new IndexPath(gameDevData.indexOf(index));
        }),
        webIndex: background.technologyExperience.web.map(index => {
            return new IndexPath(webDevData.indexOf(index));
        }),
        mobileIndex: background.technologyExperience.mobile.map(index => {
            return new IndexPath(mobileDevData.indexOf(index));
        }),
        dbIndex: background.technologyExperience.database.map(index => {
            return new IndexPath(dbData.indexOf(index));
        }),
        mlIndex: background.technologyExperience.machineLearning.map(index => {
            return new IndexPath(mlData.indexOf(index));
        })
    };

    const myReducer = (currState, action) => {
        switch (action.type) {
            case 'changeBio':
                return {
                    ...currState,
                    bioValue: action.bioValue
                };
            case 'changeGithub':
                return {
                    ...currState,
                    githubValue: action.githubValue
                };
            case 'changeLinkedin':
                return {
                    ...currState,
                    linkedinValue: action.linkedinValue
                };
            case 'changeYear':
                return {
                    ...currState,
                    yearValue: action.yearValue,
                    yearIndex: action.yearIndex
                };
            case 'changeIdea':
                return {
                    ...currState,
                    ideaValue: action.ideaValue,
                    ideaIndex: action.ideaIndex
                };
            case 'changeInterests':
                return {
                    ...currState,
                    interestsValue: action.interestsValue,
                    interestsIndex: action.interestsIndex
                };
            case 'changeCommitment':
                return {
                    ...currState,
                    commitmentValue: action.commitmentValue,
                    commitmentIndex: action.commitmentIndex
                };
            case 'changeAchievement':
                return {
                    ...currState,
                    achievementValue: action.achievementValue,
                    achievementIndex: action.achievementIndex
                };
            case 'changeSWE':
                return {
                    ...currState,
                    sweValue: action.sweValue,
                    sweIndex: action.sweIndex
                };
            case 'changeGamedev':
                return {
                    ...currState,
                    gamedevValue: action.gamedevValue,
                    gamedevIndex: action.gamedevIndex
                };
            case 'changeWebdev':
                return {
                    ...currState,
                    webValue: action.webValue,
                    webIndex: action.webIndex
                };
            case 'changeMobiledev':
                return {
                    ...currState,
                    mobileValue: action.mobileValue,
                    mobileIndex: action.mobileIndex
                };
            case 'changeDB':
                return {
                    ...currState,
                    dbValue: action.dbValue,
                    dbIndex: action.dbIndex
                };
            case 'changeML':
                return {
                    ...currState,
                    mlValue: action.mlValue,
                    mlIndex: action.mlIndex
                };
        }
    };

    const [currState, currdispatch] = React.useReducer(myReducer, initialState);

    const saveHandler = () => {
        const backgroundData = {
            background: {
                biography: currState.bioValue,
                commitment: currState.commitmentValue,
                interests: currState.interestsValue,
                degree: currState.degreeValue,
                idea: currState.ideaValue,
                achievement: currState.achievementValue,
                sweExperience: currState.sweValue,
                technologyExperience: {
                    game: currState.gamedevValue,
                    web: currState.webValue,
                    mobile: currState.mobileValue,
                    database: currState.dbValue,
                    machineLearning: currState.mlValue
                },
                year: currState.yearValue,
                github:
                    currState.githubValue.length > 0
                        ? `https://github.com/${currState.githubValue}`
                        : '',
                linkedin:
                    currState.linkedinValue.length > 0
                        ? `https://www.linkedin.com/in/${currState.linkedinValue}`
                        : ''
            },
            updatedAt: new Date().toISOString(),
            imagePath: newImagePath.length > 0 ? newImagePath : imagePath
        };

        try {
            dispatch(
                userActions.updateProfile(
                    backgroundData,
                    newImagePath !== imagePath
                )
            );
            setBgData(backgroundData.background);
            setError(null);
            // user changes their background => call model to train on new set of data => save model in heroku
            const requestOptions = {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                }
            };
            fetch(
                'https://orbitinder-recommend.herokuapp.com/train_model',
                requestOptions
            )
                .then(r => r.toString())
                .then(() => {
                    // console.log(data);
                });
            setAlertMessage('Profile changes saved!');
            setShowAlert(true);
            setAlertStatus('success');
            setShowChangePhoto(false);
        } catch (err) {
            setError(err.message);
        }
    };

    React.useEffect(
        () =>
            navigation.addListener('beforeRemove', e => {
                let finalB = {
                    achievement: currState.achievementValue,
                    biography: currState.bioValue,
                    commitment: currState.commitmentValue,
                    degree: currState.degreeValue,
                    interests: currState.interestsValue,
                    idea: currState.ideaValue,
                    sweExperience: currState.sweValue,
                    technologyExperience: {
                        database: currState.dbValue,
                        game: currState.gamedevValue,
                        machineLearning: currState.mlValue,
                        mobile: currState.mobileValue,
                        web: currState.webValue
                    },
                    year: currState.yearValue,
                    github:
                        currState.githubValue.length > 0
                            ? `https://github.com/${currState.githubValue}`
                            : '',
                    linkedin:
                        currState.linkedinValue.length > 0
                            ? `https://www.linkedin.com/in/${currState.linkedinValue}`
                            : ''
                };

                if (_.isEqual(bgData, finalB)) {
                    return;
                } else {
                    e.preventDefault();
                    Alert.alert(
                        'Discard changes?',
                        'You have unsaved changes. Are you sure to discard them and leave the screen?',
                        [
                            {
                                text: 'Leave',
                                style: 'destructive',
                                // If the user confirmed, then we dispatch the action we blocked earlier
                                // This will continue the action that had triggered the removal of the screen
                                onPress: () =>
                                    navigation.dispatch(e.data.action)
                            },
                            { text: 'Stay', style: 'cancel', onPress: () => {} }
                        ]
                    );
                }
            }),
        [navigation, currState, bgData]
    );

    const galleryHandler = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1
        });

        if (!result.cancelled) {
            setNewImagePath(result.uri);
        }
    };

    const cameraHandler = async () => {
        let result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1
        });

        if (!result.cancelled) {
            setNewImagePath(result.uri);
        }
    };

    const showChangeHandler = () => {
        setShowChangePhoto(true);
    };

    const removeChangeHandler = () => {
        setShowChangePhoto(false);
        setNewImagePath('');
    };

    const deleteHandler = () => {
        Alert.alert(
            'Remove Profile Photo?',
            'Are you sure to remove your profile photo?',
            [
                {
                    text: 'Remove',
                    style: 'destructive',
                    onPress: () => {
                        try {
                            dispatch(userActions.removeProfilePhoto());
                            setError(null);

                            setAlertMessage('Profile photo removed!');
                            setShowAlert(true);
                            setAlertStatus('success');
                            setShowChangePhoto(false);
                            setImagePath('');
                            setNewImagePath('');
                        } catch (err) {
                            setError(err.message);
                        }
                    }
                },
                { text: 'Abort', style: 'cancel', onPress: () => {} }
            ]
        );
    };

    const renderBioCaption = () => (
        <Layout
            style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 4
            }}
        >
            <Text category='label' appearance='hint'>
                Provide a short bio
            </Text>
            <Text category='label' appearance='hint'>
                {currState.bioValue.length == 0
                    ? 0 + ' / ' + maxLengthBio
                    : currState.bioValue.length + ' / ' + maxLengthBio}
            </Text>
        </Layout>
    );

    return (
        <KeyboardAvoidingView
            style={styles.formContainer}
            behavior={Platform.OS === 'ios' ? 'padding' : null}
        >
            <SafeAreaView style={styles.parentContainer}>
                <TitleHeader navProps={navProps} />
                {showAlert && (
                    <Toast
                        message={alertMessage}
                        status={alertStatus}
                        hide={show => setShowAlert(show)}
                    />
                )}
                <ScrollView>
                    <Layout style={styles.photoContainer}>
                        <View style={styles.avatarPlaceholder}>
                            {newImagePath.length > 0 || imagePath.length > 0 ? (
                                <>
                                    <Avatar
                                        size='giant'
                                        source={{
                                            uri:
                                                newImagePath.length === 0
                                                    ? imagePath
                                                    : newImagePath
                                        }}
                                        style={[
                                            styles.avatar,
                                            { position: 'absolute' }
                                        ]}
                                    />
                                    <Feather
                                        name='edit-2'
                                        size={40}
                                        color='#407BFF'
                                    />
                                </>
                            ) : (
                                <UserAvatar
                                    name={userData.name}
                                    style={{
                                        width: 100,
                                        height: 100,
                                        position: 'absolute'
                                    }}
                                    size={100}
                                    fontSize={42}
                                />
                            )}
                        </View>
                        {showChangePhoto ? (
                            <Layout style={styles.btnContainer}>
                                <Button
                                    style={styles.btn}
                                    onPress={cameraHandler}
                                >
                                    Replace using Camera
                                </Button>
                                <Button
                                    style={styles.btn}
                                    onPress={galleryHandler}
                                >
                                    Edit with Gallery
                                </Button>
                                <Layout style={styles.miniActionsContainer}>
                                    <Text
                                        style={[
                                            styles.changeText,
                                            { color: '#FF3D32' }
                                        ]}
                                        onPress={deleteHandler}
                                    >
                                        Remove
                                    </Text>
                                    <Text
                                        style={[
                                            styles.changeText,
                                            { color: '#FF3D32' }
                                        ]}
                                        onPress={removeChangeHandler}
                                    >
                                        Cancel
                                    </Text>
                                </Layout>
                            </Layout>
                        ) : (
                            <Text
                                style={[
                                    styles.changeText,
                                    { color: '#407BFF', fontSize: 18 }
                                ]}
                                onPress={showChangeHandler}
                            >
                                Change Profile Photo
                            </Text>
                        )}
                    </Layout>
                    <Layout style={styles.inputContainer}>
                        <Text style={styles.screenTitle}>
                            Personal Information
                        </Text>
                        <Select
                            style={styles.selectInput}
                            value={currState.yearValue}
                            selectedIndex={currState.yearIndex}
                            onSelect={index =>
                                currdispatch({
                                    type: 'changeYear',
                                    yearValue: yearData[index.row],
                                    yearIndex: index
                                })
                            }
                            label='Year of Study'
                        >
                            {yearData.map((value, key) => (
                                <SelectItem key={key} title={value} />
                            ))}
                        </Select>
                        <Input
                            style={styles.bioInput}
                            multiline={true}
                            textStyle={styles.bioText}
                            placeholder='Bio'
                            label={renderBioCaption}
                            onChangeText={input =>
                                currdispatch({
                                    type: 'changeBio',
                                    bioValue: input
                                })
                            }
                            numberOfLines={6}
                            value={currState.bioValue}
                            // caption={renderBioCaption}
                            maxLength={maxLengthBio}
                        />
                        <Select
                            style={styles.selectInput}
                            value={currState.ideaValue}
                            selectedIndex={currState.ideaIndex}
                            onSelect={index =>
                                currdispatch({
                                    type: 'changeIdea',
                                    ideaValue: idea[index.row],
                                    ideaIndex: index
                                })
                            }
                            label='Do you already have an idea in mind?'
                        >
                            {idea.map((value, key) => (
                                <SelectItem key={key} title={value} />
                            ))}
                        </Select>
                        <Select
                            label='Areas of Interest'
                            style={styles.selectInput}
                            multiSelect={true}
                            selectedIndex={currState.interestsIndex}
                            onSelect={input =>
                                currdispatch({
                                    type: 'changeInterests',
                                    interestsValue: input.map(index => {
                                        return interestsData[index.row];
                                    }),
                                    interestsIndex: input
                                })
                            }
                            placeholder='Select'
                            value={currState.interestsValue.join(', ')}
                        >
                            {interestsData.map((value, key) => (
                                <SelectItem key={key} title={value} />
                            ))}
                        </Select>
                        <Select
                            style={styles.selectInput}
                            selectedIndex={currState.commitmentIndex}
                            value={currState.commitmentValue}
                            onSelect={index =>
                                currdispatch({
                                    type: 'changeCommitment',
                                    commitmentValue: commitmentData[index.row],
                                    commitmentIndex: index
                                })
                            }
                            label='Commitment to Orbital'
                        >
                            {commitmentData.map((value, key) => (
                                <SelectItem key={key} title={value} />
                            ))}
                        </Select>
                        <Select
                            style={styles.selectInput}
                            selectedIndex={currState.achievementIndex}
                            value={currState.achievementValue}
                            onSelect={index =>
                                currdispatch({
                                    type: 'changeAchievement',
                                    achievementValue:
                                        achievementData[index.row],
                                    achievementIndex: index
                                })
                            }
                            label='Orbital Achievement Level'
                        >
                            {achievementData.map((value, key) => (
                                <SelectItem key={key} title={value} />
                            ))}
                        </Select>
                        <Select
                            style={styles.selectInput}
                            selectedIndex={currState.sweIndex}
                            value={currState.sweValue}
                            onSelect={index =>
                                currdispatch({
                                    type: 'changeSWE',
                                    sweValue: sweExperience[index.row],
                                    sweIndex: index
                                })
                            }
                            label='Choose your SWE experience level'
                        >
                            {sweExperience.map((value, key) => (
                                <SelectItem key={key} title={value} />
                            ))}
                        </Select>
                        <Input
                            style={styles.bioInput}
                            placeholder='Github Username'
                            label='Github'
                            onChangeText={input =>
                                currdispatch({
                                    type: 'changeGithub',
                                    githubValue: input
                                })
                            }
                            value={currState.githubValue}
                        />
                        <Input
                            style={styles.bioInput}
                            placeholder='LinkedIn Username'
                            label='LinkedIn'
                            onChangeText={input =>
                                currdispatch({
                                    type: 'changeLinkedin',
                                    linkedinValue: input
                                })
                            }
                            value={currState.linkedinValue}
                        />

                        <Text style={{ ...styles.screenTitle, marginTop: 20 }}>
                            Technology Experience
                        </Text>
                        <Select
                            label='Game Development'
                            style={styles.selectInput}
                            multiSelect={true}
                            selectedIndex={currState.gamedevIndex}
                            onSelect={input =>
                                currdispatch({
                                    type: 'changeGamedev',
                                    gamedevValue: input.map(index => {
                                        return gameDevData[index.row];
                                    }),
                                    gamedevIndex: input
                                })
                            }
                            placeholder='Select'
                            value={currState.gamedevValue.join(', ')}
                        >
                            {gameDevData.map((value, key) => (
                                <SelectItem key={key} title={value} />
                            ))}
                        </Select>
                        <Select
                            label='Web Development'
                            style={styles.selectInput}
                            multiSelect={true}
                            selectedIndex={currState.webIndex}
                            onSelect={input =>
                                currdispatch({
                                    type: 'changeWebdev',
                                    webValue: input.map(index => {
                                        return webDevData[index.row];
                                    }),
                                    webIndex: input
                                })
                            }
                            placeholder='Select'
                            value={currState.webValue.join(', ')}
                        >
                            {webDevData.map((value, key) => (
                                <SelectItem key={key} title={value} />
                            ))}
                        </Select>
                        <Select
                            label='Mobile Development'
                            style={styles.selectInput}
                            multiSelect={true}
                            selectedIndex={currState.mobileIndex}
                            onSelect={input =>
                                currdispatch({
                                    type: 'changeMobiledev',
                                    mobileValue: input.map(index => {
                                        return mobileDevData[index.row];
                                    }),
                                    mobileIndex: input
                                })
                            }
                            placeholder='Select'
                            value={currState.mobileValue.join(', ')}
                        >
                            {mobileDevData.map((value, key) => (
                                <SelectItem key={key} title={value} />
                            ))}
                        </Select>
                        <Select
                            label='Database'
                            style={styles.selectInput}
                            multiSelect={true}
                            selectedIndex={currState.dbIndex}
                            onSelect={input =>
                                currdispatch({
                                    type: 'changeDB',
                                    dbValue: input.map(index => {
                                        return dbData[index.row];
                                    }),
                                    dbIndex: input
                                })
                            }
                            placeholder='Select'
                            value={currState.dbValue.join(', ')}
                        >
                            {dbData.map((value, key) => (
                                <SelectItem key={key} title={value} />
                            ))}
                        </Select>
                        <Select
                            label='Machine Learning'
                            style={styles.selectInput}
                            multiSelect={true}
                            selectedIndex={currState.mlIndex}
                            onSelect={input =>
                                currdispatch({
                                    type: 'changeML',
                                    mlValue: input.map(index => {
                                        return mlData[index.row];
                                    }),
                                    mlIndex: input
                                })
                            }
                            placeholder='Select'
                            value={currState.mlValue.join(', ')}
                        >
                            {mlData.map((value, key) => (
                                <SelectItem key={key} title={value} />
                            ))}
                        </Select>
                    </Layout>
                </ScrollView>
                <FloatingSave saveHandler={saveHandler} />
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    formContainer: {
        flex: 1
    },
    parentContainer: {
        flex: 1,
        backgroundColor: 'white'
    },
    photoContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10,
        width: '100%'
    },
    avatarPlaceholder: {
        width: 100,
        height: 100,
        backgroundColor: '#E1E2E6',
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center'
    },
    avatarContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20
    },
    avatar: {
        height: 100,
        width: 100
    },
    miniActionsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%'
    },
    changeText: {
        marginVertical: 12,
        marginHorizontal: 40,
        flexWrap: 'wrap'
    },
    btnContainer: {
        width: '100%',
        marginTop: 20,
        alignItems: 'center'
    },
    btn: {
        marginVertical: 5,
        width: '70%'
    },
    inputContainer: {
        marginVertical: 14,
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingBottom: 80
    },
    selectInput: {
        width: '70%',
        marginVertical: 10
    },
    bioText: {
        minHeight: 64,
        paddingVertical: 10,
        textAlignVertical: 'top'
    },
    bioInput: {
        width: '70%',
        marginVertical: 10
    },
    screenTitle: {
        color: '#407BFF',
        fontSize: 20,
        fontWeight: 'bold',
        width: '70%'
    }
});

export default EditProfileScreen;
