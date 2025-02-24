import { verify } from "jsonwebtoken";
import { md5 } from "./crypto";
import multer, { diskStorage } from "multer";
import path from "path";
import toc, { Token } from "markdown-toc";
import { Authorization, Blog } from "../types";
import { PathLike } from "fs";
import { UnknownError } from "./errors";
import { readdir } from "fs/promises";
import { Request } from "express";

export function parseToken(token: string | undefined): Authorization | null {
  if (!token) {
    // 没有token
    return null;
  }
  // authorization: bearer token
  const parts = token.split(" ");
  if (parts.length > 0) {
    token = parts.length === 1 ? parts[0] : parts[1];
  }
  // }
  try {
    const result = <Authorization>verify(token, md5(process.env.JWT_SECRECT!));
    return result;
  } catch (error) {
    // logger.log(error);
    return null;
  }
}

const storage = diskStorage({
  // 文件存储路径
  destination: (req, file, cb) => {
    const url = path.resolve(__dirname, "../../public/static/uploads");
    cb(null, url);
  },
  // 上传到服务器的文件，文件名要做单独处理
  filename: (req, file, cb) => {
    console.log("file", file);

    // 获取文件名
    let basename = path.basename(
      file.originalname,
      path.extname(file.originalname)
    );
    console.log("basename", basename);
    if(/[^\w+]/.test(basename)){
      basename = 'ZYServer'
    }
    // 获取后缀名
    const ext = path.extname(file.originalname);
    // 构建新名字
    const newName = `${basename}-${new Date().getTime()}-${Math.floor(
      Math.random() * 9000 + 1000
    )}${ext}`;
    console.log(newName);

    cb(null, newName);
  },
});

// 文件上传
export const uploading = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 1024,
    files: 1,
  },
});

export interface TOC {
  name: string;
  anchor: string;
  level: number;
  children: TOC[];
}
export function handleTOC(blogInfo: Blog): Blog {
  if (!blogInfo.markdownContent) return blogInfo;
  let result = toc(blogInfo.markdownContent).json;
  // 将 markdown 标题提取出来
  // 形成一个数组，数组里面是一个个对象，每个对象记录了标题的名称以及等级，如下：
  // [
  //     { content: '数值类型概述', slug: '数值类型概述', lvl: 2, i: 0, seen: 0 },
  //     { content: '整数和浮点数', slug: '整数和浮点数', lvl: 3, i: 1, seen: 0 },
  //     { content: '数值精度', slug: '数值精度', lvl: 4, i: 2, seen: 0 },
  //     { content: '数值范围', slug: '数值范围', lvl: 3, i: 3, seen: 0 },
  //     { content: '数值的表示方法', slug: '数值的表示方法', lvl: 2, i: 4, seen: 0 }
  // ]

  // 但是这不是我们想要的格式，我们想要转换为
  // [
  //     { "name": "章节1", "anchor": "title-1" },
  //     { "name": "章节2", "anchor": "title-2",
  //         "children": [
  //             { "name": "章节2-1", "anchor": "title-2-1" },
  //             { "name": "章节2-2", "anchor": "title-2-2" },
  //         ]
  //     }
  // ]

  // 接下来对上面的数据进行一个转换

  function transfer(
    flatArr: Pick<Token, "content" | "slug" | "lvl" | "i" | "seen">[]
  ) {
    const stack: TOC[] = [], // 模拟栈的结构
      result: TOC[] = []; // 存放最后转换结果
    let min = 6; // 标题最小的级别

    /**
     * 创建 TOC 对象
     * @param {*} item
     * @returns
     */
    function createTocItem(
      item: Pick<Token, "content" | "slug" | "lvl" | "i" | "seen">
    ): TOC {
      // 创建并返回一个具有指定属性的TOC项
      return {
        name: item.content,
        anchor: item.slug!,
        level: item.lvl,
        children: [],
      };
    }

    function handleItem(tocItem: TOC) {
      // 获取 stack 栈顶的元素，即是该数组最后一个元素
      // 如果该数组为空，得到的是一个undefined
      const top = stack[stack.length - 1];
      if (!top) {
        stack.push(tocItem);
      } else if (tocItem.level > top.level) {
        // 当前top对象的等级比栈顶的更大
        // 说明 top 对象应该成为上一个 top 对象的子元素
        top.children.push(tocItem);
      } else {
        stack.pop();
        handleItem(tocItem);
      }
    }

    // 找出最小的标题级别
    for (const flat of flatArr) {
      if (flat.lvl < min) {
        min = flat.lvl;
      }
    }

    for (const item of flatArr) {
      const tocItem = createTocItem(item);
      if (tocItem.level === min) {
        // toc对象是最底的等级，不会作为其他对象的children
        result.push(tocItem);
      }
      // toc 对象不是最低等级，可能是其他 toc 对象的一员
      handleItem(tocItem);
    }
    return result;
  }

  blogInfo.toc = transfer(result);

  // 为各级别的标题添加上id
  for (const item of result) {
    let newStr = `<h1 id="${item.slug}">`;
    switch (item.lvl) {
      case 1:
        blogInfo.htmlContent = blogInfo.htmlContent.replace("<h1>", newStr);
        break;
      case 2:
        newStr = `<h2 id="${item.slug}">`;
        blogInfo.htmlContent = blogInfo.htmlContent.replace("<h2>", newStr);
        break;
      case 3:
        newStr = `<h3 id="${item.slug}">`;
        blogInfo.htmlContent = blogInfo.htmlContent.replace("<h3>", newStr);
        break;
      case 4:
        newStr = `<h4 id="${item.slug}">`;
        blogInfo.htmlContent = blogInfo.htmlContent.replace("<h4>", newStr);
        break;
      case 5:
        newStr = `<h5 id="${item.slug}">`;
        blogInfo.htmlContent = blogInfo.htmlContent.replace("<h5>", newStr);
        break;
      case 6:
        newStr = `<h6 id="${item.slug}">`;
        blogInfo.htmlContent = blogInfo.htmlContent.replace("<h6>", newStr);
        break;
    }
  }

  return blogInfo;
}

export function array2String<T, K extends T, V extends T>(
  instance: Partial<K>,
  keys: (keyof K & keyof V & string)[]
): V {
  const obj: {
    [key: string]: string;
  } = {};
  for (const key of keys) {
    const target = instance[key];
    if (!target) continue;
    obj[key] = JSON.stringify(target);
  }

  return Object.assign({}, instance, obj) as V;
}

export function string2Array<T, K extends T, V extends T>(
  instance: Partial<K>,
  keys: (keyof K & keyof V & string)[]
): V {
  const obj: {
    [key: string]: any[];
  } = {};
  for (const key of keys) {
    const target = instance[key];
    if (!target) continue;
    if (typeof target === "string") obj[key] = JSON.parse(target);
  }

  return Object.assign({}, instance, obj) as V;
}

/**
 * 读取一个目录有多少个文件
 * @param dir 目录地址
 */
export async function readDirLength(dir: PathLike) {
  try {
    const files = await readdir(dir);
    return files;
  } catch (error) {
    throw new UnknownError(error);
  }
}

export function parseToken2Info(req: Request): Authorization | null {
  // 1. 从客户端的请求拿到token
  const token = req.get("authorization");
  // 2. 解析token，还原成有用信息
  return parseToken(token);
}
