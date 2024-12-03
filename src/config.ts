import path from "path"

/** define address / path of root folder */

const ROOT_DIRECTORY = `${path.join(__dirname, `../`)}`

/**
 * __dirname: mendapatkan posisi dari folder pada file ini (cofig.ts).
 * -> pada folder "src" (/src/config.ts)
 * "../" -> mundur satu folder ke belakang 
 */

export { ROOT_DIRECTORY }