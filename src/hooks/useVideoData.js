import {ref} from "vue";
import axios from "axios";
import {useRouter} from "vue-router";

export function useVideoData(serverUrl) {
    const videoInfoList = ref([]);
    const pageNum = ref(0);
    const total = ref(0);
    const router = useRouter()

    //page可能为null，所以赋予默认值1
    async function fetchVideoData(kind, page = 1) {
        try {
            const response = await axios.get(`${serverUrl}/api/getVideoByKind`, {
                params: {
                    kind: kind,
                    page: page
                }
            }).catch((error) => {
                router.push(({
                    name: "error",
                    query: {
                        code: error.response.status
                    }
                }))
            });
            videoInfoList.value = response.data.records;
            total.value = response.data.total;
            pageNum.value = response.data.pages;
            return "获取成功"
        } catch (error) {
            return Promise.reject(new Error(error.message));
        }
    }

    return {
        videoInfoList,
        pageNum,
        total,
        fetchVideoData
    };
}
