// markdown-toc.d.ts

import * as querystring from 'querystring';

declare module 'markdown-toc' {
  namespace utils {
    function Remarkable(): any;
    function merge<T>(target: T, source: Partial<T>): T;
    function slugify(value: string, options?: Record<string, any>): string;
    function pick<T, K extends keyof T>(obj: T, keys: readonly K[]): Pick<T, K>;
    function getTitle(str: string): string;
    function mdlink(text: string, href: string): string;
    function li(options: Record<string, any>): (lvl: number, content: string, opts: Record<string, any>) => string;
  }

  export interface Options {
    firsth1?: boolean;
    maxdepth?: number;
    linkify?: boolean | ((tok: Token, text: string, slug: string, opts: Options) => string);
    num?: number;
    bullets?: string[];
    indent?: string;
    append?: string;
    filter?(content: string, token: Token, tokens: Token[]): boolean;
    strip?: string[] | ((str: string, opts: Options) => string);
    titleize?: boolean | ((str: string, opts: Options) => string);
    // ... 其他可能的选项属性
  }

  export interface Token {
    type: string;
    content: string;
    lvl: number;
    i: number;
    seen?: number;
    slug?: string;
    lines?: number[];
    children?: Token[];
  }

  function toc(markdownContent: string, options?: Options): {
    content: string;
    json: Array<Pick<Token, 'content' | 'slug' | 'lvl' | 'i' | 'seen'>>;
    highest: number;
    tokens: Token[];
  };

  namespace toc {
    function insert(): any; // 插入方法的具体类型无法从给定内容推断，需要查看实际实现或文档
    function generate(options: Options): (md: any) => void; // 返回一个Remarkable插件
    function bullets(arr: Token[], options: Options): string;
    function highest(arr: Token[]): number;
    function linkify(tok: Token, options: Options): Token;
    function titleize(str: string, opts: Options): string;
    function strip(str: string, opts: Options): string;

    const bullets: typeof utils.bullets;
    const linkify: typeof utils.linkify;
    const slugify: typeof utils.slugify;
    const titleize: typeof utils.titleize;
    const plugin: typeof generate;
    const strip: typeof utils.strip;
  }

  export = toc;
}