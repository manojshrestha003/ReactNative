import { decode } from 'base64-arraybuffer';
import * as FileSystem from 'expo-file-system';
import { supabase } from '../lib/superbase';
import { superbaseUrl } from '../constants';



export const getUserImageSource = (imagePath) => {
    if (imagePath) {
        return getSupabaseFileUrl(imagePath);
    } else {
        return require('../assets/images/defaultUser.png');
    }
};

export const getSupabaseFileUrl = (filePath) => {
    if (filePath) {
        return { uri: `${superbaseUrl}/storage/v1/object/public/uploads/${filePath}` };
    }
    return null;
};

export const uploadFile = async (folderName, fileUri, isImage = true) => {
    try {
        let fileName = getFilepath(folderName, isImage);
        
        // Read file as base64
        const fileBase64 = await FileSystem.readAsStringAsync(fileUri, {
            encoding: FileSystem.EncodingType.Base64
        });

        // Convert base64 to Blob
        const fileBlob = new Blob([decode(fileBase64)], { type: isImage ? 'image/png' : 'video/mp4' });

        let { data, error } = await supabase
            .storage
            .from('uploads')
            .upload(fileName, fileBlob, { 
                cacheControl: '3600',
                upsert: false,
                contentType: isImage ? 'image/png' : 'video/mp4'
            });

        if (error) {
            console.log('File upload error', error);
            return { success: false, message: 'Could not upload media' };
        }
        return { success: true, data: data.path };

    } catch (error) {
        console.log('File upload error', error);
        return { success: false, message: 'Could not upload media' };
    }
};

export const getFilepath = (folderName, isImage) => {
    return `${folderName}/${Date.now()}${isImage ? '.png' : '.mp4'}`;  
};
