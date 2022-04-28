import { ACCESSTOKEN_KEY, REFRESHTOKEN_KEY, TUTORIAL_CHECK, API_URL } from '../config/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFetchBlob from 'rn-fetch-blob';

class VoiceService {

    getVoiceFile(fileRemoteUrl){
        const fileExtension = 'mp3'; 
        const dirs = RNFetchBlob.fs.dirs.CacheDir;
        const path = `${dirs}/ss.mp3`;
        return RNFetchBlob.config({
            fileCache: false,
            appendExt: fileExtension,
            path,
        }).fetch('GET', fileRemoteUrl)
    }
    async postVoice(data) {
        const token = await AsyncStorage.getItem(ACCESSTOKEN_KEY);
        return RNFetchBlob.config({ trusty: true }).
        fetch(
            'POST',
            `${API_URL}/${'records'}`, {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
            data
        );
    }
    async postAnswerVoice(data) {
        const token = await AsyncStorage.getItem(ACCESSTOKEN_KEY);
        return RNFetchBlob.config({ trusty: true }).
        fetch(
            'POST',
            `${API_URL}/actions/answer`, {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
            data
        );
    }
    async getDiscoverTitle(label, skip, category) {
        const token = await AsyncStorage.getItem(ACCESSTOKEN_KEY);
        if(category == 'All')
            category = '';
        return RNFetchBlob.config({ trusty: true }).
        fetch('GET', `${API_URL}/records/discovertitle?skip=${skip}&take=20&order=DESC&category=${category}&search=${label}`, {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        });
    }
    async getDiscoverVoices(label, skip,category,recordId='') {
        const token = await AsyncStorage.getItem(ACCESSTOKEN_KEY);
        if(category=='All')
            category = '';
        return RNFetchBlob.config({ trusty: true }).
        fetch('GET', `${API_URL}/records/discover?skip=${skip}&take=10&order=DESC&category=${category}&search=${label}&recordId=${recordId}`, {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        });
    }
    async getHomeVoice(skip) {
        const token = await AsyncStorage.getItem(ACCESSTOKEN_KEY);
        return RNFetchBlob.config({ trusty: true }).
        fetch('GET', `${API_URL}/records/list?skip=${skip}&take=10&order=DESC`, {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        });
    }
    async getUserVoice(userId, skip) {
        const token = await AsyncStorage.getItem(ACCESSTOKEN_KEY);
        return RNFetchBlob.config({ trusty: true }).
        fetch('GET', `${API_URL}/records/me?skip=${skip}&take=10&order=DESC&userid=${userId}`, {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        });
    }
    async followFriend(userId) {
        const token = await AsyncStorage.getItem(ACCESSTOKEN_KEY);
        return RNFetchBlob.config({ trusty: true }).
        fetch(
            'POST',
            `${API_URL}/actions/follow?userid=${userId}`, {
                'Authorization': `Bearer ${token}`
            }
        );
    }
    async unfollowFriend(userId) {
        const token = await AsyncStorage.getItem(ACCESSTOKEN_KEY);
        return RNFetchBlob.config({ trusty: true }).
        fetch(
            'GET',
            `${API_URL}/actions/unfollow?id=${userId}`, {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        );
    }

    async blockUser(userId) {
        const token = await AsyncStorage.getItem(ACCESSTOKEN_KEY);
        return RNFetchBlob.config({ trusty: true }).
        fetch(
            'POST',
            `${API_URL}/actions/block?userid=${userId}`, {
                'Authorization': `Bearer ${token}`
            }
        );
    }

    async recordUnAppreciate(id) {
        const token = await AsyncStorage.getItem(ACCESSTOKEN_KEY);
        return RNFetchBlob.config({ trusty: true }).
        fetch(
            'GET',
            `${API_URL}/actions/recordunlike?id=${id}`, {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        );
    }
    async recordAppreciate(data) {
        const token = await AsyncStorage.getItem(ACCESSTOKEN_KEY);
        return RNFetchBlob.config({ trusty: true }).
        fetch(
            'POST',
            `${API_URL}/actions/recordappreciate`, {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            JSON.stringify(data)
        );
    }
    async answerRecord(data) {
        const token = await AsyncStorage.getItem(ACCESSTOKEN_KEY);
        return RNFetchBlob.config({ trusty: true }).
        fetch(
            'POST',
            `${API_URL}/actions/answer`, {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            JSON.stringify(data)
        );
    }
    async answerUnAppreciate(id) {
        const token = await AsyncStorage.getItem(ACCESSTOKEN_KEY);
        return RNFetchBlob.config({ trusty: true }).
        fetch(
            'GET',
            `${API_URL}/actions/answerunlike?id=${id}`, {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        );
    }
    async answerAppreciate(data) {
        const token = await AsyncStorage.getItem(ACCESSTOKEN_KEY);
        return RNFetchBlob.config({ trusty: true }).
        fetch(
            'POST',
            `${API_URL}/actions/answerappreciate`, {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            JSON.stringify(data)
        );
    }
    async addReaction(data) {
        const token = await AsyncStorage.getItem(ACCESSTOKEN_KEY);
        return RNFetchBlob.config({ trusty: true }).
        fetch(
            'POST',
            `${API_URL}/actions/recordreaction`, {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            JSON.stringify(data)
        );
    }
    async getProfile(userId) {
        const token = await AsyncStorage.getItem(ACCESSTOKEN_KEY);
        return RNFetchBlob.config({ trusty: true }).
        fetch('GET', `${API_URL}/records/getseveralcount?other=${userId}`, {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        });
    }
    async getActivities(skip) {
        const token = await AsyncStorage.getItem(ACCESSTOKEN_KEY);
        return RNFetchBlob.config({ trusty: true }).
        fetch('GET', `${API_URL}/notifications/getnotifications?skip=${skip}&take=10&order=DESC&type=`, {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        });
    }
    async getRequests(skip) {
        const token = await AsyncStorage.getItem(ACCESSTOKEN_KEY);
        return RNFetchBlob.config({ trusty: true }).
        fetch('GET', `${API_URL}/notifications/getnotifications?skip=${skip}&take=10&order=DESC&type=friendRequest`, {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        });
    }
    async unreadActivityCount() {
        const token = await AsyncStorage.getItem(ACCESSTOKEN_KEY);
        return RNFetchBlob.config({ trusty: true }).
        fetch(
            'POST',
            `${API_URL}/notifications/UnreadArticleCount`, {
                'Authorization': `Bearer ${token}`
            }
        );
    }
    async unreadRequestCount() {
        const token = await AsyncStorage.getItem(ACCESSTOKEN_KEY);
        return RNFetchBlob.config({ trusty: true }).
        fetch(
            'POST',
            `${API_URL}/notifications/UnreadRequestCount`, {
                'Authorization': `Bearer ${token}`
            }
        );
    }
    async seenNotification(id) {
        const token = await AsyncStorage.getItem(ACCESSTOKEN_KEY);
        return RNFetchBlob.config({ trusty: true }).
        fetch(
            'PUT',
            `${API_URL}/notifications/seen?id=${id}`, {
                'Authorization': `Bearer ${token}`
            }
        );
    }
    async deleteNotification(id) {
        const token = await AsyncStorage.getItem(ACCESSTOKEN_KEY);
        return RNFetchBlob.config({ trusty: true }).
        fetch(
            'DELETE',
            `${API_URL}/notifications/deletenotification?id=${id}`, {
                'Authorization': `Bearer ${token}`
            }
        );
    }
    async markAllactivitySeen() {
        const token = await AsyncStorage.getItem(ACCESSTOKEN_KEY);
        return RNFetchBlob.config({ trusty: true }).
        fetch(
            'PUT',
            `${API_URL}/notifications/allseen?type=`, {
                'Authorization': `Bearer ${token}`
            }
        );
    }
    async markAllrequestSeen() {
        const token = await AsyncStorage.getItem(ACCESSTOKEN_KEY);
        return RNFetchBlob.config({ trusty: true }).
        fetch(
            'PUT',
            `${API_URL}/notifications/allseen?type=friendRequest`, {
                'Authorization': `Bearer ${token}`
            }
        );
    }
    async acceptFriend(userId) {
        const token = await AsyncStorage.getItem(ACCESSTOKEN_KEY);
        return RNFetchBlob.config({ trusty: true }).
        fetch(
            'POST',
            `${API_URL}/actions/acceptfriend?id=${userId}`, {
                'Authorization': `Bearer ${token}`
            }
        );
    }
    async getAnswerVoices(id,answerId = '') {
        const token = await AsyncStorage.getItem(ACCESSTOKEN_KEY);
        return RNFetchBlob.config({ trusty: true }).
        fetch(
           'GET', 
            `${API_URL}/records/answers?id=${id}&skip=0&take=10&order=DESC&answerId=${answerId}`, {
                'Authorization': `Bearer ${token}`
            }
        );
    }
}

export default new VoiceService();