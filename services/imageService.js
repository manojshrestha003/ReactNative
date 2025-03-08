import * as FileSystem from 'expo-file-system';
import { supabase } from '../lib/superbase';

export const getUserImageSource = (imagePath) => {
    if (imagePath?.uri) {
 
        console.log('Local image path:', imagePath.uri);
        return { uri: imagePath.uri };
    } else if (typeof imagePath === 'string' && imagePath.trim() !== '') {
     
        
        return getSupabaseFileUrl(imagePath);
    } else {
     
        return require('../assets/images/defaultUser.png');
    }
};

export const getSupabaseFileUrl = (filePath) => {
    return filePath
        ? { uri: `https://alrzxgvbagnrdlkjtwxm.supabase.co/storage/v1/object/public/uploads/${filePath}` }
        : null;
};



export const uploadFile = async (folderName, fileUri, isImage = true) => {
    try {
        const fileExt = isImage ? 'png' : 'mp4';
        const fileName = `${folderName}/${Date.now()}.${fileExt}`;

       
        const base64 = await FileSystem.readAsStringAsync(fileUri, {
            encoding: FileSystem.EncodingType.Base64,
        });

       
        const contentType = isImage ? 'image/png' : 'video/mp4';

       
        const fileData = {
            uri: fileUri,
            name: fileName,
            type: contentType,
        };

        
        const { data, error } = await supabase.storage
            .from('uploads')
            .upload(fileName, fileData, { contentType });

        if (error) {
            console.log('File upload error:', error);
            return { success: false, message: 'Could not upload media' };
        }

        return { success: true, data: data.path }; 

    } catch (error) {
        console.log('File upload error:', error);
        return { success: false, message: 'Could not upload media' };
    }
};
