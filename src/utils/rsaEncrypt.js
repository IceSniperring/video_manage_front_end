import JSEncrypt from 'jsencrypt/bin/jsencrypt'

// 加密
export function encrypt(txt) {
    //rsa公钥
    const publicKey = '-----BEGIN PUBLIC KEY-----\n' +
        'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC8P2yknA51gQq9ew8U2mrt7esV\n' +
        'tDr7hh5dk5PG2ksyajFjWgL4hE9gUogtqx6nCNJOPl46obWIuT9JU7Sf2nGGDzHx\n' +
        'Sz5TARsE7OQqAph1MJYW7I+VCwzUSCSLp6OOiLyW2OTZ+CXbaJG9qpcWhM2oYpYw\n' +
        '4uc52F6WHliIY6Yi3QIDAQAB\n' +
        '-----END PUBLIC KEY-----'
    const encryptor = new JSEncrypt()
    encryptor.setPublicKey(publicKey) // 设置公钥
    return encryptor.encrypt(txt) // 对需要加密的数据进行加密
}
