//Author: Tianzi Zhang
//Github: acse-tz2523
import { createRouter, createWebHistory } from 'vue-router';
import IntroductionPage from '@/views/IntroductionPage.vue';
import globalmap from '@/views/GlobalMap.vue';
import histogramchart from '@/views/HistogramChart.vue';
import testPlotly from '@/views/testPlotly.vue';
import bubblechart from '@/views/BubbleChart.vue';
import uploadfile from '@/views/UploadFile.vue';
const routes = [
    {
        path: '/',
        redirect: '/introduction'
    },
    {
        path: '/introduction',
        name: 'IntroductionPage',
        component: IntroductionPage
    },
    {
        path: '/map',
        name: 'Figure1',
        component: globalmap
    },
    {
        path: '/histogram',
        name: 'histogramchart',
        component: histogramchart
    },
    
    {
        path: '/boxplot',
        name: 'testPlotly',
        component: testPlotly
    },
    // {
    //     path: '/figure3',
    //     name: 'testHistorgram',
    //     component: testHistorgram
    // },
    {
        path: '/animation',
        name: 'bubblechart',
        component: bubblechart
    },
    {
        path: '/upload',
        name: 'UploadFile',
        component: uploadfile
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
