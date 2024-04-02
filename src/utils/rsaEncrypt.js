import JSEncrypt from 'jsencrypt/bin/jsencrypt'

// 加密
export function encrypt(txt) {
    //rsa公钥
    const publicKey = "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCvsJ+dMOJfUM6iGhEE4VwxfF0L\n" +
        "6psLruCT2qbipf9IE8rmbipou/PargU+ygsl2ycOvhkrZwnxalo1xTWaWPjVRHt0\n" +
        "3T6vbYmO3zhP3JRySgULV1tscsQZecbAAT3EunJHXGwtNoaV0Jfy8K6UWarretpZ\n" +
        "ZlsFo+6+ltwnu6ZXvQIDAQAB"
    const encryptor = new JSEncrypt()
    encryptor.setPublicKey(publicKey) // 设置公钥
    return encryptor.encrypt(txt) // 对需要加密的数据进行加密
}
