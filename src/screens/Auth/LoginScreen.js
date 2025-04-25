import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import {
  TextInput,
  Button,
  Text,
  useTheme,
  ActivityIndicator,
  HelperText,
  Avatar,
} from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import { loginUser, resetAuthError } from '../../store/slices/authSlice';
import { NAV_ROUTES } from '../../constants/navigationRoutes';
import { useNavigation } from '@react-navigation/native';

function LoginScreen() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { isLoading, error } = useSelector((state) => state.auth);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Clear auth error when the component mounts or error changes
  useEffect(() => {
    return () => {
      dispatch(resetAuthError());
    };
  }, [dispatch]);

  // Clear error when inputs change
  useEffect(() => {
    if (error) {
      dispatch(resetAuthError());
    }
  }, [errors.email, errors.password, dispatch]); // Trigger on form validation errors too

  const onSubmit = (data) => {
    dispatch(loginUser({ email: data.email, password: data.password }));
  };

  const handleForgotPassword = () => {
    // navigation.navigate(NAV_ROUTES.FORGOT_PASSWORD);
    console.log('Forgot Password Pressed'); // Placeholder
  };

  // Determine if network error occurred based on error message (simple check)
  const isNetworkError = error?.includes('connect') || error?.includes('Network');

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.headerContainer}>
            <Avatar.Icon size={64} icon="truck" style={{ backgroundColor: theme.colors.primary }} />
            <Text style={styles.title}>DriveHub</Text>
            <Text style={styles.subtitle}>Welcome back</Text>
            <Text style={styles.instruction}>Please sign in to continue</Text>
        </View>

        <View style={styles.formContainer}>
          <Controller
            control={control}
            rules={{
              required: 'Email or username is required',
              // Add email validation pattern if needed
              // pattern: { value: /\S+@\S+\.\S+/, message: "Invalid email format" }
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Email or username"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                mode="outlined"
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
                error={!!errors.email}
                left={<TextInput.Icon icon="email" />}
              />
            )}
            name="email"
          />
          {errors.email && <HelperText type="error">{errors.email.message}</HelperText>}

          <Controller
            control={control}
            rules={{
              required: 'Password is required',
              // Add minLength if needed
              // minLength: { value: 6, message: "Password must be at least 6 characters" }
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Password"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                mode="outlined"
                secureTextEntry={!isPasswordVisible}
                style={styles.input}
                error={!!errors.password}
                left={<TextInput.Icon icon="lock" />}
                right={
                  <TextInput.Icon
                    icon={isPasswordVisible ? 'eye-off' : 'eye'}
                    onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                  />
                }
              />
            )}
            name="password"
          />
          {errors.password && <HelperText type="error">{errors.password.message}</HelperText>}

          <TouchableOpacity onPress={handleForgotPassword}>
             <Text style={[styles.forgotPassword, { color: theme.colors.primary }]}>Forgot Password?</Text>
          </TouchableOpacity>

          {error && !isNetworkError && (
            <HelperText type="error" visible={!!error} style={styles.apiError}>
              {error}
            </HelperText>
          )}

          <Button
            mode="contained"
            onPress={handleSubmit(onSubmit)}
            style={styles.button}
            loading={isLoading}
            disabled={isLoading}
          >
            {isLoading ? 'Logging In...' : 'Log In'}
          </Button>

           {error && isNetworkError && (
            <View style={styles.networkErrorContainer}>
                 <Avatar.Icon size={24} icon="alert-circle" color={theme.colors.error} style={styles.errorIcon} />
                <Text style={[styles.networkErrorText, {color: theme.colors.error}]}>{error}</Text>
                <Button
                    mode="contained"
                    onPress={handleSubmit(onSubmit)} // Retry login
                    style={[styles.button, { backgroundColor: theme.colors.error }]}
                    loading={isLoading}
                    disabled={isLoading}
                >
                    Retry
                </Button>
            </View>
          )}

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 24,
    marginBottom: 8,
  },
    instruction: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
  },
  input: {
    marginBottom: 10,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginVertical: 10,
  },
  button: {
    marginTop: 20,
    paddingVertical: 8,
  },
  apiError: {
      textAlign: 'center',
      marginBottom: 10,
  },
  networkErrorContainer: {
      marginTop: 15,
      padding: 15,
      backgroundColor: '#FFEBEE', // Light red background
      borderRadius: 8,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#FFCDD2'
  },
   errorIcon: {
    backgroundColor: 'transparent',
    marginBottom: 8,
  },
  networkErrorText: {
    textAlign: 'center',
    marginBottom: 15,
  },
});

export default LoginScreen; 