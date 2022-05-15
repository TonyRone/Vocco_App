import { Platform, Dimensions } from 'react-native';
export const windowWidth = Dimensions.get('window').width;
export const windowHeight = Dimensions.get('window').height;

export const API_URL = Platform.OS === 'ios' ? 'https://34.163.128.23:80' : 'https://34.163.128.23:80';
//export const API_URL = Platform.OS === 'ios' ? 'http://192.168.111.196:80' : 'http://192.168.111.196:80';
//export const API_URL = Platform.OS === 'ios' ? '' : 'https://ec2-18-117-55-156.us-east-2.compute.amazonaws.com:80';
export const SOCKET_URL = 'https://whiteboard-i2tsf4hvaq-od.a.run.app';
export const ACCESSTOKEN_KEY = "@VoccoAT:2021";
export const REFRESHTOKEN_KEY = "@VoccoRT:2021";
export const TUTORIAL_CHECK = "tutorial";
export const POST_CHECK = "firstpost";
export const SHARE_CHECK = "firstshare";
export const DEVICE_TOKEN = "devicetoken";
export const DEVICE_OS = "deviceos";
export const MAIN_LANGUAGE = 'main_language';

export const Categories = 
[
    {
        label:'',
        uri:require('../assets/categories/all.png')
    },
    {
        label:'Fun',
        uri:require('../assets/categories/fun.png')
    },
    {
        label:'Education',
        uri:require('../assets/categories/education.png')
    },
    {
        label:'Adults',
        uri:require('../assets/categories/adult.png')
    },
    {
        label:'Horror',
        uri:require('../assets/categories/horror.png')
    },
    {
        label:'Feminism',
        uri:require('../assets/categories/feminism.png')
    },
    {
        label:'LGBT',
        uri:require('../assets/categories/LGBT.png')
    },
    {
        label:'Studies',
        uri:require('../assets/categories/studies.png')
    },
    {
        label:'Parties',
        uri:require('../assets/categories/parties.png')
    },
    {
        label:'Astrology',
        uri:require('../assets/categories/astrology.png')
    },
    {
        label:'Transport',
        uri:require('../assets/categories/transport.png')
    },
    {
        label:'Fashion',
        uri:require('../assets/categories/fashion.png')
    },
    {
        label:'Film',
        uri:require('../assets/categories/film.png')
    },
    {
        label:'Cooking',
        uri:require('../assets/categories/cooking.png')
    },
    {
        label:'Games',
        uri:require('../assets/categories/games.png')
    },
    {
        label:'Music',
        uri:require('../assets/categories/music.png')
    },
    {
        label:'News',
        uri:require('../assets/categories/news.png')
    },
    {
        label:'Animals',
        uri:require('../assets/categories/animals.png')
    },
    {
        label:'Science',
        uri:require('../assets/categories/science.png')
    },
    {
        label:'Sport',
        uri:require('../assets/categories/sport.png')
    },
    {
        label:'Travel',
        uri:require('../assets/categories/travel.png')
    },
    {
        label:'Jokes',
        uri:require('../assets/categories/jokes.png')
    },
    {
        label:'Vegan',
        uri:require('../assets/categories/vegan.png')
    },
    {
        label:'Ecology',
        uri:require('../assets/categories/ecology.png')
    },
    {
        label:'Love',
        uri:require('../assets/categories/love.png')
    },
]