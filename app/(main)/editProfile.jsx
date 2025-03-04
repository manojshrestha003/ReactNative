import { Pressable, StyleSheet, Text, View, TextInput, ActivityIndicator, Alert, Button, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import { Image } from 'expo-image';
import { useAuth } from '../../contexts/authContext';
import { getUserImageSource, uploadFile } from '../../services/imageService';
import Icon from 'react-native-vector-icons/FontAwesome';
import { updateUser } from '../../services/userService';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

const EditProfile = () => {
    const router = useRouter();
    const [user, setUser] = useState({
        name: '',
        phoneNumber: '',
        image: null,
        bio: '',
        address: ''
    });
    const [loading, setLoading] = useState(false);
    const { user: currentUser, setUserData } = useAuth();

    useEffect(() => {
        if (currentUser) {
            setUser({
                name: currentUser.name || '',
                phoneNumber: currentUser.phoneNumber || '',
                image: currentUser.image || null,
                bio: currentUser.bio || '',
                address: currentUser.address || ''
            });
        }
    }, [currentUser]);

    const imageSource = user.image && typeof user.image === 'object' ? user.image.uri : getUserImageSource(user.image);

    const onPickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.7
        });

        if (!result.canceled) {
            setUser({ ...user, image: result.assets[0] });
        }
    };

    const onSubmit = async () => {
        let userData = { ...user };
        let { name, phoneNumber, address, bio, image } = userData;

        if (!name || !phoneNumber || !address || !bio || !image) {
            Alert.alert('Profile', "Please fill all the fields");
            return;
        }

        setLoading(true);

        if (typeof image === 'object') {
            let imageRes = await uploadFile('profiles', image.uri, true);
            if (imageRes.success) {
                userData.image = imageRes.data;
            }
        }

        const res = await updateUser(currentUser?.id, userData);
        setLoading(false);

        console.log("Update user result:", res);

        if (res.success) {
            setUserData({ ...currentUser, ...userData });
            router.back();
        }
    };
    

    return (
        <View style={styles.container}>
            <ScrollView style={{ flex: 1 }}>
                <Header title="Edit Profile" />

                <View style={styles.form}>
                    <View style={styles.avatarContainer}>
                        <Image source={imageSource} style={styles.avatar} />
                        <Pressable onPress={onPickImage} style={styles.cameraButton}>
                            <Icon name="camera" size={20} color="white" />
                        </Pressable>
                    </View>

                    <Text style={styles.label}>Name</Text>
                    <TextInput
                        style={styles.input}
                        value={user.name}
                        onChangeText={(text) => setUser({ ...user, name: text })}
                        placeholder="Enter your name"
                    />

                    <Text style={styles.label}>Phone Number</Text>
                    <TextInput
                        style={styles.input}
                        value={user.phoneNumber}
                        onChangeText={(text) => setUser({ ...user, phoneNumber: text })}
                        placeholder="Enter your phone number"
                        keyboardType="phone-pad"
                    />

                    <Text style={styles.label}>Bio</Text>
                    <TextInput
                        style={styles.textArea}
                        value={user.bio}
                        onChangeText={(text) => setUser({ ...user, bio: text })}
                        placeholder="Tell us about yourself"
                        multiline
                    />

                    <Text style={styles.label}>Address</Text>
                    <TextInput
                        style={styles.input}
                        value={user.address}
                        onChangeText={(text) => setUser({ ...user, address: text })}
                        placeholder="Enter your address"
                    />

                    <Button title={loading ? "Updating..." : "Update"} onPress={onSubmit} disabled={loading} />
                    {loading && <ActivityIndicator size="small" color="#0000ff" style={styles.loadingIndicator} />}
                </View>
            </ScrollView>
        </View>
    );
};

export default EditProfile;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
        padding: 16,
    },
    form: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        marginVertical: 10,
    },
    avatarContainer: {
        alignItems: 'center',
        marginBottom: 20,
        position: 'relative',
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#ddd',
    },
    cameraButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#007bff',
        borderRadius: 20,
        padding: 5,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 10,
        backgroundColor: 'white',
    },
    textArea: {
        height: 80,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginBottom: 10,
        backgroundColor: 'white',
    },
    loadingIndicator: {
        marginTop: 10,
    },
});
