const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

// ========= 编辑密码（仅后端保存，前端无法获取！=========
const ADMIN_PASSWORD = "120117_wzmX";
const WIKI_FILE = "./wiki_data.json";

app.use(express.json());
app.use(express.static("./"));

// 初始化wiki数据文件
if (!fs.existsSync(WIKI_FILE)) {
    const initData = {
        "服务器首页":`# 🌌 Air Space 服务器 Wiki
欢迎来到 Air Space Minecraft 服务器维基！

> Air Space 是一个生存向MC服务器，包含专属模组与领地系统。

## 快速导航
- [服务器介绍](服务器介绍)
- [服务器规则](服务器规则)
- [模组列表](模组列表)
- [主城](主城)
- [玩家领地](玩家领地)
- [常用指令](常用指令)

内部链接写法：\`[文字](页面名)\`
Markdown语法支持：#标题、**加粗**、*斜体*、-无序列表`,
        "服务器介绍":`# 服务器介绍
## Air Space
- 版本：Minecraft 1.20.1（模组服）
- 类型：多人生存，领地保护，休闲冒险
- 特色：自定义主城、资源世界、维度探索

服务器定期重置资源世界，主世界长期保留玩家建筑。`,
        "服务器规则":`# 服务器规则
1. 禁止破坏他人领地内建筑、偷取物品。
2. 禁止使用作弊客户端、外挂、透视模组。
3. 禁止恶意刷屏、辱骂、引战。
4. 禁止大规模机器造成服务器卡顿。
5. 违规会依次给予警告、封禁。`,
        "模组列表":`# 模组列表
## 核心模组
- 领地保护模组
- 小地图模组
- 装备耐久显示
- 背包整理
> 所有客户端模组需要在群内下载，不要自行添加额外作弊模组`,
        "主城":`# 主城
Air Space主城为出生点区域，提供基础传送、商店、公告板。
- 禁止在主城私自建造建筑
- 主城提供基础物资领取点
- 主城可传送至资源世界`,
        "玩家领地":`# 玩家领地
领地用于保护玩家建筑，防止他人破坏。
- 使用领地指令圈地
- 领地内可以设置好友权限
- 领地超出范围需要额外购买`,
        "常用指令":`# 常用指令
- /help 查看帮助
- /claim 圈领地
- /trust 给予好友领地权限
- /home 设置家
- /spawn 返回主城
- /tpa 传送请求`
    };
    fs.writeFileSync(WIKI_FILE, JSON.stringify(initData,null,2));
}

// 密码校验接口
app.post("/api/checkpwd", (req, res)=>{
    const pwd = req.body.pwd;
    if(pwd === ADMIN_PASSWORD){
        return res.json({ok:true, token:"admin_authorized_886"});
    }else{
        return res.json({ok:false});
    }
})

// 获取wiki全部数据
app.get("/api/getwiki", (req,res)=>{
    const raw = fs.readFileSync(WIKI_FILE, "utf8");
    res.json(JSON.parse(raw));
})

// 保存wiki数据（带token鉴权，必须验证成功才能保存）
app.post("/api/savewiki", (req,res)=>{
    const {token, data} = req.body;
    if(token !== "admin_authorized_886"){
        return res.status(403).json({err:"无编辑权限"});
    }
    fs.writeFileSync(WIKI_FILE, JSON.stringify(data,null,2));
    res.json({ok:true});
})

app.listen(port, ()=>{
    console.log(`Wiki服务运行在 http://localhost:${port}`);
})
