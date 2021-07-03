import React from 'react';
import {
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Button,
  Layout,
  Input,
  Select,
  SelectItem,
  IndexPath,
  Icon,
  Text
} from '@ui-kitten/components';
import { StackActions } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import * as Notifications from 'expo-notifications';

import { NavHeader, LoadingIndicator, Toast } from '../../components/index';
import { genderData } from '../../constants/profleCreationData';
import * as authActions from '../../redux/actions/auth';

import firebase from '../../firebase/';

const SignupScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  const [fName, setFName] = React.useState('');
  const [lName, setLName] = React.useState('');
  const [selectedIndex, setSelectedIndex] = React.useState(new IndexPath(0));
  const genderValue = genderData[selectedIndex.row];
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(true);
  const [name, setName] = React.useState('');

  const [loading, setLoading] = React.useState(false);
  const [showAlert, setShowAlert] = React.useState(false);
  const [alertMessage, setAlertMessage] = React.useState('');
  const [alertStatus, setAlertStatus] = React.useState('');

  React.useEffect(() => {
    setName(`${fName + ' ' + lName}`);
  }, [fName, lName]);

  const tempPush = async () => {
    // let userPushToken;
    // let statusObj = await Notifications.getPermissionsAsync();

    // if (statusObj.status !== 'granted') {
    //   statusObj = await Notifications.requestPermissionsAsync();
    // }

    // if (statusObj.status !== 'granted') {
    //   userPushToken = null;
    // } else {
    //   userPushToken = (await Notifications.getExpoPushTokenAsync()).data;
    // }

    // console.log(userPushToken);

    const batch = firebase.firestore().batch();

    firebase
      .firestore()
      .collection('users')
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          const docRef = firebase.firestore().collection('users').doc(doc.id);
          docRef.update({
            background: {
              github: '',
              linkedin: '',
              year: 'Year 1',
              degree: 'Business Analytics',
              commitment: 'Medium Commitment',
              achievement: 'Artemis',
              interests: [],
              telegram: 'https://t.me/domlimm',
              idea: 'No',
              sweExperience: 'Beginner',
              biography: 'Testing Biography',
              technologyExperience: {
                game: [],
                web: [],
                mobile: [],
                database: [],
                machineLearning: []
              }
            }
          });
          // batch.update(docRef, { matchId: '' });
        });

        // batch.commit();
      });
  };

  const signUpHandler = async () => {
    let userPushToken;
    let statusObj = await Notifications.getPermissionsAsync();

    if (statusObj.status !== 'granted') {
      statusObj = await Notifications.requestPermissionsAsync();
    }

    if (statusObj.status !== 'granted') {
      userPushToken = null;
    } else {
      userPushToken = (await Notifications.getExpoPushTokenAsync()).data;
    }

    try {
      if (
        fName.length === 0 ||
        lName.length === 0 ||
        email.length === 0 ||
        password.length === 0
      ) {
        setAlertMessage('You have empty fields!');
        setShowAlert(true);
        setAlertStatus('warning');
        return;
      }

      if (password.length < 6) {
        setAlertMessage('Password has to be min. 6 characters long!');
        setShowAlert(true);
        setAlertStatus('warning');
        return;
      }

      setLoading(true);

      await dispatch(
        authActions.signUp(email, password, name, genderValue, userPushToken)
      );

      return {
        ...StackActions.popToTop(),
        ...StackActions.replace('RegisterNavigator')
      };
    } catch (err) {
      setAlertMessage(err.message);
      setShowAlert(true);
      setAlertStatus('danger');
      setLoading(false);
    }
  };

  const NameIcon = props => <Icon {...props} name='smiling-face-outline' />;
  const EmailIcon = props => <Icon {...props} name='email-outline' />;
  const PasswordIcon = props => (
    <TouchableWithoutFeedback onPress={showPasswordHandler}>
      <Icon {...props} name={showPassword ? 'eye' : 'eye-off'} />
    </TouchableWithoutFeedback>
  );

  const showPasswordHandler = () => {
    setShowPassword(!showPassword);
  };

  const Title = ({ title }) => (
    <Layout style={styles.titleContainer}>
      <Text style={styles.title}>{title.toUpperCase()}</Text>
    </Layout>
  );

  const navProps = {
    navigation: navigation,
    type: 'auth',
    backNav: true
  };

  return (
    <KeyboardAvoidingView
      style={styles.formContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : null}
    >
      <SafeAreaView style={styles.container}>
        <NavHeader navProps={navProps} />
        {showAlert && (
          <Toast
            message={alertMessage}
            status={alertStatus}
            hide={show => setShowAlert(show)}
          />
        )}
        <ScrollView>
          <Layout style={styles.inputContainer}>
            <Title title='Personal Details' />
            <Input
              label='First Name'
              style={styles.textInput}
              placeholder='John'
              accessoryRight={NameIcon}
              value={fName}
              onChangeText={input => setFName(input)}
            />
            <Input
              label='Last Name'
              style={styles.textInput}
              placeholder='Doe'
              accessoryRight={NameIcon}
              value={lName}
              onChangeText={input => setLName(input)}
            />
            <Select
              style={styles.selectInput}
              selectedIndex={selectedIndex}
              value={genderValue}
              onSelect={index => setSelectedIndex(index)}
              placeholder='Select'
              label='Gender'
            >
              {genderData.map((value, key) => (
                <SelectItem key={key} title={value} />
              ))}
            </Select>
            <Title title='Account' />
            <Input
              label='Email'
              style={styles.textInput}
              placeholder='example@mail.com'
              value={email}
              onChangeText={input => setEmail(input)}
              accessoryRight={EmailIcon}
              keyboardType='email-address'
              autoCapitalize='none'
            />
            <Input
              label='Password'
              style={styles.textInput}
              placeholder='********'
              accessoryRight={PasswordIcon}
              value={password}
              onChangeText={input => setPassword(input)}
              secureTextEntry={showPassword}
              autoCapitalize='none'
            />
          </Layout>
          <Layout style={styles.btnContainer}>
            <Button
              onPress={signUpHandler}
              disabled={loading}
              style={styles.signupBtn}
              accessoryLeft={loading ? () => <LoadingIndicator /> : null}
            >
              {loading ? 'Registering' : 'Register'}
            </Button>
          </Layout>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  formContainer: {
    flex: 1
  },
  titleContainer: {
    width: '70%',
    marginTop: 10
  },
  title: {
    color: '#407BFF',
    fontSize: 20,
    fontWeight: 'bold'
  },
  btnContainer: {
    flex: 1,
    alignItems: 'center'
  },
  inputContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly'
  },
  textInput: {
    width: '70%',
    marginVertical: 10
  },
  signupBtn: {
    width: '70%',
    marginVertical: 30
  },
  selectInput: {
    width: '70%',
    marginVertical: 10
  },
  screenTitle: {
    color: '#407BFF',
    fontSize: 30,
    fontWeight: 'bold'
  },
  forgotPassText: {
    marginVertical: 20,
    color: '#407BFF'
  }
});

export default SignupScreen;
