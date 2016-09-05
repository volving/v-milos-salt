'use strict';

module.exports = {
    identify: { // 指纹创建
        '0100': {
            status: 'pre',
            url: '/pre',
            data: {
                db: {
                    collection: 'identity',
                    _id: ''
                },
                normal:{
                }
            }
        },
        '0110': 'pre', //
        '0120': 'record',
        '0130': 'post'
    }
};
