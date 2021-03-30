import axios from 'axios'

function axiosrequest(config) {
    const instance = axios.create({
            baseURL: 'https://www.liulongbin.top:8888/api/private/v1',
            timeout: 3000,
            //设置token
            headers: {
                'Authorization': window.sessionStorage.getItem('token')
            }
        })
        //请求拦截
    instance.interceptors.request.use(config => {
            return config;
        }, err => {
            console.log(err);
        })
        //响应拦截
    instance.interceptors.response.use(res => {
            return res;
        }, err => {
            console.log(err);
        })
        //axios.create()返回值是一个promise
        //真正发送请求
    return instance(config);
}
export { axiosrequest };