import { ACCESSTOKEN_KEY, REFRESHTOKEN_KEY, TUTORIAL_CHECK, API_URL } from '../config/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFetchBlob from 'rn-fetch-blob';

class VoiceService {

    getVoiceFile(fileRemoteUrl) {
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
                `${API_URL}/records`, {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
                data
            );
    }

    async changeVoice(data) {
        const token = await AsyncStorage.getItem(ACCESSTOKEN_KEY);
        return RNFetchBlob
            .config({ trusty: true })
            .fetch(
                'PUT',
                `${API_URL}/records/changevoice`, {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
                JSON.stringify(data)
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

    async postTag(data) {
        const token = await AsyncStorage.getItem(ACCESSTOKEN_KEY);
        return RNFetchBlob
            .config({ trusty: true })
            .fetch(
                'POST',
                `${API_URL}/actions/tagFriends`, {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
                JSON.stringify(data)
            );
    }

    async postAnswerReply(data) {
        const token = await AsyncStorage.getItem(ACCESSTOKEN_KEY);
        return RNFetchBlob.config({ trusty: true }).
            fetch(
                'POST',
                `${API_URL}/actions/answerReply`, {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
                data
            );
    }

    async postMessage(data) {
        const token = await AsyncStorage.getItem(ACCESSTOKEN_KEY);
        return RNFetchBlob.config({ trusty: true }).
            fetch(
                'POST',
                `${API_URL}/actions/addMessage`, {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
                data
            );
    }

    async confirmMessage(id) {
        const token = await AsyncStorage.getItem(ACCESSTOKEN_KEY);
        return RNFetchBlob.config({ trusty: true }).
            fetch('GET', `${API_URL}/actions/confirmMessage?toUserId=${id}`, {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            });
    }

    async getDiscoverTitle(label, skip, category) {
        const token = await AsyncStorage.getItem(ACCESSTOKEN_KEY);
        if (category == 'All')
            category = '';
        return RNFetchBlob.config({ trusty: true }).
            fetch('GET', `${API_URL}/records/discovertitle?skip=${skip}&take=20&order=DESC&category=${category}&search=${label}`, {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            });
    }

    async getDiscoverVoices(label, skip, category, recordId = '') {
        const token = await AsyncStorage.getItem(ACCESSTOKEN_KEY);
        return RNFetchBlob.config({ trusty: true }).
            fetch('GET', `${API_URL}/records/discover?skip=${skip}&take=10&order=DESC&category=${category}&search=${label}&recordId=${recordId}`, {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            });
    }

    async getStories(skip = 0, userId = '', category = '', searchTitle = '', recordId = '', friend = '') {
        const token = await AsyncStorage.getItem(ACCESSTOKEN_KEY);
        return RNFetchBlob.config({ trusty: true }).
            fetch('GET', `${API_URL}/records/stories?skip=${skip}&take=10&order=DESC&userId=${userId}&category=${category}&search=${searchTitle}&recordId=${recordId}&friend=${friend}`, {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            });
    }

    async getTemporaryList(userId = "") {
        const token = await AsyncStorage.getItem(ACCESSTOKEN_KEY);
        return RNFetchBlob.config({ trusty: true }).
            fetch('GET', `${API_URL}/records/temporary?skip=0&take=10&order=DESC&userId=${userId}`, {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            });
    }
    async getUserVoice(userId, skip) {
        const token = await AsyncStorage.getItem(ACCESSTOKEN_KEY);
        return RNFetchBlob.config({ trusty: true }).
            fetch('GET', `${API_URL}/records/me?skip=${skip}&take=10&order=DESC&userId=${userId}`, {
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

    async deleteSuggest(userId) {
        const token = await AsyncStorage.getItem(ACCESSTOKEN_KEY);
        return RNFetchBlob.config({ trusty: true }).
            fetch(
                'POST',
                `${API_URL}/actions/deleteSuggest?userId=${userId}`, {
                'Authorization': `Bearer ${token}`
            }
            );
    }

    async deleteFollower(userId) {
        const token = await AsyncStorage.getItem(ACCESSTOKEN_KEY);
        return RNFetchBlob.config({ trusty: true }).
            fetch(
                'POST',
                `${API_URL}/actions/deleteFollower?userId=${userId}`, {
                'Authorization': `Bearer ${token}`
            }
            );
    }

    async deleteFollowing(userId) {
        const token = await AsyncStorage.getItem(ACCESSTOKEN_KEY);
        return RNFetchBlob.config({ trusty: true }).
            fetch(
                'POST',
                `${API_URL}/actions/deleteFollowing?userId=${userId}`, {
                'Authorization': `Bearer ${token}`
            }
            );
    }

    async inviteFriend(phoneNumber) {
        const token = await AsyncStorage.getItem(ACCESSTOKEN_KEY);
        return RNFetchBlob.config({ trusty: true }).
            fetch(
                'POST',
                `${API_URL}/actions/inviteFriend?phoneNumber=${phoneNumber}`, {
                'Authorization': `Bearer ${token}`
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

    async replyAnswerAppreciate(id) {
        const token = await AsyncStorage.getItem(ACCESSTOKEN_KEY);
        return RNFetchBlob.config({ trusty: true }).
            fetch(
                'GET',
                `${API_URL}/actions/replyAnswerLike?id=${id}`, {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
            );
    }

    async likeTag(id, isLike) {
        const token = await AsyncStorage.getItem(ACCESSTOKEN_KEY);
        return RNFetchBlob.config({ trusty: true }).
            fetch(
                'GET',
                `${API_URL}/actions/tagLike?id=${id}&isLike=${isLike}`, {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
            );
    }

    async replyAnswerUnAppreciate(id) {
        const token = await AsyncStorage.getItem(ACCESSTOKEN_KEY);
        return RNFetchBlob.config({ trusty: true }).
            fetch(
                'GET',
                `${API_URL}/actions/replyAnswerUnlike?id=${id}`, {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
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

    async getFollows(userId, followType) {
        const token = await AsyncStorage.getItem(ACCESSTOKEN_KEY);
        return RNFetchBlob.config({ trusty: true }).
            fetch('GET', `${API_URL}/records/getFollowUsers?other=${userId}&followType=${followType}`, {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            });
    }

    async getConversations() {
        const token = await AsyncStorage.getItem(ACCESSTOKEN_KEY);
        return RNFetchBlob.config({ trusty: true }).
            fetch('GET', `${API_URL}/actions/getConversations`, {
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

    async deleteVoice(id) {
        const token = await AsyncStorage.getItem(ACCESSTOKEN_KEY);
        return RNFetchBlob.config({ trusty: true }).
            fetch(
                'DELETE',
                `${API_URL}/records/deletevoice?id=${id}`, {
                'Authorization': `Bearer ${token}`
            }
            );
    }

    async deleteAnswer(id) {
        const token = await AsyncStorage.getItem(ACCESSTOKEN_KEY);
        return RNFetchBlob.config({ trusty: true }).
            fetch(
                'DELETE',
                `${API_URL}/records/deleteAnswer?id=${id}`, {
                'Authorization': `Bearer ${token}`
            }
            );
    }

    async deleteTag(id) {
        const token = await AsyncStorage.getItem(ACCESSTOKEN_KEY);
        return RNFetchBlob.config({ trusty: true }).
            fetch(
                'DELETE',
                `${API_URL}/actions/deleteTag?id=${id}`, {
                'Authorization': `Bearer ${token}`
            }
            );
    }

    async deleteReplyAnswer(id) {
        const token = await AsyncStorage.getItem(ACCESSTOKEN_KEY);
        return RNFetchBlob.config({ trusty: true }).
            fetch(
                'DELETE',
                `${API_URL}/records/deleteReplyAnswer?id=${id}`, {
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
    async acceptFriend(userId, requestId) {
        const token = await AsyncStorage.getItem(ACCESSTOKEN_KEY);
        return RNFetchBlob.config({ trusty: true }).
            fetch(
                'POST',
                `${API_URL}/actions/acceptfriend?id=${userId}&requestId=${requestId}`, {
                'Authorization': `Bearer ${token}`
            }
            );
    }

    async getAnswerVoices(id, answerId = '') {
        const token = await AsyncStorage.getItem(ACCESSTOKEN_KEY);
        return RNFetchBlob.config({ trusty: true }).
            fetch(
                'GET',
                `${API_URL}/records/answers?id=${id}&skip=0&take=10&order=DESC&answerId=${answerId}`, {
                'Authorization': `Bearer ${token}`
            }
            );
    }

    async getTagUsers(id) {
        const token = await AsyncStorage.getItem(ACCESSTOKEN_KEY);
        return RNFetchBlob.config({ trusty: true }).
            fetch(
                'GET',
                `${API_URL}/actions/getTagUsers?tagId=${id}`, {
                'Authorization': `Bearer ${token}`
            }
            );
    }

    async getActiveUsers(){
        const token = await AsyncStorage.getItem(ACCESSTOKEN_KEY);
        return RNFetchBlob.config({ trusty: true }).
            fetch(
                'GET',
                `${API_URL}/actions/getActiveUsers`, {
                'Authorization': `Bearer ${token}`
            }
            );
    }

    async getMessages(toUserId) {
        const token = await AsyncStorage.getItem(ACCESSTOKEN_KEY);
        return RNFetchBlob.config({ trusty: true }).
            fetch(
                'GET',
                `${API_URL}/actions/getMessages?toUserId=${toUserId}`, {
                'Authorization': `Bearer ${token}`
            }
            );
    }

    async getTags(storyId, storyType) {
        const token = await AsyncStorage.getItem(ACCESSTOKEN_KEY);
        return RNFetchBlob.config({ trusty: true }).
            fetch(
                'GET',
                `${API_URL}/actions/getTags?storyId=${storyId}&storyType=${storyType}`, {
                'Authorization': `Bearer ${token}`
            }
            );
    }

    async getSuggests(skip) {
        const token = await AsyncStorage.getItem(ACCESSTOKEN_KEY);
        return RNFetchBlob.config({ trusty: true }).
            fetch(
                'GET',
                `${API_URL}/records/getSuggests?skip=${skip}`, {
                'Authorization': `Bearer ${token}`
            }
            );
    }

    async getInvites() {
        const token = await AsyncStorage.getItem(ACCESSTOKEN_KEY);
        return RNFetchBlob.config({ trusty: true }).
            fetch(
                'GET',
                `${API_URL}/records/getInvites`, {
                'Authorization': `Bearer ${token}`
            }
            );
    }

    async deleteMessages(data) {
        const token = await AsyncStorage.getItem(ACCESSTOKEN_KEY);
        return RNFetchBlob
            .config({ trusty: true })
            .fetch(
                'POST',
                `${API_URL}/actions/deleteMessages`, {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
                JSON.stringify(data)
            );
    }

    async getReplyAnswerVoices(id) {
        const token = await AsyncStorage.getItem(ACCESSTOKEN_KEY);
        return RNFetchBlob.config({ trusty: true }).
            fetch(
                'GET',
                `${API_URL}/records/replyAnswers?id=${id}&skip=0&take=10&order=DESC`, {
                'Authorization': `Bearer ${token}`
            }
            );
    }

    async getLikes(storyId, storyType) {
        const token = await AsyncStorage.getItem(ACCESSTOKEN_KEY);
        return RNFetchBlob.config({ trusty: true }).
            fetch(
                'GET',
                `${API_URL}/records/storyLikes?storyId=${storyId}&storyType=${storyType}`, {
                'Authorization': `Bearer ${token}`
            }
            );
    }

    async listenStory(id, storyType) {
        const token = await AsyncStorage.getItem(ACCESSTOKEN_KEY);
        RNFetchBlob.config({ trusty: true }).
            fetch(
                'GET',
                `${API_URL}/records/listenStory?id=${id}&storyType=${storyType}`, {
                'Authorization': `Bearer ${token}`,
            }
            );
    }

    async shareStory(id, storyType) {
        const token = await AsyncStorage.getItem(ACCESSTOKEN_KEY);
        RNFetchBlob.config({ trusty: true }).
            fetch(
                'GET',
                `${API_URL}/records/shareStory?id=${id}&storyType=${storyType}`, {
                'Authorization': `Bearer ${token}`,
            }
            );
    }

    async shareLink() {
        const token = await AsyncStorage.getItem(ACCESSTOKEN_KEY);
        RNFetchBlob.config({ trusty: true }).
            fetch(
                'GET',
                `${API_URL}/actions/shareLink`, {
                'Authorization': `Bearer ${token}`,
            }
            );
    }
}

export default new VoiceService();